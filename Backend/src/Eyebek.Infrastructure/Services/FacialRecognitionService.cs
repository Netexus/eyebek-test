using System.Net.Http;
using System.Threading.Tasks;
using Eyebek.Application.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Eyebek.Infrastructure.Services;

public class FacialRecognitionService : IFacialRecognitionService
{
    private readonly HttpClient _httpClient;

    public FacialRecognitionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<(bool Match, double Confidence)> CompareFacesAsync(string knownFaceBase64, string unknownFaceBase64)
    {
        try
        {
            // Convert base64 to bytes
            var knownBytes = Convert.FromBase64String(knownFaceBase64.Split(',').Last());
            var unknownBytes = Convert.FromBase64String(unknownFaceBase64.Split(',').Last());

            // Create multipart form data
            using var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(knownBytes), "known_face", "known.jpg");
            content.Add(new ByteArrayContent(unknownBytes), "unknown_face", "unknown.jpg");

            // Call FacialAPI
            var response = await _httpClient.PostAsync("/api/compare-faces", content);
            
            if (!response.IsSuccessStatusCode)
            {
                return (false, 0.0);
            }

            var result = await response.Content.ReadFromJsonAsync<FaceComparisonResponse>();
            return (result?.Match ?? false, result?.Confidence ?? 0.0);
        }
        catch (Exception)
        {
            // On error, default to no match
            return (false, 0.0);
        }
    }

    private class FaceComparisonResponse
    {
        public bool Match { get; set; }
        public double Confidence { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
