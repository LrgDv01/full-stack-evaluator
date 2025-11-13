using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models;

public class TaskItem
{
    public TaskItem()
    {
        // Set both timestamps on creation – guarantees consistent defaults
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public int Id { get; init; } // EF-generated PK, immutable after insert

    [Required, StringLength(200)] 
    public string Title { get; set; } = string.Empty; // Matches DB column length (see DbContext)

    [StringLength(1000)]
    public string? Description { get; set; } // Optional, large text

    public bool IsCompleted { get; set; } // UI toggle flag

    [Required]
    public int UserId { get; init; } // FK to User – required for ownership

    public User? User { get; set; } // Navigation property (EF lazy-load)

    public int Order { get; set; } // Drag-and-drop position; client must keep unique per user

    public DateTime CreatedAt { get; private set; } // Immutable after construction
    public DateTime UpdatedAt { get; set; } // Updated on every mutation (controller sets it)
}