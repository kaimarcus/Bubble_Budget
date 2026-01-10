# Test Backend Startup Script
Write-Host "=== Testing Backend Startup ===" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot\backend

Write-Host "Building project..." -ForegroundColor Cyan
dotnet build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting server..." -ForegroundColor Cyan
    Write-Host "Server will be available at: http://localhost:5018" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    dotnet run --urls "http://localhost:5018"
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}

