namespace FitLogApp.api.Data;

public class WorkoutDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int UserId { get; set; }

    public List<WorkoutExerciseDto> Exercises { get; set; }
}