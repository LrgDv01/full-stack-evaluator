// Models/Dtos/TaskItemDto.cs
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models.Dtos;

public class TaskItemDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    [Required]
    public int UserId { get; set; }

    public int Order { get; set; }
}