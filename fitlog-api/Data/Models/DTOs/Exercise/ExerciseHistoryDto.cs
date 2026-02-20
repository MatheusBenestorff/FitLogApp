namespace FitLogApp.api.Data;

public class ExerciseHistoryDto
{
    public int SessionId { get; set; }
    public string SessionName {get; set;}
    public DateTime Date { get; set; }
    public List<ExerciseSetDto> Sets { get; set; }
}