namespace FitLogApp.api.Data;

public class SessionExercise
{
    public int Id { get; set; }

    public int WorkoutSessionId { get; set; }
    public WorkoutSession WorkoutSession { get; set; }

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; }

    // SNAPSHOT
    public string ExerciseNameSnapshot { get; set; }
    public string MuscleGroupSnapshot { get; set; }

    public int OrderIndex { get; set; }

    public List<SessionSet> Sets { get; set; } = new();
}