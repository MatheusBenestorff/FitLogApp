namespace FitLogApp.api.Data;

public class SessionSet
{
    public int Id { get; set; }

    public int SessionExerciseId { get; set; }
    public SessionExercise SessionExercise { get; set; }

    public int Reps { get; set; }
    public double Weight { get; set; }

    public int OrderIndex { get; set; }
}