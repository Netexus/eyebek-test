using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly MongoDbContext _context;

    public CompanyRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<Company?> GetByIdAsync(string id)
    {
        return await _context.Companies
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Company?> GetByEmailAsync(string email)
    {
        return await _context.Companies
            .Find(c => c.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Company>> GetAllAsync()
    {
        return await _context.Companies
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task AddAsync(Company company)
    {
        await _context.Companies.InsertOneAsync(company);
    }

    public async Task UpdateAsync(Company company)
    {
        company.UpdatedAt = DateTime.UtcNow;
        await _context.Companies.ReplaceOneAsync(
            c => c.Id == company.Id,
            company);
    }

    public async Task DeleteAsync(string id)
    {
        await _context.Companies.DeleteOneAsync(c => c.Id == id);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        var count = await _context.Companies
            .CountDocumentsAsync(c => c.Email == email);
        return count > 0;
    }
}