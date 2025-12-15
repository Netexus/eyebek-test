using Eyebek.Application.DTOs.Attendance;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Domain.Entities;

namespace Eyebek.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _attendanceRepository;

    public AttendanceService(IAttendanceRepository attendanceRepository)
    {
        _attendanceRepository = attendanceRepository;
    }
    
    public async Task RegisterAsync(string companyId, AttendanceCreateRequest request)
    {
        var attendance = new Attendance
        {
            UserId = request.UserId,
            Type = request.Type,
            Method = request.Method,
            Confidence = request.Confidence,
            CapturePhoto = request.CapturePhoto,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow
        };

        await _attendanceRepository.AddAsync(attendance, companyId);
    }

    public async Task<List<AttendanceListItemDto>> GetByCompanyAsync(string companyId)
    {
        var attendances = await _attendanceRepository.GetByCompanyAsync(companyId);
        return attendances.Select(Map).ToList();
    }

    private static AttendanceListItemDto Map(Attendance a) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        UserName = a.User?.Name ?? "Unknown", // Handle null User
        Timestamp = a.Timestamp,
        Type = a.Type,
        Method = a.Method,
        Status = a.Status,
        Confidence = a.Confidence,
        CapturePhoto = a.CapturePhoto
    };
}