using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Services;

public class ExerciseService : IExerciseService
{
    private readonly AppDbContext _context;

    public ExerciseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExerciseDetailsDto>> GetAllUserExercisesAsync(int userId)
    {
        return await _context.Exercises
            .Where(e => e.UserId == userId)
            .OrderBy(e => e.Name)
            .Select(e => new ExerciseDetailsDto
            {
                Id = e.Id,
                Name = e.Name,
                MuscleGroup = e.PrimaryMuscleGroup
            })
            .ToListAsync();
    }

    public async Task<ExerciseDetailsDto?> GetUserExerciseByIdAsync(int id, int userId)
    {
        return await _context.Exercises
            .Where(e => e.Id == id && e.UserId == userId)
            .Select(e => new ExerciseDetailsDto
            {
                Id = e.Id,
                Name = e.Name,
                MuscleGroup = e.PrimaryMuscleGroup

            })
            .FirstOrDefaultAsync();
    }

    public async Task<ExerciseDetailsDto> CreateCustomExerciseAsync(CreateExerciseDto dto, int userId)
    {
        //we don't check the globals here to allow him to create his own “Supino” if he wants to write something different
        if (await _context.Exercises.AnyAsync(e => e.UserId == userId && e.Name == dto.Name))
        {
            throw new InvalidOperationException("You already have a custom exercise with this name.");
        }

        var exercise = new Exercise
        {
            Name = dto.Name,
            PrimaryMuscleGroup = dto.MuscleGroup,
            UserId = userId
        };

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        return new ExerciseDetailsDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            MuscleGroup = exercise.PrimaryMuscleGroup
        };
    }

    public async Task<ExerciseDetailsDto?> UpdateCustomExerciseAsync(int id, UpdateExerciseDto dto, int userId)
    {
        var exercise = await _context.Exercises.FirstOrDefaultAsync(e => e.UserId == userId && e.Id == id);

        if (exercise == null) return null;

        if (!string.IsNullOrEmpty(dto.Name) && dto.Name != exercise.Name)
        {
            bool nameExists = await _context.Exercises
                .AnyAsync(w => w.UserId == userId && w.Name == dto.Name && w.Id != id);

            if (nameExists)
                throw new InvalidOperationException("You already have a exercise with this name.");

            exercise.Name = dto.Name;
        }
        exercise.PrimaryMuscleGroup = dto.MuscleGroup;

        await _context.SaveChangesAsync();

        return new ExerciseDetailsDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            MuscleGroup = exercise.PrimaryMuscleGroup
        };
    }

    public async Task<bool> DeleteCustomExerciseAsync(int id, int userId)
    {
        //Ensures that the user can only delete their own exercise, not those belonging to the system or others.
        var exercise = await _context.Exercises
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (exercise == null) return false;

        _context.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();
        return true;
    }
}