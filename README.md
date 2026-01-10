# Bubble Budget - Spend Tracker

A beautiful, interactive spend tracking web application with drag-and-drop functionality.

## Features

- 🎯 **Interactive Circle Input**: Click the circle in the center to enter new expenses
- 🗑️ **Category Bins**: Drag expenses into colored bins (Eating Out, Groceries, Gas)
- 💎 **Marble Visualization**: Expenses appear as marbles in bins, sized by amount
- 📊 **Real-time Totals**: Each bin shows the total amount spent
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (LocalDB)
- **Drag & Drop**: react-dnd

## Prerequisites

- .NET 9.0 SDK
- Node.js 18+ and npm
- SQL Server LocalDB (usually comes with Visual Studio)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore packages and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Run the backend:
   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5018`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

1. **Add an Expense**:
   - Click the circle in the center
   - Enter a description and amount
   - Drag the circle to one of the category bins

2. **View Expenses**:
   - Expenses appear as colored marbles in their respective bins
   - Marble size corresponds to the expense amount
   - Hover over marbles to see details

3. **Track Spending**:
   - Each bin displays the total amount spent in that category
   - Expenses are automatically saved to the database

## Database

The application uses Entity Framework Core with SQL Server LocalDB. The database is automatically created on first run with seeded categories:
- Eating Out (Red)
- Groceries (Teal)
- Gas (Yellow)

## API Endpoints

- `GET /api/categories` - Get all categories with totals
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create a new expense

## Project Structure

```
Bubble_Budget/
├── backend/
│   ├── Controllers/     # API controllers
│   ├── Data/           # DbContext
│   ├── Models/         # Data models
│   └── DTOs/           # Data transfer objects
└── frontend/
    └── src/
        ├── components/  # React components
        └── App.jsx      # Main app component
```

## Development

The backend runs on port 5018 and the frontend on port 3000. CORS is configured to allow the frontend to communicate with the backend.

## License

MIT


