using Microsoft.AspNetCore.Mvc;
using Eyebek.Application.Services.Interfaces;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("plans")]
public class PlansController : ControllerBase
{
    private readonly IPlanService _service;
    public PlansController(IPlanService service) => _service = service;

    // 3) Ver planes disponibles
    [HttpGet]
    public async Task<IActionResult> GetActive()
    {
        var result = await _service.GetActiveAsync();
        return Ok(result);
    }
}