using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<WorkoutSession> WorkoutSessions { get; set; }
    public DbSet<SessionExercise> SessionExercises { get; set; }
    public DbSet<Set> Sets { get; set; }

}
