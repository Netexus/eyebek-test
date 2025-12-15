namespace Eyebek.Application.DTOs.Companies;

public class CompanyRegisterRequest
{
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string Password { get; set; } = default!;
}