using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Services;

public class WorkoutService : IWorkoutService
{
    private readonly AppDbContext _context;

    public WorkoutService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WorkoutSummaryDto>> GetAllWorkoutsByUserIdAsync(int userId)
    {
        return await _context.Workouts
            .AsNoTracking() 
            .Where(w => w.UserId == userId)
            .Select(w => new WorkoutSummaryDto
            {
                Id = w.Id,
                Name = w.Name,
                Exercises = w.WorkoutExercises
                    .OrderBy(we => we.OrderIndex)
                    .Select(we => new WorkoutExerciseSummaryDto
                    {
                        ExerciseId = we.ExerciseId,
                        Name = we.Exercise.Name, 
                        PrimaryMuscleGroup = we.Exercise.PrimaryMuscleGroup
                    }).ToList()
            })
            .ToListAsync();
    }

    public async Task<WorkoutDetailsDto?> GetUserWorkoutByIdAsync(int id, int userId)
    {
        return await _context.Workouts
            .AsNoTracking()
            .Where(w => w.Id == id && w.UserId == userId)
            .Select(w => new WorkoutDetailsDto
            {
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                Exercises = w.WorkoutExercises
                    .OrderBy(we => we.OrderIndex)
                    .Select(we => new WorkoutExerciseDto
                    {
                        Id = we.Id,
                        ExerciseId = we.ExerciseId,
                        Name = we.Exercise.Name,
                        PrimaryMuscleGroup = we.Exercise.PrimaryMuscleGroup,
                        ImageUrl = we.Exercise.ImageUrl,
                        OrderIndex = we.OrderIndex,
                        Sets = we.Sets.OrderBy(s => s.OrderIndex).Select(s => new WorkoutSetDto
                        {
                            Id = s.Id,
                            OrderIndex = s.OrderIndex,
                            TargetWeight = s.TargetWeight,
                            TargetReps = s.TargetReps
                        }).ToList()
                    }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<WorkoutDetailsDto> CreateWorkoutAsync(CreateWorkoutDto dto, int userId)
    {
        if (await _context.Workouts.AnyAsync(w => w.UserId == userId && w.Name == dto.Name))
        {
            throw new InvalidOperationException("You already have a workout with this name.");
        }

        var workout = new Workout
        {
            Name = dto.Name,
            UserId = userId,
            WorkoutExercises = dto.Exercises?.Select(e => new WorkoutExercise
            {
                ExerciseId = e.ExerciseId,
                OrderIndex = e.OrderIndex,
                Sets = e.Sets?.Select(s => new WorkoutSet
                {
                    OrderIndex = s.OrderIndex,
                    TargetWeight = s.TargetWeight,
                    TargetReps = s.TargetReps
                }).ToList() ?? new List<WorkoutSet>()
            }).ToList() ?? new List<WorkoutExercise>()
        };

        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();

        return await GetUserWorkoutByIdAsync(workout.Id, userId);
    }

    public async Task<WorkoutDetailsDto?> UpdateWorkoutAsync(int id, UpdateWorkoutDto dto, int userId)
    {
        var workout = await _context.Workouts
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Sets)
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workout == null) return null;

        // Atualiza Nome
        if (!string.IsNullOrEmpty(dto.Name) && dto.Name != workout.Name)
        {
            bool nameExists = await _context.Workouts
                .AnyAsync(w => w.UserId == userId && w.Name == dto.Name && w.Id != id);

            if (nameExists)
                throw new InvalidOperationException("You already have a workout with this name.");

            workout.Name = dto.Name;
        }

        // Atualiza Exercícios e Séries 
        if (dto.Exercises != null)
        {
            _context.WorkoutExercises.RemoveRange(workout.WorkoutExercises);

            workout.WorkoutExercises = dto.Exercises.Select(e => new WorkoutExercise
            {
                ExerciseId = e.ExerciseId,
                OrderIndex = e.OrderIndex,
                Sets = e.Sets?.Select(s => new WorkoutSet
                {
                    OrderIndex = s.OrderIndex,
                    TargetWeight = s.TargetWeight,
                    TargetReps = s.TargetReps
                }).ToList() ?? new List<WorkoutSet>()
            }).ToList();
        }

        await _context.SaveChangesAsync();

        return await GetUserWorkoutByIdAsync(workout.Id, userId);
    }

    public async Task<bool> DeleteWorkoutAsync(int id, int userId)
    {
        var workout = await _context.Workouts
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workout == null)
        {
            return false;
        }

        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();

        return true;
    }
}