using Eyebek.Application.DTOs.Payments;

namespace Eyebek.Application.Services.Interfaces;

public interface IPaymentService
{
    Task CreateAndApplyPlanAsync(string companyId, PaymentCreateRequest request);
    
    // Devolvemos object para simplificar, en realidad sería PaymentHistoryDto
    Task<List<object>> HistoryAsync(string companyId);
}