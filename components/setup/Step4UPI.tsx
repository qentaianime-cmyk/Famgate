'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowLeft, CheckCircle, CurrencyInr, WarningCircle } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface Props { onNext: () => void; onBack: () => void; direction: number }

export function Step4UPI({ onBack }: Props) {
  const router      = useRouter()
  const [upi, setUpi]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)
  const successRef  = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s4-item', { y: 18, opacity: 0, stagger: 0.09, duration: 0.45, ease: 'power3.out' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!done || !successRef.current) return
    const ctx = gsap.context(() => {
      // ✅ Fixed: use keyframes array on gsap.to for TypeScript compliance
      gsap.fromTo('.success-ring',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
      )
      gsap.from('.success-title', { y: 20, opacity: 0, duration: 0.4, delay: 0.25, ease: 'power3.out' })
      gsap.from('.success-sub',   { y: 12, opacity: 0, duration: 0.35, delay: 0.38, ease: 'power3.out' })
      gsap.to('.success-bar',     { scaleX: 1, duration: 2.5, delay: 0.5, ease: 'power2.inOut' })

      // Particles — using gsap.to with fromTo (no array values = no TS error)
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2
        const tx    = Math.cos(angle) * 55
        const ty    = Math.sin(angle) * 55
        gsap.fromTo(`.particle-${i}`,
          { x: 0, y: 0, scale: 0, opacity: 1 },
          { x: tx, y: ty, scale: 1, opacity: 0, duration: 0.8, delay: 0.3 + i * 0.04, ease: 'power2.out' }
        )
      }
    }, successRef)
    return () => ctx.revert()
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
      <div ref={successRef} className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-7">
          <div className="success-ring w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={38} className="text-green-500" weight="fill" />
          </div>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`particle-${i} absolute top-1/2 left-1/2 w-2 h-2 rounded-full`}
              style={{
                background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#22c55e' : '#a1a1aa',
                marginTop: -4, marginLeft: -4,
              }}
            />
          ))}
        </div>

        <h1 className="success-title text-[26px] font-bold text-white tracking-tight mb-2">
          Gateway activated.
        </h1>
        <p className="success-sub text-zinc-500 text-sm leading-relaxed">
          <code className="text-ember-400 font-mono text-xs">{upi}</code>
          <br />is now your payment destination.
        </p>

        <div className="mt-8 w-48 h-0.5 bg-zinc-800 rounded overflow-hidden">
          <div
            className="success-bar h-full rounded"
            style={{ background: 'linear-gradient(90deg,#f97316,#ea580c)', transformOrigin: 'left', transform: 'scaleX(0)' }}
          />
        </div>
        <p className="text-zinc-700 text-xs mt-2">Taking you to dashboard…</p>
      </div>
    </StepShell>
  )

  return (
    <StepShell step={4}>
      <div ref={containerRef} className="h-full flex flex-col px-5 pb-6 pt-5 max-w-md mx-auto w-full">
        <div className="s4-item mb-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-ember-500 mb-1">Step 4 of 4 — Final</p>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Set your UPI ID</h1>
          <p className="text-zinc-500 text-sm mt-1">All payments go directly here</p>
        </div>

        <div className="s4-item mb-4">
          <label className="block text-[11px] font-semibold tracking-widest uppercase text-zinc-600 mb-2">UPI ID</label>
          <div className="relative">
            <CurrencyInr size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              type="text" placeholder="yourname@upi"
              value={upi}
              onChange={e => { setUpi(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className="w-full h-12 rounded-xl bg-zinc-900 border pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200"
              style={{ borderColor: error ? '#ef4444' : valid ? 'rgba(34,197,94,0.5)' : '#27272a' }}
              onFocus={e => (e.target.style.borderColor = error ? '#ef4444' : valid ? 'rgba(34,197,94,0.6)' : '#f97316')}
              onBlur={e  => (e.target.style.borderColor = error ? '#ef4444' : valid ? 'rgba(34,197,94,0.5)' : '#27272a')}
            />
            {valid && <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" weight="fill" />}
          </div>
          {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><WarningCircle size={11} weight="fill" />{error}</p>}
          <p className="text-xs text-zinc-700 mt-1.5">e.g. name@fam · 9876543210@paytm · handle@okicici</p>
        </div>

        <div className="s4-item flex flex-col gap-2 flex-1">
          {[['⚡','Lands directly in your UPI-linked bank'],['🔁','Change anytime from Settings'],['🧾','Works with FamPay, GPay, PhonePe, Paytm']].map(([e,t]) => (
            <div key={t} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-base">{e}</span>
              <span className="text-xs text-zinc-500">{t}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={submit}
            disabled={loading || !valid}
            className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: valid && !loading ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#18181b',
              color: valid && !loading ? '#fff' : '#52525b',
              border: valid ? 'none' : '1px solid #27272a',
              boxShadow: valid ? '0 0 24px rgba(249,115,22,0.2)' : 'none',
            }}
          >
            {loading
              ? <span className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-ember-500 inline-block" style={{ animation: 'spin 0.7s linear infinite' }} />
              : 'Activate gateway 🚀'
            }
          </button>
          <button onClick={onBack} className="text-zinc-600 text-xs flex items-center justify-center gap-1 hover:text-zinc-400 transition-colors py-2">
            <ArrowLeft size={11} /> Back
          </button>
        </div>
      </div>
    </StepShell>
  )
}
