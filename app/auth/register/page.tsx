'use client'
import { useEffect, useRef, useState } from 'react'
import { KineticText } from '@/components/ui/KineticText'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Envelope, Lock, User, ArrowRight, ArrowLeft, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { AnimatedBorderInput } from '@/components/ui/AnimatedBorderInput'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Logo } from '@/components/ui/Logo'
import { AvatarUpload } from '@/components/AvatarUpload'
import { authApi, meApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { saveToken } from '@/lib/auth'

type Step = 0 | 1

export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const setAv   = useAuthStore(s => s.setAvatar)

  const [step,    setStep]    = useState<Step>(0)
  const [form,    setForm]    = useState({ display_name: '', email: '', password: '', confirm: '' })
  const [avatar,  setAvatar]  = useState<string | null>(null)
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const [svrErr,  setSvrErr]  = useState('')
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
// Add these after the useState declarations:
const token = useAuthStore(s => s.token)
const [ready, setReady] = useState(false)

useEffect(() => { setReady(true) }, [])
useEffect(() => {
  if (!ready) return
  if (token) router.replace('/dashboard')
}, [ready, token, router])
  const animateIn = (delay = 0) => {
    gsap.fromTo('.reg-item',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power3.out', delay }
    )
  }

  useEffect(() => {
    gsap.fromTo('.reg-card',
      { y: 28, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' }
    )
    animateIn(0.15)
  }, [])

  useEffect(() => { animateIn(0) }, [step])

  const validate0 = () => {
    const e: Record<string, string> = {}
    if (form.display_name.trim().length < 2)         e.display_name = 'Min 2 characters'
    if (!form.email)                                  e.email        = 'Required'
    if (form.password.length < 8)                    e.password     = 'Min 8 characters'
    if (form.password !== form.confirm)               e.confirm      = "Passwords don't match"
    setErrors(e)
    return !Object.keys(e).length
  }

  const next = () => {
    if (step === 0 && !validate0()) {
      gsap.fromTo('.reg-card', { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
      return
    }
    setStep(1)
  }

  const submit = async () => {
    setSvrErr('')
    setLoading(true)
    try {
      const res  = await authApi.register({
        email:        form.email,
        password:     form.password,
        display_name: form.display_name,
      })
      const data = res.data
      saveToken(data.token)
      setAuth({ ...data, requires_setup: true })
      if (avatar) {
        try {
          const av = await meApi.uploadAvatar(avatar)
          setAv(av.data.avatar_url)
        } catch {}
      }
      router.push('/setup')
    } catch (e: any) {
      setSvrErr(e.response?.data?.error ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const STEPS = ['Account', 'Profile']

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.07) 0%, transparent 60%)`,
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="reg-card">
          {/* Logo */}
          <div className="reg-item flex items-center gap-3 mb-8">
            <Logo size={36} />
            <div>
              <span className="text-white font-bold text-lg tracking-tight">FamSaaS</span>
              <p className="text-zinc-600 text-xs">Payment Gateway</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="reg-item flex items-center gap-2 mb-6">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                  transition-all duration-300
                  ${i < step  ? 'bg-ember-500 text-white' :
                    i === step ? 'bg-ember-950 text-ember-400 ring-1 ring-ember-500/50' :
                                 'bg-zinc-900 text-zinc-600 ring-1 ring-zinc-800'}
                `}>
                  {i < step ? <Check size={11} weight="bold" /> : i + 1}
                </div>
                <span className={`text-xs font-medium transition-colors ${i === step ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px transition-colors ${i < step ? 'bg-ember-500/40' : 'bg-zinc-800'}`} />
                )}
              </div>
            ))}
          </div>

          <SpotlightCard className="p-8">
            {step === 0 ? (
              <>
                <div className="reg-item mb-6">
                  <KineticText
  text="Create account"
  as="h1"
  delay={0.1}
  className="text-[24px] font-bold text-white tracking-tight leading-tight mb-1"
/>
                  <p className="text-zinc-500 text-sm">Set up your merchant credentials</p>
                </div>

                <div className="space-y-4">
                  <div className="reg-item">
                    <AnimatedBorderInput
                      label="Display Name"
                      placeholder="Your name or business"
                      icon={<User size={15} />}
                      value={form.display_name}
                      onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                      error={errors.display_name}
                    />
                  </div>
                  <div className="reg-item">
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
                  <div className="reg-item">
                    <AnimatedBorderInput
                      label="Password"
                      type="password"
                      placeholder="Min 8 characters"
                      icon={<Lock size={15} />}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      error={errors.password}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="reg-item">
                    <AnimatedBorderInput
                      label="Confirm Password"
                      type="password"
                      placeholder="Repeat password"
                      icon={<Lock size={15} />}
                      value={form.confirm}
                      onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                      error={errors.confirm}
                      autoComplete="new-password"
                    />
                  </div>

                  {svrErr && (
                    <div className="reg-item rounded-lg bg-red-950/50 border border-red-900/50 px-3.5 py-2.5">
                      <p className="text-xs text-red-400">{svrErr}</p>
                    </div>
                  )}

                  <div className="reg-item pt-1">
                    <Button type="button" size="lg" onClick={next} className="w-full">
                      Continue <ArrowRight size={15} weight="bold" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="reg-item mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                    Add your photo
                  </h1>
                  <p className="text-zinc-500 text-sm">Optional — you can always do this later</p>
                </div>

                <div className="reg-item flex justify-center mb-6">
                  <AvatarUpload value={avatar} onChange={setAvatar} size={108} />
                </div>

                {svrErr && (
                  <div className="reg-item rounded-lg bg-red-950/50 border border-red-900/50 px-3.5 py-2.5 mb-4">
                    <p className="text-xs text-red-400">{svrErr}</p>
                  </div>
                )}

                <div className="reg-item flex gap-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(0)}
                    className="flex-1"
                  >
                    <ArrowLeft size={15} /> Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    loading={loading}
                    onClick={submit}
                    className="flex-[2]"
                  >
                    {avatar ? 'Create account' : 'Skip & create'}
                    <ArrowRight size={15} weight="bold" />
                  </Button>
                </div>
              </>
            )}
          </SpotlightCard>

          <p className="reg-item text-center text-zinc-600 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-ember-500 hover:text-ember-400 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
