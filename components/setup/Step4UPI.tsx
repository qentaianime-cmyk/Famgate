'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, CurrencyInr, Confetti, Warning } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

export function Step4UPI({ onBack, direction }: StepProps) {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const token = useAuthStore(s => s.token)
  const merchantId = useAuthStore(s => s.merchantId)

  const [upi, setUpi] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const isValidUpi = upi.includes('@') && upi.length > 4

  const handleSubmit = async () => {
    if (!isValidUpi) {
      setError('Enter a valid UPI ID like name@upi or number@bank')
      return
    }
    setError('')
    setLoading(true)
    try {
      await settingsApi.save({ upi_id: upi })
      setDone(true)
      // Update store so requiresSetup becomes false
      if (token && merchantId) {
        useAuthStore.setState({ requiresSetup: false })
      }
      setTimeout(() => {
        router.push('/dashboard')
      }, 2800)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to save UPI ID.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepShell step={4} direction={direction}>
      <AnimatePresence mode="wait">
        {done ? (
          /* ── SUCCESS SCREEN ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 32px',
              textAlign: 'center',
            }}
          >
            {/* Animated ring */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)',
                  border: '2px solid rgba(34,197,94,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={40} color="#22C55E" weight="fill" />
              </motion.div>
              {/* Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 50,
                    y: Math.sin((i / 8) * Math.PI * 2) * 50,
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? '#F5A623' : '#22C55E',
                    marginTop: -3,
                    marginLeft: -3,
                  }}
                />
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10 }}
            >
              Gateway is live! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}
            >
              Your UPI ID <span style={{ color: '#F5A623' }}>{upi}</span> is connected.
              <br />Taking you to your dashboard...
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 2, ease: 'linear' }}
              style={{
                marginTop: 32,
                height: 2,
                background: '#F5A623',
                borderRadius: 1,
                width: 160,
                transformOrigin: 'left',
              }}
            />
          </motion.div>
        ) : (
          /* ── UPI FORM ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full px-6 pb-10 pt-6 max-w-lg mx-auto w-full"
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}
            >
              Set your UPI ID
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ color: '#555', fontSize: 14, marginBottom: 32 }}
            >
              Payments from your customers will go directly here
            </motion.p>

            <div style={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  UPI ID
                </label>
                <div style={{ position: 'relative' }}>
                  <CurrencyInr
                    size={16}
                    color="#444"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upi}
                    onChange={e => { setUpi(e.target.value); setError('') }}
                    style={{
                      width: '100%',
                      background: '#111',
                      border: `1px solid ${error ? '#7f1d1d' : isValidUpi ? 'rgba(34,197,94,0.4)' : '#222'}`,
                      borderRadius: 12,
                      padding: '13px 14px 13px 40px',
                      color: '#fff',
                      fontSize: 15,
                      fontFamily: 'var(--font-outfit), sans-serif',
                      outline: 'none',
                      letterSpacing: '0.02em',
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <AnimatePresence>
                    {isValidUpi && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <CheckCircle size={18} color="#22C55E" weight="fill" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Warning size={12} /> {error}
                  </p>
                )}

                <p style={{ fontSize: 12, color: '#333', marginTop: 8 }}>
                  Examples: aniket@fam · 9876543210@paytm · name@okicici
                </p>
              </motion.div>

              {/* Info cards */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {[
                  { emoji: '⚡', text: 'Money goes directly to your UPI-linked bank account' },
                  { emoji: '🔁', text: 'You can change this anytime from Settings' },
                  { emoji: '🧾', text: 'Works with FamPay, GPay, PhonePe, Paytm & all UPI apps' },
                ].map(({ emoji, text }) => (
                  <div
                    key={text}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 14px',
                      background: '#111',
                      borderRadius: 10,
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{emoji}</span>
                    <span style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
              <button
                onClick={handleSubmit}
                disabled={loading || !isValidUpi}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: isValidUpi && !loading ? '#F5A623' : '#1a1a1a',
                  border: `1px solid ${isValidUpi ? 'transparent' : '#222'}`,
                  borderRadius: 14,
                  color: isValidUpi && !loading ? '#000' : '#444',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isValidUpi && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  transition: 'all 0.25s ease',
                  boxShadow: isValidUpi ? '0 0 28px rgba(245,166,35,0.2)' : 'none',
                }}
              >
                {loading ? (
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #444', borderTopColor: '#F5A623', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <>Activate gateway 🚀</>
                )}
              </button>

              <button
                onClick={onBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#444',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  padding: '8px',
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  )
}
