namespace FitLogApp.api.Data;

public class CreateWorkoutExerciseDto
{
    public int ExerciseId { get; set; }
    public int OrderIndex { get; set; }
    public List<CreateWorkoutSetDto> Sets { get; set; }
}