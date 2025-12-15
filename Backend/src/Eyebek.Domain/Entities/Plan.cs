using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Eyebek.Domain.Entities;

public class Plan
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string Category { get; set; } = default!;
    public decimal Price { get; set; }
    
    public int Duration { get; set; }

    public string Description { get; set; } = default!;

    public int UserCapacity { get; set; }

    public string? Features { get; set; }

    public bool Active { get; set; } = true;

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}