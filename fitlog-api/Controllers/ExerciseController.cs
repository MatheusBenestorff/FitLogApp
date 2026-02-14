using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FitLogApp.api.Controllers;

public class ExerciseController : BaseController
{
    private readonly IExerciseService _exerciseService;

    public ExerciseController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Exercise>>> GetAllExercises()
    {
        var exercises = await _exerciseService.GetAllExercisesAsync(CurrentUserId);
        return Ok(exercises);
    }

    [HttpPost]
    public async Task<ActionResult<Exercise>> CreateCustomExercise([FromBody] CreateExerciseDto dto)
    {
        try
        {
            var exercise = await _exerciseService.CreateCustomExerciseAsync(dto, CurrentUserId);
            return Created("", exercise);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomExercise(int id, UpdateExerciseDto dto)
    {
        try
        {
            var result = await _exerciseService.UpdateCustomExerciseAsync(id, dto, CurrentUserId);

            if (result == null) return NotFound("Exercise not found");

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomExercise(int id)
    {
        var deleted = await _exerciseService.DeleteCustomExerciseAsync(id, CurrentUserId);

        if (!deleted) return NotFound("Exercise not found or cannot be deleted.");

        return NoContent();
    }
}