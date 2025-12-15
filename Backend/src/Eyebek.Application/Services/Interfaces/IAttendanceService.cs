using Eyebek.Application.DTOs.Attendance;

namespace Eyebek.Application.Services.Interfaces;

public interface IAttendanceService
{
    Task RegisterAsync(string companyId, AttendanceCreateRequest request);
    Task<List<AttendanceListItemDto>> GetByCompanyAsync(string companyId);
}