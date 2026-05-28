'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, ArrowLeft, Envelope, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'

interface Props { onNext: () => void; onBack: () => void; direction: number }

export function Step3Gmail({ onNext, onBack }: Props) {
  const [gmail,    setGmail]   = useState('')
  const [appPass,  setAppPass] = useState('')
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')
  const [gmailErr, setGmailErr]= useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s3-item', { y: 18, opacity: 0, stagger: 0.09, duration: 0.45, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const fmt = (v: string) => {
    const c = v.replace(/\s/g, '').toLowerCase().slice(0, 16)
    return c.match(/.{1,4}/g)?.join(' ') ?? c
  }

  const clean = appPass.replace(/\s/g, '')
  const done  = clean.length === 16

  const submit = async () => {
    setError(''); setGmailErr('')
    if (!gmail || !/^[^\s@]+@gmail\.com$/.test(gmail)) { setGmailErr('Must be a @gmail.com address'); return }
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
      <div ref={ref} className="h-full flex flex-col px-5 pb-6 pt-5 max-w-md mx-auto w-full overflow-y-auto">
        <div className="s3-item mb-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-ember-500 mb-1">Step 3 of 4</p>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Connect Gmail</h1>
          <p className="text-zinc-500 text-sm mt-1">We scan for FamApp emails to auto-confirm orders</p>
        </div>

        {/* Gmail */}
        <div className="s3-item mb-4">
          <label className="block text-[11px] font-semibold tracking-widest uppercase text-zinc-600 mb-2">
            Gmail Address
          </label>
          <div className="relative">
            <Envelope size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              type="email" placeholder="yourname@gmail.com"
              value={gmail}
              onChange={e => { setGmail(e.target.value); setGmailErr('') }}
              className="w-full h-12 rounded-xl bg-zinc-900 border pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200"
              style={{ borderColor: gmailErr ? '#ef4444' : '#27272a' }}
              onFocus={e => (e.target.style.borderColor = gmailErr ? '#ef4444' : '#f97316')}
              onBlur={e  => (e.target.style.borderColor = gmailErr ? '#ef4444' : '#27272a')}
            />
          </div>
          {gmailErr && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><WarningCircle size={11} weight="fill" />{gmailErr}</p>}
        </div>

        {/* 16-char password */}
        <div className="s3-item mb-4">
          <label className="block text-[11px] font-semibold tracking-widest uppercase text-zinc-600 mb-2">
            16-Character App Password
          </label>

          {/* Segmented blocks */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[0,1,2,3].map(g => {
              const filled  = clean.length >= (g + 1) * 4
              const partial = clean.length >  g * 4 && !filled
              const chars   = clean.slice(g * 4, (g + 1) * 4).padEnd(4, '·')
              return (
                <div
                  key={g}
                  className="h-11 flex items-center justify-center rounded-xl font-mono text-sm tracking-widest transition-all duration-200"
                  style={{
                    background: '#18181b',
                    border: `1px solid ${filled ? '#ea580c' : partial ? '#7c2d12' : '#27272a'}`,
                    color: filled ? '#f97316' : partial ? '#7c2d12' : '#52525b',
                    boxShadow: filled ? '0 0 10px rgba(249,115,22,0.1)' : 'none',
                  }}
                >
                  {chars}
                </div>
              )
            })}
          </div>

          <input
            type="text" placeholder="Paste your 16-char app password"
            value={appPass}
            onChange={e => { setAppPass(fmt(e.target.value)); setError('') }}
            maxLength={19}
            className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 text-sm text-zinc-100 placeholder-zinc-600 font-mono tracking-widest outline-none transition-all duration-200 focus:border-ember-500"
            style={{ borderColor: error ? '#ef4444' : '#27272a' }}
          />

          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-0.5 bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-200"
                style={{ width: `${(clean.length / 16) * 100}%`, background: done ? '#22c55e' : '#f97316' }}
              />
            </div>
            <span className={`text-[11px] min-w-[28px] text-right ${done ? 'text-green-500' : 'text-zinc-600'}`}>
              {clean.length}/16
            </span>
            {done && <CheckCircle size={14} className="text-green-500" weight="fill" />}
          </div>
          {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><WarningCircle size={11} weight="fill" />{error}</p>}
        </div>

        {/* Security note */}
        <div className="s3-item rounded-xl px-4 py-3 mb-5" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)' }}>
          <p className="text-[12px] text-amber-700/90 leading-relaxed">
            🔒 Encrypted with AES-256-CBC before storage. Your main Google password is never stored.
          </p>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50"
          style={{ background: loading ? '#27272a' : 'linear-gradient(135deg,#f97316,#ea580c)', color: loading ? '#71717a' : '#fff', border: loading ? '1px solid #3f3f46' : 'none' }}
        >
          {loading
            ? <><span className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-ember-500 inline-block" style={{ animation: 'spin 0.7s linear infinite' }} />Saving…</>
            : <>Save & continue <ArrowRight size={15} weight="bold" /></>
          }
        </button>

        <button onClick={onBack} className="mt-3 text-zinc-600 text-xs flex items-center justify-center gap-1 hover:text-zinc-400 transition-colors">
          <ArrowLeft size={11} /> Back to walkthrough
        </button>
      </div>
    </StepShell>
  )
}
