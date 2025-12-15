using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface IUserRepository
{
    Task AddAsync(User user);
    Task<List<User>> GetByCompanyAsync(string companyId);
    Task<int> CountByCompanyAsync(string companyId);
    Task<User?> GetByIdAsync(string id);
    Task UpdateAsync(User user);
}