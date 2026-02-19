using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IWorkoutSessionService
{
    Task<SessionDetailsDto> StartUserWorkoutSessionAsync(StartSessionDto dto, int userId);
    Task<SessionDetailsDto?> FinishUserWorkoutSessionAsync(int sessionId, FinishSessionDto dto, int userId);
    Task<SessionDetailsDto?> GetUserWorkoutSessionByIdAsync(int sessionId, int userId);
    Task<IEnumerable<SessionDetailsDto>> GetAllWorkoutSessionsByUserIdAsync(int userId);

}