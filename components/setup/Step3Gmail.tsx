'use client'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, ArrowLeft, Envelope, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

export function Step3Gmail({ onNext, onBack, direction }: StepProps) {
  const [gmail, setGmail]       = useState('')
  const [appPass, setAppPass]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [gmailErr, setGmailErr] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s3-item', {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const format = (v: string) => {
    const clean = v.replace(/\s/g, '').toLowerCase().slice(0, 16)
    return clean.match(/.{1,4}/g)?.join(' ') ?? clean
  }

  const clean = appPass.replace(/\s/g, '')
  const done  = clean.length === 16

  const submit = async () => {
    setError(''); setGmailErr('')
    if (!gmail || !/^[^\s@]+@gmail\.com$/.test(gmail)) {
      setGmailErr('Must be a valid @gmail.com address')
      return
    }
    if (!done) { setError('Enter all 16 characters'); return }
    setLoading(true)
    try {
      await settingsApi.save({ gmail_user: gmail, gmail_app_password: clean })
      onNext()
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Save failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <StepShell step={3}>
      <div ref={containerRef} style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        padding: '20px 24px 28px', maxWidth: 480, margin: '0 auto', width: '100%',
        overflowY: 'auto',
      }}>
        <div className="s3-item" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            STEP 3 OF 4
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em' }}>
            Connect Gmail
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            We scan for FamApp payment emails to auto-confirm orders
          </p>
        </div>

        {/* Gmail */}
        <div className="s3-item" style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            Gmail Address
          </label>
          <div style={{ position: 'relative' }}>
            <Envelope size={15} color="var(--text-3)"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email" placeholder="yourname@gmail.com"
              value={gmail}
              onChange={e => { setGmail(e.target.value); setGmailErr('') }}
              style={{
                width: '100%', background: 'var(--bg-1)',
                border: `1px solid ${gmailErr ? 'var(--red)' : 'var(--line)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px 12px 38px',
                color: 'var(--text-1)', fontSize: 14,
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = gmailErr ? 'var(--red)' : 'var(--amber)')}
              onBlur={e => (e.target.style.borderColor = gmailErr ? 'var(--red)' : 'var(--line)')}
            />
          </div>
          {gmailErr && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><WarningCircle size={12} /> {gmailErr}</p>}
        </div>

        {/* App password */}
        <div className="s3-item" style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
            16-Character App Password
          </label>

          {/* Segmented blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
            {[0,1,2,3].map(g => {
              const filled = clean.length >= (g+1)*4
              const partial = clean.length > g*4 && clean.length < (g+1)*4
              const chars = clean.slice(g*4, (g+1)*4).padEnd(4, '·')
              return (
                <div key={g} style={{
                  padding: '10px 6px',
                  background: 'var(--bg-1)',
                  border: `1px solid ${filled ? 'rgba(245,158,11,0.4)' : partial ? 'rgba(245,158,11,0.2)' : 'var(--line)'}`,
                  borderRadius: 10, textAlign: 'center',
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 15, letterSpacing: '0.18em',
                  color: filled ? 'var(--amber)' : partial ? 'var(--amber-mid)' : 'var(--text-3)',
                  transition: 'all 0.2s',
                  boxShadow: filled ? '0 0 12px rgba(245,158,11,0.07)' : 'none',
                }}>
                  {chars}
                </div>
              )
            })}
          </div>

          <input
            type="text" placeholder="Paste your 16-char app password here"
            value={appPass}
            onChange={e => { setAppPass(format(e.target.value)); setError('') }}
            maxLength={19}
            style={{
              width: '100%', background: 'var(--bg-1)',
              border: `1px solid ${error ? 'var(--red)' : 'var(--line)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              color: 'var(--text-1)', fontSize: 14,
              fontFamily: 'var(--font-geist-mono)',
              letterSpacing: '0.08em', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = error ? 'var(--red)' : 'var(--amber)')}
            onBlur={e => (e.target.style.borderColor = error ? 'var(--red)' : 'var(--line)')}
          />

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 2, background: 'var(--line)', borderRadius: 1 }}>
              <div style={{
                height: '100%', borderRadius: 1,
                width: `${(clean.length / 16) * 100}%`,
                background: done ? 'var(--green)' : 'var(--amber)',
                transition: 'width 0.2s ease',
              }} />
            </div>
            <span style={{ fontSize: 11, color: done ? 'var(--green)' : 'var(--text-3)', minWidth: 28, textAlign: 'right' }}>
              {clean.length}/16
            </span>
            {done && <CheckCircle size={14} color="var(--green)" weight="fill" />}
          </div>

          {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><WarningCircle size={12} /> {error}</p>}
        </div>

        {/* Security note */}
        <div className="s3-item" style={{
          padding: '12px 14px',
          background: 'var(--amber-low)',
          border: '1px solid rgba(245,158,11,0.12)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, color: 'var(--amber-mid)', lineHeight: 1.6 }}>
            🔒 Encrypted with AES-256-CBC before storage. Your main Google password is never touched.
          </p>
        </div>

        {/* CTA */}
        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: loading ? 'var(--bg-2)' : 'var(--amber)',
          border: `1px solid ${loading ? 'var(--line)' : 'transparent'}`,
          borderRadius: 'var(--radius-lg)',
          color: loading ? 'var(--text-3)' : '#000',
          fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}>
          {loading
            ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--line-2)', borderTopColor: 'var(--amber)', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Saving…</>
            : <>Save & continue <ArrowRight size={15} weight="bold" /></>
          }
        </button>

        <button onClick={onBack} style={{
          marginTop: 10, background: 'transparent', border: 'none',
          color: 'var(--text-3)', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          <ArrowLeft size={12} /> Back
        </button>
      </div>
    </StepShell>
  )
}
