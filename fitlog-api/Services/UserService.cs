using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public UserService(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> CreateUserAsync(CreateUserDto create)
    {
        if (await _context.Users.AnyAsync(u => u.Email == create.Email))
        {
            throw new InvalidOperationException("Este e-mail já está em uso.");
        }

        var user = new User
        {
            Name = create.Name,
            Email = create.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(create.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> UpdateUserAsync(int id, UpdateUserDto update)
    {
        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null) return null;

        if (!string.IsNullOrEmpty(update.Name))
            existingUser.Name = update.Name;

        if (!string.IsNullOrEmpty(update.Email))
        {
            if (await _context.Users.AnyAsync(u => u.Email == update.Email && u.Id != id))
            {
                throw new InvalidOperationException("Este e-mail já está em uso.");
            }
            existingUser.Email = update.Email;
        }

        if (update.Gender != null) existingUser.Gender = update.Gender;
        if (update.Birthday.HasValue) existingUser.Birthday = update.Birthday.Value;

        await _context.SaveChangesAsync();
        return existingUser;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string?> LoginAsync(LoginDto login)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
        {
            return null;
        }

        return _tokenService.GenerateToken(user);
    }
}