using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IWorkoutService
{
    Task<IEnumerable<Workout>> GetAllWorkoutsByUserIdAsync(int userId);
    Task<WorkoutDetailsDto?> GetWorkoutByIdAsync(int id, int userId);
    Task<Workout> CreateWorkoutAsync(CreateWorkoutDto dto, int userId);
}