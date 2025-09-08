using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class WorkoutSession
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public DateTime SessionTime { get; set; }

    public int UserId { get; set; }

    public User User { get; set; }

    public int WorkoutId { get; set; }

    public Workout Workout { get; set; }

    public List<SessionExercise> SessionExercises { get; set; }
}