'use client'
import { useState } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

interface Props {
  label:   string
  apiKey:  string
  type:    'live' | 'test'
}

function maskKey(key: string) {
  const prefix = key.slice(0, 10)
  const suffix = key.slice(-4)
  return `${prefix}${'•'.repeat(16)}${suffix}`
}

export function ApiKeyCard({ label, apiKey, type }: Props) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background:'var(--card)',
        border:`1px solid ${type === 'live' ? 'rgba(124,58,237,0.2)' : 'var(--bd)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: type === 'live' ? '#10b981' : '#f59e0b',
              boxShadow: type === 'live'
                ? '0 0 6px rgba(16,185,129,0.7)'
                : '0 0 6px rgba(245,158,11,0.7)',
            }}
          />
          <span className="text-[11px] font-syne font-bold tracking-[0.1em] uppercase text-ink-3">
            {label}
          </span>
        </div>

        <button
          onClick={() => setRevealed(v => !v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ background:'var(--surface)', border:'1px solid var(--bd)', color:'var(--ink-3)' }}
        >
          {revealed ? <EyeSlash size={13} /> : <Eye size={13} />}
        </button>
      </div>

      {/* Key display */}
      <div
        className="rounded-xl px-3 py-2.5 flex items-center gap-2"
        style={{ background:'var(--surface)', border:'1px solid var(--bd)' }}
      >
        <code
          className="flex-1 text-xs font-mono truncate"
          style={{
            fontFamily:'var(--font-jbmono)',
            color: revealed ? 'var(--ink-1)' : 'var(--ink-3)',
            letterSpacing: revealed ? '0.04em' : '0.08em',
            filter: revealed ? 'none' : 'blur(0)',
          }}
        >
          {revealed ? apiKey : maskKey(apiKey)}
        </code>
        <CopyButton value={apiKey} />
      </div>
    </div>
  )
}
