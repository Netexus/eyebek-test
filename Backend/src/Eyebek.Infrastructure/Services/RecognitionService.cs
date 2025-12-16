using Eyebek.Application.DTOs.Attendance;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System.Security.Cryptography;

namespace Eyebek.Infrastructure.Services;

public class RecognitionService : IRecognitionService
{
    private readonly IMongoClient _mongoClient;
    private readonly IAttendanceService _attendanceService;
    private readonly IMqttService _mqttService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<RecognitionService> _logger;

    // In-memory storage for recognition sessions (use Redis in production)
    private static readonly Dictionary<string, RecognitionSession> _activeSessions = new();
    private static readonly SemaphoreSlim _sessionsLock = new(1, 1);

    public RecognitionService(
        IMongoClient mongoClient,
        IAttendanceService attendanceService,
        IMqttService mqttService,
        IConfiguration configuration,
        ILogger<RecognitionService> logger)
    {
        _mongoClient = mongoClient;
        _attendanceService = attendanceService;
        _mqttService = mqttService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<RecognitionSessionResponse> InitiateRecognitionAsync(string companyId, string userId)
    {
        // Get tenant database for this company
        var tenantDbName = $"attendance_{companyId}";
        var tenantDb = _mongoClient.GetDatabase(tenantDbName);
        var usersCollection = tenantDb.GetCollection<User>("users");

        // Verify user exists and get their photo
        var user = await usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found in company {CompanyId} database", userId, companyId);
            throw new Exception("Usuario no encontrado");
        }

        // Verify user belongs to this company (multi-tenant security)
        if (user.CompanyId != companyId)
        {
            _logger.LogWarning("User {UserId} does not belong to company {CompanyId}", userId, companyId);
            throw new Exception("Usuario no pertenece a esta empresa");
        }

        // Verify user is active
        if (user.Status != UserStatus.Active)
        {
            _logger.LogWarning("User {UserId} is not active (status: {Status})", userId, user.Status);
            throw new Exception("Usuario inactivo");
        }

        if (string.IsNullOrEmpty(user.Photo))
        {
            _logger.LogWarning("User {UserId} has no photo registered", userId);
            throw new Exception("El usuario no tiene foto registrada");
        }

        // Generate secure token for this recognition session
        var token = GenerateSecureToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(5); // Token expires in 5 minutes

        var session = new RecognitionSession
        {
            Token = token,
            CompanyId = companyId,
            UserId = userId,
            UserName = user.Name,
            ReferenceImage = user.Photo,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            IsCompleted = false
        };

        // Store session (in production, use Redis with expiration)
        await _sessionsLock.WaitAsync();
        try
        {
            _activeSessions[token] = session;
            _logger.LogInformation("Created recognition session for user {UserId} with token expiring at {ExpiresAt}", 
                userId, expiresAt);
        }
        finally
        {
            _sessionsLock.Release();
        }

        // Build redirect URL to Recognition App
        var recognitionAppUrl = _configuration["RecognitionApp:BaseUrl"] ?? "http://localhost:3001";
        var redirectUrl = $"{recognitionAppUrl}/face?token={token}";

        return new RecognitionSessionResponse(token, redirectUrl);
    }

    public async Task<RecognitionDataResponse?> GetRecognitionDataAsync(string token)
    {
        await _sessionsLock.WaitAsync();
        try
        {
            if (!_activeSessions.TryGetValue(token, out var session))
                return null;

            // Check if token is expired
            if (DateTime.UtcNow > session.ExpiresAt)
            {
                _activeSessions.Remove(token);
                return null;
            }

            return new RecognitionDataResponse(
                session.ReferenceImage,
                session.UserName
            );
        }
        finally
        {
            _sessionsLock.Release();
        }
    }

    public async Task<RecognitionCompletionResponse?> CompleteRecognitionAsync(string token, object recognitionResult)
    {
        RecognitionSession? session;

        await _sessionsLock.WaitAsync();
        try
        {
            if (!_activeSessions.TryGetValue(token, out session))
                return null;

            // Check if token is expired
            if (DateTime.UtcNow > session.ExpiresAt)
            {
                _activeSessions.Remove(token);
                return null;
            }

            // Check if already completed
            if (session.IsCompleted)
                return new RecognitionCompletionResponse(false, "Sesión de reconocimiento ya completada");

            // Mark as completed
            session.IsCompleted = true;
        }
        finally
        {
            _sessionsLock.Release();
        }

        // Extract recognition result data
        var resultData = recognitionResult as dynamic;
        var success = (bool)(resultData?.Success ?? false);
        var confidenceDynamic = resultData?.Confidence ?? 0.0;
        var confidence = Convert.ToDouble(confidenceDynamic);

        if (!success)
        {
            // Cast to string to avoid dynamic dispatch
            string userIdStr = session.UserId;
            string companyIdStr = session.CompanyId;
            _logger.LogWarning("Recognition failed for user {UserId} in company {CompanyId}", 
                userIdStr, companyIdStr);
            return new RecognitionCompletionResponse(false, "Reconocimiento facial fallido");
        }

        // Validate confidence threshold
        var minimumConfidence = double.TryParse(_configuration["Recognition:MinimumConfidence"], out var conf) ? conf : 0.5;
        if (confidence < minimumConfidence)
        {
            string userIdStr = session.UserId;
            _logger.LogWarning("Recognition confidence {Confidence} below threshold {Threshold} for user {UserId}", 
                (object)confidence, (object)minimumConfidence, userIdStr);
            return new RecognitionCompletionResponse(false, "Confianza de reconocimiento insuficiente");
        }

        // Register attendance
        try
        {
            var request = new AttendanceCreateRequest
            {
                UserId = session.UserId,
                Type = AttendanceType.CheckIn,
                Method = AttendanceMethod.Facial,
                Confidence = confidence,
                Status = AttendanceStatus.Present
            };

            await _attendanceService.RegisterAsync(session.CompanyId, request);
            
            string userIdStr = session.UserId;
            _logger.LogInformation("Attendance registered for user {UserId} with confidence {Confidence}", 
                userIdStr, (object)confidence);

            // Publish MQTT command to open servo
            await _mqttService.PublishServoCommandAsync(session.CompanyId, "ABRIR");
            
            string companyIdStr = session.CompanyId;
            _logger.LogInformation("MQTT servo command sent for company {CompanyId}", companyIdStr);

            // Clean up session after successful completion
            await _sessionsLock.WaitAsync();
            try
            {
                _activeSessions.Remove(token);
            }
            finally
            {
                _sessionsLock.Release();
            }

            return new RecognitionCompletionResponse(true, "Reconocimiento exitoso, asistencia registrada");
        }
        catch (Exception ex)
        {
            string userIdStr = session.UserId;
            _logger.LogError(ex, "Error completing recognition for user {UserId}", userIdStr);
            return new RecognitionCompletionResponse(false, $"Error al registrar asistencia: {ex.Message}");
        }
    }

    private static string GenerateSecureToken()
    {
        // Generate a secure random token
        var bytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(bytes);
        }
        return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }

    private class RecognitionSession
    {
        public string Token { get; set; } = string.Empty;
        public string CompanyId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string ReferenceImage { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsCompleted { get; set; }
    }
}
