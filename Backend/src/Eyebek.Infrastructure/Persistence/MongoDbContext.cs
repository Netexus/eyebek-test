using Eyebek.Domain.Entities;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Persistence;

/// <summary>
/// MongoDB context for the core database (companies, plans, payments, sessions)
/// </summary>
public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IMongoClient mongoClient, string databaseName)
    {
        _database = mongoClient.GetDatabase(databaseName);
    }

    // Core collections
    public IMongoCollection<Company> Companies => _database.GetCollection<Company>("companies");
    public IMongoCollection<Plan> Plans => _database.GetCollection<Plan>("plans");
    public IMongoCollection<Payment> Payments => _database.GetCollection<Payment>("payments");
    public IMongoCollection<Session> Sessions => _database.GetCollection<Session>("sessions");
}
