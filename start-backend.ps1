Write-Host "=== Starting Bubble Budget Backend ===" -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:5018" -ForegroundColor Cyan
Write-Host "API endpoints:" -ForegroundColor Cyan
Write-Host "  - http://localhost:5018/api/categories" -ForegroundColor Gray
Write-Host "  - http://localhost:5018/api/expenses" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot\backend
dotnet run --urls "http://localhost:5018"

