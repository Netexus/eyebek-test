using Eyebek.Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Eyebek.Domain.Entities;

public class Payment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string CompanyId { get; set; } = default!;
    
    [BsonIgnore]
    public Company? Company { get; set; }

    public string PlanId { get; set; } = default!;
    
    [BsonIgnore]
    public Plan? Plan { get; set; }

    public decimal Amount { get; set; }

    [BsonRepresentation(BsonType.String)]
    public PaymentMethod PaymentMethod { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string PaymentReference { get; set; } = default!;
    public string? Receipt { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}