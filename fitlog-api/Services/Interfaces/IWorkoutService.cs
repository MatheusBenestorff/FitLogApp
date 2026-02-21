using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutSummaryDto>> GetAllWorkoutsByUserIdAsync(int userId);
    Task<WorkoutDetailsDto?> GetUserWorkoutByIdAsync(int id, int userId);
    Task<WorkoutDetailsDto> CreateWorkoutAsync(CreateWorkoutDto dto, int userId);
    Task<WorkoutDetailsDto?> UpdateWorkoutAsync(int id, UpdateWorkoutDto dto, int userId);
    Task<bool> DeleteWorkoutAsync(int id, int userId);

}