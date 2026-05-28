'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { X } from '@phosphor-icons/react'
import { Logo } from '@/components/ui/Logo'

interface Props { step: number; children: React.ReactNode }

const LABELS = ['Gateway', 'Google', 'Connect', 'UPI']

export function StepShell({ step, children }: Props) {
  const router = useRouter()
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${(step / 4) * 100}%`,
        duration: 0.8, ease: 'power3.out',
      })
    }
  }, [step])

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: '#09090b' }}
    >
      {/* Ambient glow — tracks step */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
          top: '-25%',
          left: `${(step - 1) * 30 - 5}%`,
          transition: 'left 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-0">
        <div className="flex items-center gap-2">
          <Logo size={26} />
          <span className="text-zinc-600 text-xs font-medium">Setup</span>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-1.5">
          {LABELS.map((label, i) => {
            const n = i + 1
            const active = n === step
            const done   = n < step
            return (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`
                  flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-400
                  ${active ? 'bg-ember-950 border border-ember-900/60' : 'bg-transparent'}
                `}>
                  <div className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-300
                    ${done   ? 'bg-ember-500' :
                      active ? 'bg-ember-400 shadow-[0_0_6px_rgba(249,115,22,0.8)]' :
                               'bg-zinc-700'}
                  `} />
                  {active && (
                    <span className="text-[10px] font-semibold text-ember-400 tracking-wide">
                      {label}
                    </span>
                  )}
                </div>
                {i < 3 && <div className="w-2 h-px bg-zinc-800" />}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:border-zinc-700 transition-all"
        >
          <X size={13} />
        </button>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 mt-3.5 h-px bg-zinc-900">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-ember-700 to-ember-500"
          style={{
            width: '0%',
            boxShadow: '0 0 8px rgba(249,115,22,0.6)',
          }}
        />
      </div>

      {/* Content — fixed, no reflow */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
