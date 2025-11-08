using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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

    // ---------- GET ----------
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> Get([FromQuery] int? userId = null)
    {
        _log.LogInformation("GET tasks – userId: {UserId}", userId);

        IQueryable<TaskItem> query = _db.Tasks;

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        var result = await query
            .OrderBy(t => t.Order)
            .Select(t => new TaskResponse(
                t.Id,
                t.Title,
                t.Description,
                t.IsCompleted,
                t.Order,
                t.UserId,
                t.CreatedAt,
                t.UpdatedAt))
            .ToListAsync();

        return Ok(result);
    }

    // ---------- POST ----------
    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create([FromBody] TaskItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!await _db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest($"User {dto.UserId} does not exist.");

        var entity = MapToEntity(dto);
        _db.Tasks.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = entity.Id }, MapToResponse(entity));
    }

    // ---------- PUT ----------
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var entity = await _db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        if (entity.UserId != dto.UserId && !await _db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest($"User {dto.UserId} does not exist.");

        MapToEntity(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- DELETE ----------
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Tasks.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- PATCH reorder ----------
    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] IReadOnlyList<TaskOrderUpdateDto> updates)
    {
        var ids = updates.Select(u => u.Id).ToArray();
        var tasks = await _db.Tasks.Where(t => ids.Contains(t.Id)).ToListAsync();

        foreach (var task in tasks)
        {
            var upd = updates.First(u => u.Id == task.Id);
            task.Order = upd.Order;
            task.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- PATCH toggle ----------
    [HttpPatch("{id:int}/toggle")]
    public async Task<ActionResult<TaskResponse>> Toggle(int id, [FromBody] bool isCompleted)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        task.IsCompleted = isCompleted;
        task.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(MapToResponse(task));
    }

    // ----- mapping helpers -----

    // private static TaskItem MapToEntity(TaskItemDto dto, TaskItem? target = null)
    // {
    //     target ??= new TaskItem();

    //     target.Title       = dto.Title;
    //     target.Description = dto.Description;
    //     target.IsCompleted = dto.IsCompleted;
    //     target.UserId      = dto.UserId;
    //     target.Order       = dto.Order;

    //     return target;
    // }
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