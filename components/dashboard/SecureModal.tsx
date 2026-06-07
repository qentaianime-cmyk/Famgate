'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Warning } from '@phosphor-icons/react'

interface Props {
  open:      boolean
  onClose:   () => void
  onConfirm: () => Promise<void>
  title:     string
  body:      string
  danger:    string  // button label
}

const HOLD_MS = 1500

export function SecureModal({ open, onClose, onConfirm, title, body, danger }: Props) {
  const [progress, setProgress] = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef  = useRef<number>(0)
  const rafRef    = useRef<number>(0)

  const startHold = () => {
    startRef.current = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct     = Math.min(elapsed / HOLD_MS, 1)
      setProgress(pct)
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Confirmed
        setLoading(true)
        onConfirm().then(() => { setDone(true); setLoading(false) }).catch(() => setLoading(false))
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const endHold = () => {
    cancelAnimationFrame(rafRef.current)
    if (progress < 1 && !done) {
      // Spring back
      const current = progress
      let p = current
      const release = () => {
        p = Math.max(0, p - 0.04)
        setProgress(p)
        if (p > 0) rafRef.current = requestAnimationFrame(release)
      }
      requestAnimationFrame(release)
    }
  }

  const circumference = 2 * Math.PI * 18

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
            initial={{ y:'100%' }}
            animate={{ y:0 }}
            exit={{ y:'100%' }}
            transition={{ type:'spring', stiffness:400, damping:40 }}
            style={{
              background:'var(--depth)',
              border:'1px solid rgba(244,63,94,0.2)',
              borderBottom:'none',
              borderRadius:'24px 24px 0 0',
              padding:'28px 24px',
              paddingBottom:'calc(28px + env(safe-area-inset-bottom))',
            }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-6"
              style={{ background:'var(--raised)' }} />

            <button onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'var(--surface)', border:'1px solid var(--bd)', color:'var(--ink-3)' }}>
              <X size={14} />
            </button>

            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)' }}>
                <Warning size={20} color="var(--rose)" weight="fill" />
              </div>
              <div>
                <h2 className="font-syne font-bold text-lg text-ink-1 tracking-tight">{title}</h2>
                <p className="text-sm text-ink-2 font-manrope mt-1 leading-relaxed">{body}</p>
              </div>
            </div>

            {/* Hold button */}
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              disabled={loading || done}
              className="relative w-full h-14 rounded-2xl flex items-center justify-center gap-3 select-none overflow-hidden font-syne font-bold text-sm tracking-tight"
              style={{
                background:'rgba(244,63,94,0.1)',
                border:'1px solid rgba(244,63,94,0.3)',
                color:'var(--rose)',
                cursor: done ? 'default' : 'pointer',
              }}
            >
              {/* Fill progress */}
              <div
                className="absolute inset-0 origin-left transition-none"
                style={{
                  background:'rgba(244,63,94,0.15)',
                  transform:`scaleX(${progress})`,
                  transformOrigin:'left',
                }}
              />

              {/* SVG ring */}
              <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0 relative z-10"
                style={{ transform:'rotate(-90deg)' }}>
                <circle cx="20" cy="20" r="18" fill="none"
                  stroke="rgba(244,63,94,0.15)" strokeWidth="2" />
                <circle cx="20" cy="20" r="18" fill="none"
                  stroke="var(--rose)" strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                  style={{ transition:'stroke-dashoffset 0.05s linear' }}
                />
              </svg>

              <span className="relative z-10">
                {done ? '✓ Done' : loading ? 'Processing…' : `Hold to ${danger}`}
              </span>
            </button>

            <p className="text-center text-xs text-ink-4 font-manrope mt-3">
              Hold for 1.5s to confirm this action
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
