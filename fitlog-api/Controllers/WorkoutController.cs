using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FitLogApp.api.Controllers;

public class WorkoutController : BaseController
{
    private readonly IWorkoutService _workoutService;

    public WorkoutController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workout>>> GetAllWorkoutsByUser()
    {
        var workouts = await _workoutService.GetAllWorkoutsByUserIdAsync(CurrentUserId);
        return Ok(workouts);
    }

    [HttpGet("{id}", Name = "GetUserWorkoutById")]
    public async Task<ActionResult<Workout>> GetUserWorkoutById(int id)
    {

        var workout = await _workoutService.GetUserWorkoutByIdAsync(id, CurrentUserId);

        if (workout == null) return NotFound();

        return Ok(workout);
    }

    [HttpPost]
    public async Task<ActionResult<Workout>> CreateWorkout([FromBody] CreateWorkoutDto workoutDto)
    {
        try
        {
            var workout = await _workoutService.CreateWorkoutAsync(workoutDto, CurrentUserId);

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

}