using System.ComponentModel.DataAnnotations;
using TaskManager.Models.Dtos;

namespace TaskManager.Models.Dtos
{
    public class UserDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;  // Plain password—hash in controller

        public List<TaskItemDto> Tasks { get; set; } = new List<TaskItemDto>();  // Optional tasks
    }
}