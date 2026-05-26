'use client'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, ArrowLeft, GoogleLogo, Lock, ShieldCheck, Key } from '@phosphor-icons/react'
import { StepShell } from './StepShell'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

const STEPS = [
  {
    icon: GoogleLogo, color: '#4285F4',
    num: '01', title: 'Open Google Account',
    body: 'Go to myaccount.google.com — or tap your profile photo anywhere in Google and choose "Manage your Google Account".',
    chip: 'myaccount.google.com',
  },
  {
    icon: ShieldCheck, color: '#10B981',
    num: '02', title: 'Go to Security',
    body: 'In the top navigation, tap the "Security" tab. On mobile, it may be inside a side menu.',
    chip: 'Security tab',
  },
  {
    icon: Lock, color: 'var(--amber)',
    num: '03', title: 'Enable 2-Step Verification',
    body: 'Under "How you sign in to Google", find 2-Step Verification. Turn it ON. This is required before App Passwords appear.',
    chip: '2-Step Verification → ON',
  },
  {
    icon: Key, color: '#a78bfa',
    num: '04', title: 'Generate App Password',
    body: 'After 2FA is on, search "App Passwords" in the Google search bar. Name it "FamSaaS" and tap Generate. Copy the 16-character password.',
    chip: 'App Passwords → Generate → Copy',
  },
]

export function Step2Google({ onNext, onBack, direction }: StepProps) {
  const [active, setActive] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const animateCard = () => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      )
    }
  }

  useEffect(() => { animateCard() }, [active])

  const curr = STEPS[active]
  const Icon = curr.icon

  return (
    <StepShell step={2}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        padding: '20px 24px 28px',
        maxWidth: 480, margin: '0 auto', width: '100%',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            STEP 2 OF 4
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em' }}>
            Get your App Password
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            4 quick steps inside Google Account
          </p>
        </div>

        {/* Card — fixed height so no layout shift */}
        <div
          ref={cardRef}
          style={{
            flex: 1,
            background: 'var(--bg-1)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 20px',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Icon + num */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: `${curr.color}18`,
              border: `1px solid ${curr.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={22} color={curr.color} weight="fill" />
            </div>
            <span style={{
              fontSize: 42, fontWeight: 800, color: 'var(--line-2)',
              lineHeight: 1, letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {curr.num}
            </span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            {curr.title}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, flex: 1 }}>
            {curr.body}
          </p>

          {/* Chip */}
          <div style={{
            marginTop: 16,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 12px',
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            borderRadius: 8,
            alignSelf: 'flex-start',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: curr.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-geist-mono)' }}>
              {curr.chip}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '16px 0' }}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 20 : 6, height: 6,
                borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0,
                background: i === active ? 'var(--amber)' : i < active ? 'var(--amber-mid)' : 'var(--line-2)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {active > 0 && (
            <button
              onClick={() => setActive(a => a - 1)}
              style={{
                flex: 1, padding: '13px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-2)', fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ← Prev
            </button>
          )}
          {active < 3 ? (
            <button
              onClick={() => setActive(a => a + 1)}
              style={{
                flex: 1, padding: '13px',
                background: 'var(--bg-2)',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-1)', fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onNext}
              style={{
                flex: 1, padding: '13px',
                background: 'var(--amber)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#000', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              I have it <ArrowRight size={14} weight="bold" />
            </button>
          )}
        </div>

        <button onClick={onBack} style={{
          marginTop: 12, background: 'transparent', border: 'none',
          color: 'var(--text-3)', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          <ArrowLeft size={12} /> Back
        </button>
      </div>
    </StepShell>
  )
}
