import { useState, useEffect } from 'react'
import ExpenseCircle from './components/ExpenseCircle'
import CategoryBin from './components/CategoryBin'
import HousingBin from './components/HousingBin'
import NewCategoryForm from './components/NewCategoryForm'
import TrashBin from './components/TrashBin'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

// Default categories as fallback
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Eating Out', color: '#FF6B6B' },
  { id: 2, name: 'Groceries', color: '#4ECDC4' },
  { id: 3, name: 'Gas', color: '#FFE66D' }
]

function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [expenses, setExpenses] = useState(() => {
    // Load from localStorage on startup
    const saved = localStorage.getItem('bubbleBudgetExpenses')
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)
  const [housingCategoryId, setHousingCategoryId] = useState(() => {
    // Load housing category ID from localStorage
    const saved = localStorage.getItem('housingCategoryId')
    return saved ? parseInt(saved) : 9999
  })
  const [housingCategory, setHousingCategory] = useState({
    id: 9999,
    name: 'Housing',
    color: '#8B4513',
    budget: null
  })

  useEffect(() => {
    initializeHousingCategory()
    fetchCategories()
    fetchExpenses()
  }, [])

  const initializeHousingCategory = async () => {
    // Ensure housing category exists in backend
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (response.ok) {
        const categories = await response.json()
        let housingCat = categories.find(c => c.name === 'Housing')
        
        if (!housingCat) {
          // Create housing category
          const createResponse = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Housing',
              color: '#8B4513'
            }),
          })
          
          if (createResponse.ok) {
            housingCat = await createResponse.json()
          }
        }
        
        if (housingCat && housingCat.id) {
          setHousingCategory(housingCat)
          setHousingCategoryId(housingCat.id)
          localStorage.setItem('housingCategoryId', housingCat.id.toString())
        }
      }
    } catch (error) {
      console.log('Could not initialize housing category in backend, will use local storage')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setCategories(data)
          // Update housing category if it exists
          const housingCat = data.find(c => c.name === 'Housing')
          if (housingCat) {
            setHousingCategory(housingCat)
            setHousingCategoryId(housingCat.id)
            localStorage.setItem('housingCategoryId', housingCat.id.toString())
          }
          setBackendConnected(true)
          setError(null)
        }
      } else {
        console.warn('Failed to fetch categories, using defaults')
        setCategories(DEFAULT_CATEGORIES)
        setBackendConnected(false)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setBackendConnected(false)
      // Keep default categories
      setCategories(DEFAULT_CATEGORIES)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
        // Save to localStorage as backup
        localStorage.setItem('bubbleBudgetExpenses', JSON.stringify(data))
        setBackendConnected(true)
      } else {
        // Use localStorage if backend fails
        const saved = localStorage.getItem('bubbleBudgetExpenses')
        if (saved) {
          setExpenses(JSON.parse(saved))
        }
        setBackendConnected(false)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      // Use localStorage if backend fails
      const saved = localStorage.getItem('bubbleBudgetExpenses')
      if (saved) {
        setExpenses(JSON.parse(saved))
      }
      setBackendConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseCreated = async (expenseData) => {
    // Create a temporary expense object for immediate UI update
    const tempExpense = {
      id: Date.now(), // Temporary ID
      ...expenseData,
      date: new Date().toISOString()
    }
    
    // Update UI immediately
    const updatedExpenses = [...expenses, tempExpense]
    setExpenses(updatedExpenses)
    localStorage.setItem('bubbleBudgetExpenses', JSON.stringify(updatedExpenses))
    
    // Try to save to backend
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })
      
      if (response.ok) {
        // Refresh from backend to get real ID
        await fetchExpenses()
        await fetchCategories()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error creating expense:', error)
      setBackendConnected(false)
      // Expense is already in UI and localStorage, so it still works!
      setError(`⚠️ Running in offline mode. Expense saved locally. Start backend to sync.`)
    }
  }

  const getExpensesForCategory = (categoryId) => {
    return expenses.filter(e => e.categoryId === categoryId)
  }

  const getHousingExpenses = () => {
    return expenses.filter(e => e.categoryId === housingCategoryId)
  }

  const handleCategoryCreated = async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      
      if (response.ok) {
        await fetchCategories()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      setError(`Failed to create category: ${error.message}`)
      setBackendConnected(false)
    }
  }

  const handleBudgetUpdate = async (categoryId, budget) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget }),
      })
      
      if (response.ok) {
        await fetchCategories()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error updating budget:', error)
      setError(`Failed to update budget: ${error.message}`)
      setBackendConnected(false)
    }
  }

  const handleExpenseMoved = async (expenseId, newCategoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId: newCategoryId }),
      })
      
      if (response.ok) {
        // Refresh expenses and categories to update totals
        await fetchExpenses()
        await fetchCategories()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error moving expense:', error)
      setError(`Failed to move expense: ${error.message}`)
      setBackendConnected(false)
    }
  }

  const handleExpenseDeleted = async (expenseId) => {
    // Optimistically remove from UI
    const updatedExpenses = expenses.filter(e => e.id !== expenseId)
    setExpenses(updatedExpenses)
    localStorage.setItem('bubbleBudgetExpenses', JSON.stringify(updatedExpenses))

    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh to ensure consistency
        await fetchExpenses()
        await fetchCategories()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      setError(`Failed to delete expense: ${error.message}`)
      setBackendConnected(false)
      // Revert the optimistic update
      await fetchExpenses()
    }
  }

  const handleCategoryDeleted = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh both categories and expenses
        await fetchCategories()
        await fetchExpenses()
        setBackendConnected(true)
        setError(null)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError(`Failed to delete category: ${error.message}`)
      setBackendConnected(false)
    }
  }

  if (loading && categories.length === 0) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <HousingBin
        category={housingCategory}
        expenses={getHousingExpenses()}
        onExpenseDropped={handleExpenseCreated}
        onBudgetUpdate={handleBudgetUpdate}
        onExpenseMoved={handleExpenseMoved}
      />
      <h1 className="app-title">Bubble Budget</h1>
      {error && (
        <div className={`error-banner ${backendConnected ? 'success' : 'warning'}`}>
          {error}
          {!backendConnected && (
            <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
              💡 Tip: Run <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>cd backend; dotnet run</code> to start the backend server
            </div>
          )}
        </div>
      )}
      {backendConnected && !error && (
        <div className="success-banner">
          ✓ Connected to backend - expenses are being saved to database
        </div>
      )}
      <div className="app-container">
        <div className="top-actions">
          <ExpenseCircle onExpenseCreated={handleExpenseCreated} />
          <NewCategoryForm onCategoryCreated={handleCategoryCreated} />
        </div>
        <div className="bins-container">
          {categories.length > 0 ? (
            categories
              .filter(category => category.name !== 'Housing' && category.id !== housingCategoryId)
              .map(category => (
                <CategoryBin
                  key={category.id}
                  category={category}
                  expenses={getExpensesForCategory(category.id)}
                  onExpenseDropped={handleExpenseCreated}
                  onBudgetUpdate={handleBudgetUpdate}
                  onExpenseMoved={handleExpenseMoved}
                  onCategoryDelete={handleCategoryDeleted}
                />
              ))
          ) : (
            <div className="no-categories">No categories available</div>
          )}
        </div>
      </div>
      <TrashBin onExpenseDeleted={handleExpenseDeleted} />
    </div>
  )
}

export default App

