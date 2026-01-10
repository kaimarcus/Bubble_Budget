import { useState } from 'react'
import './NewCategoryForm.css'

const PREDEFINED_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
  '#AA96DA', '#FCBAD3', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF6B9D', '#C44569', '#F8B500', '#6C5CE7', '#00D2D3'
]

function NewCategoryForm({ onCategoryCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PREDEFINED_COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onCategoryCreated({ name: name.trim(), color })
      setName('')
      setColor(PREDEFINED_COLORS[0])
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        className="new-category-button"
        onClick={() => setIsOpen(true)}
        title="Add New Category"
      >
        <span className="plus-icon">+</span>
        <span className="circle-label">New Category</span>
      </button>
    )
  }

  return (
    <div className="new-category-form-container">
      <form className="new-category-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Create New Category</h3>
          <button
            type="button"
            className="close-button"
            onClick={() => {
              setIsOpen(false)
              setName('')
            }}
          >
            ×
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="category-name">Category Name</label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Entertainment, Shopping..."
            className="category-input"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {PREDEFINED_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-option ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#FF6B6B"
            className="color-input"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setIsOpen(false)
              setName('')
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button"
            disabled={!name.trim() || isSubmitting}
            style={{ backgroundColor: color }}
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewCategoryForm

