using Eyebek.Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Eyebek.Domain.Entities;

public class Company
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;

    // Estado y plan
    [BsonRepresentation(BsonType.String)]
    public CompanyStatus Status { get; set; }
    public string? PlanId { get; set; }
    
    [BsonIgnore]
    public Plan? Plan { get; set; }

    public DateTime? PlanStartDate { get; set; }
    public DateTime? PlanEndDate { get; set; }

    // Usuarios actuales usando el sistema
    public int CurrentUsers { get; set; }

    // Timestamps
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Nombre de la base de datos del tenant (calculado)
    public string TenantDbName => $"attendance_{Id}";

    // Relaciones (ignoradas en MongoDB, se consultan por separado)
    [BsonIgnore]
    public ICollection<User>? Users { get; set; }
    
    [BsonIgnore]
    public ICollection<Payment>? Payments { get; set; }
}