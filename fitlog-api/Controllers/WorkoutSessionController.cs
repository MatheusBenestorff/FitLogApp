using FitLogApp.api.Data;
using FitLogApp.api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitLogApp.api.Controllers;

public class WorkoutSessionController : BaseController
{
    private readonly IWorkoutSessionService _workoutsessionService;

    public WorkoutSessionController(IWorkoutSessionService workoutsessionService)
    {
        _workoutsessionService = workoutsessionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkoutSession>>> GetAllWorkoutSessionsByUser()
    {
        var workoutSessions = await _workoutsessionService.GetAllWorkoutSessionsByUserIdAsync(CurrentUserId);
        return Ok(workoutSessions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserWorkoutSessionById(int id)
    {
        var session = await _workoutsessionService.GetUserWorkoutSessionByIdAsync(id, CurrentUserId);

        if (session == null)
            return NotFound("Session not found");

        return Ok(session);
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartUserWorkoutSession([FromBody] StartSessionDto dto)
    {
        try
        {
            var workoutsession = await _workoutsessionService.StartUserWorkoutSessionAsync(dto, CurrentUserId);

            return CreatedAtAction(nameof(GetUserWorkoutSessionById), new { id = workoutsession.Id }, workoutsession);
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao iniciar sessão: {ex.Message}");
        }
    }

    [HttpPost("{id}/finish")]
    public async Task<IActionResult> FinishUserWorkoutSession(int id, [FromBody] FinishSessionDto dto)
    {
        try
        {
            var result = await _workoutsessionService.FinishUserWorkoutSessionAsync(id, dto, CurrentUserId);

            if (result == null)
                return NotFound("Session not found or does not belong to this user.");

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }


}