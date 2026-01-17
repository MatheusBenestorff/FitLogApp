using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace FitLogApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public abstract class BaseController : ControllerBase
{
    protected int CurrentUserId
    {
        get
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
            {
                userIdString = User.FindFirstValue(JwtRegisteredClaimNames.NameId) ??
                               User.FindFirstValue("nameid") ??
                               User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            }

            if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out int id))
            {
                return id;
            }

            throw new UnauthorizedAccessException("Token is valid, but the user ID was not found in Claims.");
        }
    }
}