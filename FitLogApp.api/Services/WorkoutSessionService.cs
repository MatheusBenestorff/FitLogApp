using FitLogApp.api.Data;
using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Services;

public class WorkoutSessionService : IWorkoutSessionService
{
    private readonly AppDbContext _context;

    public WorkoutSessionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SessionDetailsDto>> GetAllWorkoutSessionsByUserIdAsync(int userId)
    {
        var sessions = await _context.WorkoutSessions
            .AsNoTracking() 
            .Where(s => s.UserId == userId && s.EndTime != null) 
            .Include(s => s.SessionExercises)
                .ThenInclude(se => se.Sets) 
            .OrderByDescending(s => s.StartTime)
            .ToListAsync();

        return sessions.Select(MapToDto);
    }

    public async Task<SessionDetailsDto?> GetUserWorkoutSessionByIdAsync(int sessionId, int userId)
    {
        var session = await _context.WorkoutSessions
            .Include(s => s.SessionExercises)
            .ThenInclude(se => se.Sets)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        return session == null ? null : MapToDto(session);
    }

    public async Task<SessionDetailsDto> StartUserWorkoutSessionAsync(StartSessionDto dto, int userId)
    {
        var session = new WorkoutSession
        {
            UserId = userId,
            StartTime = DateTime.UtcNow,
            EndTime = null,
            SessionExercises = new List<SessionExercise>()
        };

        if (dto.WorkoutId.HasValue)
        {
            var workoutTemplate = await _context.Workouts
                .Include(w => w.WorkoutExercises)
                    .ThenInclude(we => we.Exercise)
                .Include(w => w.WorkoutExercises)
                    .ThenInclude(we => we.Sets)
                .FirstOrDefaultAsync(w => w.Id == dto.WorkoutId && w.UserId == userId); 

            if (workoutTemplate != null)
            {
                session.WorkoutId = workoutTemplate.Id;
                session.WorkoutNameSnapshot = workoutTemplate.Name;

                var orderedExercises = workoutTemplate.WorkoutExercises.OrderBy(we => we.OrderIndex).ToList();

                foreach (var we in orderedExercises)
                {
                    session.SessionExercises.Add(new SessionExercise
                    {
                        ExerciseId = we.ExerciseId,
                        ExerciseNameSnapshot = we.Exercise.Name, 
                        MuscleGroupSnapshot = we.Exercise.PrimaryMuscleGroup,
                        OrderIndex = we.OrderIndex,
                        Sets = we.Sets.OrderBy(s => s.OrderIndex).Select(s => new SessionSet
                        {
                            OrderIndex = s.OrderIndex,
                            Weight = s.TargetWeight ?? 0, 
                            Reps = s.TargetReps ?? 0
                        }).ToList()
                    });
                }
            }
        }
        else
        {
            session.WorkoutNameSnapshot = "Treino Livre";
        }

        _context.WorkoutSessions.Add(session);
        await _context.SaveChangesAsync();

        return MapToDto(session);
    }

    public async Task<SessionDetailsDto?> FinishUserWorkoutSessionAsync(int sessionId, FinishSessionDto dto, int userId)
    {
        var session = await _context.WorkoutSessions
            .Include(s => s.SessionExercises)
            .ThenInclude(se => se.Sets)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null) return null;

        if (session.EndTime != null)
            throw new InvalidOperationException("This Workout session has already ended.");

        session.EndTime = DateTime.UtcNow;

        _context.SessionExercises.RemoveRange(session.SessionExercises);
        await _context.SaveChangesAsync();

        session.SessionExercises = new List<SessionExercise>();

        var exerciseIds = dto.Exercises.Select(e => e.ExerciseId).Distinct().ToList();
        var originalExercises = await _context.Exercises
            .Where(e => exerciseIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id);

        foreach (var exerciseDto in dto.Exercises)
        {
            if (!originalExercises.TryGetValue(exerciseDto.ExerciseId, out var originalExercise)) 
                continue;

            var newSessionExercise = new SessionExercise
            {
                WorkoutSessionId = session.Id,
                ExerciseId = originalExercise.Id,
                ExerciseNameSnapshot = originalExercise.Name,
                MuscleGroupSnapshot = originalExercise.PrimaryMuscleGroup,
                OrderIndex = exerciseDto.OrderIndex,
                Sets = exerciseDto.Sets.Select(s => new SessionSet
                {
                    Reps = s.Reps,
                    Weight = s.Weight,
                    OrderIndex = s.OrderIndex
                }).ToList()
            };

            session.SessionExercises.Add(newSessionExercise);
        }

        await _context.SaveChangesAsync();

        return MapToDto(session);
    }

    // Aux
    private static SessionDetailsDto MapToDto(WorkoutSession session)
    {
        return new SessionDetailsDto
        {
            Id = session.Id,
            UserId = session.UserId,
            WorkoutNameSnapshot = session.WorkoutNameSnapshot,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Duration = session.Duration,
            Exercises = session.SessionExercises
                .OrderBy(e => e.OrderIndex)
                .Select(e => new SessionExerciseDto
                {
                    Id = e.Id,
                    ExerciseId = e.ExerciseId,
                    ExerciseNameSnapshot = e.ExerciseNameSnapshot,
                    MuscleGroupSnapshot = e.MuscleGroupSnapshot,
                    OrderIndex = e.OrderIndex,
                    Sets = e.Sets
                        .OrderBy(s => s.OrderIndex)
                        .Select(s => new SessionSetDto
                        {
                            Id = s.Id,
                            Reps = s.Reps,
                            Weight = s.Weight,
                            OrderIndex = s.OrderIndex
                        }).ToList()
                }).ToList()
        };
    }
}