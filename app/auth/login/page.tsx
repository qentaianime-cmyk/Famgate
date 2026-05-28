'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Envelope, Lock, ArrowRight, Lightning, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { AnimatedBorderInput } from '@/components/ui/AnimatedBorderInput'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Logo } from '@/components/ui/Logo'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { saveToken } from '@/lib/auth'

const FEATURES = [
  'Auto-confirms payments via Gmail IMAP',
  'Webhook fires on every successful pay',
  'Real-time UPI QR for every order',
]

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const containerRef = useRef<HTMLDivElement>(null)

  const [form,        setForm]        = useState({ email: '', password: '' })
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading,     setLoading]     = useState(false)

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.login-card',
        { y: 32, opacity: 0, scale: 0.97 },
        { y: 0,  opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
      )
      gsap.fromTo('.login-item',
        { y: 20, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.2 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Shake on error
  const shakeCard = () => {
    gsap.fromTo('.login-card',
      { x: -8 },
      { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' }
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) { shakeCard(); return }
    setLoading(true)
    setServerError('')
    try {
      const res  = await authApi.login(form)
      const data = res.data
      saveToken(data.token)
      setAuth(data)
      router.push(data.requires_setup ? '/setup' : '/dashboard')
    } catch (err: any) {
      setServerError(err.response?.data?.error ?? 'Something went wrong.')
      shakeCard()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.08) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(249,115,22,0.04) 0%, transparent 40%)
        `,
      }}
    >
      {/* Dot grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="login-card">
          <div className="login-item flex items-center gap-3 mb-8">
            <Logo size={36} />
            <div>
              <span className="text-white font-bold text-lg tracking-tight">FamSaaS</span>
              <p className="text-zinc-600 text-xs">Payment Gateway</p>
            </div>
          </div>

          <SpotlightCard className="p-8">
            <div className="login-item mb-7">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                Welcome back
              </h1>
              <p className="text-zinc-500 text-sm">Sign in to your merchant dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="login-item">
                <AnimatedBorderInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Envelope size={15} />}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="login-item">
                <AnimatedBorderInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </div>

              {serverError && (
                <div className="login-item rounded-lg bg-red-950/50 border border-red-900/50 px-3.5 py-2.5">
                  <p className="text-xs text-red-400">{serverError}</p>
                </div>
              )}

              <div className="login-item pt-1">
                <Button type="submit" size="lg" loading={loading} className="w-full">
                  Sign in <ArrowRight size={15} weight="bold" />
                </Button>
              </div>
            </form>

            {/* Features */}
            <div className="login-item mt-6 pt-6 border-t border-zinc-800/60">
              <div className="space-y-2">
                {FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Lightning size={12} className="text-ember-500 shrink-0" weight="fill" />
                    <span className="text-xs text-zinc-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          <p className="login-item text-center text-zinc-600 text-sm mt-5">
            No account?{' '}
            <Link href="/auth/register" className="text-ember-500 hover:text-ember-400 transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
