using System.ComponentModel.DataAnnotations;

namespace FitLogApp.api.Data;

public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public DateTime? Birthday { get; set; }
}

public class CreateUserDto
{

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public string Gender { get; set; }

    public DateTime Birthday { get; set; }
}

public class UserDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Gender { get; set; }
    public DateTime? Birthday { get; set; }
}