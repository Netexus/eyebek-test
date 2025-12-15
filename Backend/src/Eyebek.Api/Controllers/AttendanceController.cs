using Eyebek.Api.Helpers;
using Eyebek.Application.DTOs.Attendance;
using Eyebek.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("attendance")]
[Authorize] // todas requieren empresa autenticada
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

  
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] AttendanceCreateRequest request)
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

        await _attendanceService.RegisterAsync(companyId, request);

        return Ok(new { message = "Asistencia registrada correctamente." });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

        var data = await _attendanceService.GetByCompanyAsync(companyId);
        return Ok(data);
    }
}