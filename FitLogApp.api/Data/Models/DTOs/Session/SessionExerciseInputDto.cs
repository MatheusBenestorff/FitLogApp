namespace FitLogApp.api.Data;

public class SessionExerciseInputDto
{
    public int ExerciseId { get; set; }
    public int OrderIndex { get; set; }
    public List<SessionSetInputDto> Sets { get; set; } = new();
}