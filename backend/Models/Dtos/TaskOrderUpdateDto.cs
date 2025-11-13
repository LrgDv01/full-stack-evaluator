namespace TaskManager.Models.Dtos;

// Record = immutable DTO – perfect for PATCH reorder payload
public record TaskOrderUpdateDto(int Id, int Order);