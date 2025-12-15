using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eyebek.Application.DTOs.Users;
using Eyebek.Application.Interfaces;
using Eyebek.Application.Services.Interfaces;
using Eyebek.Domain.Entities;
using Eyebek.Domain.Enums;

namespace Eyebek.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly ICompanyRepository _companies;

    public UserService(IUserRepository users, ICompanyRepository companies)
    {
        _users = users;
        _companies = companies;
    }

    // Crea un usuario para una empresa
    public async Task<UserListItemDto> CreateAsync(string companyId, UserCreateRequest request)
    {
        var company = await _companies.GetByIdAsync(companyId)
            ?? throw new Exception("Empresa no encontrada.");

        if (company.Status != CompanyStatus.Activo || company.Plan == null)
        {
            // Opcional: Permitir crear usuarios si es para pruebas o definir comportamiento "Sin Plan"
            // Por regla de negocio estricta:
            throw new Exception("La empresa no tiene un plan activo.");
        }

        // Verificar límite de usuarios
        // Nota: Company.CurrentUsers debería actualizarse al agregar/borrar,
        // o podemos contar directamente para estar seguros.
        
        // Vamos a confiar en una consulta real count para seguridad
        var currentCount = (await _users.GetByCompanyAsync(companyId)).Count;
        
        if (currentCount >= company.Plan.UserCapacity)
        {
             throw new Exception($"Se ha alcanzado el límite de usuarios del plan ({company.Plan.UserCapacity}).");
        }

        var user = new User
        {
            CompanyId   = companyId,
            Name        = request.Name,
            Email       = request.Email,
            Document    = request.Document,
            Role        = request.Role,
            Status      = UserStatus.Active,
            Phone       = request.Phone,
            Photo       = request.Photo,
            FacialEmbedding = request.FacialEmbedding,
            PasswordHash = string.Empty,
            CreatedAt   = DateTime.UtcNow,
            UpdatedAt   = DateTime.UtcNow
        };

        await _users.AddAsync(user);
        
        // Actualizamos contador en company (opcional, pero buena práctica para rendimiento de lectura)
        company.CurrentUsers = currentCount + 1;
        await _companies.UpdateAsync(company);

        return Map(user);
    }

    // Lista de usuarios por empresa
    public async Task<List<UserListItemDto>> GetByCompanyAsync(string companyId)
    {
        var users = await _users.GetByCompanyAsync(companyId);
        return users
            .Select(Map)
            .ToList();
    }

    private static UserListItemDto Map(User u) => new()
    {
        Id     = u.Id,
        Name   = u.Name,
        Email  = u.Email,
        Role   = u.Role,
        Status = u.Status,
        Document = u.Document,
        Phone = u.Phone,
        Photo = u.Photo
    };
}