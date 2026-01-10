namespace BubbleBudget.API.DTOs;

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty; // Hex color code
}

