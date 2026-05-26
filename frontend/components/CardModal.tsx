'use client'

import { useEffect, useRef, useState } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
    <div
      className="fixed inset-0 bg-dark-navy/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-2 border-b border-gray-100">
          <h2 className="text-dark-navy font-semibold text-lg">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-text uppercase tracking-wider">
              Title
            </label>
            <input
              ref={inputRef}
              value={cardTitle}
              onChange={e => setCardTitle(e.target.value)}
              placeholder="Card title"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark-navy placeholder:text-gray-300 outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-text uppercase tracking-wider">
              Details
            </label>
            <textarea
              value={cardDetails}
              onChange={e => setCardDetails(e.target.value)}
              placeholder="Add details..."
              rows={4}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark-navy placeholder:text-gray-300 outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-text border border-gray-200 hover:border-gray-300 hover:text-dark-navy transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cardTitle.trim()}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-purple-secondary hover:bg-purple-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
