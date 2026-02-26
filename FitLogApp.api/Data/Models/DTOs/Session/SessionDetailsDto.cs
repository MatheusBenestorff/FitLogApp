namespace FitLogApp.api.Data;

public class SessionDetailsDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string WorkoutNameSnapshot { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public TimeSpan? Duration { get; set; }
    public List<SessionExerciseDto> Exercises { get; set; } = new();
}