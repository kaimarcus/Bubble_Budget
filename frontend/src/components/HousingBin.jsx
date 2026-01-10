import { useState } from 'react'
import { useDrop } from 'react-dnd'
import ExpenseMarble from './ExpenseMarble'
import BudgetEditor from './BudgetEditor'
import './HousingBin.css'

function HousingBin({ category, expenses, onExpenseDropped, onBudgetUpdate, onExpenseMoved }) {
  const [showBudgetEditor, setShowBudgetEditor] = useState(false)
  
  // Use provided category or default
  const housingCategory = category || {
    id: 9999,
    name: 'Housing',
    color: '#8B4513',
    budget: null
  }

  const [{ isOver }, drop] = useDrop({
    accept: ['expense', 'existing-expense'],
    drop: (item) => {
      // Handle new expense from circle
      if (item.description && item.amount > 0 && !item.expenseId) {
        onExpenseDropped({
          description: item.description,
          amount: item.amount,
          categoryId: housingCategory.id,
        })
      }
      // Handle existing expense being moved
      else if (item.expenseId && item.expense) {
        if (onExpenseMoved) {
          onExpenseMoved(item.expense.id, housingCategory.id)
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budget = housingCategory.budget
  const spent = total
  const remaining = budget !== null ? budget - spent : null
  const isOverBudget = budget !== null && spent > budget
  const budgetPercentage = budget && budget > 0 ? Math.min((spent / budget) * 100, 100) : 0

  const handleBudgetUpdate = async (categoryId, newBudget) => {
    if (onBudgetUpdate) {
      await onBudgetUpdate(categoryId, newBudget)
    }
  }

  return (
    <>
      <div
        ref={drop}
        className={`housing-bin ${isOver ? 'drag-over' : ''} ${isOverBudget ? 'over-budget' : ''}`}
      >
        {/* House Roof */}
        <div className="house-roof" style={{ borderBottomColor: housingCategory.color }}>
          <div className="chimney" style={{ backgroundColor: housingCategory.color }}></div>
        </div>
        
        {/* House Body */}
        <div className="house-body" style={{ borderColor: housingCategory.color }}>
          <div className="house-header" style={{ backgroundColor: housingCategory.color }}>
            <div className="bin-title-row">
              <h2 className="bin-title">🏠 {housingCategory.name}</h2>
              {isOverBudget && (
                <span className="over-budget-indicator" title="Over Budget">✕</span>
              )}
              <div className="bin-actions">
                <button
                  className="edit-budget-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBudgetEditor(true)
                  }}
                  title="Edit Budget"
                >
                  ✎
                </button>
              </div>
            </div>
            
            {budget !== null && (
              <div className="budget-info">
                {remaining !== null && (
                  <div className="budget-remaining">
                    ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'} out of ${budget.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            
            <div className="bin-total">${total.toFixed(2)}</div>
          </div>
          
          {/* Budget Progress Visualization */}
          {budget !== null && (
            <div className="budget-progress-container">
              <div className="budget-progress-bar">
                <div
                  className="budget-progress-fill"
                  style={{
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor: housingCategory.color,
                    opacity: isOverBudget ? 0.8 : 1,
                  }}
                />
                {isOverBudget && (
                  <div
                    className="budget-overfill"
                    style={{
                      width: `${((spent - budget) / budget) * 100}%`,
                      backgroundColor: '#ff4444',
                    }}
                  />
                )}
              </div>
            </div>
          )}
          
          <div className="house-content">
            {/* Door */}
            <div className="house-door" style={{ backgroundColor: housingCategory.color }}></div>
            
            {/* Windows */}
            <div className="house-windows">
              <div className="window" style={{ borderColor: housingCategory.color }}></div>
              <div className="window" style={{ borderColor: housingCategory.color }}></div>
            </div>
            
            <div className="marble-container">
              {expenses.map((expense) => (
                <ExpenseMarble key={expense.id} expense={expense} color={housingCategory.color} />
              ))}
            </div>
            {expenses.length === 0 && (
              <div className="empty-bin">Drop housing expenses here</div>
            )}
          </div>
        </div>
      </div>
      
      {showBudgetEditor && (
        <BudgetEditor
          category={housingCategory}
          onBudgetUpdate={handleBudgetUpdate}
          onClose={() => setShowBudgetEditor(false)}
        />
      )}
    </>
  )
}

export default HousingBin

