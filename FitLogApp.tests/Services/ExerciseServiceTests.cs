using FitLogApp.api.Data;
using FitLogApp.api.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FitLogApp.tests.Services;

public class ExerciseServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllUserExercisesAsync_Should_Return_Only_User_Exercises_Ordered()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;

        context.Exercises.AddRange(
            new Exercise { Id = 1, Name = "Z Press", PrimaryMuscleGroup = "Shoulders", UserId = userId }, // Nome com Z para testar ordem
            new Exercise { Id = 2, Name = "Agachamento", PrimaryMuscleGroup = "Legs", UserId = userId },
            new Exercise { Id = 3, Name = "Supino", PrimaryMuscleGroup = "Chest", UserId = 2 },
            new Exercise { Id = 4, Name = "Rosca", PrimaryMuscleGroup = "Biceps", UserId = null }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetAllUserExercisesAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.First().Name.Should().Be("Agachamento");
        result.Last().Name.Should().Be("Z Press");
    }

    [Fact]
    public async Task GetUserExerciseByIdAsync_Should_Return_Null_When_Not_Found()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);

        // Act
        var result = await service.GetUserExerciseByIdAsync(99, 1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetUserExerciseByIdAsync_Should_Calculate_Stats_Correctly()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;
        int exerciseId = 10;

        var exercise = new Exercise { Id = exerciseId, Name = "Deadlift", PrimaryMuscleGroup = "Back", UserId = userId };

        var session = new WorkoutSession { Id = 100, UserId = userId, StartTime = DateTime.UtcNow, WorkoutNameSnapshot = "Treino Costas" };

        var sessionExercise = new SessionExercise
        {
            Id = 1000,
            ExerciseId = exerciseId,
            WorkoutSessionId = 100,
            Sets = new List<SessionSet>
            {
                new SessionSet { Weight = 100, Reps = 10 }, // Volume = 1000, 1RM = ~133
                new SessionSet { Weight = 120, Reps = 5 }   // Volume = 600,  1RM = 140
            }
        };

        context.Exercises.Add(exercise);
        context.WorkoutSessions.Add(session);
        context.SessionExercises.Add(sessionExercise);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetUserExerciseByIdAsync(exerciseId, userId);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Deadlift");

        result.HeaviestWeight.Should().Be(120);
        result.BestSetVolume.Should().Be(1600);
        result.BestOneRepMax.Should().Be(140);

        result.History.Should().HaveCount(1);
        result.ChartData.Should().HaveCount(1);
    }

    [Fact]
    public async Task CreateCustomExerciseAsync_Should_Create_Successfully()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;

        var dto = new CreateExerciseDto { Name = "Elevação Lateral", PrimaryMuscleGroup = "Shoulders" };

        // Act
        var result = await service.CreateCustomExerciseAsync(dto, userId);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Elevação Lateral");

        var dbExercise = await context.Exercises.FirstOrDefaultAsync(e => e.Id == result.Id);
        dbExercise.Should().NotBeNull();
        dbExercise!.UserId.Should().Be(userId);
    }

    [Fact]
    public async Task CreateCustomExerciseAsync_Should_Throw_If_Name_Already_Exists_For_User()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;

        context.Exercises.Add(new Exercise { Name = "Supino", UserId = userId, PrimaryMuscleGroup = "Chest" });
        await context.SaveChangesAsync();

        var dto = new CreateExerciseDto { Name = "Supino", PrimaryMuscleGroup = "Chest" };

        // Act & Assert
        await service.Invoking(s => s.CreateCustomExerciseAsync(dto, userId))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("You already have a custom exercise with this name.");
    }

    [Fact]
    public async Task UpdateCustomExerciseAsync_Should_Update_And_Return_Exercise()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;
        int exerciseId = 5;

        context.Exercises.Add(new Exercise { Id = exerciseId, Name = "Puxada", UserId = userId, PrimaryMuscleGroup = "Back" });
        await context.SaveChangesAsync();

        var dto = new UpdateExerciseDto { Name = "Puxada Frente", PrimaryMuscleGroup = "Lats", Equipment = "Cable" };

        // Act
        var result = await service.UpdateCustomExerciseAsync(exerciseId, dto, userId);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Puxada Frente");
        result.PrimaryMuscleGroup.Should().Be("Lats");
        result.Equipment.Should().Be("Cable");
    }

    [Fact]
    public async Task DeleteCustomExerciseAsync_Should_Return_True_When_Deleted()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);
        int userId = 1;
        int exerciseId = 10;

        context.Exercises.Add(new Exercise { Id = exerciseId, Name = "Remada", UserId = userId, PrimaryMuscleGroup = "Back" });
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteCustomExerciseAsync(exerciseId, userId);

        // Assert
        result.Should().BeTrue();
        var exists = await context.Exercises.AnyAsync(e => e.Id == exerciseId);
        exists.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteCustomExerciseAsync_Should_Return_False_When_Exercise_Does_Not_Exist_Or_Belongs_To_Another_User()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new ExerciseService(context);

        context.Exercises.Add(new Exercise { Id = 1, Name = "Remada", UserId = 2, PrimaryMuscleGroup = "Back" }); // Pertence a outro usuário
        await context.SaveChangesAsync();

        // Act
        var result = await service.DeleteCustomExerciseAsync(1, 1); // Usuário 1 tentando deletar

        // Assert
        result.Should().BeFalse();
    }
}