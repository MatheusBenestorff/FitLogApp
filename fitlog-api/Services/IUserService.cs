using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User> CreateUserAsync(CreateUserDto createDto);
    Task<User?> UpdateUserAsync(int id, UpdateUserDto updateDto);
    Task<bool> DeleteUserAsync(int id);
    Task<string?> LoginAsync(LoginDto loginDto);
}