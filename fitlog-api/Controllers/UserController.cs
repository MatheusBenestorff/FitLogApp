using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Authorization;

namespace FitLogApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly ITokenService _tokenService;


    public UserController(AppDbContext appDbContext, ITokenService tokenService)
    {
        _appDbContext = appDbContext;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _appDbContext.Users.ToListAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = await _appDbContext.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDto create)
    {

        if (await _appDbContext.Users.AnyAsync(u => u.Email == create.Email))
        {
            return Conflict("An account with this email already exists.");
        }

        var user = new User()
        {
            Password = BCrypt.Net.BCrypt.HashPassword(create.Password),
            Email = create.Email,
            Name = create.Name
        };

        _appDbContext.Users.Add(user);
        await _appDbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetUserById),
            new { id = user.Id },
            user
        );
    }

    [AllowAnonymous]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto update)
    {
        var existingUser = await _appDbContext.Users.FindAsync(id);

        if (existingUser == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(update.Name))
        {
            existingUser.Name = update.Name;
        }

        if (!string.IsNullOrEmpty(update.Email))
        {
            if (await _appDbContext.Users.AnyAsync(u => u.Email == update.Email))
            {
                return Conflict("An account with this email already exists.");
            }
            else
            {
                existingUser.Email = update.Email;
            }
        }

        if (update.Gender != null)
        {
            existingUser.Gender = update.Gender;
        }

        if (update.Birthday.HasValue)
        {
            existingUser.Birthday = update.Birthday.Value;
        }

        await _appDbContext.SaveChangesAsync();

        return NoContent();
    }

    [AllowAnonymous]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _appDbContext.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        _appDbContext.Users.Remove(user);

        await _appDbContext.SaveChangesAsync();


        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto login)
    {
        var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
        {
            return BadRequest("Invalid credentials.");
        }

        var token = _tokenService.GenerateToken(user);

        return Ok(new { token = token });
    }
}
