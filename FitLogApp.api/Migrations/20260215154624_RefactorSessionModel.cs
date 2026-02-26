using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace fitlogapi.Migrations
{
    /// <inheritdoc />
    public partial class RefactorSessionModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessions_Workouts_WorkoutId",
                table: "WorkoutSessions");

            migrationBuilder.DropTable(
                name: "Sets");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "WorkoutSessions");

            migrationBuilder.RenameColumn(
                name: "SessionTime",
                table: "WorkoutSessions",
                newName: "StartTime");

            migrationBuilder.AlterColumn<int>(
                name: "WorkoutId",
                table: "WorkoutSessions",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "WorkoutSessions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkoutNameSnapshot",
                table: "WorkoutSessions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExerciseNameSnapshot",
                table: "SessionExercises",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MuscleGroupSnapshot",
                table: "SessionExercises",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "SessionExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SessionSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SessionExerciseId = table.Column<int>(type: "integer", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<float>(type: "real", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionSets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionSets_SessionExercises_SessionExerciseId",
                        column: x => x.SessionExerciseId,
                        principalTable: "SessionExercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionSets_SessionExerciseId",
                table: "SessionSets",
                column: "SessionExerciseId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessions_Workouts_WorkoutId",
                table: "WorkoutSessions",
                column: "WorkoutId",
                principalTable: "Workouts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessions_Workouts_WorkoutId",
                table: "WorkoutSessions");

            migrationBuilder.DropTable(
                name: "SessionSets");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "WorkoutNameSnapshot",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "ExerciseNameSnapshot",
                table: "SessionExercises");

            migrationBuilder.DropColumn(
                name: "MuscleGroupSnapshot",
                table: "SessionExercises");

            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "SessionExercises");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "WorkoutSessions",
                newName: "SessionTime");

            migrationBuilder.AlterColumn<int>(
                name: "WorkoutId",
                table: "WorkoutSessions",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "WorkoutSessions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Sets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExerciseSessionId = table.Column<int>(type: "integer", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sets_SessionExercises_ExerciseSessionId",
                        column: x => x.ExerciseSessionId,
                        principalTable: "SessionExercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sets_ExerciseSessionId",
                table: "Sets",
                column: "ExerciseSessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessions_Workouts_WorkoutId",
                table: "WorkoutSessions",
                column: "WorkoutId",
                principalTable: "Workouts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
