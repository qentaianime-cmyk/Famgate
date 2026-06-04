'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { X } from '@phosphor-icons/react'
import { Logo } from '@/components/ui/Logo'

interface Props { step: number; children: React.ReactNode }
const LABELS = ['Ignition','Unlock','Connect','Activate']

export function StepShell({ step, children }: Props) {
  const router = useRouter()
  const barRef = useRef<HTMLDivElement>(null)
  const blobRef= useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barRef.current)
      gsap.to(barRef.current, { width:`${(step/4)*100}%`, duration:0.9, ease:'power3.out' })
    if (blobRef.current)
      gsap.to(blobRef.current, { left:`${(step-1)*30-5}%`, duration:1.2, ease:'power3.inOut' })
  }, [step])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background:'var(--bg)' }}>

      {/* Ambient blob */}
      <div ref={blobRef} className="absolute pointer-events-none rounded-full"
        style={{
          width:'65vw', height:'65vw', top:'-25%',
          background:'radial-gradient(circle, rgba(60,7,100,0.5) 0%, transparent 70%)',
          transition:'none', // GSAP handles this
          filter:'blur(60px)',
        }} />

      {/* Secondary blob */}
      <div className="absolute pointer-events-none rounded-full animate-blob-b"
        style={{
          width:'40vw', height:'40vw', right:'-5%', bottom:'-15%',
          background:'radial-gradient(circle, rgba(30,27,75,0.6) 0%, transparent 70%)',
          filter:'blur(50px)',
        }} />

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:'radial-gradient(circle, rgba(139,92,246,0.1) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
        }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <Logo size={26} animate={false} />
          <span className="text-ink-3 text-xs font-manrope font-medium">Setup</span>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-1">
          {LABELS.map((label, i) => {
            const n = i + 1
            const active = n === step, done = n < step
            return (
              <div key={label} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-400"
                  style={{
                    background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  }}>
                  <div style={{
                    width:6, height:6, borderRadius:'50%', transition:'all 0.3s ease',
                    background: done ? '#7c3aed' : active ? '#8b5cf6' : 'var(--raised)',
                    boxShadow: active ? '0 0 8px rgba(139,92,246,0.8)' : 'none',
                  }} />
                  {active && (
                    <span className="text-[10px] font-semibold font-syne tracking-wide"
                      style={{ color:'#a78bfa' }}>
                      {label}
                    </span>
                  )}
                </div>
                {i < 3 && <div style={{ width:10, height:1, background:'var(--bd)' }} />}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background:'var(--raised)', border:'1px solid var(--bd)',
            color:'var(--ink-3)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color='var(--ink-1)')}
          onMouseLeave={e => (e.currentTarget.style.color='var(--ink-3)')}
        >
          <X size={13} />
        </button>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 mt-3" style={{ height:1, background:'var(--raised)' }}>
        <div ref={barRef} style={{
          height:'100%', width:'0%',
          background:'linear-gradient(90deg,#7c3aed,#4f46e5,#3b82f6)',
          boxShadow:'0 0 12px rgba(124,58,237,0.7)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
