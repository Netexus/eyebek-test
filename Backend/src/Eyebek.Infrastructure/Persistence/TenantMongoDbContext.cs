using Eyebek.Domain.Entities;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Persistence;

/// <summary>
/// MongoDB context for tenant-specific databases (users, attendance, face embeddings)
/// Database is resolved dynamically based on companyId
/// </summary>
public class TenantMongoDbContext
{
    private readonly IMongoClient _mongoClient;
    private readonly string _companyId;

    public TenantMongoDbContext(IMongoClient mongoClient, string companyId)
    {
        _mongoClient = mongoClient;
        _companyId = companyId;
    }

    private IMongoDatabase Database => _mongoClient.GetDatabase($"attendance_{_companyId}");

    // Tenant collections
    public IMongoCollection<User> Users => Database.GetCollection<User>("users");
    public IMongoCollection<Attendance> Attendances => Database.GetCollection<Attendance>("attendances");
}
