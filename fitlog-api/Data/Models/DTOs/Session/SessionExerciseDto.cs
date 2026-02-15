namespace FitLogApp.api.Data;

public class SessionExerciseDto
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseNameSnapshot { get; set; }
    public string MuscleGroupSnapshot { get; set; }
    public List<SessionSetDto> Sets { get; set; } = new();
}