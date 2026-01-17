using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace fitlogapi.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoUserIdEmExercise : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Exercises",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Exercises");
        }
    }
}
