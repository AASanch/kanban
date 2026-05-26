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
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { Board, Card as CardType } from '@/types'
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
  const [activeCard, setActiveCard] = useState<CardType | null>(null)

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
      onMoveCard(activeId, fromCol.id, toCol.id, toCol.cards.findIndex(c => c.id === overId))
    } else {
      const toCol = board.columns.find(c => c.id === overId)
      if (toCol) onMoveCard(activeId, fromCol.id, toCol.id, toCol.cards.length)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2.5, p: 3, overflowX: 'auto', height: '100%', alignItems: 'flex-start' }}>
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
      </Box>
      <DragOverlay>
        {activeCard && (
          <Card elevation={8} sx={{ width: 288, bgcolor: '#ffffff', transform: 'rotate(1deg)' }}>
            <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#032147' }}>
                {activeCard.title}
              </Typography>
              {activeCard.details && (
                <Typography variant="caption" sx={{ color: '#888888' }}>
                  {activeCard.details}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  )
}
