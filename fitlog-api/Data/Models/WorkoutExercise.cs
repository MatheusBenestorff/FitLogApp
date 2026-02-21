namespace FitLogApp.api.Data;

public class WorkoutExercise
{
    public int Id { get; set; }
    
    public int WorkoutId { get; set; }
    public Workout Workout { get; set; }

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; }

    public int OrderIndex { get; set; } 

    public List<WorkoutSet> Sets { get; set; }
}