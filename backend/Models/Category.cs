namespace BubbleBudget.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty; // Hex color code
    public decimal? Budget { get; set; } // Optional budget amount
    public List<Expense> Expenses { get; set; } = new();
}


