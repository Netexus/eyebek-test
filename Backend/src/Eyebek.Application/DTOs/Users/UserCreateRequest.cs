using Eyebek.Domain.Enums;

namespace Eyebek.Application.DTOs.Users;

public class UserCreateRequest
{
    public string Name { get; set; } = default!;
    public string Document { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public UserRole Role { get; set; } = UserRole.Employee;
    public string? Photo { get; set; }
    public byte[]? FacialEmbedding { get; set; }
}