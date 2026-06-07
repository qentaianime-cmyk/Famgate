'use client'
import { useState } from 'react'
import { Copy, Check } from '@phosphor-icons/react'

interface Props { value: string; size?: number }

export function CopyButton({ value, size = 14 }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 font-manrope"
      style={{
        background: copied ? 'var(--green-bg)' : 'var(--surface)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--bd)'}`,
        color: copied ? 'var(--green)' : 'var(--ink-2)',
      }}
    >
      {copied
        ? <><Check size={size} weight="bold" /><span className="text-[11px]">Copied</span></>
        : <><Copy size={size} /><span className="text-[11px]">Copy</span></>
      }
    </button>
  )
}
