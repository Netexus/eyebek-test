namespace Eyebek.Application.DTOs.Plans;

public class PlanListItemDto
{
    public string Id { get; set; } = default!;
    public string Category { get; set; } = default!;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public string Description { get; set; } = default!;
    public int UserCapacity { get; set; }
}