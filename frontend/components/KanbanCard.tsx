'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import type { Card as CardType } from '@/types'

interface Props {
  card: CardType
  onClick: () => void
  onDelete: () => void
}

export function KanbanCard({ card, onClick, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      onClick={onClick}
      data-testid={`card-${card.id}`}
      elevation={2}
      sx={{
        bgcolor: '#ffffff',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        borderLeft: '2px solid transparent',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        '&:hover': { borderLeftColor: 'primary.main', boxShadow: 6 },
        '& .delete-btn': { opacity: 0 },
        '&:hover .delete-btn': { opacity: 1 },
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#032147', pr: 2.5, lineHeight: 1.4 }}>
          {card.title}
        </Typography>
        {card.details && (
          <Typography
            variant="caption"
            sx={{
              color: '#888888',
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {card.details}
          </Typography>
        )}
      </CardContent>
      <IconButton
        size="small"
        className="delete-btn"
        onClick={e => { e.stopPropagation(); onDelete() }}
        onPointerDown={e => e.stopPropagation()}
        aria-label="Delete card"
        data-testid={`delete-card-${card.id}`}
        sx={{ position: 'absolute', top: 4, right: 4, color: '#888888', '&:hover': { color: 'error.main', bgcolor: 'error.light' } }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Card>
  )
}
