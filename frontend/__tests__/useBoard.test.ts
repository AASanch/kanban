import { renderHook, act } from '@testing-library/react'
import { useBoard } from '@/hooks/useBoard'

describe('useBoard', () => {
  it('initialises with 5 columns of dummy data', () => {
    const { result } = renderHook(() => useBoard())
    expect(result.current.board.columns).toHaveLength(5)
  })

  it('addCard appends a card to the target column', () => {
    const { result } = renderHook(() => useBoard())
    const colId = result.current.board.columns[0].id
    const before = result.current.board.columns[0].cards.length

    act(() => result.current.addCard(colId, 'New task', 'Some details'))

    const col = result.current.board.columns.find(c => c.id === colId)!
    expect(col.cards).toHaveLength(before + 1)
    expect(col.cards.at(-1)?.title).toBe('New task')
    expect(col.cards.at(-1)?.details).toBe('Some details')
  })

  it('editCard updates an existing card', () => {
    const { result } = renderHook(() => useBoard())
    const col = result.current.board.columns[0]
    const card = col.cards[0]

    act(() => result.current.editCard(col.id, card.id, 'Updated title', 'Updated details'))

    const updated = result.current.board.columns[0].cards.find(c => c.id === card.id)!
    expect(updated.title).toBe('Updated title')
    expect(updated.details).toBe('Updated details')
  })

  it('deleteCard removes the correct card', () => {
    const { result } = renderHook(() => useBoard())
    const col = result.current.board.columns[0]
    const cardId = col.cards[0].id
    const before = col.cards.length

    act(() => result.current.deleteCard(col.id, cardId))

    const after = result.current.board.columns[0].cards
    expect(after).toHaveLength(before - 1)
    expect(after.find(c => c.id === cardId)).toBeUndefined()
  })

  it('renameColumn updates the column name', () => {
    const { result } = renderHook(() => useBoard())
    const colId = result.current.board.columns[1].id

    act(() => result.current.renameColumn(colId, 'Renamed'))

    expect(result.current.board.columns.find(c => c.id === colId)?.name).toBe('Renamed')
  })

  it('moveCard moves a card to another column at the given index', () => {
    const { result } = renderHook(() => useBoard())
    const fromCol = result.current.board.columns[0]
    const toCol = result.current.board.columns[1]
    const card = fromCol.cards[0]
    const fromBefore = fromCol.cards.length
    const toBefore = toCol.cards.length

    act(() => result.current.moveCard(card.id, fromCol.id, toCol.id, 0))

    expect(result.current.board.columns[0].cards).toHaveLength(fromBefore - 1)
    expect(result.current.board.columns[1].cards).toHaveLength(toBefore + 1)
    expect(result.current.board.columns[1].cards[0].id).toBe(card.id)
  })

  it('moveCard within the same column reorders cards', () => {
    const { result } = renderHook(() => useBoard())
    const col = result.current.board.columns[0]
    const [first, second] = col.cards

    act(() => result.current.moveCard(first.id, col.id, col.id, 1))

    const newOrder = result.current.board.columns[0].cards
    expect(newOrder[0].id).toBe(second.id)
    expect(newOrder[1].id).toBe(first.id)
  })
})
