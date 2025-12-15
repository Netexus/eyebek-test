using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly IMongoClient _mongoClient;

    public AttendanceRepository(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }

    private IMongoCollection<Attendance> GetCollection(string companyId)
    {
        var database = _mongoClient.GetDatabase($"attendance_{companyId}");
        return database.GetCollection<Attendance>("attendances");
    }

    public async Task AddAsync(Attendance attendance, string companyId)
    {
        var collection = GetCollection(companyId);
        await collection.InsertOneAsync(attendance);
    }

    public async Task<List<Attendance>> GetByCompanyAsync(string companyId)
    {
        var collection = GetCollection(companyId);
        return await collection
            .Find(_ => true)
            .SortByDescending(a => a.Timestamp)
            .ToListAsync();
    }
}
