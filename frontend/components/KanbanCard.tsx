'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '@/types'

interface Props {
  card: Card
  onClick: () => void
  onDelete: () => void
}

export function KanbanCard({ card, onClick, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
      className="bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group select-none border-l-2 border-transparent hover:border-blue-primary"
      onClick={onClick}
      data-testid={`card-${card.id}`}
      {...attributes}
      {...listeners}
    >
      <h3 className="text-dark-navy font-semibold text-sm pr-5 leading-snug">{card.title}</h3>
      {card.details && (
        <p className="text-gray-text text-xs mt-1 line-clamp-2 leading-relaxed">{card.details}</p>
      )}
      <button
        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-gray-text hover:text-red-400 hover:bg-red-50 transition-all text-base leading-none"
        onClick={e => { e.stopPropagation(); onDelete() }}
        onPointerDown={e => e.stopPropagation()}
        aria-label="Delete card"
        data-testid={`delete-card-${card.id}`}
      >
        ×
      </button>
    </div>
  )
}
