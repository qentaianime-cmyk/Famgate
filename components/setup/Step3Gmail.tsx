'use client'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useSearchParams } from 'next/navigation'
import {
  ArrowRight, ArrowLeft, CheckCircle,
  GoogleLogo, WarningCircle, Spinner
} from '@phosphor-icons/react'
import { StepShell }      from './StepShell'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { meApi }          from '@/lib/api'
import { googleAuthApi }  from '@/lib/api'

interface Props { onNext: () => void; onBack: () => void; direction: number }

export function Step3Gmail({ onNext, onBack }: Props) {
  const searchParams = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)

  const [status,    setStatus]    = useState<'idle'|'loading'|'connected'|'error'>('idle')
  const [gmailUser, setGmailUser] = useState('')
  const [errMsg,    setErrMsg]    = useState('')

  // Replace the existing useEffect:
useEffect(() => {
  const params      = new URLSearchParams(window.location.search)
  const gmailParam  = params.get('gmail')
  const errorParam  = params.get('error')

  if (errorParam === 'access_denied') {
    setStatus('error')
    setErrMsg('You denied Gmail access. Please try again.')
    return
  }
  if (errorParam === 'no_refresh_token') {
    setStatus('error')
    setErrMsg('Google did not return a token. Please reconnect.')
    return
  }

  // Check if Gmail is already connected (from OAuth callback or previous session)
  meApi.get().then(r => {
    if (r.data.gmail_configured) {
      setStatus('connected')
      setGmailUser(r.data.gmail_user ?? '')
    }
  }).catch(() => {})
}, [])

  useGSAP(() => {
    gsap.from('.s3-item', {
      y: 18, opacity: 0, stagger: 0.09, duration: 0.45, ease: 'qash',
    })
  }, { scope: ref })

  const handleConnect = async () => {
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await googleAuthApi.getUrl()
      // Redirect to Google OAuth — user authorizes, Google sends back to callback
      window.location.href = res.data.url
    } catch {
      setStatus('error')
      setErrMsg('Failed to start Google authorization. Try again.')
    }
  }

  return (
    <StepShell step={3}>
      <div ref={ref} className="h-full flex flex-col px-5 pb-8 pt-5 max-w-[420px] mx-auto w-full">

        {/* Header */}
        <div className="s3-item mb-6">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase font-syne mb-1"
            style={{ color:'#a78bfa' }}>
            Step 3 of 4
          </p>
          <h1 className="font-syne font-bold text-[22px] text-ink-1 tracking-[-0.04em]">
            Connect Gmail
          </h1>
          <p className="text-ink-2 text-sm font-manrope mt-1">
            We scan FamApp payment emails to auto-confirm orders
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Connected state */}
         {status === 'connected' && (
  <div className="s3-item flex flex-col items-center text-center gap-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{
        background:'rgba(16,185,129,0.1)',
        border:'1px solid rgba(16,185,129,0.3)',
      }}
    >
      <CheckCircle size={40} color="var(--green)" weight="fill" />
    </div>
    <div>
      <p className="font-syne font-bold text-lg text-ink-1 mb-1">
        Gmail connected!
      </p>
      <p className="text-ink-2 text-sm font-manrope">{gmailUser}</p>
      <p className="text-ink-3 text-xs font-manrope mt-1">
        FamApp payment emails will be scanned automatically
      </p>
    </div>

    {/* Prominent CTA — user must click this to go to step 4 */}
    <MagneticButton
      type="button"
      onClick={onNext}
      className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight"
    >
      Continue — Set your UPI ID <ArrowRight size={15} weight="bold" />
    </MagneticButton>

    <button
      onClick={handleConnect}
      className="text-xs text-ink-3 font-manrope hover:text-ink-2 transition-colors"
    >
      Connect a different Gmail account
    </button>
  </div>
)}
          {/* Connect button state */}
          {status !== 'connected' && (
            <div className="s3-item flex flex-col gap-5">

              {/* Google OAuth button */}
              <button
                onClick={handleConnect}
                disabled={status === 'loading'}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-syne font-bold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
                style={{
                  background: status === 'loading' ? 'var(--card)' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: status === 'loading' ? 'var(--ink-2)' : '#1f1f1f',
                  boxShadow: status === 'loading' ? 'none' : '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                {status === 'loading' ? (
                  <>
                    <div
                      className="w-5 h-5 rounded-full border-2 border-violet-lo border-t-violet-hi"
                      style={{ animation: 'spin 0.7s linear infinite' }}
                    />
                    Redirecting to Google…
                  </>
                ) : (
                  <>
                    {/* Google G logo */}
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Error message */}
              {status === 'error' && errMsg && (
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-2"
                  style={{
                    background: 'var(--rose-bg)',
                    border: '1px solid rgba(244,63,94,0.2)',
                  }}
                >
                  <WarningCircle size={15} color="var(--rose)" weight="fill" className="mt-0.5 shrink-0" />
                  <p className="text-xs font-manrope" style={{ color: 'var(--rose)' }}>
                    {errMsg}
                  </p>
                </div>
              )}

              {/* What access we request */}
              <div
                className="rounded-2xl p-4 space-y-2.5"
                style={{ background: 'var(--card)', border: '1px solid var(--bd)' }}
              >
                <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
                  What we access
                </p>
                {[
                  ['✅', 'Read FamApp payment confirmation emails'],
                  ['✅', 'See your Gmail address'],
                  ['❌', 'Cannot send emails'],
                  ['❌', 'Cannot delete or modify anything'],
                  ['❌', 'Cannot access other Google services'],
                ].map(([icon, text]) => (
                  <div key={text as string} className="flex items-center gap-2.5">
                    <span className="text-sm">{icon}</span>
                    <span className="text-xs font-manrope text-ink-2">{text}</span>
                  </div>
                ))}
              </div>

              {/* Security note */}
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(124,58,237,0.06)',
                  border: '1px solid rgba(124,58,237,0.12)',
                }}
              >
                <p className="text-[12px] font-manrope leading-relaxed" style={{ color: '#a78bfa' }}>
                  🔒 Your Gmail token is encrypted with AES-256 before storage.
                  You can revoke access anytime from your Google Account settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="mt-5 text-ink-3 text-xs font-manrope flex items-center justify-center gap-1 hover:text-ink-2 transition-colors py-2"
        >
          <ArrowLeft size={11} /> Back
        </button>
      </div>
    </StepShell>
  )
}
