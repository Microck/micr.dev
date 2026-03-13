import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || 'https://anonq.micr.dev'

export const metadata: Metadata = {
  title: 'anonq',
  description: 'No strings, no names. Just curiosity.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    url: '/',
    title: 'anonq',
    description: 'No strings, no names. Just curiosity.',
    siteName: 'anonq',
  },
  twitter: {
    card: 'summary',
    title: 'anonq',
    description: 'No strings, no names. Just curiosity.',
  },
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
