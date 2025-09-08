namespace FitLogApp.api.Data;

public class Set
{
    public int Id { get; set; }

    public int Reps { get; set; }

    public float Weight { get; set; }

    public int ExerciseSessionId { get; set; }

    public SessionExercise ExerciseSession { get; set; }
}