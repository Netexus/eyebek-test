using Eyebek.Application.DTOs.Payments;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Domain.Enums;

namespace Eyebek.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly ICompanyRepository _companies;
    private readonly IPlanRepository _plans;
    private readonly IPaymentRepository _payments;

    public PaymentService(ICompanyRepository companies, IPlanRepository plans, IPaymentRepository payments)
    {
        _companies = companies;
        _plans = plans;
        _payments = payments;
    }

    public async Task CreateAndApplyPlanAsync(string companyId, PaymentCreateRequest request)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new Exception("Empresa no encontrada.");

        var plan = await _plans.GetByIdAsync(request.PlanId)
            ?? throw new Exception("Plan no encontrado.");

        if (!plan.Active) throw new Exception("Plan inactivo.");

        var payment = new Payment
        {
            CompanyId = companyId,
            PlanId = plan.Id,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = request.PaymentStatus,
            PaymentReference = request.PaymentReference,
            PaymentDate = DateTime.UtcNow
        };

        await _payments.AddAsync(payment);

        if (payment.PaymentStatus == PaymentStatus.Approved)
        {
            company.PlanId = plan.Id;
            company.PlanStartDate = DateTime.UtcNow;
            company.PlanEndDate = DateTime.UtcNow.AddDays(plan.Duration);
            company.Status = CompanyStatus.Activo;

            await _companies.UpdateAsync(company);
        }
    }

    public async Task<List<object>> HistoryAsync(string companyId)
    {
        var list = await _payments.GetByCompanyAsync(companyId);
        return list.Select(p => new
        {
            p.Id,
            p.PlanId,
            p.Amount,
            p.PaymentMethod,
            p.PaymentStatus,
            p.PaymentReference,
            p.PaymentDate
        }).Cast<object>().ToList();
    }
}
