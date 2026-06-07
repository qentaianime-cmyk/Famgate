'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface Props {
  label:     string
  value:     number | string
  prefix?:   string
  suffix?:   string
  sub?:      string
  pulse?:    boolean
  pulseColor?:string
  delay?:    number
  format?:   (n:number) => string
}

export function MetricCard({ label, value, prefix, suffix, sub, pulse, pulseColor='#f59e0b', delay=0, format }: Props) {
  const numRef = useRef<HTMLSpanElement>(null)
useEffect(() => {
  if (typeof value !== 'number' || !numRef.current) return
  const counter = { val: 0 }
  gsap.to(counter, {
    val: value,
    duration: 1.2,
    delay: 0.3 + delay,
    ease: 'power3.out',
    onUpdate: () => {
      if (numRef.current) {
        const v = counter.val
        numRef.current.textContent = format
          ? format(v)
          : v >= 1000
          ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
          : v.toFixed(v % 1 === 0 ? 0 : 1)
      }
    },
  })
}, [value, delay, format])

  return (
    <div
      className="relative rounded-2xl p-4 overflow-hidden transition-all duration-300"
      style={{
        background:'var(--card)',
        border:'1px solid var(--bd)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--bd-hi)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bd)')}
    >
      {/* Ambient gradient corner */}
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
        style={{
          background:'radial-gradient(circle at top right, rgba(124,58,237,0.08), transparent 70%)',
        }} />

      {/* Pulse indicator */}
      {pulse && (
        <div className="absolute top-3.5 right-3.5">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full animate-ping opacity-75"
              style={{ background:pulseColor }} />
            <div className="w-2 h-2 rounded-full"
              style={{ background:pulseColor }} />
          </div>
        </div>
      )}

      <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3 mb-2">
        {label}
      </p>

      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="text-sm font-mono text-ink-2">{prefix}</span>
        )}
        <span
          ref={numRef}
          className="font-mono font-bold tabular text-2xl text-ink-1"
          style={{ fontFamily:'var(--font-jbmono)' }}
        >
          {typeof value === 'number' ? '0' : value}
        </span>
        {suffix && (
          <span className="text-sm font-mono text-ink-2">{suffix}</span>
        )}
      </div>

      {sub && (
        <p className="text-xs text-ink-3 font-manrope mt-1">{sub}</p>
      )}
    </div>
  )
}
