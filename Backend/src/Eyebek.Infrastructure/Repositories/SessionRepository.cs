using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class SessionRepository : ISessionRepository
{
    private readonly MongoDbContext _context;

    public SessionRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Session session)
    {
        await _context.Sessions.InsertOneAsync(session);
    }

    public async Task DeactivateCompanySessionsAsync(string companyId)
    {
        var update = Builders<Session>.Update.Set(s => s.Active, false);
        await _context.Sessions.UpdateManyAsync(
            s => s.CompanyId == companyId && s.Active,
            update);
    }
}