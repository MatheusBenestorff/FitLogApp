using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IExerciseService
{
    Task<IEnumerable<ExerciseDetailsDto>> GetAllExercisesAsync(int userId);
    Task<ExerciseDetailsDto> CreateCustomExerciseAsync(CreateExerciseDto dto, int userId);
    Task<bool> DeleteCustomExerciseAsync(int id, int userId);
}