using System.ComponentModel.DataAnnotations;
using TaskManager.Models.Dtos;

namespace TaskManager.Models.Dtos
{
    public class UserDto
    {
        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8)]
        public string Password { get; set; } = string.Empty; // Plain text – hashed in controller

        // Optional TODO : allows creating a user with initial tasks in one call (not used yet)
        public List<TaskItemDto>? Tasks { get; set; } 
    }
}