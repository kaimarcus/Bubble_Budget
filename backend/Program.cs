using Microsoft.EntityFrameworkCore;
using BubbleBudget.API.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Prevent circular reference errors
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
// Only add Swagger in development to avoid version conflicts
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen();
}

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configure Database - Using SQLite for easier setup (no LocalDB required)
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "bubblebudget.db");
builder.Services.AddDbContext<BubbleBudgetDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthorization();
app.MapControllers();

// Initialize database synchronously before starting server
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<BubbleBudgetDbContext>();
        // Delete and recreate database to ensure schema is up to date
        if (System.IO.File.Exists(dbPath))
        {
            System.IO.File.Delete(dbPath);
            Console.WriteLine("✓ Deleted old database file");
        }
        dbContext.Database.EnsureCreated();
        Console.WriteLine("✓ Database initialized successfully with Budget column.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"✗ Database initialization error: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}

var urls = builder.Configuration["urls"] ?? "http://localhost:5000";
Console.WriteLine($"✓ Starting server on {urls}");
Console.WriteLine("✓ Server is ready! Press Ctrl+C to stop.");
app.Run();
