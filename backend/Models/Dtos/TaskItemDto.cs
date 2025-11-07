// Models/Dtos/TaskItemDto.cs
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models.Dtos
{
    public class TaskItemDto
    {
        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public bool IsDone { get; set; } = false;

        [Required]                     // the client must tell us which user
        public int UserId { get; set; }
    }
}