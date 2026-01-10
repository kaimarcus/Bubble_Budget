import { useState, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import './ExpenseCircle.css'

function ExpenseCircle({ onExpenseCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [wasDropped, setWasDropped] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'expense',
    item: { description, amount: parseFloat(amount) || 0 },
    canDrag: () => description && amount && parseFloat(amount) > 0,
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        setWasDropped(true)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    if (wasDropped) {
      setDescription('')
      setAmount('')
      setIsOpen(false)
      setWasDropped(false)
    }
  }, [wasDropped])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (description && amount && parseFloat(amount) > 0) {
      // Don't submit here - let drag and drop handle it
      // This form is just for entering the expense data
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setDescription('')
      setAmount('')
    }
  }

  return (
    <div className="expense-circle-container">
      <div
        ref={drag}
        className={`expense-circle ${isDragging ? 'dragging' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        {!isOpen ? (
          <div className="circle-content">
            <span className="plus-icon">+</span>
            <span className="circle-label">Add Expense</span>
          </div>
        ) : (
          <form className="expense-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="expense-input"
              autoFocus
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="expense-input"
              step="0.01"
              min="0"
            />
            <div className="form-hint">
              {description && amount && parseFloat(amount) > 0
                ? 'Drag to a category bin'
                : 'Enter description and amount'}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ExpenseCircle

