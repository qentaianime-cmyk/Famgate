'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { Envelope, Lock, ArrowRight, Lightning } from '@phosphor-icons/react'
import { gsap, SplitText } from '@/lib/gsap'
import { MagneticButton }  from '@/components/ui/MagneticButton'
import { GlassCard }        from '@/components/ui/GlassCard'
import { AnimatedInput }    from '@/components/ui/AnimatedInput'
import { Logo }             from '@/components/ui/Logo'
import { authApi }          from '@/lib/api'
import { useAuthStore }     from '@/store/authStore'
import { saveToken }        from '@/lib/auth'

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const token   = useAuthStore(s => s.token)

  const [ready,   setReady]   = useState(false)
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState<Record<string,string>>({})
  const [svrErr,  setSvrErr]  = useState('')
  const [loading, setLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const headingRef   = useRef<HTMLHeadingElement>(null)

  // ── Auth guard ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
    setReady(true)
  }, [])
  useEffect(() => {
    if (ready && token) router.replace('/dashboard')
  }, [ready, token, router])

  // ── GSAP entrance timeline ──────────────────────────────
  useGSAP(() => {
    if (!containerRef.current || !ready) return

    const tl = gsap.timeline({ defaults: { ease: 'qash' } })

    // Card rises
    tl.from(cardRef.current, {
      y: 40, opacity: 0, scale: 0.95,
      duration: 0.7,
    })

    // Heading — SplitText word reveal
    if (headingRef.current) {
      const split = new SplitText(headingRef.current, {
        type: 'lines,words',
        linesClass: 'split-line',
        wordsClass:  'split-word',
      })
      tl.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
      }, '-=0.45')
      // cleanup on unmount
      return () => split.revert()
    }
  }, { scope: containerRef, dependencies: [ready] })

  const shake = () => {
    gsap.fromTo(cardRef.current,
      { x: -10 },
      { x: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }
    )
  }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.email)    e.email    = 'Required'
    if (!form.password) e.password = 'Required'
    setErrors(e); return !Object.keys(e).length
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) { shake(); return }
    setLoading(true); setSvrErr('')
    try {
      const res  = await authApi.login(form)
      const data = res.data
      saveToken(data.token)
      setAuth(data)
      router.push(data.requires_setup ? '/setup' : '/dashboard')
    } catch (err: any) {
      setSvrErr(err.response?.data?.error ?? 'Invalid credentials.')
      shake()
    } finally { setLoading(false) }
  }

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#07070f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-5 py-12 overflow-hidden"
      style={{ background:'var(--bg)' }}
    >
      {/* ── Mesh blobs ── */}
      <div className="absolute pointer-events-none overflow-hidden inset-0">
        <div className="absolute animate-blob-a rounded-full opacity-60"
          style={{ width:500, height:500, left:'-10%', top:'-15%',
            background:'radial-gradient(circle, #3b0764 0%, transparent 70%)' }} />
        <div className="absolute animate-blob-b rounded-full opacity-40"
          style={{ width:400, height:400, right:'-5%', bottom:'-10%',
            background:'radial-gradient(circle, #1e1b4b 0%, transparent 70%)' }} />
        <div className="absolute animate-blob-c rounded-full opacity-25"
          style={{ width:300, height:300, left:'45%', top:'40%',
            background:'radial-gradient(circle, #0c4a6e 0%, transparent 70%)' }} />
      </div>

      {/* ── Dot grid ── */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-[380px]">
        {/* Logo + brand */}
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <Logo size={38} animate />
          <div>
            <div className="overflow-hidden">
              <div className="flex flex-nowrap items-center">
                {'Qash'.split('').map((c, i) => (
                  <span
                    key={i}
                    className="font-syne font-bold text-xl text-ink-1 inline-block"
                    style={{
                      animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s both`,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-ink-3 font-manrope mt-0.5"
              style={{ animation:'fade-up 0.4s ease 0.45s both' }}>
              Payment Gateway
            </p>
          </div>
        </div>

        {/* Card */}
        <div ref={cardRef}>
          <GlassCard className="p-7">
            {/* Heading */}
            <div className="mb-7">
              <h1
                ref={headingRef}
                className="font-syne font-bold text-[28px] text-ink-1 tracking-[-0.04em] leading-[1.1] mb-2"
                style={{ overflow:'hidden' }}
              >
                Welcome back
              </h1>
              <p className="text-ink-2 text-sm font-manrope">
                Sign in to your merchant dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              <AnimatedInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Envelope size={15} />}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
              />
              <AnimatedInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={15} />}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
              />

              {svrErr && (
                <div className="rounded-xl px-4 py-3 text-xs font-manrope"
                  style={{ background:'var(--rose-bg)', border:'1px solid rgba(244,63,94,0.2)', color:'var(--rose)' }}>
                  {svrErr}
                </div>
              )}

              <div className="pt-1">
                <MagneticButton
                  type="submit"
                  loading={loading}
                  className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight"
                >
                  Sign in <ArrowRight size={15} weight="bold" />
                </MagneticButton>
              </div>
            </form>

            {/* Feature pills */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor:'var(--bd)' }}>
              <div className="flex flex-col gap-2">
                {['Auto-confirms via Gmail IMAP','Webhook on every payment','Real-time UPI QR'].map((f,i) => (
                  <div key={f} className="flex items-center gap-2"
                    style={{ animation:`fade-up 0.4s ease ${0.7 + i*0.08}s both` }}>
                    <Lightning size={11} className="text-violet-hi shrink-0" weight="fill" />
                    <span className="text-xs text-ink-3 font-manrope">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <p className="text-center text-ink-3 text-sm font-manrope mt-5"
          style={{ animation:'fade-up 0.4s ease 0.9s both' }}>
          No account?{' '}
          <Link href="/auth/register"
            className="text-violet-hi hover:text-violet font-semibold underline underline-offset-4
              decoration-violet-hi/30 hover:decoration-violet/60 transition-all">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
