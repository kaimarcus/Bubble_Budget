import { useState } from 'react'
import { useDrop } from 'react-dnd'
import ExpenseMarble from './ExpenseMarble'
import BudgetEditor from './BudgetEditor'
import './CategoryBin.css'

function CategoryBin({ category, expenses, onExpenseDropped, onBudgetUpdate, onExpenseMoved, onCategoryDelete }) {
  const [showBudgetEditor, setShowBudgetEditor] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [{ isOver }, drop] = useDrop({
    accept: ['expense', 'existing-expense'],
    drop: (item) => {
      // Handle new expense from circle
      if (item.description && item.amount > 0 && !item.expenseId) {
        onExpenseDropped({
          description: item.description,
          amount: item.amount,
          categoryId: category.id,
        })
      }
      // Handle existing expense being moved
      else if (item.expenseId && item.expense) {
        // Call the move handler if provided
        if (onExpenseMoved) {
          onExpenseMoved(item.expense.id, category.id)
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budget = category.budget || null
  const spent = total
  const remaining = budget !== null ? budget - spent : null
  const isOverBudget = budget !== null && spent > budget
  const budgetPercentage = budget && budget > 0 ? Math.min((spent / budget) * 100, 100) : 0

  const handleBudgetUpdate = async (categoryId, newBudget) => {
    if (onBudgetUpdate) {
      await onBudgetUpdate(categoryId, newBudget)
    }
  }

  const handleDeleteCategory = () => {
    if (onCategoryDelete) {
      onCategoryDelete(category.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div
        ref={drop}
        className={`category-bin ${isOver ? 'drag-over' : ''} ${isOverBudget ? 'over-budget' : ''}`}
        style={{ borderColor: category.color }}
      >
        <div className="bin-header" style={{ backgroundColor: category.color }}>
          <div className="bin-title-row">
            <h2 className="bin-title">{category.name}</h2>
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
              <button
                className="delete-category-button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(true)
                }}
                title="Delete Category"
              >
                🗑️
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
                  backgroundColor: category.color,
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
        
        <div className="bin-content">
          <div className="marble-container">
            {expenses.map((expense) => (
              <ExpenseMarble key={expense.id} expense={expense} color={category.color} />
            ))}
          </div>
          {expenses.length === 0 && (
            <div className="empty-bin">Drop expenses here</div>
          )}
        </div>
      </div>
      
      {showBudgetEditor && (
        <BudgetEditor
          category={category}
          onBudgetUpdate={handleBudgetUpdate}
          onClose={() => setShowBudgetEditor(false)}
        />
      )}
      
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Category?</h3>
            <p>Are you sure you want to delete "<strong>{category.name}</strong>"?</p>
            {expenses.length > 0 && (
              <p className="warning-text">
                This will also delete {expenses.length} expense{expenses.length !== 1 ? 's' : ''} in this category.
              </p>
            )}
            <div className="modal-actions">
              <button
                className="modal-button cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button delete-button"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CategoryBin


