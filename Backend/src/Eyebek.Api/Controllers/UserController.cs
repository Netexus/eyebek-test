using Eyebek.Api.Helpers;
using Eyebek.Application.DTOs.Users;
using Eyebek.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateRequest request)
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

       
        await Task.CompletedTask;

        return Ok(new
        {
            message = "Usuario creado (implementación de servicio pendiente).",
            companyId = companyId,
            user = request
        });
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

        
        await Task.CompletedTask;

        var emptyList = new List<object>();

        return Ok(new
        {
            message = "Listado de usuarios (implementación de servicio pendiente).",
            companyId = companyId,
            users = emptyList
        });
    }
}