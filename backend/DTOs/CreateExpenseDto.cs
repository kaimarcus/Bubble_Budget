namespace BubbleBudget.API.DTOs;

public class CreateExpenseDto
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int CategoryId { get; set; }
}


