using System.Threading.Tasks;

namespace Eyebek.Application.Services.Interfaces;

public interface IFacialRecognitionService
{
    Task<(bool Match, double Confidence)> CompareFacesAsync(string knownFaceBase64, string unknownFaceBase64);
}
