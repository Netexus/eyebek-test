using Eyebek.Api.Helpers;
using Eyebek.Application.DTOs.Payments;
using Eyebek.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eyebek.Api.Controllers;

[ApiController]
[Route("payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PaymentCreateRequest request)
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");
        
        await _paymentService.CreateAndApplyPlanAsync(companyId, request);

        return Ok(new
        {
            message = "Pago registrado exitosamente.",
            companyId = companyId
        });
    }

   
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var companyId = HttpContext.GetCompanyId();
        if (companyId == null)
            return Unauthorized("No se encontró la empresa en el token.");

        var history = await _paymentService.HistoryAsync(companyId);

        return Ok(new
        {
            companyId = companyId,
            payments = history
        });
    }
}