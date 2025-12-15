using Eyebek.Domain.Enums;

namespace Eyebek.Application.DTOs.Attendance;

public class AttendanceRegisterRequest
{
    public int UserId { get; set; }
    public AttendanceType Type { get; set; }          // CheckIn / CheckOut
    public AttendanceMethod Method { get; set; }      // Facial / Manual
    public double? Confidence { get; set; }          // Nivel de confianza del reconocimiento
    public string? CapturePhoto { get; set; }        // Base64 o URL de la captura
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}