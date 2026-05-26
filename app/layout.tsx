import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FamSaaS — Payment Gateway',
  description: 'Accept UPI payments via FamPay. Merchant dashboard.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-outfit bg-void text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
