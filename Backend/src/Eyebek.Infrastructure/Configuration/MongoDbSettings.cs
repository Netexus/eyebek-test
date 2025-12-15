namespace Eyebek.Infrastructure.Configuration;

/// <summary>
/// MongoDB configuration settings
/// </summary>
public class MongoDbSettings
{
    public string ConnectionString { get; set; } = default!;
    public string CoreDatabaseName { get; set; } = "core";
}
