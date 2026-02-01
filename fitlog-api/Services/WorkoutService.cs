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
                    MuscleGroup = e.MuscleGroup
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
                    MuscleGroup = e.MuscleGroup
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
                MuscleGroup = e.MuscleGroup
            }).ToList()
        };
    }
}