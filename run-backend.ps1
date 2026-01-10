# Run Backend Server - Shows all output
Write-Host "=== Bubble Budget Backend ===" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot\backend

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Building project..." -ForegroundColor Yellow
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Build failed! Check errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n✓ Build successful!" -ForegroundColor Green
Write-Host ""

Write-Host "Starting server on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Watch for any error messages below..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow
Write-Host "----------------------------------------`n" -ForegroundColor Gray

# Run and show all output
dotnet run --urls "http://localhost:5000"

Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "Server stopped." -ForegroundColor Yellow
Read-Host "Press Enter to close"

