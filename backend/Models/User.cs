using System.ComponentModel.DataAnnotations; // For data annotations

namespace TaskManager.Models
{
   public class User
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}