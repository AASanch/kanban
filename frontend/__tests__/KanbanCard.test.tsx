import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanCard } from '@/components/KanbanCard'

jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}))

const card = { id: 'c1', title: 'Test card', details: 'Some details here' }

describe('KanbanCard', () => {
  it('renders title and details', () => {
    render(<KanbanCard card={card} onClick={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText('Test card')).toBeInTheDocument()
    expect(screen.getByText('Some details here')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const onClick = jest.fn()
    render(<KanbanCard card={card} onClick={onClick} onDelete={jest.fn()} />)
    fireEvent.click(screen.getByText('Test card'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onDelete when delete button is clicked without triggering onClick', () => {
    const onClick = jest.fn()
    const onDelete = jest.fn()
    render(<KanbanCard card={card} onClick={onClick} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('Delete card'))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})
