using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class SessionExercise
{
    public int Id { get; set; }

    public int ExerciseId { get; set; }

    public Exercise Exercise { get; set; }

    public int WorkoutSessionId { get; set; }

    public WorkoutSession WorkoutSession { get; set; }

    public List<Set> Sets { get; set; }
}