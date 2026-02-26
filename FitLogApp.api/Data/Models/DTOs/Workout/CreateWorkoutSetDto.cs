namespace FitLogApp.api.Data;

public class CreateWorkoutSetDto
{
    public int OrderIndex { get; set; }
    public double? TargetWeight { get; set; }
    public int? TargetReps { get; set; }
}