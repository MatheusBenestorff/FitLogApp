using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FitLogApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExerciseController : ControllerBase
{
    private readonly IExerciseService _exerciseService;

    public ExerciseController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Exercise>>> GetAllExercises()
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        var exercises = await _exerciseService.GetAllExercisesAsync(userId.Value);
        return Ok(exercises);
    }

    [HttpPost]
    public async Task<ActionResult<Exercise>> CreateCustomExercise([FromBody] CreateExerciseDto dto)
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var exercise = await _exerciseService.CreateCustomExerciseAsync(dto, userId.Value);
            return CreatedAtAction(nameof(GetAllExercises), new { id = exercise.Id }, exercise);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomExercise(int id)
    {
        int? userId = GetUserId();
        if (userId == null) return Unauthorized();

        var deleted = await _exerciseService.DeleteCustomExerciseAsync(id, userId.Value);

        if (!deleted)
        {
            return NotFound("Exercise not found or you don't have permission to delete it.");
        }

        return NoContent();
    }

    // Aux
    private int? GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString)) return null;
        return int.Parse(userIdString);
    }
}