namespace FitLogApp.api.Data;

public class ExerciseDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public string Equipment { get; set; }
    public string PrimaryMuscleGroup { get; set; }
    public string SecondaryMuscleGroups { get; set; }
    public double HeaviestWeight { get; set; }
    public double BestOneRepMax { get; set; }
    public double BestSetVolume { get; set; }
    public List<ExerciseChartDataDto> ChartData { get; set; }
    public List<ExerciseHistoryDto> History { get; set; }
}