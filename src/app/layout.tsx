import './globals.css'
import type { Metadata } from 'next'
import { ReduxProvider } from '@/store/provider'


export const metadata: Metadata = {
  title: 'Image Processing Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}

