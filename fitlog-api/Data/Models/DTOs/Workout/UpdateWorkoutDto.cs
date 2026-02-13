using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class UpdateWorkoutDto
{
    public string Name { get; set; }

    public List<int>? ExerciseIds { get; set; }
}
