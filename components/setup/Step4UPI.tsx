'use client'
import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { ArrowLeft, CheckCircle, CurrencyInr, WarningCircle } from '@phosphor-icons/react'
import { StepShell }      from './StepShell'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { settingsApi }    from '@/lib/api'
import { useRouter }      from 'next/navigation'
import { useAuthStore }   from '@/store/authStore'

interface Props { onNext:()=>void; onBack:()=>void; direction:number }

export function Step4UPI({ onBack }: Props) {
  const router = useRouter()
  const [upi,     setUpi]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const successRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.s4-item', { y:18, opacity:0, stagger:0.09, duration:0.45, ease:'qash' })
  }, { scope:containerRef })

  useEffect(() => {
    if (!done || !successRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults:{ ease:'qash' } })

      // Ring entrance
      tl.fromTo('.success-ring',
        { scale:0, opacity:0 },
        { scale:1, opacity:1, duration:0.55, ease:'back.out(2)' }
      )
      .from('.success-title', { y:22, opacity:0, duration:0.45 }, '-=0.1')
      .from('.success-sub',   { y:14, opacity:0, duration:0.4  }, '-=0.1')
      .fromTo('.success-bar',
        { scaleX:0 },
        { scaleX:1, duration:2.8, ease:'power2.inOut' }, '-=0.1'
      )

      // Particles — fromTo only, no array values (TypeScript safe)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const tx    = Math.cos(angle) * 65
        const ty    = Math.sin(angle) * 65
        gsap.fromTo(`.sp-${i}`,
          { x:0, y:0, scale:0, opacity:1 },
          { x:tx, y:ty, scale:1, opacity:0, duration:0.9, delay:0.35 + i*0.04, ease:'power2.out' }
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
      await settingsApi.save({ upi_id:upi })
      useAuthStore.setState({ requiresSetup:false })
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 3200)
    } catch(e:any) {
      setError(e.response?.data?.error ?? 'Save failed.')
    } finally { setLoading(false) }
  }

  if (done) return (
    <StepShell step={4}>
      <div ref={successRef}
        className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-7">
          <div className="success-ring w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background:'var(--green-bg)', border:'1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle size={38} color="var(--green)" weight="fill" />
          </div>
          {[...Array(12)].map((_,i) => (
            <div key={i} className={`sp-${i} absolute rounded-full`}
              style={{
                width:8, height:8,
                top:'50%', left:'50%',
                marginTop:-4, marginLeft:-4,
                background: i%3===0 ? '#7c3aed' : i%3===1 ? 'var(--green)' : '#a78bfa',
              }} />
          ))}
        </div>

        <h1 className="success-title font-syne font-bold text-[28px] text-ink-1 tracking-[-0.04em] mb-2">
          Gateway activated.
        </h1>
        <p className="success-sub text-ink-2 text-sm font-manrope leading-relaxed">
          <code className="font-mono text-xs" style={{color:'#a78bfa'}}>{upi}</code>
          <br />is now your payment destination.
        </p>

        <div className="mt-8 overflow-hidden rounded"
          style={{ width:200, height:1, background:'var(--raised)' }}>
          <div className="success-bar h-full origin-left rounded"
            style={{ background:'linear-gradient(90deg,#7c3aed,#4f46e5,#3b82f6)', transform:'scaleX(0)' }} />
        </div>
        <p className="text-ink-4 text-xs font-manrope mt-2">Taking you to dashboard…</p>
      </div>
    </StepShell>
  )

  return (
    <StepShell step={4}>
      <div ref={containerRef} className="h-full flex flex-col px-5 pb-6 pt-4 max-w-[420px] mx-auto w-full">
        <div className="s4-item mb-5">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase font-syne mb-1" style={{color:'#a78bfa'}}>
            Step 4 of 4 — Final
          </p>
          <h1 className="font-syne font-bold text-[22px] text-ink-1 tracking-[-0.04em]">Set your UPI ID</h1>
          <p className="text-ink-2 text-sm font-manrope mt-1">All payments land here directly</p>
        </div>

        <div className="s4-item mb-4">
          <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-3 font-syne mb-2">
            UPI ID
          </label>
          <div className="relative">
            <CurrencyInr size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{color:'var(--ink-3)'}} />
            <input
              type="text"
              placeholder="yourname@upi"
              value={upi}
              onChange={e => { setUpi(e.target.value); setError('') }}
              onKeyDown={e => e.key==='Enter' && submit()}
              className="w-full h-12 rounded-xl pl-10 pr-10 text-sm font-manrope outline-none transition-all duration-200"
              style={{
                background:'var(--card)',
                border:`1px solid ${error ? 'var(--rose)' : valid ? 'rgba(16,185,129,0.45)' : 'var(--bd)'}`,
                color:'var(--ink-1)',
              }}
              onFocus={e => (e.target.style.borderColor = error ? 'var(--rose)' : valid ? 'rgba(16,185,129,0.6)' : '#7c3aed')}
              onBlur={e  => (e.target.style.borderColor = error ? 'var(--rose)' : valid ? 'rgba(16,185,129,0.45)' : 'var(--bd)')}
            />
            {valid && (
              <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2"
                color="var(--green)" weight="fill" />
            )}
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-manrope mt-1.5" style={{color:'var(--rose)'}}>
              <WarningCircle size={12} weight="fill" /> {error}
            </p>
          )}
          <p className="text-xs text-ink-4 font-manrope mt-1.5">
            e.g. name@fam · 9876543210@paytm · handle@okicici
          </p>
        </div>

        <div className="s4-item flex flex-col gap-2 flex-1">
          {[['⚡','Lands in your UPI-linked bank account'],['🔁','Change anytime from Settings'],['🧾','Works with all UPI apps']].map(([e,t]) => (
            <div key={t as string} className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
              style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
              <span className="text-base">{e}</span>
              <span className="text-xs text-ink-3 font-manrope">{t}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <MagneticButton type="button" onClick={submit} loading={loading} disabled={!valid}
            className={`w-full h-12 rounded-xl text-sm font-syne font-bold tracking-tight transition-all ${
              valid ? 'text-white bg-violet-gradient' : 'text-ink-4 bg-raised'
            }`}
          >
            Activate gateway 🚀
          </MagneticButton>
          <button onClick={onBack}
            className="text-ink-3 text-xs font-manrope flex items-center justify-center gap-1 hover:text-ink-2 transition-colors py-2">
            <ArrowLeft size={11} /> Back
          </button>
        </div>
      </div>
    </StepShell>
  )
}
