using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace fitlogapi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExerciseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseWorkout_Workouts_WorkoutsId",
                table: "ExerciseWorkout");

            migrationBuilder.RenameColumn(
                name: "WorkoutsId",
                table: "ExerciseWorkout",
                newName: "WorkoutExercisesId");

            migrationBuilder.RenameIndex(
                name: "IX_ExerciseWorkout_WorkoutsId",
                table: "ExerciseWorkout",
                newName: "IX_ExerciseWorkout_WorkoutExercisesId");

            migrationBuilder.RenameColumn(
                name: "MuscleGroup",
                table: "Exercises",
                newName: "SecondaryMuscleGroups");

            migrationBuilder.AddColumn<string>(
                name: "Equipment",
                table: "Exercises",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Exercises",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryMuscleGroup",
                table: "Exercises",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseWorkout_Workouts_WorkoutExercisesId",
                table: "ExerciseWorkout",
                column: "WorkoutExercisesId",
                principalTable: "Workouts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseWorkout_Workouts_WorkoutExercisesId",
                table: "ExerciseWorkout");

            migrationBuilder.DropColumn(
                name: "Equipment",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "PrimaryMuscleGroup",
                table: "Exercises");

            migrationBuilder.RenameColumn(
                name: "WorkoutExercisesId",
                table: "ExerciseWorkout",
                newName: "WorkoutsId");

            migrationBuilder.RenameIndex(
                name: "IX_ExerciseWorkout_WorkoutExercisesId",
                table: "ExerciseWorkout",
                newName: "IX_ExerciseWorkout_WorkoutsId");

            migrationBuilder.RenameColumn(
                name: "SecondaryMuscleGroups",
                table: "Exercises",
                newName: "MuscleGroup");

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseWorkout_Workouts_WorkoutsId",
                table: "ExerciseWorkout",
                column: "WorkoutsId",
                principalTable: "Workouts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
