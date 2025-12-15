using Eyebek.Application.DTOs.Plans;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services.Interfaces;

namespace Eyebek.Application.Services;

public class PlanService : IPlanService
{
    private readonly IPlanRepository _plans;
    public PlanService(IPlanRepository plans) => _plans = plans;

    public async Task<List<PlanListItemDto>> GetActiveAsync()
    {
        var list = await _plans.GetActiveAsync();

        return list.Select(p => new PlanListItemDto
        {
            Id = p.Id,
            Category = p.Category,
            Price = p.Price,
            Duration = p.Duration,
            Description = p.Description,
            UserCapacity = p.UserCapacity
        }).ToList();
    }
}