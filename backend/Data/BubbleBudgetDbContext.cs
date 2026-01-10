using Microsoft.EntityFrameworkCore;
using BubbleBudget.API.Models;

namespace BubbleBudget.API.Data;

public class BubbleBudgetDbContext : DbContext
{
    public BubbleBudgetDbContext(DbContextOptions<BubbleBudgetDbContext> options)
        : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Eating Out", Color = "#FF6B6B", Budget = null },
            new Category { Id = 2, Name = "Groceries", Color = "#4ECDC4", Budget = null },
            new Category { Id = 3, Name = "Gas", Color = "#FFE66D", Budget = null }
        );
    }
}


