'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{ px: 3, py: 1.75, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'common.white' }}>
          <Box component="span" sx={{ color: 'warning.main' }}>K</Box>anban
        </Typography>
      </Box>

      <Box component="main" sx={{ flex: 1, overflow: 'hidden' }}>
        <KanbanBoard
          board={board}
          onRenameColumn={renameColumn}
          onAddCard={openAddModal}
          onDeleteCard={deleteCard}
          onCardClick={openEditModal}
          onMoveCard={moveCard}
        />
      </Box>

      {modal && (
        <CardModal
          title={modal.mode === 'add' ? 'Add Card' : 'Edit Card'}
          initialTitle={modal.mode === 'edit' ? modal.title : ''}
          initialDetails={modal.mode === 'edit' ? modal.details : ''}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </Box>
  )
}
