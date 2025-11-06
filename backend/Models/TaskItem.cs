using System.ComponentModel.DataAnnotations; // For data annotations

namespace TaskManager.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")] // Title must be provided
        [StringLength(200, ErrorMessage = "Title can't be longer than 200 characters")] // Fix: Match DbContext max length
        public string Title { get; set; } = string.Empty; 
        public bool IsDone { get; set; }

        [Required] // Ensure UserId is provided
        public int UserId { get; set; }
        public User? User { get; set; } // Make nullable to avoid required warnings
    }
}