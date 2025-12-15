using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface IPlanRepository
{
    Task<List<Plan>> GetActiveAsync();
    Task<Plan?> GetByIdAsync(string id);
    Task AddAsync(Plan plan);
}