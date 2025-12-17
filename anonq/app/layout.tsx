import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'anonq',
  description: 'No strings, no names. Just curiosity.',
  icons: {
    icon: [
      { url: `${basePath}/favicons/favicon.ico`, sizes: 'any' },
      { url: `${basePath}/favicons/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}/favicons/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: `${basePath}/favicons/apple-touch-icon.png`,
  },
  manifest: `${basePath}/favicons/site.webmanifest`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ToastProvider position="top-right">
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
