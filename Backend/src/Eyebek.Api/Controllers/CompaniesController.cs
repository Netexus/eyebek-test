using Eyebek.Api.Helpers;
using Eyebek.Application.DTOs.Companies;
using Eyebek.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("companies")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    /// <summary>
    /// Registro de empresa (sin plan).
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] CompanyRegisterRequest request)
    {
        try
        {
            var company = await _companyService.RegisterAsync(request);
            return Ok(company);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Login de empresa. Devuelve token JWT y datos básicos.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] CompanyLoginRequest request)
    {
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers.UserAgent.ToString();

            var (token, company) = await _companyService.LoginAsync(request, ip, userAgent);

            return Ok(new
            {
                token,
                company
            });
        }
        catch (Exception ex)
        {
            // Aquí ya NO tendrás 204/500 sin cuerpo,
            // Swagger te mostrará el mensaje.
            return Unauthorized(new
            {
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Datos de la empresa autenticada (o SuperAdmin por defecto si no hay token).
    /// </summary>
    [HttpGet("me")]
    [AllowAnonymous]
    public async Task<IActionResult> Me()
    {
        // Si viene token, se usa la empresa del token
        var companyId = HttpContext.GetCompanyId();

        if (companyId == null)
        {
            // Si NO hay token, devolvemos el SuperAdmin "quemado"
            var superAdmin = await _companyService.GetSuperAdminAsync();
            return Ok(superAdmin);
        }

        var company = await _companyService.GetMeAsync(companyId);
        return Ok(company);
    }

    /// <summary>
    /// Actualizar datos básicos de la empresa autenticada.
    /// </summary>
    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateMe([FromBody] CompanyUpdateRequest request)
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized(new { message = "No se encontró la empresa en el token." });

        var company = await _companyService.UpdateMeAsync(companyId, request);
        return Ok(company);
    }
}
