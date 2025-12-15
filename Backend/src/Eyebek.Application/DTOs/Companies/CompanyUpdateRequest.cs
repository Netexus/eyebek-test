namespace Eyebek.Application.DTOs.Companies;

public class CompanyUpdateRequest
{
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
}