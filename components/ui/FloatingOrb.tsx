'use client'
import { motion } from 'framer-motion'

interface OrbProps {
  size?: number
  color?: string
  x?: string
  y?: string
  delay?: number
  blur?: number
}

export function FloatingOrb({
  size = 300,
  color = 'rgba(249,115,22,0.06)',
  x = '50%',
  y = '50%',
  delay = 0,
  blur = 80,
}: OrbProps) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: 'translate(-50%,-50%)',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}
