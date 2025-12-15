using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface IAttendanceRepository
{
    Task AddAsync(Attendance attendance, string companyId);
    Task<List<Attendance>> GetByCompanyAsync(string companyId);
}