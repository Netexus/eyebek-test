using Eyebek.Application.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly MongoDbContext _context;

    public PaymentRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Payment payment)
    {
        await _context.Payments.InsertOneAsync(payment);
    }

    public async Task<List<Payment>> GetByCompanyAsync(string companyId)
    {
        return await _context.Payments
            .Find(p => p.CompanyId == companyId)
            .SortByDescending(p => p.PaymentDate)
            .ToListAsync();
    }
}