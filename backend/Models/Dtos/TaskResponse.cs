namespace TaskManager.Models.Dtos;

// Read-only response – hides internal navigation (User) and exposes only needed fields
public record TaskResponse(
    int Id,
    string Title,
    string? Description,
    bool IsCompleted,
    int Order,
    int UserId,
    DateTime CreatedAt,
    DateTime UpdatedAt);