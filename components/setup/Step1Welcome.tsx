'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Lightning, QrCode, Bell, ArrowsSplit } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { useAuthStore } from '@/store/authStore'

interface StepProps {
  onNext: () => void
  onBack: () => void
  direction: number
}

const features = [
  { icon: QrCode,   label: 'Generate UPI QR codes instantly',      delay: 0.5 },
  { icon: Bell,     label: 'Gmail auto-confirms every payment',     delay: 0.65 },
  { icon: Webhook,  label: 'Webhook fires on each successful pay',  delay: 0.80 },
]

export function Step1Welcome({ onNext, direction }: StepProps) {
  const displayName = useAuthStore(s => s.displayName)

  return (
    <StepShell step={1} direction={direction}>
      <div className="flex flex-col justify-between h-full px-6 pb-10 pt-8 max-w-lg mx-auto w-full">

        {/* Hero text */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid rgba(245,166,35,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
            }}
          >
            <Lightning size={28} color="#F5A623" weight="fill" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(28px, 8vw, 40px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            {displayName ? `Hey ${displayName.split(' ')[0]},` : 'Welcome.'}
            <br />
            <span style={{ color: '#F5A623' }}>Let's arm</span> your
            <br />gateway.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: '#666', fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}
          >
            Takes about 3 minutes. You'll connect your Gmail
            and UPI ID so payments start landing automatically.
          </motion.p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map(({ icon: Icon, label, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: '#111',
                  borderRadius: 12,
                  border: '1px solid #1e1e1e',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(245,166,35,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color="#F5A623" />
                </div>
                <span style={{ color: '#aaa', fontSize: 14 }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 40 }}
        >
          <button
            onClick={onNext}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: '#F5A623',
              border: 'none',
              borderRadius: 14,
              color: '#000',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-outfit), sans-serif',
              boxShadow: '0 0 32px rgba(245,166,35,0.25)',
            }}
          >
            Begin setup <ArrowRight size={18} />
          </button>
          <p style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 12 }}>
            You can always do this later from Settings
          </p>
        </motion.div>

      </div>
    </StepShell>
  )
}
