'use client'
import { useEffect, useState, useCallback } from 'react'
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react'
import { TransactionRow } from '@/components/dashboard/TransactionRow'
import { PageHeader }     from '@/components/dashboard/PageHeader'
import { transactionsApi } from '@/lib/api'

const FILTERS = ['ALL','PAID','PENDING','EXPIRED'] as const
type Filter = typeof FILTERS[number]

interface TxPage {
  transactions: any[]
  total_rows:   number
  total_pages:  number
  summary:      { paid_count:number; pending_count:number; expired_count:number; paid_volume:string }
}

export default function TransactionsPage() {
  const [filter,  setFilter]  = useState<Filter>('ALL')
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [data,    setData]    = useState<TxPage | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    transactionsApi.list({ page, limit:20, status:filter, search })
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter, page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [filter, search])

  return (
    <div className="space-y-4">
      <PageHeader title="Ledger" subtitle={data ? `${data.total_rows} transactions` : ''} />

      {/* Summary pills */}
      {data?.summary && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label:'Paid',    val:data.summary.paid_count,    color:'var(--green)' },
            { label:'Pending', val:data.summary.pending_count, color:'#f59e0b'      },
            { label:'Expired', val:data.summary.expired_count, color:'var(--ink-3)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center"
              style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
              <p className="font-mono font-bold text-lg tabular"
                style={{ fontFamily:'var(--font-jbmono)', color:s.color }}>
                {s.val}
              </p>
              <p className="text-[11px] text-ink-3 font-manrope">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="relative flex rounded-xl p-1"
        style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex-1 py-2 rounded-lg text-[11px] font-syne font-bold tracking-wide transition-all duration-200 relative z-10"
            style={{
              background: filter===f ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
              color:      filter===f ? '#fff' : 'var(--ink-3)',
              boxShadow:  filter===f ? '0 2px 12px rgba(124,58,237,0.3)' : 'none',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search order ID, UTR, purpose…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl pl-9 pr-4 text-xs font-manrope outline-none transition-all"
          style={{
            background:'var(--card)',
            border:'1px solid var(--bd)',
            color:'var(--ink-1)',
          }}
          onFocus={e => (e.target.style.borderColor='#7c3aed')}
          onBlur={e  => (e.target.style.borderColor='var(--bd)')}
        />
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
        </div>
      ) : data?.transactions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-3 font-manrope text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.transactions.map((tx, i) => (
            <TransactionRow key={tx.order_id} tx={tx} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-xs font-syne font-bold transition-all disabled:opacity-30"
            style={{ background:'var(--card)', border:'1px solid var(--bd)', color:'var(--ink-2)' }}
          >
            ← Prev
          </button>
          <span className="text-xs text-ink-3 font-manrope">
            {page} / {data.total_pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.total_pages, p+1))}
            disabled={page === data.total_pages}
            className="px-4 py-2 rounded-xl text-xs font-syne font-bold transition-all disabled:opacity-30"
            style={{ background:'var(--card)', border:'1px solid var(--bd)', color:'var(--ink-2)' }}
          >
            Next →
          </button>
        </div>
      )}

      {data?.summary.paid_volume && (
        <p className="text-center text-xs text-ink-4 font-manrope pb-2">
          Total confirmed volume: ₹{data.summary.paid_volume}
        </p>
      )}
    </div>
  )
}
