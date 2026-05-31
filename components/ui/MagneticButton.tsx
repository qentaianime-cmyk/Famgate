'use client'
import { useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  type = 'button',
  disabled,
  loading,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 })
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.6 })

  // Inner text moves slightly more than outer button (parallax feel)
  const innerX = useTransform(x, v => v * 0.4)
  const innerY = useTransform(y, v => v * 0.4)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold text-sm',
        'transition-shadow duration-300',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        hovered && 'shadow-[0_8px_40px_rgba(249,115,22,0.35)]',
        className
      )}
    >
      {/* Gradient sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            'linear-gradient(105deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
        }}
      />

      {/* Border shimmer on hover */}
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.2s linear infinite',
          }}
        />
      )}

      <motion.span
        style={{ x: innerX, y: innerY }}
        className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
      >
        {loading ? (
          <span
            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block"
            style={{ animation: 'spin 0.7s linear infinite' }}
          />
        ) : (
          children
        )}
      </motion.span>
    </motion.button>
  )
}
