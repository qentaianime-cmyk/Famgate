'use client'
import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(249,115,22,0.08)',
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos,     setPos]     = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [border,  setBorder]  = useState({ x: 0, y: 0, o: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPos({ x, y })
    setOpacity(1)
    setBorder({ x, y, o: 1 })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setOpacity(0); setBorder(b => ({ ...b, o: 0 })) }}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      {/* Animated border highlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: border.o * 0.6,
          background: `radial-gradient(160px circle at ${border.x}px ${border.y}px, rgba(249,115,22,0.2), transparent 70%)`,
          borderRadius: 'inherit',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
