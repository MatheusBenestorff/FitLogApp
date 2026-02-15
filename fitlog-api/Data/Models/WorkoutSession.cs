using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class WorkoutSession
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public int? WorkoutId { get; set; }
    public Workout? Workout { get; set; }

    // SNAPSHOT
    public string WorkoutNameSnapshot { get; set; }

    // Time Control
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }

    public TimeSpan? Duration => EndTime.HasValue ? EndTime.Value - StartTime : null;

    public List<SessionExercise> SessionExercises { get; set; } = new();
}