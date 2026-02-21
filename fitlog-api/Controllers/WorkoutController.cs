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
    public async Task<ActionResult<IEnumerable<WorkoutSummaryDto>>> GetAllWorkoutsByUser()
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, UpdateWorkoutDto dto)
    {
        try
        {
            var result = await _workoutService.UpdateWorkoutAsync(id, dto, CurrentUserId);

            if (result == null) return NotFound("Workout not found");

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {

        var deleted = await _workoutService.DeleteWorkoutAsync(id, CurrentUserId);

        if (!deleted)
        {
            return NotFound("Workout not found");
        }

        return NoContent();
    }

}