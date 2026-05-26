'use client'

import { useRef, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { Column } from '@/types'
import { KanbanCard } from './KanbanCard'

interface Props {
  column: Column
  onRename: (name: string) => void
  onAddCard: () => void
  onDeleteCard: (cardId: string) => void
  onCardClick: (cardId: string) => void
}

export function KanbanColumn({ column, onRename, onAddCard, onDeleteCard, onCardClick }: Props) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(column.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  function startEditing() {
    setEditName(column.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitRename() {
    const name = editName.trim()
    if (name && name !== column.name) onRename(name)
    else setEditName(column.name)
    setEditing(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') { setEditName(column.name); setEditing(false) }
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: 288,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          borderBottom: '2px solid',
          borderColor: 'warning.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {editing ? (
          <InputBase
            inputRef={inputRef}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={onKeyDown}
            inputProps={{ 'data-testid': `column-name-input-${column.id}` }}
            sx={{
              flex: 1,
              color: 'common.white',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid',
              borderColor: 'warning.light',
            }}
          />
        ) : (
          <Typography
            variant="overline"
            onDoubleClick={startEditing}
            data-testid={`column-header-${column.id}`}
            sx={{ flex: 1, cursor: 'pointer', color: 'common.white', lineHeight: 1.5, fontWeight: 700 }}
          >
            {column.name}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {column.cards.length}
        </Typography>
      </Box>

      <Box
        ref={setNodeRef}
        data-testid={`column-cards-${column.id}`}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 64,
          bgcolor: isOver ? 'action.hover' : 'transparent',
          transition: 'background-color 0.15s',
        }}
      >
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card.id)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </SortableContext>
      </Box>

      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onAddCard}
          data-testid={`add-card-${column.id}`}
          sx={{
            borderStyle: 'dashed',
            borderColor: 'rgba(255,255,255,0.15)',
            color: 'text.secondary',
            fontSize: '0.75rem',
            '&:hover': {
              borderStyle: 'dashed',
              borderColor: 'warning.main',
              color: 'warning.main',
              bgcolor: 'transparent',
            },
          }}
        >
          + Add card
        </Button>
      </Box>
    </Paper>
  )
}
