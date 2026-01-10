# View SQLite Database Directly (requires sqlite3)
Write-Host "=== SQLite Database Viewer ===" -ForegroundColor Green
Write-Host ""

$dbPath = "C:\Users\Kai\Code\Bubble_Budget\backend\bubblebudget.db"

if (-not (Test-Path $dbPath)) {
    Write-Host "✗ Database file not found at: $dbPath" -ForegroundColor Red
    Write-Host "The database will be created when you add your first expense." -ForegroundColor Yellow
    exit
}

# Check if sqlite3 is available
$sqlite3 = Get-Command sqlite3 -ErrorAction SilentlyContinue

if (-not $sqlite3) {
    Write-Host "⚠ sqlite3 command not found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install SQLite tools:" -ForegroundColor Cyan
    Write-Host "1. Download from: https://www.sqlite.org/download.html" -ForegroundColor White
    Write-Host "2. Or use: winget install SQLite.SQLite" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternatively, use: .\view-database.ps1 (uses API)" -ForegroundColor Cyan
    exit
}

Write-Host "📁 Categories:" -ForegroundColor Cyan
sqlite3 $dbPath "SELECT Id, Name, Color FROM Categories;" | Format-Table -AutoSize

Write-Host ""
Write-Host "💰 Expenses:" -ForegroundColor Cyan
sqlite3 $dbPath "SELECT e.Id, e.Description, e.Amount, c.Name as Category, e.Date FROM Expenses e JOIN Categories c ON e.CategoryId = c.Id ORDER BY e.Date DESC;" | Format-Table -AutoSize

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
sqlite3 $dbPath "SELECT COUNT(*) as TotalExpenses, SUM(Amount) as TotalAmount FROM Expenses;" | Format-Table -AutoSize

