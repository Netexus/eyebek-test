using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface ISessionRepository
{
    Task AddAsync(Session session);
    Task DeactivateCompanySessionsAsync(string companyId);
}