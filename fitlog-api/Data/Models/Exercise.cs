using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class Exercise
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string MuscleGroup { get; set; }
}