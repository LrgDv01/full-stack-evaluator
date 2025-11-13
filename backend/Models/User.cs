using System.ComponentModel.DataAnnotations; // For data annotations

namespace TaskManager.Models
{
    public class User
    {
        public int Id { get; set; } // EF auto-increment PK

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty; // Display name

        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; } = string.Empty; // Unique index in DbContext

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // BCrypt hash – never plain text

        // One-to-many: a user owns many tasks (cascade delete configured in DbContext)
        public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}