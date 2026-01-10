# Quick Start Guide

## The Backend Won't Start?

If `localhost:5000` or `localhost:5018` isn't available, follow these steps:

### Step 1: Run the Backend Manually

Open PowerShell in the project root and run:

```powershell
.\run-backend.ps1
```

This will show you **exactly what error is preventing the server from starting**.

### Step 2: Check Common Issues

1. **Port Already in Use**
   ```powershell
   netstat -an | findstr "5000"
   ```
   If something is using the port, either stop it or change the port in `backend/Properties/launchSettings.json`

2. **Database Error**
   - The app uses SQLite (no setup needed)
   - Database file will be created automatically
   - If you see database errors, delete `backend/bubblebudget.db` and try again

3. **Missing Dependencies**
   ```powershell
   cd backend
   dotnet restore
   dotnet build
   ```

### Step 3: Alternative - Use the Frontend Only Mode

The frontend works **without the backend**! It saves expenses to your browser's localStorage.

1. Just start the frontend:
   ```powershell
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000
3. You'll see a warning about backend, but everything still works!
4. Expenses are saved locally in your browser

### Step 4: Get Help

If you see specific error messages when running `.\run-backend.ps1`, share them and I can help fix the issue!

