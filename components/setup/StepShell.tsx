'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { X } from '@phosphor-icons/react'
import { Logo } from '@/components/ui/Logo'

interface StepShellProps {
  step: number          // 1-4
  totalSteps?: number
  children: React.ReactNode
  direction?: number    // 1 = forward, -1 = back
}

const STEPS = ['Gateway', 'Google', 'Connect', 'UPI']

export function StepShell({ step, totalSteps = 4, children, direction = 1 }: StepShellProps) {
  const router = useRouter()
  const progress = (step / totalSteps) * 100

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0A0A0A' }}
    >
      {/* Ambient glow — moves per step */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-20%',
          left: `${(step - 1) * 25}%`,
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
          transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 0,
        }}
      />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4"
        style={{ borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span style={{ color: '#555', fontSize: 13, fontWeight: 500 }}>Setup</span>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-1"
            >
              <div
                style={{
                  width: i + 1 === step ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i + 1 < step
                    ? '#F5A623'
                    : i + 1 === step
                    ? '#F5A623'
                    : '#222',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  opacity: i + 1 > step ? 0.4 : 1,
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#444',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: '#111', position: 'relative', zIndex: 10 }}>
        <motion.div
          style={{ height: '100%', background: '#F5A623', originX: 0 }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Step label */}
      <div className="relative z-10 px-6 pt-5 pb-1">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 11,
              color: '#F5A623',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Step {step} of {totalSteps}
          </span>
          <span style={{ color: '#333', fontSize: 11 }}>—</span>
          <span style={{ color: '#555', fontSize: 11 }}>{STEPS[step - 1]}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={{
              enter: (d: number) => ({
                opacity: 0,
                x: d * 60,
                filter: 'blur(4px)',
              }),
              center: {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
              },
              exit: (d: number) => ({
                opacity: 0,
                x: d * -60,
                filter: 'blur(4px)',
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
