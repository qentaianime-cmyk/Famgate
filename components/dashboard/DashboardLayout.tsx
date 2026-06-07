'use client'
import { usePathname } from 'next/navigation'
import { BottomNav }   from './BottomNav'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background:'var(--bg)' }}>
      {/* Ambient mesh — persistent across all dashboard pages */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex:0 }}>
        <div className="absolute rounded-full animate-blob-a"
          style={{ width:'55vw', height:'55vw', left:'-10%', top:'-15%',
            background:'radial-gradient(circle, rgba(60,7,100,0.35) 0%, transparent 70%)',
            filter:'blur(70px)' }} />
        <div className="absolute rounded-full animate-blob-b"
          style={{ width:'40vw', height:'40vw', right:'-8%', bottom:'10%',
            background:'radial-gradient(circle, rgba(30,27,75,0.4) 0%, transparent 70%)',
            filter:'blur(60px)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage:'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
            backgroundSize:'28px 28px',
          }} />
      </div>

      {/* Page content */}
      <main className="relative z-10 flex-1 pb-24 px-4 pt-5 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
