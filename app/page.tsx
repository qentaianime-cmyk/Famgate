'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function RootPage() {
  const router  = useRouter()
  const [ready, setReady] = useState(false)
  const token   = useAuthStore(s => s.token)

  // Wait one tick for Zustand persist to hydrate from localStorage
  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (!ready) return
    if (token) router.replace('/dashboard')
    else       router.replace('/auth/login')
  }, [ready, token, router])

  // Splash while hydrating
  return (
    <div style={{
      minHeight: '100vh', background: '#09090b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '2px solid #27272a',
        borderTopColor: '#f97316',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )
}
