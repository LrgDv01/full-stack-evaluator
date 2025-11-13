using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models.Dtos;

public class TaskItemDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty; // Mirrors TaskItem validation

    [StringLength(1000)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    [Required]
    public int UserId { get; set; } // FK – validated in controller

    public int Order { get; set; } // Sent by client for reordering
}