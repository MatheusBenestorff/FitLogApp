using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IUserService
{
    Task<IEnumerable<UserDetailsDto>> GetAllUsersAsync();
    Task<UserDetailsDto?> GetUserByIdAsync(int id);
    Task<UserDetailsDto> CreateUserAsync(CreateUserDto create);
    Task<UserDetailsDto?> UpdateUserAsync(int id, UpdateUserDto update);
    Task<bool> DeleteUserAsync(int id);
    Task<string?> LoginAsync(LoginDto loginDto);
}