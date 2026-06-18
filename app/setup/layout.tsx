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
    // 1. Not logged in → go to login immediately
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // 2. Safely read URL parameters strictly client-side
    const params      = new URLSearchParams(window.location.search)
    const isReconnect = params.get('reconnect')    === 'true'
    const isGmail     = params.get('gmail')        === 'connected'
    const hasError    = params.get('error')        !== null

    // 3. Safety Check: Are they currently looking at a step subroute?
    // This stops the layout from breaking out of /setup/step/3 during page load
    const isInsideSteps = window.location.pathname.includes('/setup/step')

    // 4. Tight Guard Condition
    // ONLY redirect to dashboard if setup is complete AND they aren't actively running a setup step flow
    if (!requiresSetup && !isReconnect && !isGmail && !hasError && !isInsideSteps) {
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
