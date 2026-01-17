using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FitLogApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workout>>> GetAllWorkoutsByUser()
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        var workouts = await _workoutService.GetAllWorkoutsByUserIdAsync(userId.Value);
        return Ok(workouts);
    }

    [HttpGet("{id}", Name = "GetUserWorkoutById")]
    public async Task<ActionResult<Workout>> GetUserWorkoutById(int id)
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        var workout = await _workoutService.GetWorkoutByIdAsync(id, userId.Value);

        if (workout == null) return NotFound();

        return Ok(workout);
    }

    [HttpPost]
    public async Task<ActionResult<Workout>> CreateWorkout([FromBody] CreateWorkoutDto workoutDto)
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var workout = await _workoutService.CreateWorkoutAsync(workoutDto, userId.Value);

            return CreatedAtAction(
                nameof(GetUserWorkoutById),
                new { id = workout.Id },
                workout
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    // Aux
    private int? GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return null;
        return int.Parse(userIdString);
    }
}