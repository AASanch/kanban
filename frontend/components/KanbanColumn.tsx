'use client'

import { useRef, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
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
    <div className="flex flex-col w-72 flex-shrink-0 rounded-xl overflow-hidden bg-column-bg max-h-full">
      <div className="px-4 pt-4 pb-3 border-b-2 border-accent-yellow flex items-center justify-between gap-2">
        {editing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-white font-semibold text-sm tracking-wide uppercase outline-none border-b border-accent-yellow/60 pb-0.5"
            data-testid={`column-name-input-${column.id}`}
          />
        ) : (
          <span
            className="flex-1 text-white font-semibold text-sm tracking-wide uppercase cursor-pointer select-none"
            onDoubleClick={startEditing}
            data-testid={`column-header-${column.id}`}
          >
            {column.name}
          </span>
        )}
        <span className="text-xs text-gray-text font-medium tabular-nums">{column.cards.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-16 transition-colors ${isOver ? 'bg-white/5' : ''}`}
        data-testid={`column-cards-${column.id}`}
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
      </div>

      <button
        onClick={onAddCard}
        className="mx-3 mb-3 py-2.5 rounded-lg text-xs font-medium text-gray-text border border-dashed border-gray-text/25 hover:border-accent-yellow hover:text-accent-yellow transition-colors"
        data-testid={`add-card-${column.id}`}
      >
        + Add card
      </button>
    </div>
  )
}
