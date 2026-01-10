using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BubbleBudget.API.Data;
using BubbleBudget.API.Models;
using BubbleBudget.API.DTOs;

namespace BubbleBudget.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly BubbleBudgetDbContext _context;

    public ExpensesController(BubbleBudgetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetExpenses()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .OrderByDescending(e => e.Date)
            .Select(e => new
            {
                id = e.Id,
                description = e.Description,
                amount = e.Amount,
                date = e.Date,
                categoryId = e.CategoryId,
                category = new
                {
                    id = e.Category.Id,
                    name = e.Category.Name,
                    color = e.Category.Color
                }
            })
            .ToListAsync();
        
        return Ok(expenses);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(CreateExpenseDto dto)
    {
        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
        {
            return NotFound($"Category with id {dto.CategoryId} not found");
        }

        var expense = new Expense
        {
            Description = dto.Description,
            Amount = dto.Amount,
            CategoryId = dto.CategoryId,
            Date = DateTime.Now
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        await _context.Entry(expense).Reference(e => e.Category).LoadAsync();

        // Return expense without circular reference
        return Ok(new
        {
            id = expense.Id,
            description = expense.Description,
            amount = expense.Amount,
            date = expense.Date,
            categoryId = expense.CategoryId,
            category = new
            {
                id = expense.Category.Id,
                name = expense.Category.Name,
                color = expense.Category.Color
            }
        });
    }

    [HttpPut("{id}/category")]
    public async Task<ActionResult> UpdateExpenseCategory(int id, UpdateExpenseCategoryDto dto)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound($"Expense with id {id} not found");
        }

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
        {
            return NotFound($"Category with id {dto.CategoryId} not found");
        }

        expense.CategoryId = dto.CategoryId;
        await _context.SaveChangesAsync();

        await _context.Entry(expense).Reference(e => e.Category).LoadAsync();

        return Ok(new
        {
            id = expense.Id,
            description = expense.Description,
            amount = expense.Amount,
            date = expense.Date,
            categoryId = expense.CategoryId,
            category = new
            {
                id = expense.Category.Id,
                name = expense.Category.Name,
                color = expense.Category.Color
            }
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound($"Expense with id {id} not found");
        }

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}


