using Eyebek.Api.Helpers;
using Eyebek.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("api/recognition")]
public class RecognitionController : ControllerBase
{
    private readonly IRecognitionService _recognitionService;
    private readonly ILogger<RecognitionController> _logger;

    public RecognitionController(
        IRecognitionService recognitionService,
        ILogger<RecognitionController> logger)
    {
        _recognitionService = recognitionService;
        _logger = logger;
    }

    /// <summary>
    /// Initiates a recognition session for a specific user
    /// </summary>
    [HttpPost("init")]
    [Authorize]
    public async Task<IActionResult> InitiateRecognition([FromBody] InitiateRecognitionRequest request)
    {
        var companyId = HttpContext.GetCompanyId();
        // var role = HttpContext.GetRole(); // Commented out - extension method not available
        
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

        _logger.LogInformation("🎭 Recognition init: User={UserId}, Company={CompanyId}", 
            request.UserId, companyId);

        var result = await _recognitionService.InitiateRecognitionAsync(companyId, request.UserId);

        return Ok(result);
    }

    /// <summary>
    /// Gets recognition data (user image) for a recognition session
    /// Only accessible with a valid recognition token
    /// </summary>
    [HttpGet("data")]
    public async Task<IActionResult> GetRecognitionData()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized("Token de reconocimiento requerido.");

        var token = authHeader.Substring("Bearer ".Length).Trim();

        _logger.LogInformation("Getting recognition data for token");

        var data = await _recognitionService.GetRecognitionDataAsync(token);

        if (data == null)
            return Unauthorized("Token de reconocimiento inválido o expirado.");

        return Ok(data);
    }

    /// <summary>
    /// Completes a recognition session with the result from the Recognition App
    /// </summary>
    [HttpPost("complete")]
    public async Task<IActionResult> CompleteRecognition([FromBody] CompleteRecognitionRequest request)
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized("Token de reconocimiento requerido.");

        var token = authHeader.Substring("Bearer ".Length).Trim();

        _logger.LogInformation("Completing recognition with success={Success}, confidence={Confidence}", 
            request.Success, request.Confidence);

        var result = await _recognitionService.CompleteRecognitionAsync(token, request);

        if (result == null)
            return Unauthorized("Token de reconocimiento inválido o expirado.");

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}

public record InitiateRecognitionRequest(string UserId);

public record CompleteRecognitionRequest(
    bool Success,
    double Confidence,
    DateTime Timestamp
);
