using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
                .Select(u => new { u.Id, u.Email, Tasks = u.Tasks.Count })
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
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id) return BadRequest("User ID mismatch.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

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
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}