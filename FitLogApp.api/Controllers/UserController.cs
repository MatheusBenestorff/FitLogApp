using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace FitLogApp.api.Controllers;

public class UserController : BaseController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpGet("current")]
    public async Task<ActionResult<User>> GetCurrentUser()
    {
        var user = await _userService.GetUserByIdAsync(CurrentUserId);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDto create)
    {
        try
        {
            var user = await _userService.CreateUserAsync(create);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto update)
    {
        try
        {
            var updatedUser = await _userService.UpdateUserAsync(id, update);

            if (updatedUser == null) return NotFound();

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteUserAsync(id);

        if (!deleted) return NotFound();

        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto login)
    {
        var token = await _userService.LoginAsync(login);

        if (token == null)
        {
            return BadRequest("Invalid credentials.");
        }

        return Ok(new { token = token });
    }
}