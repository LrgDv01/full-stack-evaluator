using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TaskManager.Data;
using TaskManager.Models;          // EF entities
using TaskManager.Models.Dtos;     // DTOs
using System.Threading.Tasks;

namespace TaskManager.API
{
    [Route("api/tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ApplicationDbContext context, ILogger<TasksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // -------------------------------------------------
        // GET  /api/tasks?userId=3
        // -------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? userId = null)
        {
            _logger.LogInformation("Fetching tasks. UserId filter: {UserId}", userId);

            IQueryable<TaskItem> query = _context.Tasks;

            if (userId.HasValue)
                query = query.Where(t => t.UserId == userId.Value);

            var tasks = await query
                .Select(t => new   // tiny response DTO – hides navigation
                {
                    t.Id,
                    t.Title,
                    t.IsDone,
                    t.UserId
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // -------------------------------------------------
        // POST /api/tasks
        // -------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItemDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Validate that the supplied UserId actually exists
            bool userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
                return BadRequest($"User with Id {dto.UserId} does not exist.");

            var task = new TaskItem
            {
                Title   = dto.Title,
                IsDone  = dto.IsDone,
                UserId  = dto.UserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Return the created task (no navigation to avoid cycles)
            var created = new
            {
                task.Id,
                task.Title,
                task.IsDone,
                task.UserId
            };

            return CreatedAtAction(nameof(Get), new { id = task.Id }, created);
        }

        // -------------------------------------------------
        // PUT  /api/tasks/5
        // -------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskItemDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            // If the client wants to move the task to another user, validate the new UserId
            if (task.UserId != dto.UserId)
            {
                bool userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
                if (!userExists)
                    return BadRequest($"User with Id {dto.UserId} does not exist.");
            }

            task.Title  = dto.Title;
            task.IsDone = dto.IsDone;
            task.UserId = dto.UserId;

            await _context.SaveChangesAsync();
            return NoContent();   // 204 – standard for successful PUT
        }

        // -------------------------------------------------
        // DELETE /api/tasks/5
        // -------------------------------------------------
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