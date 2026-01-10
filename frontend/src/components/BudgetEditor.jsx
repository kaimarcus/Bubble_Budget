import { useState } from 'react'
import './BudgetEditor.css'

function BudgetEditor({ category, onBudgetUpdate, onClose }) {
  const [budget, setBudget] = useState(category.budget || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const budgetValue = budget === '' ? null : parseFloat(budget)
    onBudgetUpdate(category.id, budgetValue)
    onClose()
  }

  return (
    <div className="budget-editor-overlay" onClick={onClose}>
      <div className="budget-editor" onClick={(e) => e.stopPropagation()}>
        <div className="budget-editor-header">
          <h3>Set Budget for {category.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="budget-amount">Budget Amount ($)</label>
            <input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget amount"
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" style={{ backgroundColor: category.color }}>
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetEditor

