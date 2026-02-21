namespace FitLogApp.api.Data;

public class WorkoutExerciseDto
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string Name { get; set; } 
    public string PrimaryMuscleGroup { get; set; }
    public string ImageUrl { get; set; }
    public int OrderIndex { get; set; }
    public List<WorkoutSetDto> Sets { get; set; }
}