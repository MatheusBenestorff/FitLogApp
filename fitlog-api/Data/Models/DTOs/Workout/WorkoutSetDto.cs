namespace FitLogApp.api.Data;

public class WorkoutSetDto
{
    public int Id { get; set; }
    public int OrderIndex { get; set; }
    public double? TargetWeight { get; set; }
    public int? TargetReps { get; set; }
}