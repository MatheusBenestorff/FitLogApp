using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IExerciseService
{
    Task<IEnumerable<Exercise>> GetAllExercisesAsync(int userId);
    Task<Exercise> CreateCustomExerciseAsync(CreateExerciseDto dto, int userId);
    Task<bool> DeleteCustomExerciseAsync(int id, int userId);
}