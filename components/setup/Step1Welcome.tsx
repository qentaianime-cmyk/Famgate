'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Lightning, QrCode, Bell, ArrowsSplit } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { motion } from 'framer-motion'
import { KineticText } from '@/components/ui/KineticText'
import { useAuthStore } from '@/store/authStore'

interface Props { onNext: () => void; onBack: () => void; direction: number }

const FEATURES = [
  { icon: QrCode,      label: 'Instant UPI QR per order',           sub: 'Generated in < 100ms' },
  { icon: Bell,        label: 'Gmail auto-confirms payments',        sub: 'No manual checking ever' },
  { icon: ArrowsSplit, label: 'Webhook on every confirmed payment',  sub: 'Integrate with anything' },
]

export function Step1Welcome({ onNext }: Props) {
  const name = useAuthStore(s => s.displayName)
  const ref  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.s1-icon',    { scale: 0.4, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
        .from('.s1-eyebrow', { y: 12, opacity: 0, duration: 0.4 }, '-=0.1')
        .from('.s1-heading', { y: 24, opacity: 0, duration: 0.55 }, '-=0.25')
        .from('.s1-sub',     { y: 16, opacity: 0, duration: 0.45 }, '-=0.3')
        .from('.s1-feature', { y: 20, opacity: 0, duration: 0.4, stagger: 0.09 }, '-=0.2')
        .from('.s1-cta',     { y: 16, opacity: 0, duration: 0.4 }, '-=0.1')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <StepShell step={1}>
      <div
        ref={ref}
        className="h-full flex flex-col px-5 pb-8 pt-6 max-w-md mx-auto w-full overflow-y-auto"
      >
        {/* Icon */}
        <div className="s1-icon w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <Lightning size={24} color="#f97316" weight="fill" />
        </div>

        {/* Eyebrow */}
        <p className="s1-eyebrow text-[11px] font-semibold tracking-widest uppercase text-ember-500 mb-3">
          Merchant Setup · 3 minutes
        </p>
{/* CHOTTI LULI UPDATE */}
<div className="s1-heading">
  <KineticText
    text={name ? `Hey ${name.split(' ')[0]},` : 'Welcome.'}
    as="h1"
    delay={0.2}
    stagger={0.1}
    className="text-[clamp(26px,7vw,34px)] font-bold text-white tracking-tight leading-tight"
  />

  <div className="flex flex-wrap gap-[0.25em] overflow-hidden mt-0.5">
    {['Arm', 'your', 'gateway.'].map((word, i) => (
      <span key={word} style={{ overflow: 'hidden', display: 'inline-block' }}>
        <motion.span
          className={`text-[clamp(26px,7vw,34px)] font-bold tracking-tight leading-tight inline-block ${i === 0 ? 'text-ember-500' : 'text-white'}`}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 160,
            delay: 0.38 + i * 0.1,
          }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </div>
</div>

        <p className="s1-sub text-zinc-500 text-sm leading-relaxed mb-7">
          Connect Gmail + UPI once. Every payment confirms automatically — no polling, no manual work.
        </p>

        {/* Features */}
        <div className="s1-feature flex flex-col gap-2.5 flex-1">
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-zinc-800 border border-zinc-700">
                <Icon size={15} color="#f97316" />
              </div>
              <div>
                <p className="text-sm text-zinc-200 font-medium leading-tight">{label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="s1-cta mt-7">
          <button
            onClick={onNext}
            className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff',
              boxShadow: '0 1px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 0 transparent, 0 8px 32px rgba(249,115,22,0.35)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' }}
          >
            Begin setup <ArrowRight size={16} weight="bold" />
          </button>
          <p className="text-center text-zinc-700 text-xs mt-2.5">
            Skip for now — come back via Settings anytime
          </p>
        </div>
      </div>
    </StepShell>
  )
}
