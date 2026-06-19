'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CurrencyInr, Tag, QrCode, CheckCircle, ArrowLeft, Clock } from '@phosphor-icons/react'
import { PageHeader }      from '@/components/dashboard/PageHeader'
import { AnimatedInput }   from '@/components/ui/AnimatedInput'
import { MagneticButton }  from '@/components/ui/MagneticButton'
import { ordersApi, transactionsApi } from '@/lib/api'

interface OrderResult {
  order_id: string; amount: number; purpose: string
  qr_code: string; upi_link: string; expires_at: number
}

export default function CreateOrderPage() {
  const router = useRouter()
  const [amount,  setAmount]  = useState('')
  const [purpose, setPurpose] = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [order,   setOrder]   = useState<OrderResult | null>(null)
  const [status,  setStatus]  = useState<'PENDING'|'PAID'|'EXPIRED'>('PENDING')
  const [secsLeft, setSecsLeft] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const createOrder = async () => {
    setError('')
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Enter a valid amount'); return }
    if (!purpose.trim())  { setError('Enter a purpose');      return }

    setLoading(true)
    try {
      const res = await ordersApi.create({ amount: amt, purpose: purpose.trim() })
      setOrder(res.data)
      setStatus('PENDING')
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Failed to create order.')
    } finally {
      setLoading(false)
    }
  }

  // Countdown + polling
  useEffect(() => {
    if (!order) return

    const tick = () => {
      const left = order.expires_at - Math.floor(Date.now() / 1000)
      setSecsLeft(Math.max(0, left))
      if (left <= 0) setStatus('EXPIRED')
    }
    tick()
    const countdown = setInterval(tick, 1000)

    pollRef.current = setInterval(async () => {
      try {
        const res = await transactionsApi.list({ page: 1, limit: 1, search: order.order_id })
        const tx  = res.data.transactions?.[0]
        if (tx?.status === 'PAID') {
          setStatus('PAID')
          clearInterval(pollRef.current!)
          clearInterval(countdown)
        }
      } catch {}
    }, 4000)

    return () => {
      clearInterval(countdown)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [order])

  const reset = () => {
    setOrder(null); setAmount(''); setPurpose(''); setStatus('PENDING')
  }

  const mins = Math.floor(secsLeft / 60)
  const secs = secsLeft % 60

  return (
    <div className="space-y-5">
      <PageHeader title="New Order" subtitle="Create & show a QR instantly" back />

      {!order ? (
        <div className="space-y-4">
          <AnimatedInput
            label="Amount"
            type="number"
            placeholder="499"
            icon={<CurrencyInr size={15} />}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <AnimatedInput
            label="Purpose"
            placeholder="Pro Plan / Order #123"
            icon={<Tag size={15} />}
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
          />
          {error && (
            <div className="rounded-xl px-4 py-3 text-xs font-manrope"
              style={{ background:'var(--rose-bg)', border:'1px solid rgba(244,63,94,0.2)', color:'var(--rose)' }}>
              {error}
            </div>
          )}
          <MagneticButton type="button" loading={loading} onClick={createOrder}
            className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight">
            <QrCode size={16} weight="bold" /> Generate QR
          </MagneticButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">

          {/* QR */}
          <div className="rounded-2xl p-4 bg-white">
            <img src={order.qr_code} alt="Payment QR" width={240} height={240} />
          </div>

          {/* Amount + purpose */}
          <div className="text-center">
            <p className="font-mono font-bold text-3xl text-ink-1"
              style={{ fontFamily:'var(--font-jbmono)' }}>
              ₹{order.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-ink-2 text-sm font-manrope mt-1">{order.purpose}</p>
            <p className="text-ink-4 text-xs font-mono mt-1"
              style={{ fontFamily:'var(--font-jbmono)' }}>
              {order.order_id}
            </p>
          </div>

          {/* Status */}
          {status === 'PENDING' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)' }}>
              <Clock size={15} color="#f59e0b" />
              <span className="text-xs font-syne font-bold" style={{ color:'#f59e0b' }}>
                Waiting for payment · {mins}:{secs.toString().padStart(2,'0')}
              </span>
            </div>
          )}

          {status === 'PAID' && (
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle size={48} color="var(--green)" weight="fill" />
              <p className="font-syne font-bold text-lg" style={{ color:'var(--green)' }}>
                Payment confirmed!
              </p>
            </div>
          )}

          {status === 'EXPIRED' && (
            <div className="px-4 py-2 rounded-xl text-xs font-syne font-bold"
              style={{ background:'var(--bg-2)', border:'1px solid var(--bd)', color:'var(--ink-3)' }}>
              Order expired
            </div>
          )}

          <MagneticButton type="button" onClick={reset}
            className="w-full h-12 rounded-xl text-sm text-ink-1 bg-raised ring-1 ring-ink-4 font-syne font-bold tracking-tight">
            <ArrowLeft size={15} /> Create another order
          </MagneticButton>
        </div>
      )}
    </div>
  )
}
