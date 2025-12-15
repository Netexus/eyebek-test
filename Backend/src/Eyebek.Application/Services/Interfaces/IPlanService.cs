using Eyebek.Application.DTOs.Plans;

namespace Eyebek.Application.Services.Interfaces;

public interface IPlanService
{
    Task<List<PlanListItemDto>> GetActiveAsync();
}