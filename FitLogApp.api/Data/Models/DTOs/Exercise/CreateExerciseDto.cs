using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class CreateExerciseDto
{
    [Required]
    public string Name { get; set; }

    public string PrimaryMuscleGroup { get; set; }

    public string Equipment { get; set; }

    public string SecondaryMuscleGroups { get; set; }

    public string ImageUrl { get; set; }
}
