using Eyebek.Domain.Enums;

namespace Eyebek.Application.DTOs.Companies;

public class CompanyMeResponse
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public CompanyStatus Status { get; set; }

    public string? PlanId { get; set; }
    public DateTime? PlanStartDate { get; set; }
    public DateTime? PlanEndDate { get; set; }

    public int CurrentUsers { get; set; }
}