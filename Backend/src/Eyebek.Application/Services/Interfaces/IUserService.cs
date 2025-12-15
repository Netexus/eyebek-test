using Eyebek.Application.DTOs.Users;

namespace Eyebek.Application.Services.Interfaces;

public interface IUserService
{
    Task<UserListItemDto> CreateAsync(string companyId, UserCreateRequest request);
    Task<List<UserListItemDto>> GetByCompanyAsync(string companyId);
}