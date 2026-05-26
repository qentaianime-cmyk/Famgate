'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Envelope, CheckCircle, Warning } from '@phosphor-icons/react'
import { StepShell } from './StepShell'
import { settingsApi } from '@/lib/api'

interface StepProps { onNext: () => void; onBack: () => void; direction: number }

export function Step3Gmail({ onNext, onBack, direction }: StepProps) {
  const [gmail, setGmail] = useState('')
  const [appPass, setAppPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gmailError, setGmailError] = useState('')

  // Format app password: insert space every 4 chars for readability
  const formatAppPass = (val: string) => {
    const clean = val.replace(/\s/g, '').toLowerCase().slice(0, 16)
    return clean.match(/.{1,4}/g)?.join(' ') ?? clean
  }

  const cleanPass = appPass.replace(/\s/g, '')
  const passProgress = cleanPass.length
  const passComplete = passProgress === 16

  const handleSubmit = async () => {
    setError('')
    setGmailError('')

    if (!gmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
      setGmailError('Enter a valid Gmail address')
      return
    }
    if (!passComplete) {
      setError('App Password must be exactly 16 characters')
      return
    }

    setLoading(true)
    try {
      await settingsApi.save({
        gmail_user: gmail,
        gmail_app_password: cleanPass,
      })
      onNext()
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepShell step={3} direction={direction}>
      <div className="flex flex-col h-full px-6 pb-10 pt-6 max-w-lg mx-auto w-full">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}
        >
          Connect Gmail
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#555', fontSize: 14, marginBottom: 32 }}
        >
          We read payment confirmation emails to auto-verify payments
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

          {/* Gmail input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Gmail Address
            </label>
            <div style={{ position: 'relative' }}>
              <Envelope
                size={16}
                color="#444"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={gmail}
                onChange={e => { setGmail(e.target.value); setGmailError('') }}
                style={{
                  width: '100%',
                  background: '#111',
                  border: `1px solid ${gmailError ? '#7f1d1d' : '#222'}`,
                  borderRadius: 12,
                  padding: '13px 14px 13px 40px',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  outline: 'none',
                }}
              />
            </div>
            {gmailError && (
              <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Warning size={12} /> {gmailError}
              </p>
            )}
          </motion.div>

          {/* App password — segmented display */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              16-Character App Password
            </label>

            {/* Segmented blocks */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[0, 1, 2, 3].map(groupIdx => (
                <div
                  key={groupIdx}
                  style={{
                    flex: 1,
                    background: '#111',
                    border: `1px solid ${
                      cleanPass.length >= (groupIdx + 1) * 4
                        ? '#F5A623'
                        : cleanPass.length >= groupIdx * 4
                        ? '#8B5E1A'
                        : '#1e1e1e'
                    }`,
                    borderRadius: 10,
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: 15,
                    letterSpacing: '0.15em',
                    color: cleanPass.length >= (groupIdx + 1) * 4 ? '#F5A623' : '#444',
                    transition: 'all 0.2s ease',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  {cleanPass.slice(groupIdx * 4, (groupIdx + 1) * 4).padEnd(4, '·')}
                </div>
              ))}
            </div>

            {/* Actual input */}
            <input
              type="text"
              placeholder="Paste or type your 16-character app password"
              value={appPass}
              onChange={e => {
                setAppPass(formatAppPass(e.target.value))
                setError('')
              }}
              maxLength={19} // 16 chars + 3 spaces
              style={{
                width: '100%',
                background: '#111',
                border: `1px solid ${error ? '#7f1d1d' : '#222'}`,
                borderRadius: 12,
                padding: '13px 14px',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                outline: 'none',
              }}
            />

            {/* Progress bar */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 3, background: '#1a1a1a', borderRadius: 2 }}>
                <motion.div
                  animate={{ width: `${(passProgress / 16) * 100}%` }}
                  transition={{ duration: 0.2 }}
                  style={{
                    height: '100%',
                    background: passComplete ? '#22C55E' : '#F5A623',
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: passComplete ? '#22C55E' : '#555', minWidth: 32 }}>
                {passProgress}/16
              </span>
              <AnimatePresence>
                {passComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle size={16} color="#22C55E" weight="fill" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Warning size={12} /> {error}
              </p>
            )}
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(245,166,35,0.05)',
              border: '1px solid rgba(245,166,35,0.12)',
              borderRadius: 12,
              padding: '14px 16px',
            }}
          >
            <p style={{ fontSize: 12, color: '#8B5E1A', lineHeight: 1.6 }}>
              🔒 Your App Password is encrypted with AES-256 before storage.
              We never store your main Google password.
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#3D2A0A' : '#F5A623',
              border: 'none',
              borderRadius: 14,
              color: loading ? '#8B5E1A' : '#000',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-outfit), sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #8B5E1A', borderTopColor: '#F5A623', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>Save & continue <ArrowRight size={18} /></>
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
            <ArrowLeft size={14} /> Back to walkthrough
          </button>
        </div>

      </div>
    </StepShell>
  )
}
