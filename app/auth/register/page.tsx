'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { Envelope, Lock, User, ArrowRight, ArrowLeft, Check } from '@phosphor-icons/react'
import { gsap, SplitText } from '@/lib/gsap'
import { MagneticButton }  from '@/components/ui/MagneticButton'
import { GlassCard }        from '@/components/ui/GlassCard'
import { AnimatedInput }    from '@/components/ui/AnimatedInput'
import { AvatarUpload }     from '@/components/AvatarUpload'
import { Logo }             from '@/components/ui/Logo'
import { authApi, meApi }   from '@/lib/api'
import { useAuthStore }     from '@/store/authStore'
import { saveToken }        from '@/lib/auth'
import { cn }               from '@/lib/utils'

type Step = 0 | 1

export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const setAv   = useAuthStore(s => s.setAvatar)
  const token   = useAuthStore(s => s.token)

  const [ready,   setReady]   = useState(false)
  const [step,    setStep]    = useState<Step>(0)
  const [form,    setForm]    = useState({ display_name:'', email:'', password:'', confirm:'' })
  const [avatar,  setAvatar]  = useState<string|null>(null)
  const [errors,  setErrors]  = useState<Record<string,string>>({})
  const [svrErr,  setSvrErr]  = useState('')
  const [loading, setLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const headRef      = useRef<HTMLHeadingElement>(null)

  // Auth guard
  useEffect(() => { window.scrollTo(0,0); setReady(true) }, [])
  useEffect(() => { if (ready && token) router.replace('/dashboard') }, [ready, token, router])

  useGSAP(() => {
    if (!cardRef.current || !ready) return
    gsap.from(cardRef.current, { y:36, opacity:0, scale:0.95, duration:0.65, ease:'qash' })
  }, { scope: containerRef, dependencies: [ready] })

  useGSAP(() => {
    if (!headRef.current) return
    const split = new SplitText(headRef.current, {
      type: 'lines,words', linesClass:'split-line', wordsClass:'split-word',
    })
    gsap.from(split.words, { yPercent:110, opacity:0, duration:0.5, stagger:0.06, ease:'qash' })
    return () => split.revert()
  }, { scope: containerRef, dependencies: [step] })

  const validate0 = () => {
    const e: Record<string,string> = {}
    if (form.display_name.trim().length < 2) e.display_name = 'Min 2 chars'
    if (!form.email)                         e.email        = 'Required'
    if (form.password.length < 8)            e.password     = 'Min 8 characters'
    if (form.password !== form.confirm)      e.confirm      = "Passwords don't match"
    setErrors(e); return !Object.keys(e).length
  }

  const next = () => {
    if (step === 0) {
      if (!validate0()) {
        gsap.fromTo(cardRef.current, { x:-10 }, { x:0, duration:0.5, ease:'elastic.out(1,0.4)' })
        return
      }
      setStep(1)
    }
  }

  const submit = async () => {
    setSvrErr(''); setLoading(true)
    try {
      const res  = await authApi.register({ email:form.email, password:form.password, display_name:form.display_name })
      const data = res.data
      saveToken(data.token)
      setAuth({ ...data, requires_setup:true })
      if (avatar) {
        try { const av = await meApi.uploadAvatar(avatar); setAv(av.data.avatar_url) } catch {}
      }
      router.push('/setup')
    } catch (e:any) {
      setSvrErr(e.response?.data?.error ?? 'Registration failed.')
    } finally { setLoading(false) }
  }

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#07070f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
    </div>
  )

  const STEPS = ['Account','Profile']

  return (
    <div ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-5 py-12 overflow-hidden"
      style={{ background:'var(--bg)' }}>

      {/* Mesh blobs */}
      <div className="absolute pointer-events-none inset-0 overflow-hidden">
        <div className="absolute animate-blob-a rounded-full opacity-50"
          style={{ width:450, height:450, left:'-8%', top:'-12%',
            background:'radial-gradient(circle, #3b0764 0%, transparent 70%)' }} />
        <div className="absolute animate-blob-c rounded-full opacity-35"
          style={{ width:350, height:350, right:'-5%', bottom:'-8%',
            background:'radial-gradient(circle, #1e1b4b 0%, transparent 70%)' }} />
      </div>
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:'radial-gradient(circle, rgba(139,92,246,0.12) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
        }} />

      <div className="relative z-10 w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 animate-fade-up">
          <Logo size={36} animate={false} />
          <span className="font-syne font-bold text-xl text-ink-1">Qash</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 animate-fade-up d-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-syne transition-all duration-300',
                i < step  ? 'bg-violet text-white' :
                i === step ? 'bg-violet/20 text-violet-hi ring-1 ring-violet/50' :
                             'bg-raised text-ink-3 ring-1 ring-ink-4'
              )}>
                {i < step ? <Check size={11} weight="bold" /> : i + 1}
              </div>
              <span className={cn(
                'text-xs font-manrope font-medium transition-colors',
                i === step ? 'text-ink-1' : 'text-ink-3'
              )}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'w-8 h-px transition-all duration-500',
                  i < step ? 'bg-violet/50' : 'bg-ink-4'
                )} />
              )}
            </div>
          ))}
        </div>

        <div ref={cardRef}>
          <GlassCard className="p-7">
            {step === 0 ? (
              <>
                <div className="mb-6">
                  <h1 ref={headRef}
                    className="font-syne font-bold text-[24px] text-ink-1 tracking-[-0.04em] leading-[1.1] mb-1.5"
                    style={{ overflow:'hidden' }}>
                    Create account
                  </h1>
                  <p className="text-ink-2 text-sm font-manrope">Set up your merchant credentials</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label:'Display Name',    name:'display_name', type:'text',     placeholder:'Your name or business', icon:<User size={15}/>     },
                    { label:'Email',           name:'email',        type:'email',    placeholder:'you@example.com',       icon:<Envelope size={15}/> },
                    { label:'Password',        name:'password',     type:'password', placeholder:'Min 8 characters',      icon:<Lock size={15}/>      },
                    { label:'Confirm Password',name:'confirm',      type:'password', placeholder:'Repeat password',       icon:<Lock size={15}/>      },
                  ].map(f => (
                    <AnimatedInput key={f.name} label={f.label} type={f.type as any}
                      placeholder={f.placeholder} icon={f.icon}
                      value={(form as any)[f.name]}
                      onChange={e => { setForm(p => ({ ...p, [f.name]: e.target.value })); setErrors(p=>({...p,[f.name]:''})) }}
                      error={errors[f.name]}
                      autoComplete={f.name === 'confirm' ? 'new-password' : f.name === 'password' ? 'new-password' : f.name}
                    />
                  ))}
                  {svrErr && (
                    <div className="rounded-xl px-4 py-3 text-xs font-manrope"
                      style={{ background:'var(--rose-bg)', border:'1px solid rgba(244,63,94,0.2)', color:'var(--rose)' }}>
                      {svrErr}
                    </div>
                  )}
                  <div className="pt-1">
                    <MagneticButton type="button" onClick={next}
                      className="w-full h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight">
                      Continue <ArrowRight size={15} weight="bold" />
                    </MagneticButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 ref={headRef}
                    className="font-syne font-bold text-[24px] text-ink-1 tracking-[-0.04em] leading-[1.1] mb-1.5"
                    style={{ overflow:'hidden' }}>
                    Add your photo
                  </h1>
                  <p className="text-ink-2 text-sm font-manrope">Optional — always changeable later</p>
                </div>
                <div className="flex justify-center mb-6">
                  <AvatarUpload value={avatar} onChange={setAvatar} size={108} />
                </div>
                {svrErr && (
                  <div className="rounded-xl px-4 py-3 text-xs font-manrope mb-4"
                    style={{ background:'var(--rose-bg)', border:'1px solid rgba(244,63,94,0.2)', color:'var(--rose)' }}>
                    {svrErr}
                  </div>
                )}
                <div className="flex gap-2.5">
                  <MagneticButton type="button" onClick={() => setStep(0)}
                    className="flex-1 h-12 rounded-xl text-sm text-ink-2 bg-raised ring-1 ring-ink-4 hover:ring-ink-3 font-manrope font-semibold">
                    <ArrowLeft size={14} /> Back
                  </MagneticButton>
                  <MagneticButton type="button" loading={loading} onClick={submit}
                    className="flex-[2] h-12 rounded-xl text-sm text-white bg-violet-gradient font-syne font-bold tracking-tight">
                    {avatar ? 'Create account' : 'Skip & create'}
                    <ArrowRight size={15} weight="bold" />
                  </MagneticButton>
                </div>
              </>
            )}
          </GlassCard>
        </div>

        <p className="text-center text-ink-3 text-sm font-manrope mt-5">
          Already have an account?{' '}
          <Link href="/auth/login"
            className="text-violet-hi hover:text-violet font-semibold underline underline-offset-4 decoration-violet-hi/30 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
