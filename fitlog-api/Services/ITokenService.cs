using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}