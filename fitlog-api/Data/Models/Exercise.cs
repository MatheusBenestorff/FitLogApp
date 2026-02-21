using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace FitLogApp.api.Data;

public class Exercise
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string Equipment { get; set; }

    [Required]
    public string PrimaryMuscleGroup { get; set; }

    public string SecondaryMuscleGroups { get; set; }

    public string ImageUrl { get; set; }

    public int? UserId { get; set; }

    public List<WorkoutExercise> WorkoutExercises { get; set; }
    public List<SessionExercise> SessionExercises { get; set; }
}