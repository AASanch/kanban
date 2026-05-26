import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardModal } from '@/components/CardModal'

describe('CardModal', () => {
  it('renders the modal title', () => {
    render(<CardModal title="Add Card" onClose={jest.fn()} onSubmit={jest.fn()} />)
    expect(screen.getByText('Add Card')).toBeInTheDocument()
  })

  it('pre-fills title and details in edit mode', () => {
    render(
      <CardModal
        title="Edit Card"
        initialTitle="Existing title"
        initialDetails="Existing details"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    )
    expect(screen.getByDisplayValue('Existing title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing details')).toBeInTheDocument()
  })

  it('disables Save when title is empty', () => {
    render(<CardModal title="Add Card" onClose={jest.fn()} onSubmit={jest.fn()} />)
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('calls onSubmit with title and details on save', async () => {
    const onSubmit = jest.fn()
    render(<CardModal title="Add Card" onClose={jest.fn()} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByPlaceholderText('Card title'), 'My new card')
    await userEvent.type(screen.getByPlaceholderText('Add details...'), 'Some details')
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onSubmit).toHaveBeenCalledWith('My new card', 'Some details')
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = jest.fn()
    render(<CardModal title="Add Card" onClose={onClose} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = jest.fn()
    render(<CardModal title="Add Card" onClose={onClose} onSubmit={jest.fn()} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn()
    const { container } = render(
      <CardModal title="Add Card" onClose={onClose} onSubmit={jest.fn()} />
    )
    fireEvent.click(container.firstChild!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
