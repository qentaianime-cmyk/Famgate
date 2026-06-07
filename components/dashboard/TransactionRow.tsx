'use client'
import { useState } from 'react'
import { StatusBadge } from './StatusBadge'

interface Tx {
  order_id: string; amount: number; purpose: string
  status: string; utr?: string; created_at: number; paid_time?: number
}
interface Props { tx: Tx; index: number }

function midEllipsis(str: string, maxLen = 14) {
  if (str.length <= maxLen) return str
  const half = Math.floor(maxLen / 2)
  return str.slice(0, half) + '…' + str.slice(-half)
}

function relativeTime(ts: number) {
  const diff = Date.now() / 1000 - ts
  if (diff < 60)        return 'just now'
  if (diff < 3600)      return `${Math.floor(diff/60)}m ago`
  if (diff < 86400)     return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export function TransactionRow({ tx, index }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background:'var(--card)',
        border:`1px solid ${open ? 'rgba(124,58,237,0.2)' : 'var(--bd)'}`,
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Left accent bar — draws down when open */}
          <div
            className="w-0.5 rounded-full shrink-0 transition-all duration-300"
            style={{
              height: open ? 36 : 20,
              background: tx.status === 'PAID'    ? 'var(--green)' :
                          tx.status === 'PENDING' ? '#f59e0b'      : 'var(--ink-4)',
            }}
          />
          <div className="min-w-0">
            <p className="font-mono text-xs text-ink-2 truncate"
              style={{ fontFamily:'var(--font-jbmono)' }}>
              {midEllipsis(tx.order_id)}
            </p>
            <p className="text-xs text-ink-3 font-manrope truncate">{tx.purpose}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className="font-mono font-bold text-sm tabular"
            style={{
              fontFamily:'var(--font-jbmono)',
              color: tx.status === 'PAID' ? 'var(--green)' : 'var(--ink-1)',
            }}
          >
            ₹{tx.amount.toLocaleString('en-IN')}
          </span>
          <StatusBadge status={tx.status} />
        </div>
      </button>

      {/* Expandable drawer — CSS grid 0fr→1fr trick */}
      <div
        style={{
          display:'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition:'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow:'hidden' }}>
          <div className="px-4 pb-4 pt-1 space-y-1.5"
            style={{ borderTop:'1px solid var(--bd)' }}>
            {[
              ['Order ID',  tx.order_id],
              ['UTR',       tx.utr || '—'],
              ['Created',   relativeTime(tx.created_at)],
              ['Paid',      tx.paid_time ? relativeTime(tx.paid_time) : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[11px] text-ink-4 font-manrope">{k}</span>
                <span className="font-mono text-[11px] text-ink-2"
                  style={{ fontFamily:'var(--font-jbmono)' }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
