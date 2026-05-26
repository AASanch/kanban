'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useBoard } from '@/hooks/useBoard'
import { CardModal } from '@/components/CardModal'

const KanbanBoard = dynamic(
  () => import('@/components/KanbanBoard').then(m => m.KanbanBoard),
  { ssr: false }
)

type ModalState =
  | { mode: 'add'; columnId: string }
  | { mode: 'edit'; columnId: string; cardId: string; title: string; details: string }

export default function Page() {
  const { board, addCard, editCard, deleteCard, renameColumn, moveCard } = useBoard()
  const [modal, setModal] = useState<ModalState | null>(null)

  function openAddModal(columnId: string) {
    setModal({ mode: 'add', columnId })
  }

  function openEditModal(columnId: string, cardId: string) {
    const col = board.columns.find(c => c.id === columnId)
    const card = col?.cards.find(c => c.id === cardId)
    if (!card) return
    setModal({ mode: 'edit', columnId, cardId, title: card.title, details: card.details })
  }

  function handleModalSubmit(title: string, details: string) {
    if (!modal) return
    if (modal.mode === 'add') addCard(modal.columnId, title, details)
    else editCard(modal.columnId, modal.cardId, title, details)
  }

  return (
    <div className="flex flex-col h-full bg-board-bg">
      <header className="flex items-center px-6 py-4 border-b border-white/5 flex-shrink-0">
        <h1 className="text-white font-bold text-xl tracking-tight">
          <span className="text-accent-yellow">K</span>anban
        </h1>
      </header>

      <main className="flex-1 overflow-hidden">
        <KanbanBoard
          board={board}
          onRenameColumn={renameColumn}
          onAddCard={openAddModal}
          onDeleteCard={deleteCard}
          onCardClick={openEditModal}
          onMoveCard={moveCard}
        />
      </main>

      {modal && (
        <CardModal
          title={modal.mode === 'add' ? 'Add Card' : 'Edit Card'}
          initialTitle={modal.mode === 'edit' ? modal.title : ''}
          initialDetails={modal.mode === 'edit' ? modal.details : ''}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  )
}
