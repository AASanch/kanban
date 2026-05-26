# Kanban MVP — Implementation Plan

## Context

Building a Kanban board web app from scratch per CLAUDE.md. The directory currently only contains CLAUDE.md — nothing else exists. Goal is a polished, simple MVP: one board, five renameable columns, card CRUD, drag-and-drop, no persistence, gorgeous UI.

---

## Tech Stack

- **Next.js 15** (App Router, `"use client"` components, no SSR needed)
- **TypeScript**
- **Tailwind CSS** — styling, custom color tokens
- **@dnd-kit/core + @dnd-kit/sortable** — drag-and-drop (actively maintained, tree-shakeable)
- **Jest + React Testing Library** — unit tests
- **Playwright** — integration tests

---

## Color Tokens (globals.css + tailwind.config)

| Token | Hex | Usage |
|---|---|---|
| accent-yellow | `#ecad0a` | accent lines, highlights |
| blue-primary | `#209dd7` | links, key sections |
| purple-secondary | `#753991` | submit buttons, important actions |
| dark-navy | `#032147` | main headings |
| gray-text | `#888888` | supporting text, labels |

---

## Data Model (`src/types.ts`)

```ts
type Card   = { id: string; title: string; details: string }
type Column = { id: string; name: string; cards: Card[] }
type Board  = { columns: Column[] }
```

State lives in a single `"use client"` root component. No persistence.

---

## Dummy Data

Five columns (e.g. Backlog, To Do, In Progress, Review, Done) with 2–3 cards each, seeded in `src/data/initialBoard.ts`.

---

## Phases & Success Criteria

### Phase 1 — Scaffolding
- [ ] `frontend/` created via `create-next-app@latest` (TypeScript, Tailwind, App Router, no ESLint prompt override)
- [ ] `.gitignore` at repo root covers `node_modules`, `.next`, `.env*`, `.DS_Store`
- [ ] Tailwind config extended with custom color tokens
- [ ] `globals.css` sets CSS variables for the color scheme
- [ ] `npm run dev` starts cleanly; `npm run build` passes

### Phase 2 — Data Model & State
- [ ] `src/types.ts` — Card, Column, Board types
- [ ] `src/data/initialBoard.ts` — dummy board with 5 columns, ≥2 cards each
- [ ] `src/hooks/useBoard.ts` — returns board state + mutators:
  - `addCard(columnId, title, details)`
  - `deleteCard(columnId, cardId)`
  - `renameColumn(columnId, name)`
  - `moveCard(cardId, fromColumnId, toColumnId, toIndex)`

### Phase 3 — UI Components
- [ ] `src/components/Board.tsx` — horizontal flex layout, all 5 columns visible
- [ ] `src/components/Column.tsx` — header (inline rename on double-click), card list, "Add card" button
- [ ] `src/components/Card.tsx` — title, truncated details, delete button, drag handle
- [ ] `src/components/CardModal.tsx` — modal for add / view+edit card; title + textarea for details
- [ ] Color scheme applied throughout; board background dark-navy, columns lighter card-surface
- [ ] Responsive: columns scroll horizontally on narrow screens

### Phase 4 — Drag and Drop
- [ ] `@dnd-kit/core` and `@dnd-kit/sortable` installed
- [ ] Cards draggable within and between columns via `SortableContext`
- [ ] Drag overlay shows ghost card
- [ ] Drop targets subtly highlighted during drag
- [ ] `moveCard` called on `onDragEnd`

### Phase 5 — Unit Tests
- [ ] Jest + React Testing Library configured (`jest.config.ts`, `jest.setup.ts`)
- [ ] `useBoard` hook: tests for addCard, deleteCard, renameColumn, moveCard
- [ ] `Column` component: renders cards, fires rename callback
- [ ] `Card` component: renders title/details, fires delete callback
- [ ] `CardModal` component: submits new card, validates non-empty title
- [ ] All tests pass (`npm test`)

### Phase 6 — Integration Tests (Playwright)
- [ ] Playwright installed and configured (`playwright.config.ts`)
- [ ] Test: page loads with dummy data — 5 column headers visible
- [ ] Test: add a card to a column — card appears in column
- [ ] Test: delete a card — card removed from DOM
- [ ] Test: rename a column — new name persists in header
- [ ] Test: drag card from one column to another — card moves
- [ ] All tests pass (`npx playwright test`)

### Phase 7 — Final Verification
- [ ] `npm run dev` running, no console errors
- [ ] `npm run build` passes
- [ ] All unit tests green
- [ ] All Playwright tests green
- [ ] UI reviewed: colors correct, drag-drop smooth, modals accessible

---

## Critical Files

| File | Purpose |
|---|---|
| `frontend/src/types.ts` | Data types |
| `frontend/src/data/initialBoard.ts` | Dummy data seed |
| `frontend/src/hooks/useBoard.ts` | All state mutations |
| `frontend/src/app/page.tsx` | Root client component, mounts Board |
| `frontend/src/components/Board.tsx` | Layout |
| `frontend/src/components/Column.tsx` | Column with rename + add |
| `frontend/src/components/Card.tsx` | Draggable card |
| `frontend/src/components/CardModal.tsx` | Add/edit modal |
| `frontend/tailwind.config.ts` | Custom color tokens |
| `frontend/src/app/globals.css` | CSS variables, base styles |
| `frontend/__tests__/` | Unit tests |
| `frontend/e2e/` | Playwright tests |
| `.gitignore` | Repo root ignore file |

---

## Verification

1. `cd frontend && npm run dev` — open browser, interact manually
2. `npm test` — all unit tests pass
3. `npx playwright test` — all e2e tests pass
4. `npm run build` — production build succeeds
