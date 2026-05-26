'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Envelope, Lock, User, ArrowRight, ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { AvatarUpload } from '@/components/AvatarUpload'
import { authApi, meApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { saveToken } from '@/lib/auth'

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir * -40 }),
}

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const setAvatar = useAuthStore(s => s.setAvatar)

  const [step, setStep] = useState(0) // 0 = credentials, 1 = avatar
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({ display_name: '', email: '', password: '', confirm: '' })
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n) }

  const validateStep0 = () => {
    const e: Record<string, string> = {}
    if (!form.display_name.trim() || form.display_name.length < 2) e.display_name = 'At least 2 characters'
    if (!form.email) e.email = 'Email is required'
    if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNextStep = () => {
    if (step === 0 && validateStep0()) go(1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setServerError('')
    try {
      // 1. Register
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        display_name: form.display_name,
      })
      const data = res.data
      saveToken(data.token)
      setAuth({ ...data, requires_setup: true })

      // 2. Upload avatar if provided
      if (avatarBase64) {
        try {
          const avatarRes = await meApi.uploadAvatar(avatarBase64)
          setAvatar(avatarRes.data.avatar_url)
        } catch {
          // Avatar upload failure is non-fatal
        }
      }

      router.push('/setup')
    } catch (err: any) {
      setServerError(err.response?.data?.error ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <Logo size={36} />
          <span className="text-white font-bold text-xl tracking-tight">FamSaaS</span>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Account', 'Profile'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-gold text-black' : i === step ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-elevated text-[#444] border border-border'
              }`}>
                {i < step ? <CheckCircle size={14} weight="fill" /> : i + 1}
              </div>
              <span className={`text-xs transition-colors ${i === step ? 'text-white' : 'text-[#444]'}`}>{label}</span>
              {i < 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence custom={dir} mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
                <p className="text-[#555] text-sm mb-6">Set up your merchant credentials</p>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Display Name"
                    placeholder="Your name or business"
                    icon={<User size={16} />}
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    error={errors.display_name}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Envelope size={16} />}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min 8 characters"
                    icon={<Lock size={16} />}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    error={errors.password}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    icon={<Lock size={16} />}
                    value={form.confirm}
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    error={errors.confirm}
                  />

                  {serverError && (
                    <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                      {serverError}
                    </p>
                  )}

                  <Button onClick={handleNextStep} className="w-full mt-2">
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-2xl font-bold text-white mb-1">Add your photo</h1>
                <p className="text-[#555] text-sm mb-8">Optional — you can always do this later</p>

                <div className="flex flex-col items-center gap-6">
                  <AvatarUpload
                    value={avatarBase64}
                    onChange={setAvatarBase64}
                    size={112}
                  />
                  <p className="text-xs text-[#444] text-center">
                    Click or drag a photo here<br />
                    JPEG, PNG or WebP • Max 2 MB
                  </p>
                </div>

                {serverError && (
                  <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2 mt-4">
                    {serverError}
                  </p>
                )}

                <div className="flex gap-3 mt-8">
                  <Button variant="ghost" onClick={() => go(0)} className="flex-1">
                    <ArrowLeft size={16} /> Back
                  </Button>
                  <Button onClick={handleSubmit} loading={loading} className="flex-2 flex-1">
                    {avatarBase64 ? 'Create account' : 'Skip & create'} <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[#444] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gold hover:text-yellow-400 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
