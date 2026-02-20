using FitLogApp.api.Data;

namespace FitLogApp.api.Services;

public interface IExerciseService
{
    Task<IEnumerable<ExerciseSummaryDto>> GetAllUserExercisesAsync(int userId);
    Task<ExerciseDetailsDto> CreateCustomExerciseAsync(CreateExerciseDto dto, int userId);
    Task<ExerciseDetailsDto?> UpdateCustomExerciseAsync(int id, UpdateExerciseDto dto, int userId);

    Task<ExerciseDetailsDto?> GetUserExerciseByIdAsync(int id, int userId);

    Task<bool> DeleteCustomExerciseAsync(int id, int userId);
}