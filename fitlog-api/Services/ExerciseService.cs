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

    public async Task<IEnumerable<Exercise>> GetAllExercisesAsync(int userId)
    {
        return await _context.Exercises
            .Where(e => e.UserId == null || e.UserId == userId)
            .OrderBy(e => e.Name)
            .ToListAsync();
    }

    public async Task<Exercise> CreateCustomExerciseAsync(CreateExerciseDto dto, int userId)
    {
        //we don't check the globals here to allow him to create his own “Supino” if he wants to write something different
        if (await _context.Exercises.AnyAsync(e => e.UserId == userId && e.Name == dto.Name))
        {
            throw new InvalidOperationException("You already have a custom exercise with this name.");
        }

        var exercise = new Exercise
        {
            Name = dto.Name,
            MuscleGroup = dto.MuscleGroup,
            UserId = userId
        };

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        return exercise;
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