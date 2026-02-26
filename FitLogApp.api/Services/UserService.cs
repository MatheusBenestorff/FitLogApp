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

    public async Task<IEnumerable<UserDetailsDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserDetailsDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Gender = u.Gender,
                Birthday = u.Birthday
            })
            .ToListAsync();
    }

    public async Task<UserDetailsDto?> GetUserByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDetailsDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Gender = u.Gender,
                Birthday = u.Birthday
            })
            .FirstOrDefaultAsync();
    }


    public async Task<UserDetailsDto> CreateUserAsync(CreateUserDto create)
    {
        if (await _context.Users.AnyAsync(u => u.Email == create.Email))
        {
            throw new InvalidOperationException("Este e-mail já está em uso.");
        }

        var user = new User
        {
            Name = create.Name,
            Email = create.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(create.Password),
            Gender = create.Gender,
            Birthday = DateTime.SpecifyKind(create.Birthday, DateTimeKind.Utc)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDetailsDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Gender = user.Gender,
            Birthday = user.Birthday
        };
    }

    public async Task<UserDetailsDto?> UpdateUserAsync(int id, UpdateUserDto update)
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
        if (update.Birthday.HasValue)
            existingUser.Birthday = DateTime.SpecifyKind(update.Birthday.Value, DateTimeKind.Utc);

        await _context.SaveChangesAsync();

        return new UserDetailsDto
        {
            Id = existingUser.Id,
            Name = existingUser.Name,
            Email = existingUser.Email,
            Gender = existingUser.Gender,
            Birthday = existingUser.Birthday
        };
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