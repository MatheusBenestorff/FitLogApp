using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class UpdateWorkoutDto
{
    public string Name { get; set; }

    public int UserId { get; set; }

    public List<ExerciseDetailsDto> Exercises { get; set; }
}
