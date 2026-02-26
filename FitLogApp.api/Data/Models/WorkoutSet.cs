namespace FitLogApp.api.Data;

public class WorkoutSet
{
    public int Id { get; set; }

    public int WorkoutExerciseId { get; set; }
    public WorkoutExercise WorkoutExercise { get; set; }

    public int OrderIndex { get; set; } 
    
    public double? TargetWeight { get; set; } 
    public int? TargetReps { get; set; }
}