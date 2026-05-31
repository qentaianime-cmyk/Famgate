'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Envelope, Lock, ArrowRight } from '@phosphor-icons/react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { GlowCard } from '@/components/ui/GlowCard'
import { KineticText } from '@/components/ui/KineticText'
import { FloatingOrb } from '@/components/ui/FloatingOrb'
import { AnimatedBorderInput } from '@/components/ui/AnimatedBorderInput'
import { Logo } from '@/components/ui/Logo'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { saveToken } from '@/lib/auth'

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const token   = useAuthStore(s => s.token)

  const [ready,    setReady]    = useState(false)
  const [form,     setForm]     = useState({ email: '', password: '' })
  const [errors,   setErrors]   = useState<Record<string,string>>({})
  const [svrErr,   setSvrErr]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [shake,    setShake]    = useState(false)

  // ── Auth guard: if already logged in, redirect away ────────────
  useEffect(() => { setReady(true) }, [])
  useEffect(() => {
    if (!ready) return
    if (token) router.replace('/dashboard')
  }, [ready, token, router])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.email)    e.email    = 'Required'
    if (!form.password) e.password = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) { triggerShake(); return }
    setLoading(true); setSvrErr('')
    try {
      const res  = await authApi.login(form)
      const data = res.data
      saveToken(data.token)
      setAuth(data)
      router.push(data.requires_setup ? '/setup' : '/dashboard')
    } catch (err: any) {
      setSvrErr(err.response?.data?.error ?? 'Invalid credentials.')
      triggerShake()
    } finally { setLoading(false) }
  }

  if (!ready) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-ember-500"
        style={{ animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  return (
    <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center px-5 overflow-hidden">
      {/* Ambient orbs */}
      <FloatingOrb size={500} color="rgba(249,115,22,0.07)" x="15%"  y="20%"  delay={0}   blur={100} />
      <FloatingOrb size={400} color="rgba(234,88,12,0.05)"  x="85%"  y="75%"  delay={2.5} blur={120} />
      <FloatingOrb size={300} color="rgba(249,115,22,0.04)" x="60%"  y="10%"  delay={4}   blur={90}  />

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.45,
        }}
      />

      <div className="relative z-10 w-full max-w-[360px]">
        {/* Logo — staggered letter entrance */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
          >
            <Logo size={38} />
          </motion.div>
          <div>
            {/* Kinetic letter-by-letter brand name */}
            <div className="flex overflow-hidden">
              {'FamSaaS'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="text-white font-bold text-lg tracking-tight"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 16,
                    stiffness: 200,
                    delay: 0.2 + i * 0.04,
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="text-zinc-600 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              Payment Gateway
            </motion.p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <GlowCard className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md">
            <div className="p-7">
              {/* Heading — word masked reveal */}
              <div className="mb-7">
                <KineticText
                  text="Welcome back"
                  as="h1"
                  delay={0.15}
                  stagger={0.08}
                  className="text-[26px] font-bold text-white tracking-tight leading-tight mb-1.5"
                />
                <motion.p
                  className="text-zinc-500 text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  Sign in to your merchant dashboard
                </motion.p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Inputs — staggered fade-up */}
                  {[
                    {
                      label: 'Email', type: 'email' as const,
                      placeholder: 'you@example.com',
                      icon: <Envelope size={15} />,
                      value: form.email,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm(f => ({ ...f, email: e.target.value })),
                      error: errors.email,
                      autoComplete: 'email',
                      delay: 0.3,
                    },
                    {
                      label: 'Password', type: 'password' as const,
                      placeholder: '••••••••',
                      icon: <Lock size={15} />,
                      value: form.password,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm(f => ({ ...f, password: e.target.value })),
                      error: errors.password,
                      autoComplete: 'current-password',
                      delay: 0.38,
                    },
                  ].map(({ delay, ...field }) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AnimatedBorderInput {...field} />
                    </motion.div>
                  ))}

                  {/* Server error */}
                  <AnimatePresence>
                    {svrErr && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-lg bg-red-950/60 border border-red-900/50 px-3.5 py-2.5">
                          <p className="text-xs text-red-400">{svrErr}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CTA — Magnetic */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48, duration: 0.5 }}
                    className="pt-1"
                  >
                    <MagneticButton
                      type="submit"
                      loading={loading}
                      className="w-full h-12"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#fff',
                        boxShadow: '0 1px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                      } as React.CSSProperties}
                    >
                      Sign in <ArrowRight size={15} weight="bold" />
                    </MagneticButton>
                  </motion.div>
                </div>
              </form>

              {/* Features — staggered */}
              <motion.div
                className="mt-6 pt-5 border-t border-zinc-800/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="space-y-2">
                  {[
                    'Auto-confirms via Gmail IMAP',
                    'Webhook on every payment',
                    'Real-time UPI QR generation',
                  ].map((feat, i) => (
                    <motion.div
                      key={feat}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + i * 0.08, duration: 0.4 }}
                    >
                      <div className="w-1 h-1 rounded-full bg-ember-500/60 shrink-0" />
                      <span className="text-xs text-zinc-600">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Footer link */}
        <motion.p
          className="text-center text-zinc-600 text-sm mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          No account?{' '}
          <Link
            href="/auth/register"
            className="text-ember-500 hover:text-ember-400 transition-colors font-medium underline underline-offset-4 decoration-ember-500/30 hover:decoration-ember-400/60"
          >
            Create one free
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
