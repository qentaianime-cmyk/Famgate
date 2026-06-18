'use client'
import { useEffect, useState }  from 'react'
import { useRouter }            from 'next/navigation'
import { useAuthStore }         from '@/store/authStore'
import { meApi }                from '@/lib/api'
import { removeToken }          from '@/lib/auth'
import { AvatarUpload }         from '@/components/AvatarUpload'
import { AnimatedInput }        from '@/components/ui/AnimatedInput'
import { MagneticButton }       from '@/components/ui/MagneticButton'
import { PageHeader }           from '@/components/dashboard/PageHeader'
import { SignOut, TelegramLogo } from '@phosphor-icons/react'

export default function ProfilePage() {
  const router      = useRouter()
  const displayName = useAuthStore(s => s.displayName)
  const avatarUrl   = useAuthStore(s => s.avatarUrl)
  const setAvatar   = useAuthStore(s => s.setAvatar)
  const setDName    = useAuthStore(s => s.setDisplayName)
  const logout      = useAuthStore(s => s.logout)

  // Form state
  const [name,      setName]     = useState(displayName ?? '')
  const [telegram,  setTelegram] = useState('')
  const [avatar,    setAvatarLocal] = useState<string | null>(avatarUrl)
  const [email,     setEmail]    = useState('')
  const [memberSince, setMemberSince] = useState('')

  // Loading states
  const [savingAv,    setSavingAv]    = useState(false)
  const [savingName,  setSavingName]  = useState(false)
  const [savedName,   setSavedName]   = useState(false)
  const [savingTg,    setSavingTg]    = useState(false)
  const [savedTg,     setSavedTg]     = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Load full profile from API on mount
  useEffect(() => {
    meApi.get().then(r => {
      const d = r.data
      setName(d.display_name ?? '')
      setTelegram(d.telegram_handle ?? '')
      setEmail(d.email ?? '')
      if (d.avatar_url) setAvatarLocal(d.avatar_url)
      if (d.created_at) {
        const date = new Date(d.created_at * 1000)
        setMemberSince(date.toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric',
        }))
      }
      setProfileLoaded(true)
    }).catch(() => {
      // Fallback to store values if API fails
      setName(displayName ?? '')
      setProfileLoaded(true)
    })
  }, [])

  // Avatar upload
  const handleAvatarChange = async (b64: string) => {
    setAvatarLocal(b64)
    setSavingAv(true)
    try {
      const res = await meApi.uploadAvatar(b64)
      setAvatar(res.data.avatar_url)
    } finally {
      setSavingAv(false)
    }
  }

  // Save display name
  const saveName = async () => {
    if (!name.trim() || name.trim().length < 2) return
    setSavingName(true)
    try {
      await meApi.updateName(name.trim())
      setDName(name.trim())
      setSavedName(true)
      setTimeout(() => setSavedName(false), 2000)
    } finally {
      setSavingName(false)
    }
  }

  // Save telegram handle
  const saveTelegram = async () => {
    setSavingTg(true)
    try {
      // Clean the handle — strip @ if user typed it
      const clean = telegram.replace(/^@/, '').trim()
      setTelegram(clean)

      await meApi.updateProfile?.({ telegram_handle: clean })
        ?? await import('@/lib/api').then(({ api }) =>
            api.post('/me.php', { action: 'save_profile', telegram_handle: clean, display_name: name })
          )

      setSavedTg(true)
      setTimeout(() => setSavedTg(false), 2000)
    } catch {
      // silently fail — non-critical
    } finally {
      setSavingTg(false)
    }
  }

  // Logout
  const handleLogout = () => {
    removeToken()
    logout()
    router.push('/auth/login')
  }

  if (!profileLoaded) return (
    <div className="flex items-center justify-center py-24">
      <div
        className="w-6 h-6 rounded-full border-2 border-violet-lo border-t-violet-hi"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Your identity canvas" />

      {/* Avatar section */}
      <div
        className="flex flex-col items-center py-6 rounded-2xl"
        style={{ background: 'var(--card)', border: '1px solid var(--bd)' }}
      >
        <div className="relative">
          <AvatarUpload
            value={avatar}
            onChange={handleAvatarChange}
            size={108}
          />
          {savingAv && (
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(7,7,15,0.7)' }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-violet-lo border-t-violet-hi"
                style={{ animation: 'spin 0.7s linear infinite' }}
              />
            </div>
          )}
        </div>

        <p className="font-syne font-bold text-lg text-ink-1 mt-3 tracking-[-0.02em]">
          {name || displayName || 'Merchant'}
        </p>

        {email && (
          <p className="text-ink-3 text-xs font-manrope mt-0.5">{email}</p>
        )}
        {memberSince && (
          <p className="text-ink-4 text-[11px] font-manrope mt-1">
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* Display name */}
      <section className="space-y-3">
        <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
          Display Name
        </p>
        <AnimatedInput
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name or business"
        />
        <MagneticButton
          type="button"
          loading={savingName}
          onClick={saveName}
          className={`w-full h-12 rounded-xl text-sm font-syne font-bold tracking-tight ${
            savedName
              ? 'text-green-400 bg-green-900/30 ring-1 ring-green-500/30'
              : 'text-white bg-violet-gradient'
          }`}
        >
          {savedName ? '✓ Name updated' : 'Save name'}
        </MagneticButton>
      </section>

      {/* Telegram */}
      <section className="space-y-3">
        <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
          Telegram (for payment alerts)
        </p>
        <AnimatedInput
          label="Telegram Username"
          value={telegram}
          onChange={e => setTelegram(e.target.value.replace(/^@/, ''))}
          placeholder="yourusername"
          icon={<TelegramLogo size={15} />}
          hint="Used for manual UTR verification alerts on unmatched payments"
        />
        <MagneticButton
          type="button"
          loading={savingTg}
          onClick={saveTelegram}
          className={`w-full h-12 rounded-xl text-sm font-syne font-bold tracking-tight ${
            savedTg
              ? 'text-green-400 bg-green-900/30 ring-1 ring-green-500/30'
              : 'text-white bg-violet-gradient'
          }`}
        >
          {savedTg ? '✓ Telegram saved' : 'Save Telegram'}
        </MagneticButton>
      </section>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all font-syne font-bold text-sm"
        style={{
          background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.15)',
          color: 'var(--rose)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(244,63,94,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)')}
      >
        <SignOut size={18} weight="bold" />
        Sign out
      </button>
    </div>
  )
}
