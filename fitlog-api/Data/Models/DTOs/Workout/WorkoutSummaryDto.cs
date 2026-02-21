namespace FitLogApp.api.Data;

public class WorkoutSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<WorkoutExerciseSummaryDto> Exercises { get; set; }
}