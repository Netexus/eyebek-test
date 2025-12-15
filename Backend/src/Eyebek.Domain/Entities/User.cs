using Eyebek.Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Eyebek.Domain.Entities;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    // Relación con Company
    public string CompanyId { get; set; } = default!;
    
    [BsonIgnore]
    public Company? Company { get; set; }

    // Datos básicos
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string Document { get; set; } = default!;
    

    // Rol y estado
    [BsonRepresentation(BsonType.String)]
    public UserRole Role { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public UserStatus Status { get; set; }
    public string? Phone { get; set; }
    public string? Photo { get; set; }
    public byte[]? FacialEmbedding { get; set; }

    // Timestamps
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones (ignoradas)
    [BsonIgnore]
    public ICollection<Attendance>? Attendances { get; set; }
}