using Eyebek.Domain.Entities;

namespace Eyebek.Application.Interfaces;

public interface IPaymentRepository
{
    Task AddAsync(Payment payment);
    Task<List<Payment>> GetByCompanyAsync(string companyId);
}