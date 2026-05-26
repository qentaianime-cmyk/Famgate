'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Envelope, Lock, ArrowRight, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { saveToken } from '@/lib/auth'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const res = await authApi.login(form)
      const data = res.data
      saveToken(data.token)
      setAuth(data)
      if (data.requires_setup) {
        router.push('/setup')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setServerError(err.response?.data?.error ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dim/60 via-void to-void" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 text-center px-12"
        >
          <div className="text-7xl font-bold text-gold/10 leading-none select-none mb-6">FAM</div>
          <p className="text-[#333] text-sm leading-relaxed max-w-xs">
            Accept UPI payments through FamPay.<br />
            Real-time email confirmation. Zero hassle.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {['Generate QR codes instantly', 'Gmail IMAP auto-confirmation', 'Webhook on every payment'].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                className="flex items-center gap-3 text-[#444] text-sm"
              >
                <Lightning size={14} className="text-gold/40" weight="fill" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-10">
            <Logo size={36} />
            <span className="text-white font-bold text-xl tracking-tight">FamSaaS</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="text-2xl font-bold text-white mb-1">
            Welcome back
          </motion.h1>
          <motion.p {...fadeUp(0.12)} className="text-[#555] text-sm mb-8">
            Sign in to your merchant dashboard
          </motion.p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div {...fadeUp(0.16)}>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Envelope size={16} />}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
              />
            </motion.div>

            <motion.div {...fadeUp(0.20)}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
              />
            </motion.div>

            {serverError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2"
              >
                {serverError}
              </motion.p>
            )}

            <motion.div {...fadeUp(0.24)} className="mt-2">
              <Button type="submit" loading={loading} className="w-full">
                Sign in <ArrowRight size={16} />
              </Button>
            </motion.div>
          </form>

          <motion.p {...fadeUp(0.28)} className="text-center text-[#444] text-sm mt-6">
            No account?{' '}
            <Link href="/auth/register" className="text-gold hover:text-yellow-400 transition-colors font-medium">
              Create one
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
