'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Lightning, QrCode, Bell, ArrowsSplit } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { useAuthStore } from '@/store/authStore'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

const FEATURES = [
  { icon: QrCode,      label: 'Instant UPI QR codes for every order',   sub: 'Generated server-side in < 100ms' },
  { icon: Bell,        label: 'Gmail IMAP auto-confirms payments',       sub: 'No manual checking, ever'          },
  { icon: ArrowsSplit, label: 'Webhook fires on every confirmed payment', sub: 'Integrate with anything'         },
]

export function Step1Welcome({ onNext, direction }: StepProps) {
  const displayName = useAuthStore(s => s.displayName)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.s1-icon', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
        .from('.s1-heading', { y: 32, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .from('.s1-sub', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .from('.s1-feature', {
          y: 24, opacity: 0, duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }, '-=0.2')
        .from('.s1-cta', { y: 16, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <StepShell step={1}>
      <div
        ref={containerRef}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px 32px',
          maxWidth: 480,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Icon */}
        <div className="s1-icon" style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'var(--amber-low)',
          border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Lightning size={26} color="var(--amber)" weight="fill" />
        </div>

        {/* Heading */}
        <div className="s1-heading" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            MERCHANT SETUP
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 7vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}>
            {displayName ? `Hey ${displayName.split(' ')[0]}.` : 'Welcome.'}<br />
            <span style={{ color: 'var(--amber)' }}>Arm</span> your gateway<br />
            in 3 minutes.
          </h1>
        </div>

        <p className="s1-sub" style={{
          color: 'var(--text-2)', fontSize: 14, lineHeight: 1.65,
          marginBottom: 28,
        }}>
          Connect Gmail + UPI. We handle payment confirmation automatically — no polling, no manual work.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="s1-feature"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: 'var(--bg-1)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color="var(--amber)" />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="s1-cta" style={{ marginTop: 24 }}>
          <button
            onClick={onNext}
            style={{
              width: '100%', padding: '15px 20px',
              background: 'var(--amber)',
              border: 'none', borderRadius: 'var(--radius-lg)',
              color: '#000', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              letterSpacing: '-0.01em',
              boxShadow: '0 0 0 0 rgba(245,158,11,0)',
              transition: 'transform 0.15s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(245,158,11,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 0 rgba(245,158,11,0)'
            }}
          >
            Begin setup <ArrowRight size={16} weight="bold" />
          </button>
          <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 12, marginTop: 10 }}>
            Skip for now — Settings → Configure anytime
          </p>
        </div>
      </div>
    </StepShell>
  )
}
