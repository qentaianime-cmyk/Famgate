'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const router        = useRouter()
  const token         = useAuthStore(s => s.token)
  const requiresSetup = useAuthStore(s => s.requiresSetup)
  
  const [ready, setReady] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // 1. Wait for Zustand to load data from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    // If the store hasn't loaded yet, do nothing. Just wait.
    if (!hydrated) return

    // 2. Now we safely check the token. 
    // If it's truly empty, send to login.
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // 3. Read URL parameters client-side
    const params      = new URLSearchParams(window.location.search)
    const isReconnect = params.get('reconnect')    === 'true'
    const isGmail     = params.get('gmail')        === 'connected'
    const hasError    = params.get('error')        !== null

    // 4. ONLY kick them to dashboard if they are totally finished 
    // AND they are not currently returning from Google/reconnecting.
    if (!requiresSetup && !isReconnect && !isGmail && !hasError) {
      router.replace('/dashboard')
      return
    }

    // Safe to show the setup screen!
    setReady(true)
  }, [hydrated, token, requiresSetup, router])

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
