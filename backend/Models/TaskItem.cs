using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models;

public class TaskItem
{
    public TaskItem()
    {
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public int Id { get; init; }

    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    [Required]
    public int UserId { get; init; }

    public User? User { get; set; }

    public int Order { get; set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; set; }
}