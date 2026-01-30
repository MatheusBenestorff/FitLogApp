using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class CreateWorkoutDto
{
    [Required]
    public string Name { get; set; }

    public List<int> ExerciseIds { get; set; }
}

public class WorkoutDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int UserId { get; set; }

    public List<ExerciseDetailsDto> Exercises { get; set; }
}