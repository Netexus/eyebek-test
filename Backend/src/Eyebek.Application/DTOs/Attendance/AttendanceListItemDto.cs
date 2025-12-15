using Eyebek.Domain.Enums;

namespace Eyebek.Application.DTOs.Attendance;

public class AttendanceListItemDto
{
    public string Id { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    
    public DateTime Timestamp { get; set; }
    public AttendanceType Type { get; set; }
    public AttendanceMethod Method { get; set; }
    public AttendanceStatus Status { get; set; }
    
    public decimal? Confidence { get; set; }
    public string? CapturePhoto { get; set; }
}
