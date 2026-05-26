import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'Project management board',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className} style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
