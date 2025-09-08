using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public string? Gender { get; set; }

    public DateTime? Birthday { get; set; }

    public List<Workout> Workouts { get; set; }

}