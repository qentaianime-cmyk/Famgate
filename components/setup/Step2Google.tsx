'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, ArrowLeft, GoogleLogo, ShieldCheck, Lock, Key } from '@phosphor-icons/react'
import { StepShell } from './StepShell'

interface Props { onNext: () => void; onBack: () => void; direction: number }

const STEPS = [
  { icon: GoogleLogo, color: '#4285F4', num: '01', title: 'Open Google Account',
    body: 'Go to myaccount.google.com — or tap your profile photo anywhere in Google and choose "Manage your Google Account".',
    chip: 'myaccount.google.com' },
  { icon: ShieldCheck, color: '#22c55e', num: '02', title: 'Go to Security tab',
    body: 'In the top navigation bar tap "Security". On mobile it may be in the hamburger menu.',
    chip: 'Security tab' },
  { icon: Lock, color: '#f97316', num: '03', title: 'Enable 2-Step Verification',
    body: 'Under "How you sign in to Google" find 2-Step Verification. Turn it ON — required before App Passwords appear.',
    chip: '2-Step Verification → ON' },
  { icon: Key, color: '#a78bfa', num: '04', title: 'Generate App Password',
    body: 'Search "App Passwords" in the Google search bar. Name it "FamSaaS", tap Generate. Copy all 16 characters.',
    chip: 'App Passwords → Generate → Copy' },
]

export function Step2Google({ onNext, onBack }: Props) {
  const [active, setActive] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const animCard = () => {
    if (cardRef.current)
      gsap.fromTo(cardRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
  }
  useEffect(() => { animCard() }, [active])

  const curr = STEPS[active]
  const Icon = curr.icon

  return (
    <StepShell step={2}>
      <div className="h-full flex flex-col px-5 pb-6 pt-5 max-w-md mx-auto w-full">
        <div className="mb-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-ember-500 mb-1">Step 2 of 4</p>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Get your App Password</h1>
          <p className="text-zinc-500 text-sm mt-1">4 quick steps inside Google Account</p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col"
          style={{ minHeight: 0 }}
        >
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${curr.color}18`, border: `1px solid ${curr.color}30` }}
            >
              <Icon size={20} color={curr.color} weight="fill" />
            </div>
            <span className="text-5xl font-black text-zinc-800 leading-none tracking-tighter select-none">
              {curr.num}
            </span>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 self-start"
            style={{ background: `${curr.color}15`, border: `1px solid ${curr.color}25` }}
          >
            <span className="text-[10px] font-bold tracking-wide" style={{ color: curr.color }}>
              STEP {active + 1} OF 4
            </span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight mb-2">{curr.title}</h2>
          <p className="text-sm text-zinc-500 leading-relaxed flex-1">{curr.body}</p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg self-start">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: curr.color }} />
            <code className="text-xs text-zinc-400">{curr.chip}</code>
          </div>
        </div>

        {/* Dot nav */}
        <div className="flex justify-center gap-2 my-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === active ? 20 : 6, height: 6, padding: 0, border: 'none', cursor: 'pointer',
                background: i === active ? '#f97316' : i < active ? '#7c2d12' : '#27272a',
              }}
            />
          ))}
        </div>

        <div className="flex gap-2.5">
          {active > 0 && (
            <button
              onClick={() => setActive(a => a - 1)}
              className="flex-1 h-11 rounded-xl bg-transparent border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-700 hover:text-zinc-200 transition-all"
            >
              ← Prev
            </button>
          )}
          {active < 3 ? (
            <button
              onClick={() => setActive(a => a + 1)}
              className="flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm hover:bg-zinc-800 transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              I have it <ArrowRight size={14} weight="bold" />
            </button>
          )}
        </div>

        <button onClick={onBack} className="mt-3 text-zinc-600 text-xs flex items-center justify-center gap-1 hover:text-zinc-400 transition-colors">
          <ArrowLeft size={11} /> Back
        </button>
      </div>
    </StepShell>
  )
}
