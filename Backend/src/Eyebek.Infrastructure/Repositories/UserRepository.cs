using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoClient _mongoClient;

    public UserRepository(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }

    private IMongoCollection<User> GetCollection(string companyId)
    {
        var database = _mongoClient.GetDatabase($"attendance_{companyId}");
        return database.GetCollection<User>("users");
    }

    public async Task AddAsync(User user)
    {
        var collection = GetCollection(user.CompanyId);
        await collection.InsertOneAsync(user);
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        // Note: We need companyId to get the user, this might need to be refactored
        throw new NotImplementedException("GetByIdAsync requires companyId for tenant resolution");
    }

    public async Task UpdateAsync(User user)
    {
        var collection = GetCollection(user.CompanyId);
        user.UpdatedAt = DateTime.UtcNow;
        await collection.ReplaceOneAsync(u => u.Id == user.Id, user);
    }

    public async Task<List<User>> GetByCompanyAsync(string companyId)
    {
        var collection = GetCollection(companyId);
        return await collection.Find(_ => true).ToListAsync();
    }

    public async Task<int> CountByCompanyAsync(string companyId)
    {
        var collection = GetCollection(companyId);
        return (int)await collection.CountDocumentsAsync(_ => true);
    }
}