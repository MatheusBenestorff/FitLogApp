namespace FitLogApp.api.Data;

public class ExerciseHistoryDto
{
    public int SessionId { get; set; }
    public DateTime Date { get; set; }
    public List<ExerciseSetDto> Sets { get; set; }
}