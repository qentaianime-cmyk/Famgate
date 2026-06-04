'use client'
import { useRef, useEffect } from 'react'
import { gsap, DrawSVGPlugin } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface LogoProps { size?: number; animate?: boolean; className?: string }

export function Logo({ size = 36, animate = true, className }: LogoProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animate || !ref.current) return
    const paths = ref.current.querySelectorAll('[data-draw]')
    gsap.fromTo(paths,
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
    )
    gsap.from(ref.current.querySelector('[data-dot]'), {
      scale: 0, opacity: 0, duration: 0.4,
      ease: 'back.out(2)', delay: 0.7,
      transformOrigin: 'center',
    })
  }, [animate])

  return (
    <svg
      ref={ref}
      width={size} height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <rect width="40" height="40" rx="10" fill="#13122b" />
      <rect width="40" height="40" rx="10" fill="url(#q-grad)" fillOpacity="0.4" />
      {/* Q letter paths */}
      <path
        data-draw
        d="M20 10 C13.37 10 8 15.37 8 22 C8 28.63 13.37 34 20 34 C23.2 34 26.1 32.8 28.3 30.8 L31 33.5"
        stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      <path
        data-draw
        d="M20 10 C26.63 10 32 15.37 32 22 C32 25.5 30.5 28.7 28.1 30.9"
        stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      {/* Dot */}
      <circle data-dot cx="33" cy="9" r="3.5" fill="#7c3aed" />
      <circle data-dot cx="33" cy="9" r="2" fill="#a78bfa" />
      <defs>
        <linearGradient id="q-grad" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
