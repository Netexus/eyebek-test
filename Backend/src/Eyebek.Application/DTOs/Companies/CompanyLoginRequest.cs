namespace Eyebek.Application.DTOs.Companies;

public class CompanyLoginRequest
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}