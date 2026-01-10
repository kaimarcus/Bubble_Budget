# View Bubble Budget Database
Write-Host "=== Bubble Budget Database Viewer ===" -ForegroundColor Green
Write-Host ""

$apiBase = "http://localhost:5000/api"

try {
    # Get Categories
    Write-Host "📁 Categories:" -ForegroundColor Cyan
    $categories = Invoke-RestMethod -Uri "$apiBase/categories" -Method Get
    $categories | Format-Table id, name, color, @{Label="Total"; Expression={$_.total}}, @{Label="Count"; Expression={$_.expenseCount}} -AutoSize
    
    Write-Host ""
    
    # Get Expenses
    Write-Host "💰 Expenses:" -ForegroundColor Cyan
    $expenses = Invoke-RestMethod -Uri "$apiBase/expenses" -Method Get
    
    if ($expenses.Count -eq 0) {
        Write-Host "  No expenses yet." -ForegroundColor Yellow
        Write-Host "  Add expenses by dragging them to category bins in the app!" -ForegroundColor Gray
    } else {
        $expenses | Format-Table id, description, @{Label="Amount"; Expression={"`$$($_.amount)"}}, @{Label="Category"; Expression={$_.category.name}}, date -AutoSize
        
        Write-Host ""
        Write-Host "📊 Summary:" -ForegroundColor Cyan
        $total = ($expenses | Measure-Object -Property amount -Sum).Sum
        Write-Host "  Total Expenses: $($expenses.Count)" -ForegroundColor White
        Write-Host "  Total Amount: `$$([math]::Round($total, 2))" -ForegroundColor White
        
        Write-Host ""
        Write-Host "By Category:" -ForegroundColor Cyan
        $expenses | Group-Object -Property @{Expression={$_.category.name}} | ForEach-Object {
            $catTotal = ($_.Group | Measure-Object -Property amount -Sum).Sum
            Write-Host "  $($_.Name): $($_.Count) expenses, `$$([math]::Round($catTotal, 2))" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "Database file location:" -ForegroundColor Gray
    Write-Host "  C:\Users\Kai\Code\Bubble_Budget\backend\bubblebudget.db" -ForegroundColor White
    
} catch {
    Write-Host "✗ Error connecting to backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the backend is running on http://localhost:5000" -ForegroundColor Yellow
}

