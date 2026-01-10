import { useDrag } from 'react-dnd'
import './ExpenseMarble.css'

function ExpenseMarble({ expense, color }) {
  // Scale marble size based on amount: $1-10 = 40px, $50 = 60px, $100 = 80px, $200+ = 100px
  const size = Math.min(Math.max(30 + (expense.amount * 0.35), 40), 100)
  
  const [{ isDragging }, drag] = useDrag({
    type: 'existing-expense',
    item: { expenseId: expense.id, expense },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  return (
    <div
      ref={drag}
      className={`expense-marble ${isDragging ? 'dragging' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        cursor: 'grab',
      }}
    >
      <span className="marble-amount">${expense.amount.toFixed(0)}</span>
      <div className="expense-tooltip" style={{ borderColor: color }}>
        <div className="tooltip-header" style={{ backgroundColor: color }}>
          <div className="tooltip-amount">${expense.amount.toFixed(2)}</div>
        </div>
        <div className="tooltip-body">
          <div className="tooltip-description">{expense.description}</div>
          <div className="tooltip-date">{formatDate(expense.date)}</div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseMarble


