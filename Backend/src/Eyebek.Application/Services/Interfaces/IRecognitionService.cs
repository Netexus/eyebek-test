namespace Eyebek.Application.Services.Interfaces;

public interface IRecognitionService
{
    /// <summary>
    /// Initiates a recognition session and returns a token and redirect URL
    /// </summary>
    Task<RecognitionSessionResponse> InitiateRecognitionAsync(string companyId, string userId);

    /// <summary>
    /// Gets recognition data (user image) using a valid recognition token
    /// </summary>
    Task<RecognitionDataResponse?> GetRecognitionDataAsync(string token);

    /// <summary>
    /// Completes recognition, validates result, registers attendance, and triggers MQTT
    /// </summary>
    Task<RecognitionCompletionResponse?> CompleteRecognitionAsync(string token, object recognitionResult);
}

public record RecognitionSessionResponse(
    string Token,
    string RedirectUrl
);

public record RecognitionDataResponse(
    string ReferenceImage,
    string UserName
);

public record RecognitionCompletionResponse(
    bool Success,
    string Message,
    string? AttendanceId = null
);
