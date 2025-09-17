using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class Workout
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public int UserId { get; set; }

    public User User { get; set; }

    public List<Exercise> Exercises { get; set; }
}