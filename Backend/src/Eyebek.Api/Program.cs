using System.Text;
using Eyebek.Api.Services;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Infrastructure.Configuration;
using Eyebek.Infrastructure.Persistence;
using Eyebek.Infrastructure.Repositories;
using Eyebek.Infrastructure.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger + JWT Security Scheme
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Eyebek API",
        Version = "v1"
    });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter your JWT with the format: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

// MongoDB Configuration
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDB"));

var mongoSettings = builder.Configuration.GetSection("MongoDB").Get<MongoDbSettings>();
var mongoConnectionString = mongoSettings?.ConnectionString ?? 
    builder.Configuration.GetConnectionString("MongoDB") ?? 
    "mongodb://localhost:27017";

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    return new MongoClient(mongoConnectionString);
});

// MongoDB Contexts
builder.Services.AddScoped<MongoDbContext>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var dbName = mongoSettings?.CoreDatabaseName ?? "core";
    return new MongoDbContext(client, dbName);
});

// Repositories (Infrastructure)
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IPlanRepository, PlanRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();

// Application Services
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IPlanService, PlanService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();

// JWT Token Generator (Api)
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// JWT Configuration
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"] ?? "CLAVE_POR_DEFECTO_SUPER_SECRETA";
var jwtIssuer = jwtSection["Issuer"] ?? "Eyebek";
var jwtAudience = jwtSection["Audience"] ?? "Eyebek";

// JWT Bearer Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true); // For development - restrict in production
    });
});

var app = builder.Build();

// Seed initial data (plans and superadmin) - MongoDB
try
{
    using var scope = app.Services.CreateScope();
    var mongoClient = scope.ServiceProvider.GetRequiredService<IMongoClient>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var mongoContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
    
    // Seed plans
    await MongoSeeder.SeedPlansAsync(mongoContext, logger);
    
    // Seed SuperAdmin
    await MongoSeeder.SeedSuperAdminAsync(mongoContext, logger, builder.Configuration);
}
catch (Exception ex)
{
    Console.WriteLine("⚠️ Error seeding MongoDB data:");
    Console.WriteLine(ex.Message);
    if (ex.InnerException != null)
    {
        Console.WriteLine(ex.InnerException.Message);
    }
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", database = "mongodb" }));

app.Run();
