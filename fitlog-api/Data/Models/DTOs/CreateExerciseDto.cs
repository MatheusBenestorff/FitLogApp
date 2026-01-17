using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class CreateExerciseDto
{
    [Required]
    public string Name { get; set; }

    public string MuscleGroup { get; set; }
}