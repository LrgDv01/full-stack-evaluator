using System.ComponentModel.DataAnnotations; // For data annotations

namespace TaskManager.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required] // Ensure Email is provided
        [EmailAddress] // Validate email format
        public string Email { get; set; } = string.Empty;

        [Required] // Ensure PasswordHash is provided
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")] // Basic length constraint
        public string PasswordHash { get; set; } = string.Empty;
        
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}