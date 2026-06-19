'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { AnimatedInput }  from '@/components/ui/AnimatedInput'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { verifyApi }      from '@/lib/api'

interface Props {
  open:      boolean
  orderId:   string
  amount:    number
  onClose:   () => void
  onSuccess: () => void
}

export function ManualVerifyModal({ open, orderId, amount, onClose, onSuccess }: Props) {
  const [utr,     setUtr]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const submit = async () => {
    setError('')
    if (!/^\d{10,}$/.test(utr)) {
      setError('UTR must be at least 10 digits'); return
    }
    setLoading(true)
    try {
      await verifyApi.manual({ order_id: orderId, utr })
      onSuccess()
      onClose()
      setUtr('')
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
            initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
            transition={{ type:'spring', stiffness:400, damping:40 }}
            style={{
              background:'var(--depth)', border:'1px solid rgba(124,58,237,0.2)',
              borderBottom:'none', borderRadius:'24px 24px 0 0',
              padding:'28px 24px', paddingBottom:'calc(28px + env(safe-area-inset-bottom))',
            }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background:'var(--raised)' }} />
            <button onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'var(--surface)', border:'1px solid var(--bd)', color:'var(--ink-3)' }}>
              <X size={14} />
            </button>

            <h2 className="font-syne font-bold text-lg text-ink-1 mb-1">Manual UTR Verification</h2>
            <p className="text-sm text-ink-2 font-manrope mb-5">
              For payments from GPay/PhonePe with no order reference. Enter the UTR from the payment confirmation.
            </p>

            <div className="rounded-xl px-4 py-3 mb-4"
              style={{ background:'var(--surface)', border:'1px solid var(--bd)' }}>
              <p className="text-[11px] text-ink-3 font-manrope">Order</p>
              <p className="font-mono text-sm text-ink-1" style={{ fontFamily:'var(--font-jbmono)' }}>
                {orderId} · ₹{amount}
              </p>
            </div>

            <AnimatedInput
              label="UTR / Transaction Reference"
              placeholder="123456789012"
              value={utr}
              onChange={e => setUtr(e.target.value.replace(/\D/g, ''))}
              error={error}
            />

            <MagneticButton type="button" loading={loading} onClick={submit}
              className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight mt-4">
              <CheckCircle size={15} weight="bold" /> Mark as Paid
            </MagneticButton>

            <p className="text-center text-[11px] text-ink-4 font-manrope mt-3 flex items-center justify-center gap-1">
              <WarningCircle size={11} /> Only verify UTRs you've personally confirmed
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
