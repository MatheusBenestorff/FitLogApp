using FitLogApp.api.Data;     
using FitLogApp.api.Services; 
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FitLogApp.tests.Services;

public class WorkoutServiceTests
{
    // Helper 
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateWorkoutAsync_Should_Create_Successfully()
    {
        // ARRANGE 
        var context = GetInMemoryDbContext();
        var service = new WorkoutService(context);
        int userId = 1;

        var exercise = new Exercise 
        { 
            Id = 50, 
            Name = "Supino Reto", 
            PrimaryMuscleGroup = "Chest",
            WorkoutExercises = new List<WorkoutExercise>() 
        };
        context.Exercises.Add(exercise);
        await context.SaveChangesAsync();

        var dto = new CreateWorkoutDto
        {
            Name = "Treino de Peito Hardcore",
            Exercises = new List<CreateWorkoutExerciseDto>
            {
                new CreateWorkoutExerciseDto
                {
                    ExerciseId = 50,
                    OrderIndex = 1,
                    Sets = new List<CreateWorkoutSetDto>
                    {
                        new CreateWorkoutSetDto { OrderIndex = 1, TargetWeight = 80, TargetReps = 10 },
                        new CreateWorkoutSetDto { OrderIndex = 2, TargetWeight = 90, TargetReps = 8 }
                    }
                }
            }
        };

        // ACT 
        var result = await service.CreateWorkoutAsync(dto, userId);

        // ASSERT 
        
        result.Should().NotBeNull();
        result.Name.Should().Be("Treino de Peito Hardcore");
        
        var savedWorkout = await context.Workouts
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Sets)
            .FirstOrDefaultAsync(w => w.Id == result.Id);

        savedWorkout.Should().NotBeNull();
        savedWorkout!.WorkoutExercises.Should().HaveCount(1);
        savedWorkout.WorkoutExercises.First().Sets.Should().HaveCount(2);
        savedWorkout.WorkoutExercises.First().Sets.First().TargetWeight.Should().Be(80);
    }

    [Fact]
    public async Task CreateWorkoutAsync_Should_Throw_Error_If_Name_Exists()
    {
        // ARRANGE
        var context = GetInMemoryDbContext();
        var service = new WorkoutService(context);
        int userId = 1;

        context.Workouts.Add(new Workout 
        { 
            Name = "Treino A", 
            UserId = userId,
            WorkoutExercises = new List<WorkoutExercise>()
        });
        await context.SaveChangesAsync();

        var dto = new CreateWorkoutDto { Name = "Treino A", Exercises = new List<CreateWorkoutExerciseDto>() };

        // ACT & ASSERT 
        await service.Invoking(x => x.CreateWorkoutAsync(dto, userId))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("You already have a workout with this name.");
    }
}