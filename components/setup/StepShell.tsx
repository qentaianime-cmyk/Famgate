'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { X } from '@phosphor-icons/react'

interface StepShellProps {
  step: number
  children: React.ReactNode
}

export function StepShell({ step, children }: StepShellProps) {
  const router = useRouter()
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${(step / 4) * 100}%`,
        duration: 0.7,
        ease: 'power3.out',
      })
    }
  }, [step])

  const LABELS = ['Gateway', 'Google', 'Connect', 'UPI']

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Ambient radial — moves per step */}
      <div style={{
        position: 'absolute',
        width: '70vw', height: '70vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.055) 0%, transparent 65%)',
        top: '-20%',
        left: `${(step - 1) * 28 - 10}%`,
        transition: 'left 1s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Dot grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.35,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 0',
      }}>
        {/* Step pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {LABELS.map((label, i) => {
            const n = i + 1
            const done = n < step
            const active = n === step
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: active ? '4px 10px' : '4px 8px',
                  borderRadius: 20,
                  background: active ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(245,158,11,0.25)' : 'transparent'}`,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: done ? 'var(--amber)' : active ? 'var(--amber)' : 'var(--line-2)',
                    transition: 'background 0.3s ease',
                    boxShadow: active ? '0 0 8px var(--amber)' : 'none',
                  }} />
                  {active && (
                    <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                  )}
                </div>
                {i < 3 && <div style={{ width: 12, height: 1, background: 'var(--line)' }} />}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)' }}
        >
          <X size={14} />
        </button>
      </header>

      {/* Progress bar */}
      <div style={{ height: 1, background: 'var(--line)', margin: '14px 0 0', position: 'relative', zIndex: 10 }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, var(--amber-mid), var(--amber))',
            boxShadow: '0 0 12px rgba(245,158,11,0.5)',
          }}
        />
      </div>

      {/* Content — fixed height, no reflow */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}
