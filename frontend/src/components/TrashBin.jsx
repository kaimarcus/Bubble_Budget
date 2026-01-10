import { useDrop } from 'react-dnd'
import './TrashBin.css'

function TrashBin({ onExpenseDeleted }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'existing-expense',
    drop: (item) => {
      if (item.expenseId && item.expense) {
        onExpenseDeleted(item.expense.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = canDrop && isOver

  return (
    <div
      ref={drop}
      className={`trash-bin ${isActive ? 'trash-active' : ''} ${canDrop ? 'trash-hover' : ''}`}
    >
      <div className="trash-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
      <div className="trash-label">
        {isActive ? 'Drop to Delete' : 'Drag Here to Delete'}
      </div>
    </div>
  )
}

export default TrashBin

