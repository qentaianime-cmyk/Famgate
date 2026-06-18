'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const router        = useRouter()
  const token         = useAuthStore(s => s.token)
  const requiresSetup = useAuthStore(s => s.requiresSetup)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Not logged in → go to login
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // Read URL params client-side
    const params      = new URLSearchParams(window.location.search)
    const isReconnect = params.get('reconnect')    === 'true'
    const isGmail     = params.get('gmail')        === 'connected'
    const hasError    = params.get('error')        !== null

    // If setup is complete AND not in a special flow → go to dashboard
    if (!requiresSetup && !isReconnect && !isGmail && !hasError) {
      router.replace('/dashboard')
      return
    }

    setReady(true)
  }, [token, requiresSetup, router])

  if (!ready) return (
    <div style={{
      minHeight: '100vh',
      background: '#07070f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2px solid #4c1d95',
        borderTopColor: '#8b5cf6',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )

  return <>{children}</>
}
