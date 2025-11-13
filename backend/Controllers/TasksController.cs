using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // use logging to log data for debugging purposes
using TaskManager.Data;      
using TaskManager.Models;
using TaskManager.Models.Dtos;

namespace TaskManager.API;

[Route("api/tasks")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<TasksController> _log;

    public TasksController(ApplicationDbContext db, ILogger<TasksController> log)
    {
        _db = db;
        _log = log;
    }

    // GET: Fetch tasks, optionally filtered by userId, ordered by Order field
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> Get([FromQuery] int? userId = null)
    {
        _log.LogInformation("Fetching tasks for userId: {UserId}", userId);

        var query = _db.Tasks.AsNoTracking(); // Optimize for read-only

        if (userId.HasValue)
            // If UserId is valid,  Add existence check to handle invalid filters gracefully (e.g., return empty list vs. error)
            query = query.Where(t => t.UserId == userId.Value);

        var result = await query
            .OrderBy(t => t.Order) //  Order by 'Order' field for UI drag-and-drop support; assumes client pre-sorts to avoid duplicates
            .Select(t => MapToResponse(t))
            .ToListAsync();

        return Ok(result);
    }

    // POST: Create a new task
    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create([FromBody] TaskItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Early user validation prevents orphan tasks; assumes UserId is required for ownership
        if (!await _db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest($"User {dto.UserId} does not exist.");

        var entity = MapToEntity(dto);
        _db.Tasks.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = entity.Id }, MapToResponse(entity));
    }

    // PUT: Update an existing task
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var entity = await _db.Tasks.FindAsync(id);
        if (entity == null) return NotFound();

        //  Checks UserId consistency to prevent cross-user updates, assumes same-user edits for security (no auth yet)
        if (entity.UserId != dto.UserId && !await _db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest($"User {dto.UserId} does not exist.");

        MapToEntity(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: Remove a task
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Tasks.FindAsync(id);
        if (entity == null) return NotFound();

        _db.Tasks.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // PATCH: Reorder tasks
    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] IReadOnlyList<TaskOrderUpdateDto> updates)
    {
        // Client sends complete list of IDs to reorder, bulk fetch for efficiency in large lists
        var ids = updates.Select(u => u.Id).ToArray();
        var tasks = await _db.Tasks.Where(t => ids.Contains(t.Id)).ToListAsync();

        foreach (var task in tasks)
        {
            var upd = updates.FirstOrDefault(u => u.Id == task.Id);
            if (upd != null)
            {
                task.Order = upd.Order;
                task.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // PATCH: Toggle task completion
    [HttpPatch("{id:int}/toggle")]
    public async Task<ActionResult<TaskResponse>> Toggle(int id, [FromBody] bool isCompleted)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.IsCompleted = isCompleted;
        task.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(MapToResponse(task));
    }

    // Mapping Helpers 
    private static TaskItem MapToEntity(TaskItemDto dto, TaskItem? target = null)
    {
        if (target is null)
        {
            return new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                IsCompleted = dto.IsCompleted,
                UserId = dto.UserId,
                Order = dto.Order
            };
        }

        target.Title = dto.Title;
        target.Description = dto.Description;
        target.IsCompleted = dto.IsCompleted;
        target.Order = dto.Order;

        return target;
    }

    // Static for reusability/performance, projects only needed fields to reduce payload size
    private static TaskResponse MapToResponse(TaskItem e) => new(
        e.Id,
        e.Title,
        e.Description,
        e.IsCompleted,
        e.Order,
        e.UserId,
        e.CreatedAt,
        e.UpdatedAt);
}