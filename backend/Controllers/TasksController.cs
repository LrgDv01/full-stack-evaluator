using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using TaskManager.Models;
using TaskManager.Data;
namespace TaskManager.API
{
    [Route("api/tasks")] // [Route("tasks")] should be [Route("api/tasks")] for convention (avoids conflicts).
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet] // For GET, maybe add a query param later for user-specific tasks. > TODO later
        public async Task<IActionResult> Get()
        {
            
            var tasks = await _context.Tasks.ToListAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItem task)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // Validate the incoming model using Built-in validation.

            // Check if UserId exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == task.UserId); 
            if (!userExists) return BadRequest($"Invalid UserId - user with Id {task.UserId} does not exist.");

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")] 
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem updated)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // Validate the incoming model using Built-in validation.

            // Check if UserId exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == updated.UserId);
            if (!userExists) return BadRequest($"Invalid UserId - user with Id {updated.UserId} does not exist.");

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updated.Title;
            task.IsDone = updated.IsDone;
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
