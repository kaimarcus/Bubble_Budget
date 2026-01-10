# Backend Setup Instructions

## Quick Start

1. Make sure you're in the backend directory:
   ```powershell
   cd backend
   ```

2. Run the server:
   ```powershell
   dotnet run --urls "http://localhost:5018"
   ```

3. The server will:
   - Create a SQLite database file (`bubblebudget.db`) automatically
   - Start listening on http://localhost:5018
   - Initialize the three default categories (Eating Out, Groceries, Gas)

## Testing the API

Once running, test these endpoints in your browser:

- **Categories**: http://localhost:5018/api/categories
- **Expenses**: http://localhost:5018/api/expenses

## Troubleshooting

If the server doesn't start:
1. Check for port conflicts: `netstat -an | findstr "5018"`
2. Make sure .NET 9.0 SDK is installed: `dotnet --version`
3. Check for errors in the console output

## Database

The app uses SQLite, so no separate database server is needed. The database file (`bubblebudget.db`) will be created in the backend directory on first run.

