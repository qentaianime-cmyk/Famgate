import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FamSaaS — Payment Gateway',
  description: 'Accept UPI payments through FamPay.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body
        className="font-outfit"
        style={{
          backgroundColor: '#0A0A0A',
          color: '#ffffff',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  )
}
