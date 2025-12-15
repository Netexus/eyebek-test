using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class PlanRepository : IPlanRepository
{
    private readonly MongoDbContext _context;

    public PlanRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Plan>> GetActiveAsync()
    {
        return await _context.Plans
            .Find(p => p.Active)
            .ToListAsync();
    }

    public async Task<Plan?> GetByIdAsync(string id)
    {
        return await _context.Plans
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task AddAsync(Plan plan)
    {
        await _context.Plans.InsertOneAsync(plan);
    }
}