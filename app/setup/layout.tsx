'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const router        = useRouter()
  const pathname      = usePathname()
  const searchParams  = useSearchParams()
  
  const token         = useAuthStore(s => s.token)
  const requiresSetup = useAuthStore(s => s.requiresSetup)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 1. Not logged in → push to login immediately
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // 2. Read URL params reliably using Next.js native hooks
    const isReconnect = searchParams.get('reconnect') === 'true'
    const isGmail     = searchParams.get('gmail')     === 'connected'
    const hasError    = searchParams.get('error')     !== null
    
    // 3. Safety Check: Is the user inside a setup step right now?
    const isInsideSteps = pathname.includes('/setup/step')

    // 4. Tighten the guard condition: 
    // ONLY redirect to dashboard if setup is finished AND they aren't actively on a setup step page
    if (!requiresSetup && !isReconnect && !isGmail && !hasError && !isInsideSteps) {
      router.replace('/dashboard')
      return
    }

    // Safe to show the setup step content
    setReady(true)
  }, [token, requiresSetup, router, pathname, searchParams])

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
