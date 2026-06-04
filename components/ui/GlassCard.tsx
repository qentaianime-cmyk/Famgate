'use client'
import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children:   React.ReactNode
  className?: string
  glow?:      boolean
}

export function GlassCard({ children, className, glow = true }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0, o: 0 })

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, o: 1 })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={glow ? onMove : undefined}
      onMouseLeave={glow ? () => setPos(p => ({ ...p, o: 0 })) : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'glass',
        className,
      )}
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 rounded-2xl"
          style={{
            opacity: pos.o,
            background: `radial-gradient(380px circle at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.09), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
