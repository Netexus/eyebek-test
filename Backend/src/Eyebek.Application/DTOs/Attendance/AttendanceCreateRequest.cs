using Eyebek.Domain.Enums;

namespace Eyebek.Application.DTOs.Attendance;

public class AttendanceCreateRequest
{
    public string UserId { get; set; } = default!;
    public AttendanceType Type { get; set; }     
    public AttendanceMethod Method { get; set; }   
    public decimal? Confidence { get; set; }     
    public string? CapturePhoto { get; set; }      
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public AttendanceStatus Status { get; set; }
}