using Eyebek.Domain.Entities;

namespace Eyebek.Application.Services;

public interface IJwtTokenGenerator
{
    string GenerateCompanyToken(Company company);
}