'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { Board, Card } from '@/types'
import { KanbanColumn } from './KanbanColumn'

interface Props {
  board: Board
  onRenameColumn: (columnId: string, name: string) => void
  onAddCard: (columnId: string) => void
  onDeleteCard: (columnId: string, cardId: string) => void
  onCardClick: (columnId: string, cardId: string) => void
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void
}

export function KanbanBoard({ board, onRenameColumn, onAddCard, onDeleteCard, onCardClick, onMoveCard }: Props) {
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart({ active }: DragStartEvent) {
    const card = board.columns.flatMap(c => c.cards).find(c => c.id === active.id)
    setActiveCard(card ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const fromCol = board.columns.find(col => col.cards.some(c => c.id === activeId))
    if (!fromCol) return

    const overCard = board.columns.flatMap(c => c.cards).find(c => c.id === overId)
    if (overCard) {
      const toCol = board.columns.find(col => col.cards.some(c => c.id === overId))!
      const toIndex = toCol.cards.findIndex(c => c.id === overId)
      onMoveCard(activeId, fromCol.id, toCol.id, toIndex)
    } else {
      const toCol = board.columns.find(c => c.id === overId)
      if (toCol) {
        onMoveCard(activeId, fromCol.id, toCol.id, toCol.cards.length)
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 p-6 overflow-x-auto h-full items-start">
        {board.columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            onRename={name => onRenameColumn(column.id, name)}
            onAddCard={() => onAddCard(column.id)}
            onDeleteCard={cardId => onDeleteCard(column.id, cardId)}
            onCardClick={cardId => onCardClick(column.id, cardId)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard && (
          <div className="bg-white rounded-lg px-4 py-3 shadow-2xl border-l-2 border-blue-primary rotate-1 opacity-95 w-72">
            <h3 className="text-dark-navy font-semibold text-sm leading-snug">{activeCard.title}</h3>
            {activeCard.details && (
              <p className="text-gray-text text-xs mt-1 line-clamp-2 leading-relaxed">{activeCard.details}</p>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
