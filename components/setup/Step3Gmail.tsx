'use client'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { ArrowRight, ArrowLeft, Envelope, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedInput }  from '@/components/ui/AnimatedInput'
import { settingsApi }    from '@/lib/api'

interface Props { onNext:()=>void; onBack:()=>void; direction:number }

export function Step3Gmail({ onNext, onBack }: Props) {
  const [gmail,   setGmail]   = useState('')
  const [appPass, setAppPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [gmailErr,setGmailErr]= useState('')
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.s3-item', { y:18, opacity:0, stagger:0.09, duration:0.45, ease:'qash' })
  }, { scope:ref })

  const fmt = (v:string) => {
    const c = v.replace(/\s/g,'').toLowerCase().slice(0,16)
    return c.match(/.{1,4}/g)?.join(' ') ?? c
  }
  const clean = appPass.replace(/\s/g,'')
  const done  = clean.length === 16

  const submit = async () => {
    setError(''); setGmailErr('')
    if (!gmail || !/^[^\s@]+@gmail\.com$/.test(gmail)) { setGmailErr('Must be a @gmail.com address'); return }
    if (!done) { setError('Enter all 16 characters'); return }
    setLoading(true)
    try {
      await settingsApi.save({ gmail_user:gmail, gmail_app_password:clean })
      onNext()
    } catch(e:any) {
      setError(e.response?.data?.error ?? 'Save failed.')
    } finally { setLoading(false) }
  }

  return (
    <StepShell step={3}>
      <div ref={ref} className="h-full flex flex-col px-5 pb-6 pt-4 max-w-[420px] mx-auto w-full overflow-y-auto">
        <div className="s3-item mb-5">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase font-syne mb-1" style={{color:'#a78bfa'}}>
            Step 3 of 4
          </p>
          <h1 className="font-syne font-bold text-[22px] text-ink-1 tracking-[-0.04em]">Connect Gmail</h1>
          <p className="text-ink-2 text-sm font-manrope mt-1">We scan FamApp emails to auto-confirm orders</p>
        </div>

        {/* Gmail input */}
        <div className="s3-item mb-4">
          <AnimatedInput
            label="Gmail Address"
            type="email"
            placeholder="yourname@gmail.com"
            icon={<Envelope size={15} />}
            value={gmail}
            onChange={e => { setGmail(e.target.value); setGmailErr('') }}
            error={gmailErr}
            autoComplete="email"
          />
        </div>

        {/* 16-char password */}
        <div className="s3-item mb-4">
          <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-3 font-syne mb-2">
            16-Character App Password
          </label>

          {/* Segmented blocks */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[0,1,2,3].map(g => {
              const filled  = clean.length >= (g+1)*4
              const partial = clean.length > g*4 && !filled
              return (
                <div key={g} className="h-11 flex items-center justify-center rounded-xl font-mono text-sm tracking-widest transition-all duration-200"
                  style={{
                    background:'var(--card)',
                    border:`1px solid ${filled ? '#7c3aed' : partial ? '#4c1d95' : 'var(--bd)'}`,
                    color: filled ? '#a78bfa' : partial ? '#4c1d95' : 'var(--ink-4)',
                    boxShadow: filled ? '0 0 12px rgba(124,58,237,0.15)' : 'none',
                  }}>
                  {clean.slice(g*4,(g+1)*4).padEnd(4,'·')}
                </div>
              )
            })}
          </div>

          <input
            type="text"
            placeholder="Paste 16-char app password"
            value={appPass}
            onChange={e => { setAppPass(fmt(e.target.value)); setError('') }}
            maxLength={19}
            className="w-full h-12 rounded-xl px-4 text-sm font-mono tracking-widest outline-none transition-all duration-200 font-manrope"
            style={{
              background:'var(--card)',
              border:`1px solid ${error ? 'var(--rose)' : 'var(--bd)'}`,
              color:'var(--ink-1)',
            }}
            onFocus={e => (e.target.style.borderColor = error ? 'var(--rose)' : '#7c3aed')}
            onBlur={e  => (e.target.style.borderColor = error ? 'var(--rose)' : 'var(--bd)')}
          />

          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-0.5 rounded overflow-hidden" style={{ background:'var(--raised)' }}>
              <div className="h-full rounded transition-all duration-200"
                style={{
                  width:`${(clean.length/16)*100}%`,
                  background: done ? 'var(--green)' : 'linear-gradient(90deg,#7c3aed,#4f46e5)',
                }} />
            </div>
            <span className="text-[11px] font-manrope min-w-[28px] text-right"
              style={{ color: done ? 'var(--green)' : 'var(--ink-3)' }}>
              {clean.length}/16
            </span>
            {done && <CheckCircle size={14} color="var(--green)" weight="fill" />}
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-manrope mt-1.5" style={{color:'var(--rose)'}}>
              <WarningCircle size={12} weight="fill" /> {error}
            </p>
          )}
        </div>

        {/* Security note */}
        <div className="s3-item rounded-xl px-4 py-3 mb-5"
          style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.12)' }}>
          <p className="text-[12px] font-manrope leading-relaxed" style={{color:'#a78bfa'}}>
            🔒 Encrypted with AES-256-CBC before storage. Your main Google password is never touched.
          </p>
        </div>

        <MagneticButton type="button" onClick={submit} loading={loading}
          className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight">
          Save & continue <ArrowRight size={15} weight="bold" />
        </MagneticButton>

        <button onClick={onBack}
          className="mt-3 text-ink-3 text-xs font-manrope flex items-center justify-center gap-1 hover:text-ink-2 transition-colors py-2">
          <ArrowLeft size={11} /> Back to walkthrough
        </button>
      </div>
    </StepShell>
  )
}
