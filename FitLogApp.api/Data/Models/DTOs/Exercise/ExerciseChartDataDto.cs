namespace FitLogApp.api.Data;

public class ExerciseChartDataDto
{
    public int SessionId { get; set; } 
    public DateTime Date { get; set; }
    public double MaxWeight { get; set; }
    public double OneRepMax { get; set; }
    public double Volume { get; set; }
}