using Eyebek.Domain.Entities;
using Eyebek.Domain.Enums;
using Eyebek.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Eyebek.Infrastructure.Seed;

public static class MongoSeeder
{
    public static async Task SeedPlansAsync(MongoDbContext context, ILogger logger)
    {
        try
        {
            var existingCount = await context.Plans.CountDocumentsAsync(_ => true);
            if (existingCount > 0)
            {
                logger.LogInformation("Plans already seeded. Skipping...");
                return;
            }

            var plans = new List<Plan>
            {
                new Plan
                {
                    Category = "Basic",
                    Price = 29.99m,
                    Duration = 30,
                    Description = "Basic plan for small teams",
                    UserCapacity = 10,
                    Features = "Facial recognition, Basic reports, Email support",
                    Active = true
                },
                new Plan
                {
                    Category = "Pro",
                    Price = 79.99m,
                    Duration = 30,
                    Description = "Professional plan for growing businesses",
                    UserCapacity = 50,
                    Features = "Facial recognition, Advanced reports, Priority support, API access",
                    Active = true
                },
                new Plan
                {
                    Category = "Enterprise",
                    Price = 199.99m,
                    Duration = 30,
                    Description = "Enterprise plan for large organizations",
                    UserCapacity = 200,
                    Features = "Facial recognition, Custom reports, 24/7 support, API access, Custom integrations",
                    Active = true
                }
            };

            await context.Plans.InsertManyAsync(plans);
            logger.LogInformation($"✅ Seeded {plans.Count} plans successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding plans");
        }
    }

    public static async Task SeedSuperAdminAsync(MongoDbContext context, ILogger logger, IConfiguration configuration)
    {
        try
        {
            var superAdminEmail = configuration["SuperAdmin:Email"] ?? "superadmin@eyebek.com";
            
            // Check if super admin company already exists
            var existingCompany = await context.Companies
                .Find(c => c.Email == superAdminEmail)
                .FirstOrDefaultAsync();

            if (existingCompany != null)
            {
                logger.LogInformation("SuperAdmin already exists. Skipping...");
                return;
            }

            // Get a plan for the super admin (first active plan)
            var plan = await context.Plans
                .Find(p => p.Active)
                .FirstOrDefaultAsync();

            if (plan == null)
            {
                logger.LogWarning("No active plans found. Cannot create SuperAdmin.");
                return;
            }

            // Create SuperAdmin company
            var superAdminCompany = new Company
            {
                Name = configuration["SuperAdmin:Name"] ?? "Super Administrator",
                Email = superAdminEmail,
                Phone = "+1234567890",
                Address = "System",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    configuration["SuperAdmin:Password"] ?? "SuperAdmin123!"),
                Status = CompanyStatus.Activo,
                PlanId = plan.Id,
                PlanStartDate = DateTime.UtcNow,
                PlanEndDate = DateTime.UtcNow.AddYears(10), // Long expiration for super admin
                CurrentUsers = 0
            };

            await context.Companies.InsertOneAsync(superAdminCompany);
            logger.LogInformation($"✅ SuperAdmin created with email: {superAdminEmail}");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding SuperAdmin");
        }
    }
}
