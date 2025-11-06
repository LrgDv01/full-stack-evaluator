using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BCrypt.Net; // Added missing using for BCrypt

using TaskManager.Models;
using TaskManager.Data;

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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Exclude PasswordHash from response for security 
            var users = await _context.Users
                .Select(u => new { u.Id, u.Name, u.Email, Tasks = u.Tasks.Count })
                .ToListAsync(); // Hides hash, adds task count
            return Ok(users); 
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // Validate the incoming model using Built-in validation.

            // Check for existing email
            var emailExists = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (emailExists) return BadRequest($"Email {user.Email} is already registered.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash); // Hash the password before storing

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return the created user without PasswordHash for security
            return CreatedAtAction(nameof(Get), new { id = user.Id, user.Name, user.Email });
        }

        // TODO/FIX: fix Update to not expose PasswordHash directly
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id) return BadRequest("User ID mismatch.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

            if (existingUser.Email != updatedUser.Email) // Email changed
            {
                // Check for email uniqueness if changed
                var emailExists = await _context.Users.AnyAsync(u => u.Email == updatedUser.Email && u.Id != id);
                if (emailExists) return BadRequest($"Email {updatedUser.Email} is already registered.");
            }

            // Update fields
            existingUser.Name = updatedUser.Name;
            existingUser.Email = updatedUser.Email;

            // If password is being updated, hash it            
            if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
            {
                existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        // TODO/FIX: Consider cascading delete implications
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.Include(u => u.Tasks).FirstOrDefaultAsync(u => u.Id == id); // Include tasks for potential cascading delete
            if (user == null) return NotFound();

            _context.Tasks.RemoveRange(user.Tasks); // Remove associated tasks (orphan prevention)
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}