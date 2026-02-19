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

    public async Task<IEnumerable<WorkoutDetailsDto>> GetAllWorkoutsByUserIdAsync(int userId)
    {
        return await _context.Workouts
            .Where(w => w.UserId == userId)
            .Select(w => new WorkoutDetailsDto
            {
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                Exercises = w.Exercises.Select(e => new ExerciseDetailsDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    MuscleGroup = e.PrimaryMuscleGroup
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<WorkoutDetailsDto?> GetUserWorkoutByIdAsync(int id, int userId)
    {
        return await _context.Workouts
            .Where(w => w.Id == id && w.UserId == userId)
            .Select(w => new WorkoutDetailsDto
            {
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                Exercises = w.Exercises.Select(e => new ExerciseDetailsDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    MuscleGroup = e.PrimaryMuscleGroup
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
            Exercises = new List<Exercise>()
        };

        if (dto.ExerciseIds != null && dto.ExerciseIds.Any())
        {
            var exercises = await _context.Exercises
                .Where(e => dto.ExerciseIds.Contains(e.Id))
                .ToListAsync();

            workout.Exercises.AddRange(exercises);
        }

        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();

        return new WorkoutDetailsDto
        {
            Id = workout.Id,
            Name = workout.Name,
            UserId = workout.UserId,
            Exercises = workout.Exercises.Select(e => new ExerciseDetailsDto
            {
                Id = e.Id,
                Name = e.Name,
                MuscleGroup = e.PrimaryMuscleGroup
            }).ToList()
        };
    }

    public async Task<WorkoutDetailsDto?> UpdateWorkoutAsync(int id, UpdateWorkoutDto dto, int userId)
    {
        var workout = await _context.Workouts
            .Include(w => w.Exercises)
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workout == null) return null;

        if (!string.IsNullOrEmpty(dto.Name) && dto.Name != workout.Name)
        {
            bool nameExists = await _context.Workouts
                .AnyAsync(w => w.UserId == userId && w.Name == dto.Name && w.Id != id);

            if (nameExists)
                throw new InvalidOperationException("You already have a workout with this name.");

            workout.Name = dto.Name;
        }

        if (dto.ExerciseIds != null)
        {
            workout.Exercises.Clear();

            if (dto.ExerciseIds.Any())
            {
                var exercisesToAdd = await _context.Exercises
                    .Where(e => dto.ExerciseIds.Contains(e.Id))
                    .ToListAsync();

                workout.Exercises.AddRange(exercisesToAdd);
            }
        }

        await _context.SaveChangesAsync();

        return new WorkoutDetailsDto
        {
            Id = workout.Id,
            Name = workout.Name,
            UserId = workout.UserId,
            Exercises = workout.Exercises.Select(e => new ExerciseDetailsDto
            {
                Id = e.Id,
                Name = e.Name,
                MuscleGroup = e.PrimaryMuscleGroup
            }).ToList()
        };
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