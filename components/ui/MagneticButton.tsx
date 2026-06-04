'use client'
import { useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// ⚠️ NO style prop — className only. This is a TypeScript contract.
interface MagneticButtonProps {
  children:   React.ReactNode
  className:  string
  strength?:  number
  onClick?:   () => void
  type?:      'button' | 'submit'
  disabled?:  boolean
  loading?:   boolean
}

export function MagneticButton({
  children, className, strength = 0.3,
  onClick, type = 'button', disabled, loading,
}: MagneticButtonProps) {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const [over,  setOver]  = useState(false)

  const mx = useSpring(0, { stiffness: 220, damping: 20, mass: 0.5 })
  const my = useSpring(0, { stiffness: 220, damping: 20, mass: 0.5 })
  const ix = useTransform(mx, v => v * 0.35)
  const iy = useTransform(my, v => v * 0.35)

  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left - r.width  / 2) * strength)
    my.set((e.clientY - r.top  - r.height / 2) * strength)
  }

  const leave = () => { mx.set(0); my.set(0); setOver(false) }

  return (
    <motion.button
      ref={btnRef} type={type}
      style={{ x: mx, y: my }}
      onMouseMove={move}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={leave}
      onTouchStart={() => { /* mobile — no magnetic on touch */ }}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden font-manrope font-semibold',
        'transition-shadow duration-300 select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        over && 'shadow-[0_8px_40px_rgba(124,58,237,0.45)]',
        className,
      )}
    >
      {/* Sheen sweep on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: over ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: 'linear-gradient(105deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0) 55%)',
        }}
      />
      <motion.span
        style={{ x: ix, y: iy }}
        className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
            style={{ animation:'spin 0.7s linear infinite' }} />
        ) : children}
      </motion.span>
    </motion.button>
  )
}
