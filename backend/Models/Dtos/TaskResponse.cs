// Models/Dtos/TaskResponse.cs
namespace TaskManager.Models.Dtos;

public record TaskResponse(
    int Id,
    string Title,
    string? Description,
    bool IsCompleted,
    int Order,
    int UserId,
    DateTime CreatedAt,
    DateTime UpdatedAt);