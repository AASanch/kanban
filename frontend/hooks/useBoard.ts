import { useState, useCallback } from 'react'
import type { Board, Card } from '@/types'
import { initialBoard } from '@/data/initialBoard'

let counter = 100

export function useBoard() {
  const [board, setBoard] = useState<Board>(initialBoard)

  const addCard = useCallback((columnId: string, title: string, details: string) => {
    const card: Card = { id: `card-${++counter}`, title, details }
    setBoard(prev => ({
      columns: prev.columns.map(col =>
        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
      ),
    }))
  }, [])

  const editCard = useCallback((columnId: string, cardId: string, title: string, details: string) => {
    setBoard(prev => ({
      columns: prev.columns.map(col =>
        col.id === columnId
          ? { ...col, cards: col.cards.map(c => c.id === cardId ? { ...c, title, details } : c) }
          : col
      ),
    }))
  }, [])

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setBoard(prev => ({
      columns: prev.columns.map(col =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          : col
      ),
    }))
  }, [])

  const renameColumn = useCallback((columnId: string, name: string) => {
    setBoard(prev => ({
      columns: prev.columns.map(col =>
        col.id === columnId ? { ...col, name } : col
      ),
    }))
  }, [])

  const moveCard = useCallback((cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    setBoard(prev => {
      const fromCol = prev.columns.find(c => c.id === fromColumnId)
      const card = fromCol?.cards.find(c => c.id === cardId)
      if (!fromCol || !card) return prev

      return {
        columns: prev.columns.map(col => {
          if (col.id === fromColumnId && col.id === toColumnId) {
            const cards = col.cards.filter(c => c.id !== cardId)
            cards.splice(toIndex, 0, card)
            return { ...col, cards }
          }
          if (col.id === fromColumnId) return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          if (col.id === toColumnId) {
            const cards = [...col.cards]
            cards.splice(toIndex, 0, card)
            return { ...col, cards }
          }
          return col
        }),
      }
    })
  }, [])

  return { board, addCard, editCard, deleteCard, renameColumn, moveCard }
}
