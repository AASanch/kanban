import type { Board } from '@/types'

export const initialBoard: Board = {
  columns: [
    {
      id: 'col-1',
      name: 'Backlog',
      cards: [
        { id: 'card-1', title: 'Research competitors', details: 'Analyze top 5 competitor products and document key differentiators and pricing.' },
        { id: 'card-2', title: 'Define user personas', details: 'Create 3 user personas based on customer interviews conducted last month.' },
        { id: 'card-3', title: 'Set up analytics', details: 'Integrate event tracking on all key user flows before next release.' },
      ],
    },
    {
      id: 'col-2',
      name: 'To Do',
      cards: [
        { id: 'card-4', title: 'Design onboarding flow', details: 'Wireframe the 4-step onboarding experience for new users.' },
        { id: 'card-5', title: 'API rate limiting', details: 'Implement token bucket algorithm for the public REST API.' },
      ],
    },
    {
      id: 'col-3',
      name: 'In Progress',
      cards: [
        { id: 'card-6', title: 'Kanban MVP', details: 'Build the Kanban board web app with drag-and-drop and full CRUD.' },
        { id: 'card-7', title: 'Auth refactor', details: 'Migrate from session tokens to JWT with refresh token rotation.' },
      ],
    },
    {
      id: 'col-4',
      name: 'Review',
      cards: [
        { id: 'card-8', title: 'Dashboard charts', details: 'Add line charts for MAU and revenue on the main dashboard.' },
        { id: 'card-9', title: 'Mobile navigation', details: 'Fix the hamburger menu collapse bug on iOS Safari 16.' },
      ],
    },
    {
      id: 'col-5',
      name: 'Done',
      cards: [
        { id: 'card-10', title: 'Project scaffolding', details: 'Set up Next.js, Tailwind, TypeScript, and testing infrastructure.' },
        { id: 'card-11', title: 'Database schema', details: 'Designed and applied the initial migration for the production schema.' },
        { id: 'card-12', title: 'CI/CD pipeline', details: 'GitHub Actions workflow for automated testing and deploy to staging.' },
      ],
    },
  ],
}
