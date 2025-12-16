using Eyebek.Application.DTOs.Attendance;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Domain.Enums;

namespace Eyebek.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IUserRepository _userRepository;
    private readonly IFacialRecognitionService _facialRecognitionService;

    public AttendanceService(
        IAttendanceRepository attendanceRepository,
        IUserRepository userRepository,
        IFacialRecognitionService facialRecognitionService)
    {
        _attendanceRepository = attendanceRepository;
        _userRepository = userRepository;
        _facialRecognitionService = facialRecognitionService;
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

        if (request.Method == AttendanceMethod.Facial && !string.IsNullOrEmpty(request.CapturePhoto))
        {
            // Fix 1: GetByIdAsync only takes 1 argument
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user != null && !string.IsNullOrEmpty(user.Photo))
            {
                // Fix 2: Explicit deconstruction to avoid inference errors
                (bool match, double confidence) = await _facialRecognitionService.CompareFacesAsync(
                    user.Photo, 
                    request.CapturePhoto
                );

                attendance.Confidence = (decimal)confidence;
                
                // Auto-approve if confidence is high enough (>= 85%)
                if (match && confidence >= 0.85)
                {
                    attendance.Status = AttendanceStatus.Approved;
                }
                else
                {
                    attendance.Status = AttendanceStatus.Rejected;
                }
            }
            else
            {
                // No stored photo to compare - reject
                attendance.Status = AttendanceStatus.Rejected;
            }
        }

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