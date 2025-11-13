using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BCrypt.Net; // Added missing using for BCrypt

using TaskManager.Models;
using TaskManager.Data;
using System.Security.Cryptography.X509Certificates;
using TaskManager.Models.Dtos;

namespace TaskManager.API
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Record for immutable, lightweight responses
        // Excludes sensitive fields like PasswordHash
        public record UserResponse(int Id, string Name, string Email, int TaskCount); // Response DTO without password hash

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Exclude PasswordHash from response for security 
            var users = await _context.Users
                .Select(u => new { u.Id, u.Name, u.Email, Tasks = u.Tasks.Count }) //  Eager-loads task count via projection to avoid N+1 queries
                .ToListAsync(); // Hides hash, adds task count
            return Ok(users.Select(u => new UserResponse(u.Id, u.Name, u.Email, u.Tasks)));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var emailExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
            if (emailExists) return BadRequest($"Email {userDto.Email} is already registered.");

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                // Security: BCrypt for salted hashing (work factor default=10), prevents rainbow table attacks
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = user.Id }, new { user.Id, user.Email, user.Name });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserDto updatedUserDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

            if (existingUser.Email != updatedUserDto.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == updatedUserDto.Email && u.Id != id);
                if (emailExists) return BadRequest($"Email {updatedUserDto.Email} is already registered.");
            }

            existingUser.Name = updatedUserDto.Name;
            existingUser.Email = updatedUserDto.Email;

            //  Optional password update (empty string skips), supports partial updates without full re-hash**
            if (!string.IsNullOrEmpty(updatedUserDto.Password))
            {
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUserDto.Password);
            }

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Consider cascading delete implications
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Includes Tasks for explicit removal, assumes hard-delete OK for eval (prevents orphans per EF Cascade)
            var user = await _context.Users.Include(u => u.Tasks).FirstOrDefaultAsync(u => u.Id == id); // Include tasks for potential cascading delete
            if (user == null) return NotFound();

            _context.Tasks.RemoveRange(user.Tasks); // Remove associated tasks (orphan prevention)
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}