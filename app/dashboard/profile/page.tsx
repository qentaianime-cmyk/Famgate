'use client'
import { useState, useRef } from 'react'
import { useAuthStore }    from '@/store/authStore'
import { meApi }           from '@/lib/api'
import { AvatarUpload }    from '@/components/AvatarUpload'
import { AnimatedInput }   from '@/components/ui/AnimatedInput'
import { MagneticButton }  from '@/components/ui/MagneticButton'
import { PageHeader }      from '@/components/dashboard/PageHeader'
import { useRouter }       from 'next/navigation'
import { SignOut }         from '@phosphor-icons/react'
import { removeToken }     from '@/lib/auth'

export default function ProfilePage() {
  const router       = useRouter()
  const displayName  = useAuthStore(s => s.displayName)
  const avatarUrl    = useAuthStore(s => s.avatarUrl)
  const setAvatar    = useAuthStore(s => s.setAvatar)
  const setDName     = useAuthStore(s => s.setDisplayName)
  const logout       = useAuthStore(s => s.logout)

  const [name,       setName]       = useState(displayName ?? '')
  const [avatar,     setAvatarLocal]= useState<string | null>(avatarUrl)
  const [savingAv,   setSavingAv]   = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [savedName,  setSavedName]  = useState(false)

  const handleAvatarChange = async (b64: string) => {
    setAvatarLocal(b64)
    setSavingAv(true)
    try {
      const res = await meApi.uploadAvatar(b64)
      setAvatar(res.data.avatar_url)
    } finally { setSavingAv(false) }
  }

  const saveName = async () => {
    setSavingName(true)
    try {
      await meApi.updateName?.(name) // optional chaining — may not be exposed
      setDName(name)
      setSavedName(true)
      setTimeout(() => setSavedName(false), 2000)
    } finally { setSavingName(false) }
  }

  const handleLogout = () => {
    removeToken()
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Your identity canvas" />

      {/* Avatar */}
      <div className="flex flex-col items-center py-4 rounded-2xl"
        style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
        <div className="relative">
          <AvatarUpload value={avatar} onChange={handleAvatarChange} size={108} />
          {savingAv && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background:'rgba(7,7,15,0.7)' }}>
              <div className="w-6 h-6 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
            </div>
          )}
        </div>
        <p className="text-ink-1 font-syne font-bold text-lg mt-3 tracking-[-0.02em]">
          {displayName ?? 'Merchant'}
        </p>
      </div>

      {/* Name edit */}
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
        <MagneticButton type="button" loading={savingName} onClick={saveName}
          className={`w-full h-12 rounded-xl text-sm font-syne font-bold tracking-tight ${
            savedName ? 'text-green-400 bg-green-900/30 ring-1 ring-green-500/30' : 'text-white bg-violet-gradient'
          }`}>
          {savedName ? '✓ Updated' : 'Save name'}
        </MagneticButton>
      </section>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all font-syne font-bold text-sm"
        style={{
          background:'rgba(244,63,94,0.06)',
          border:'1px solid rgba(244,63,94,0.15)',
          color:'var(--rose)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(244,63,94,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(244,63,94,0.15)')}
      >
        <SignOut size={18} weight="bold" />
        Sign out
      </button>
    </div>
  )
}
