using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Eyebek.Api.Helpers;

public static class HttpContextExtensions
{
    public static string? GetCompanyId(this HttpContext context)
    {
        var claim = context.User.FindFirst("companyId");
        if (claim == null)
            return null;

        return claim.Value;
    }
}