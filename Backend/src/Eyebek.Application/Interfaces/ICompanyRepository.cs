using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface ICompanyRepository
{
    Task<Company?> GetByEmailAsync(string email);
    Task<Company?> GetByIdAsync(string id);
    Task AddAsync(Company company);
    Task UpdateAsync(Company company);
}