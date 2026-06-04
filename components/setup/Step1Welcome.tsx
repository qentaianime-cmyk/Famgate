'use client'
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import { ArrowRight, Lightning, QrCode, Bell, ArrowsSplit } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useAuthStore } from '@/store/authStore'

interface Props { onNext:()=>void; onBack:()=>void; direction:number }

// Inline 2D illustration — developer at setup
function IllustrationIgnition() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full max-w-[200px] mx-auto"
      style={{ filter:'drop-shadow(0 0 30px rgba(124,58,237,0.2))' }}>
      {/* Background shapes */}
      <circle cx="100" cy="100" r="80" fill="rgba(124,58,237,0.06)" />
      <circle cx="100" cy="100" r="55" fill="rgba(79,70,229,0.06)" />
      {/* Floating triangles */}
      <polygon points="30,40 45,65 15,65" fill="rgba(139,92,246,0.15)" className="animate-float" style={{animationDelay:'0.3s'}}/>
      <polygon points="160,30 172,52 148,52" fill="rgba(99,102,241,0.12)" className="animate-float" style={{animationDelay:'1.2s'}}/>
      <circle cx="165" cy="140" r="8" fill="rgba(124,58,237,0.2)" className="animate-float" style={{animationDelay:'0.7s'}}/>
      <rect x="20" y="130" width="14" height="14" rx="3" fill="rgba(139,92,246,0.15)" className="animate-float" style={{animationDelay:'1.8s'}}/>
      {/* Person body */}
      <ellipse cx="100" cy="155" rx="30" ry="8" fill="rgba(124,58,237,0.12)" />
      {/* Legs */}
      <rect x="88" y="135" width="10" height="22" rx="5" fill="#1a1936" />
      <rect x="102" y="135" width="10" height="22" rx="5" fill="#1a1936" />
      {/* Body */}
      <rect x="82" y="95" width="36" height="45" rx="10" fill="#13122b" />
      <rect x="85" y="98" width="30" height="38" rx="8"
        fill="url(#shirt-grad)" />
      {/* Lightning bolt on shirt */}
      <path d="M103 108 L97 120 L102 120 L97 132 L107 118 L102 118 Z"
        fill="#7c3aed" fillOpacity="0.8" />
      {/* Arms — raised/open */}
      <path d="M82 100 Q70 92 62 85" stroke="#13122b" strokeWidth="9" strokeLinecap="round"/>
      <path d="M82 100 Q70 92 62 85" stroke="#1a1936" strokeWidth="7" strokeLinecap="round"/>
      <path d="M118 100 Q130 92 138 85" stroke="#13122b" strokeWidth="9" strokeLinecap="round"/>
      <path d="M118 100 Q130 92 138 85" stroke="#1a1936" strokeWidth="7" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="62" cy="84" r="6" fill="#2a1f4a" />
      <circle cx="138" cy="84" r="6" fill="#2a1f4a" />
      {/* Neck */}
      <rect x="94" y="87" width="12" height="12" rx="4" fill="#2a1f4a" />
      {/* Head */}
      <circle cx="100" cy="78" r="18" fill="#2a1f4a" />
      {/* Hair */}
      <path d="M83 72 Q90 58 100 60 Q110 58 117 72" fill="#7c3aed" fillOpacity="0.6"/>
      {/* Eyes */}
      <circle cx="94" cy="76" r="3" fill="#ededff" />
      <circle cx="106" cy="76" r="3" fill="#ededff" />
      <circle cx="95" cy="76" r="1.5" fill="#07070f" />
      <circle cx="107" cy="76" r="1.5" fill="#07070f" />
      {/* Smile */}
      <path d="M94 83 Q100 88 106 83" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* Floating payment icons */}
      <g className="animate-float" style={{animationDelay:'0.5s'}}>
        <rect x="50" y="55" width="28" height="20" rx="5" fill="rgba(124,58,237,0.2)" />
        <rect x="53" y="61" width="22" height="3" rx="1.5" fill="rgba(139,92,246,0.5)" />
        <rect x="53" y="67" width="14" height="3" rx="1.5" fill="rgba(99,102,241,0.4)" />
      </g>
      <g className="animate-float" style={{animationDelay:'1.0s'}}>
        <rect x="122" y="55" width="28" height="20" rx="5" fill="rgba(79,70,229,0.2)" />
        <path d="M129 62 L135 68 L145 58" stroke="rgba(139,92,246,0.6)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>
      <defs>
        <linearGradient id="shirt-grad" x1="85" y1="98" x2="115" y2="136" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1936"/>
          <stop offset="1" stopColor="#0d0c1a"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

const FEATURES = [
  { icon: QrCode,      label:'Instant UPI QR per order',    sub:'Generated in < 100ms' },
  { icon: Bell,        label:'Gmail auto-confirms payments', sub:'No manual checking, ever' },
  { icon: ArrowsSplit, label:'Webhook on every payment',     sub:'Integrate with anything' },
]

export function Step1Welcome({ onNext }: Props) {
  const name = useAuthStore(s => s.displayName)
  const ref  = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults:{ ease:'qash' } })
    tl.from('.s1-illus', { scale:0.8, opacity:0, duration:0.6, ease:'back.out(1.5)' })
      .from('.s1-eyebrow', { y:16, opacity:0, duration:0.4 }, '-=0.2')
      .from('.s1-feature', { y:20, opacity:0, stagger:0.08, duration:0.45 }, '-=0.2')
      .from('.s1-cta',     { y:14, opacity:0, duration:0.4 }, '-=0.1')

    // SplitText heading
    if (headRef.current) {
      const split = new SplitText(headRef.current, {
        type:'lines,words', linesClass:'split-line', wordsClass:'split-word',
      })
      tl.from(split.words, { yPercent:110, opacity:0, stagger:0.06, duration:0.5 }, 0.2)
      return () => split.revert()
    }
  }, { scope: ref })

  return (
    <StepShell step={1}>
      <div ref={ref} className="h-full flex flex-col px-5 pb-8 pt-5 max-w-[420px] mx-auto w-full overflow-y-auto">

        {/* Illustration */}
        <div className="s1-illus mb-5">
          <IllustrationIgnition />
        </div>

        {/* Eyebrow */}
        <p className="s1-eyebrow text-[11px] font-semibold tracking-[0.12em] uppercase mb-2 font-syne"
          style={{ color:'#a78bfa' }}>
          Merchant Setup · 3 minutes
        </p>

        {/* Heading */}
        <div ref={headRef}
          className="font-syne font-bold text-[clamp(24px,6vw,32px)] text-ink-1 tracking-[-0.04em] leading-[1.1] mb-3"
          style={{ overflow:'hidden' }}>
          {name ? `Hey ${name.split(' ')[0]},` : 'Welcome.'}{' '}
          <span style={{ color:'#a78bfa' }}>Arm</span> your gateway.
        </div>

        <p className="text-ink-2 text-sm font-manrope leading-relaxed mb-6">
          Connect Gmail + UPI once. Every payment confirms automatically — no polling, no manual work.
        </p>

        {/* Features */}
        <div className="flex flex-col gap-2.5 flex-1">
          {FEATURES.map(({ icon:Icon, label, sub }) => (
            <div key={label} className="s1-feature flex items-center gap-3.5 p-3.5 rounded-xl transition-colors duration-200"
              style={{ background:'var(--card)', border:'1px solid var(--bd)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(139,92,246,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor='var(--bd)')}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background:'var(--surface)', border:'1px solid var(--bd)' }}>
                <Icon size={15} color="#8b5cf6" />
              </div>
              <div>
                <p className="text-sm text-ink-1 font-manrope font-medium leading-tight">{label}</p>
                <p className="text-xs text-ink-3 font-manrope mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="s1-cta mt-6">
          <MagneticButton
            type="button"
            onClick={onNext}
            className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight"
          >
            Begin setup <ArrowRight size={16} weight="bold" />
          </MagneticButton>
          <p className="text-center text-ink-4 text-xs font-manrope mt-2.5">
            Skip for now — Settings → Configure anytime
          </p>
        </div>
      </div>
    </StepShell>
  )
}
