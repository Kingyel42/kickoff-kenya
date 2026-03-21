import type { Metadata, Viewport } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KickOff Kenya — Find Your Next Pickup Game',
  description: 'Stop organising football on WhatsApp. Find pickup matches, build teams, and book turfs across Kenya — all in one free app.',
  keywords: ['football', 'soccer', 'Kenya', 'Nairobi', 'pickup games', 'turf booking', 'teams', 'M-Pesa'],
  authors: [{ name: 'KickOff Kenya' }],
  openGraph: {
    title: 'KickOff Kenya — Find Your Next Pickup Game',
    description: 'Stop organising football on WhatsApp. Find matches, book turfs, build teams — free app for Android & iPhone.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF8F3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
