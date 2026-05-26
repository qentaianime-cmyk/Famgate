'use client'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowLeft, CheckCircle, CurrencyInr, WarningCircle } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

export function Step4UPI({ onBack }: StepProps) {
  const router = useRouter()
  const [upi, setUpi]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [done, setDone]     = useState(false)
  const successRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s4-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (done && successRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline()
        tl.from('.success-ring', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
          .from('.success-title', { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.1')
          .from('.success-sub', { y: 12, opacity: 0, duration: 0.35, ease: 'power3.out' }, '-=0.1')
          .from('.success-bar', { scaleX: 0, duration: 2.2, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.1')

        // Particles
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2
          gsap.fromTo(`.particle-${i}`,
            { scale: 0, x: 0, y: 0, opacity: 1 },
            {
              scale: [0, 1, 0],
              x: Math.cos(angle) * 60,
              y: Math.sin(angle) * 60,
              opacity: 0,
              duration: 0.9,
              delay: 0.3 + i * 0.04,
              ease: 'power2.out',
            }
          )
        }
      }, successRef)
      return () => ctx.revert()
    }
  }, [done])

  const valid = upi.includes('@') && upi.length > 4

  const submit = async () => {
    if (!valid) { setError('Enter a valid UPI ID like name@upi'); return }
    setError(''); setLoading(true)
    try {
      await settingsApi.save({ upi_id: upi })
      useAuthStore.setState({ requiresSetup: false })
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 3000)
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Save failed.')
    } finally { setLoading(false) }
  }

  if (done) return (
    <StepShell step={4}>
      <div ref={successRef} style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center',
      }}>
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div className="success-ring" style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={38} color="var(--green)" weight="fill" />
          </div>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle-${i}`} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 7, height: 7, borderRadius: '50%',
              background: i % 3 === 0 ? 'var(--amber)' : i % 3 === 1 ? 'var(--green)' : 'var(--text-2)',
              marginTop: -3.5, marginLeft: -3.5,
            }} />
          ))}
        </div>
        <h1 className="success-title" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: 10 }}>
          Gateway activated.
        </h1>
        <p className="success-sub" style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>
          <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-geist-mono)', fontSize: 13 }}>{upi}</span>
          <br />is now your payment destination.
        </p>
        <div style={{ marginTop: 28, width: 200, height: 1, background: 'var(--line)', borderRadius: 1, overflow: 'hidden' }}>
          <div className="success-bar" style={{ height: '100%', background: 'var(--amber)' }} />
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>Taking you to dashboard…</p>
      </div>
    </StepShell>
  )

  return (
    <StepShell step={4}>
      <div ref={containerRef} style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        padding: '20px 24px 28px', maxWidth: 480, margin: '0 auto', width: '100%',
      }}>
        <div className="s4-item" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            STEP 4 OF 4 — FINAL
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em' }}>
            Set your UPI ID
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            All customer payments will arrive here directly
          </p>
        </div>

        {/* Input */}
        <div className="s4-item" style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            UPI ID
          </label>
          <div style={{ position: 'relative' }}>
            <CurrencyInr size={15} color="var(--text-3)"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="yourname@upi"
              value={upi}
              onChange={e => { setUpi(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%', background: 'var(--bg-1)',
                border: `1px solid ${error ? 'var(--red)' : valid ? 'rgba(16,185,129,0.4)' : 'var(--line)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '13px 40px 13px 38px',
                color: 'var(--text-1)', fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = error ? 'var(--red)' : valid ? 'rgba(16,185,129,0.5)' : 'var(--amber)')}
              onBlur={e => (e.target.style.borderColor = error ? 'var(--red)' : valid ? 'rgba(16,185,129,0.4)' : 'var(--line)')}
            />
            {valid && (
              <CheckCircle size={16} color="var(--green)" weight="fill"
                style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)' }} />
            )}
          </div>
          {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><WarningCircle size={12} /> {error}</p>}
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            e.g. name@fam · 9876543210@paytm · handle@okicici
          </p>
        </div>

        {/* Info */}
        <div className="s4-item" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {[
            ['⚡', 'Lands directly in your UPI-linked bank account'],
            ['🔁', 'Change anytime from Settings → Configure'],
            ['🧾', 'Works with FamPay, GPay, PhonePe, Paytm & all UPI apps'],
          ].map(([emoji, text]) => (
            <div key={text as string} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              background: 'var(--bg-1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
            }}>
              <span style={{ fontSize: 15 }}>{emoji}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={submit}
            disabled={loading || !valid}
            style={{
              width: '100%', padding: '14px',
              background: valid && !loading ? 'var(--amber)' : 'var(--bg-2)',
              border: `1px solid ${valid && !loading ? 'transparent' : 'var(--line)'}`,
              borderRadius: 'var(--radius-lg)',
              color: valid && !loading ? '#000' : 'var(--text-3)',
              fontSize: 14, fontWeight: 600,
              cursor: valid && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              boxShadow: valid ? '0 0 24px rgba(245,158,11,0.15)' : 'none',
            }}
          >
            {loading
              ? <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--line-2)', borderTopColor: 'var(--amber)', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              : 'Activate gateway 🚀'
            }
          </button>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-3)', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <ArrowLeft size={12} /> Back
          </button>
        </div>
      </div>
    </StepShell>
  )
}
