using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;

namespace FitLogApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public UserController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpGet]
    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _appDbContext.Users.ToListAsync();
    }

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

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] User user)
    {

        if (await _appDbContext.Users.AnyAsync(u => u.Email == user.Email))
        {
            return Conflict("An account with this email already exists.");
        }

        _appDbContext.Users.Add(user);
        await _appDbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetUserById),
            new { id = user.Id },
            user
        );
    }

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
            existingUser.Email = update.Email;
        }

        if (update.Gender != null)
        {
            existingUser.Gender = update.Gender;
        }

        if (update.Birthday != default(DateTime))
        {
            existingUser.Birthday = update.Birthday;
        }

        await _appDbContext.SaveChangesAsync();

        return NoContent();
    }

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
}
