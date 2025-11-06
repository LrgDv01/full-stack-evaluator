using System.ComponentModel.DataAnnotations; // For data annotations

namespace TaskManager.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required] // Ensure Name is provided
        [StringLength(100, ErrorMessage = "Name too long")] // Max length constraint
        public string Name { get; set; } = string.Empty; 
        
        [Required] // Ensure Email is provided
        [EmailAddress] // Validate email format
        [StringLength(256, ErrorMessage = "Email too long")] 
        public string Email { get; set; } = string.Empty;

        [Required] // Ensure PasswordHash is provided
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")] // Basic length constraint (applies to plain before hash)
        public string PasswordHash { get; set; } = string.Empty;

        public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>(); // Improvement: Virtual for lazy loading if needed
    }
}