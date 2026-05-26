'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, GoogleLogo, Lock, Shield, Key } from '@phosphor-icons/react'
import { StepShell } from './StepShell'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

const INSTRUCTIONS = [
  {
    step: 1,
    icon: GoogleLogo,
    color: '#4285F4',
    title: 'Open Google Account',
    desc: 'Go to myaccount.google.com or click your profile photo → "Manage your Google Account"',
    tag: 'myaccount.google.com',
  },
  {
    step: 2,
    icon: Shield,
    color: '#34A853',
    title: 'Click "Security" tab',
    desc: 'In the top navigation bar, find and click the "Security" tab.',
    tag: 'Security tab',
  },
  {
    step: 3,
    icon: Lock,
    color: '#FBBC05',
    title: 'Enable 2-Step Verification',
    desc: 'Scroll to "How you sign in to Google". Click "2-Step Verification" and turn it ON. This is required for App Passwords.',
    tag: '2-Step Verification → ON',
  },
  {
    step: 4,
    icon: Key,
    color: '#F5A623',
    title: 'Generate App Password',
    desc: 'After enabling 2FA, search for "App Passwords" in the search bar. Select app: "Mail", device: "Other" → type "FamSaaS" → click Generate.',
    tag: 'App Passwords → Generate',
  },
]

export function Step2Google({ onNext, onBack, direction }: StepProps) {
  const [activeStep, setActiveStep] = useState(0)
  const current = INSTRUCTIONS[activeStep]
  const Icon = current.icon

  return (
    <StepShell step={2} direction={direction}>
      <div className="flex flex-col h-full px-6 pb-10 pt-6 max-w-lg mx-auto w-full">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}
        >
          Get your App Password
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#555', fontSize: 14, marginBottom: 28 }}
        >
          Follow these 4 steps inside your Google Account
        </motion.p>

        {/* Instruction card */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 20,
                padding: 24,
                marginBottom: 20,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${current.color}15`,
                border: `1px solid ${current.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Icon size={26} color={current.color} weight="fill" />
              </div>

              {/* Step badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: `${current.color}15`,
                border: `1px solid ${current.color}25`,
                borderRadius: 20,
                padding: '3px 10px',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 11, color: current.color, fontWeight: 700 }}>
                  STEP {current.step} OF 4
                </span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                {current.title}
              </h2>
              <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, marginBottom: 16 }}>
                {current.desc}
              </p>

              {/* Tag pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                padding: '6px 12px',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: current.color }} />
                <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>
                  {current.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {INSTRUCTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  width: i === activeStep ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === activeStep ? '#F5A623' : i < activeStep ? '#8B5E1A' : '#222',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Prev / Next within the card */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(s => s - 1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid #222',
                  borderRadius: 12,
                  color: '#aaa',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-outfit), sans-serif',
                }}
              >
                ← Previous
              </button>
            )}
            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(s => s + 1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-outfit), sans-serif',
                }}
              >
                Next step →
              </button>
            ) : (
              <button
                onClick={onNext}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#F5A623',
                  border: 'none',
                  borderRadius: 12,
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-outfit), sans-serif',
                }}
              >
                I have my password <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Back */}
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
            gap: 6,
            fontFamily: 'var(--font-outfit), sans-serif',
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

      </div>
    </StepShell>
  )
}
