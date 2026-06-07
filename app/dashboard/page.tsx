'use client'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import { useRouter } from 'next/navigation'
import { ArrowRight, Spinner, Warning } from '@phosphor-icons/react'
import { MetricCard }    from '@/components/dashboard/MetricCard'
import { VelocityChart } from '@/components/dashboard/VelocityChart'
import { TransactionRow }from '@/components/dashboard/TransactionRow'
import { useAuthStore }  from '@/store/authStore'
import { dashboardApi }  from '@/lib/api'
import { Logo }          from '@/components/ui/Logo'

interface Stats {
  requires_setup: boolean
  merchant: { display_name:string; avatar_url:string|null }
  metrics: {
    volume_raw:number; success_rate:number
    total_transactions:number; pending_count:number; paid_transactions:number
  }
  chart_data: { day:string; volume:string; orders:number }[]
  recent_transactions: any[]
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Late night,'
  if (h < 12) return 'Good morning,'
  if (h < 17) return 'Good afternoon,'
  if (h < 21) return 'Good evening,'
  return 'Good night,'
}

export default function DashboardPage() {
  const router     = useRouter()
  const displayName = useAuthStore(s => s.displayName)
  const avatarUrl   = useAuthStore(s => s.avatarUrl)

  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const greetRef     = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    dashboardApi.stats()
      .then(r => { setStats(r.data); setLoading(false) })
      .catch(() => { setError('Failed to load dashboard.'); setLoading(false) })
  }, [])

  useGSAP(() => {
    if (!stats || !containerRef.current) return

    const tl = gsap.timeline({ defaults:{ ease:'qash' } })

    // SplitText greeting
    if (greetRef.current) {
      const split = new SplitText(greetRef.current, {
        type:'lines,words', linesClass:'split-line', wordsClass:'split-word',
      })
      tl.from(split.words, { yPercent:110, opacity:0, stagger:0.05, duration:0.5 }, 0)
      tl.add(() => split.revert(), '+=0.1')
    }

    tl.from('.metric-card',  { y:20, opacity:0, scale:0.97, stagger:0.07, duration:0.5 }, 0.15)
    tl.from('.chart-section',{ y:16, opacity:0, duration:0.5 }, 0.3)
    tl.from('.tx-row',       { y:12, opacity:0, stagger:0.05, duration:0.4 }, 0.4)
  }, { scope:containerRef, dependencies:[stats] })

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
      <p className="text-xs text-ink-3 font-manrope">Loading your gateway…</p>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-2">
      <Warning size={28} color="var(--rose)" />
      <p className="text-sm text-ink-2 font-manrope">{error}</p>
    </div>
  )

  const m = stats!.metrics
  const chartData = stats!.chart_data.map(d => ({
    day:    d.day,
    volume: parseFloat(d.volume),
    orders: d.orders,
  }))

  return (
    <div ref={containerRef} className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs text-ink-3 font-manrope">{getGreeting()}</p>
          <h1
            ref={greetRef}
            className="font-syne font-bold text-[22px] text-ink-1 tracking-[-0.03em]"
            style={{ overflow:'hidden' }}
          >
            {displayName?.split(' ')[0] ?? 'Merchant'}
            {m.pending_count > 0 && (
              <span className="ml-2 text-sm font-manrope text-amber-400">
                · {m.pending_count} waiting
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background:'var(--green-bg)', border:'1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-glow" />
            <span className="text-[11px] font-syne font-bold text-green-400">Live</span>
          </div>
          {/* Avatar */}
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-violet/30" />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:'var(--surface)', border:'1px solid var(--bd)' }}>
              <Logo size={20} animate={false} />
            </div>
          )}
        </div>
      </div>

      {/* Setup banner */}
      {stats!.requires_setup && (
        <button
          onClick={() => router.push('/setup')}
          className="w-full rounded-2xl p-4 text-left transition-all duration-200 animate-fade-up"
          style={{
            background:'rgba(124,58,237,0.08)',
            border:'1px solid rgba(124,58,237,0.25)',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(124,58,237,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(124,58,237,0.25)')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-syne font-bold text-sm text-violet-hi mb-0.5">
                Complete setup
              </p>
              <p className="text-xs text-ink-2 font-manrope">
                Connect Gmail + UPI to start accepting payments
              </p>
            </div>
            <ArrowRight size={18} className="text-violet-hi shrink-0 ml-3" />
          </div>
          {/* Pulsing progress bar */}
          <div className="mt-3 h-0.5 rounded overflow-hidden" style={{ background:'var(--raised)' }}>
            <div className="h-full w-1/4 rounded animate-shimmer"
              style={{ background:'linear-gradient(90deg,#7c3aed,#4f46e5,#7c3aed)', backgroundSize:'200% 100%' }} />
          </div>
        </button>
      )}

      {/* Metric bento grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="metric-card">
          <MetricCard
            label="Total Volume"
            value={m.volume_raw}
            prefix="₹"
            sub="All time"
            delay={0}
            format={n => n.toLocaleString('en-IN', { maximumFractionDigits:0 })}
          />
        </div>
        <div className="metric-card">
          <MetricCard
            label="Success Rate"
            value={m.success_rate}
            suffix="%"
            sub={`${m.paid_transactions} paid`}
            delay={0.08}
          />
        </div>
        <div className="metric-card">
          <MetricCard
            label="Total Orders"
            value={m.total_transactions}
            sub="All time"
            delay={0.16}
          />
        </div>
        <div className="metric-card">
          <MetricCard
            label="Pending"
            value={m.pending_count}
            sub="Awaiting confirm"
            pulse={m.pending_count > 0}
            pulseColor="#f59e0b"
            delay={0.24}
          />
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-section rounded-2xl p-4"
          style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
                7-Day Volume
              </p>
              <p className="text-xs text-ink-4 font-manrope mt-0.5">
                ₹{chartData.reduce((s,d) => s+d.volume, 0).toLocaleString('en-IN', { maximumFractionDigits:0 })} this week
              </p>
            </div>
          </div>
          <VelocityChart data={chartData} height={100} />
        </div>
      )}

      {/* Recent transactions */}
      {stats!.recent_transactions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
              Recent
            </p>
            <button
              onClick={() => router.push('/dashboard/transactions')}
              className="text-xs text-violet-hi font-manrope hover:text-violet transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {stats!.recent_transactions.slice(0,5).map((tx, i) => (
              <div key={tx.order_id} className="tx-row">
                <TransactionRow tx={tx} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
