'use client'
import { useRef, useState, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { ArrowRight, ArrowLeft, GoogleLogo, ShieldCheck, Lock, Key } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { MagneticButton } from '@/components/ui/MagneticButton'

interface Props { onNext:()=>void; onBack:()=>void; direction:number }

const STEPS = [
  { icon:GoogleLogo, color:'#4285F4', num:'01', title:'Open Google Account',
    body:'Go to myaccount.google.com — or tap your profile photo → "Manage your Google Account".',
    chip:'myaccount.google.com' },
  { icon:ShieldCheck, color:'#10b981', num:'02', title:'Go to Security tab',
    body:'In the top navigation tap "Security". On mobile it may be inside a hamburger menu.',
    chip:'Security tab' },
  { icon:Lock, color:'#8b5cf6', num:'03', title:'Enable 2-Step Verification',
    body:'Under "How you sign in" find 2-Step Verification. Turn it ON — required before App Passwords appear.',
    chip:'2-Step Verification → ON' },
  { icon:Key, color:'#a78bfa', num:'04', title:'Generate App Password',
    body:'Search "App Passwords" in Google. Name it "Qash", tap Generate. Copy all 16 characters.',
    chip:'App Passwords → Generate → Copy' },
]

export function Step2Google({ onNext, onBack }: Props) {
  const [active, setActive] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const animCard = () => {
    if (cardRef.current)
      gsap.fromTo(cardRef.current,
        { y:16, opacity:0 },
        { y:0, opacity:1, duration:0.35, ease:'power3.out' }
      )
  }
  useEffect(() => { animCard() }, [active])

  const curr = STEPS[active]
  const Icon = curr.icon

  return (
    <StepShell step={2}>
      <div className="h-full flex flex-col px-5 pb-6 pt-4 max-w-[420px] mx-auto w-full">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase font-syne mb-1"
            style={{ color:'#a78bfa' }}>Step 2 of 4</p>
          <h1 className="font-syne font-bold text-[22px] text-ink-1 tracking-[-0.04em]">
            Get your App Password
          </h1>
          <p className="text-ink-2 text-sm font-manrope mt-1">4 steps inside Google Account</p>
        </div>

        {/* Card */}
        <div ref={cardRef} className="flex-1 rounded-2xl p-5 flex flex-col"
          style={{ background:'var(--card)', border:'1px solid var(--bd)', minHeight:0 }}>

          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:`${curr.color}18`,
                border:`1px solid ${curr.color}30`,
              }}>
              <Icon size={22} color={curr.color} weight="fill" />
            </div>
            <span className="font-syne font-black text-[52px] leading-none tracking-tighter select-none"
              style={{ color:'var(--raised)' }}>
              {curr.num}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full self-start mb-3"
            style={{ background:`${curr.color}15`, border:`1px solid ${curr.color}25` }}>
            <span className="text-[10px] font-bold tracking-wide font-syne"
              style={{ color:curr.color }}>STEP {active+1} OF 4</span>
          </div>

          <h2 className="font-syne font-bold text-lg text-ink-1 tracking-tight mb-2">{curr.title}</h2>
          <p className="text-sm text-ink-2 font-manrope leading-relaxed flex-1">{curr.body}</p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg self-start"
            style={{ background:'var(--surface)', border:'1px solid var(--bd-hi)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background:curr.color }} />
            <code className="text-xs font-mono text-ink-2">{curr.chip}</code>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 my-4">
          {STEPS.map((_,i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i===active ? 20 : 6, height:6, padding:0, border:'none', cursor:'pointer',
                background: i===active ? '#7c3aed' : i<active ? '#4c1d95' : 'var(--raised)',
              }} />
          ))}
        </div>

        <div className="flex gap-2.5">
          {active > 0 && (
            <button onClick={() => setActive(a=>a-1)}
              className="flex-1 h-11 rounded-xl text-ink-2 text-sm font-manrope font-medium transition-all"
              style={{ background:'transparent', border:'1px solid var(--bd)' }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--bd-hi)')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--bd)')}>
              ← Prev
            </button>
          )}
          {active < 3 ? (
            <button onClick={() => setActive(a=>a+1)}
              className="flex-1 h-11 rounded-xl text-ink-1 text-sm font-manrope font-medium transition-all"
              style={{ background:'var(--surface)', border:'1px solid var(--bd)' }}>
              Next →
            </button>
          ) : (
            <MagneticButton type="button" onClick={onNext}
              className="flex-1 h-11 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold">
              I have it <ArrowRight size={14} weight="bold" />
            </MagneticButton>
          )}
        </div>

        <button onClick={onBack}
          className="mt-3 text-ink-3 text-xs font-manrope flex items-center justify-center gap-1 hover:text-ink-2 transition-colors py-2">
          <ArrowLeft size={11} /> Back
        </button>
      </div>
    </StepShell>
  )
}
