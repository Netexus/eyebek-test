using Eyebek.Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Eyebek.Domain.Entities;

public class Attendance
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string UserId { get; set; } = default!;
    
    [BsonIgnore]
    public User? User { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [BsonRepresentation(BsonType.String)]
    public AttendanceType Type { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public AttendanceMethod Method { get; set; }

    public decimal? Confidence { get; set; }
    public string? CapturePhoto { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    [BsonRepresentation(BsonType.String)]
    public AttendanceStatus Status { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}