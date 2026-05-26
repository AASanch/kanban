'use client'

import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

interface Props {
  title: string
  initialTitle?: string
  initialDetails?: string
  onClose: () => void
  onSubmit: (title: string, details: string) => void
}

export function CardModal({ title, initialTitle = '', initialDetails = '', onClose, onSubmit }: Props) {
  const [cardTitle, setCardTitle] = useState(initialTitle)
  const [cardDetails, setCardDetails] = useState(initialDetails)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const t = cardTitle.trim()
    if (!t) return
    onSubmit(t, cardDetails.trim())
    onClose()
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            label="Title"
            placeholder="Card title"
            value={cardTitle}
            onChange={e => setCardTitle(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Details"
            placeholder="Add details..."
            value={cardDetails}
            onChange={e => setCardDetails(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={!cardTitle.trim()}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
