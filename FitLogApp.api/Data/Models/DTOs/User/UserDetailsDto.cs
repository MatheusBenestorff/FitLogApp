namespace FitLogApp.api.Data;

public class UserDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Gender { get; set; }
    public DateTime? Birthday { get; set; }
}