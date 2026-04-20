import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoiceBot Pro - AI English Tutor',
  description: 'AI-powered English speaking tutor for Spanish speakers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-background text-white">
        {children}
      </body>
    </html>
  )
}

