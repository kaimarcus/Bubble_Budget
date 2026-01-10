using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BubbleBudget.API.Data;
using BubbleBudget.API.Models;
using BubbleBudget.API.DTOs;

namespace BubbleBudget.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly BubbleBudgetDbContext _context;

    public CategoriesController(BubbleBudgetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Include(c => c.Expenses)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Color,
                c.Budget,
                Total = c.Expenses.Sum(e => (decimal?)e.Amount) ?? 0,
                ExpenseCount = c.Expenses.Count
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult> CreateCategory(CreateCategoryDto dto)
    {
        // Validate color format (basic hex color validation)
        if (!string.IsNullOrEmpty(dto.Color) && !dto.Color.StartsWith("#"))
        {
            dto.Color = "#" + dto.Color;
        }

        // Default color if not provided
        if (string.IsNullOrEmpty(dto.Color))
        {
            // Generate a random color
            var random = new Random();
            dto.Color = $"#{random.Next(0x1000000):X6}";
        }

        var category = new Category
        {
            Name = dto.Name,
            Color = dto.Color,
            Budget = null // New categories start without a budget
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = category.Id,
            name = category.Name,
            color = category.Color,
            budget = category.Budget,
            total = 0m,
            expenseCount = 0
        });
    }

    [HttpPut("{id}/budget")]
    public async Task<ActionResult> UpdateCategoryBudget(int id, UpdateCategoryBudgetDto dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound($"Category with id {id} not found");
        }

        category.Budget = dto.Budget;
        await _context.SaveChangesAsync();

        await _context.Entry(category).Collection(c => c.Expenses).LoadAsync();
        var total = category.Expenses.Sum(e => e.Amount);

        return Ok(new
        {
            id = category.Id,
            name = category.Name,
            color = category.Color,
            budget = category.Budget,
            total = total,
            expenseCount = category.Expenses.Count
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Expenses)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (category == null)
        {
            return NotFound($"Category with id {id} not found");
        }

        // Delete all expenses associated with this category
        _context.Expenses.RemoveRange(category.Expenses);
        
        // Delete the category
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

