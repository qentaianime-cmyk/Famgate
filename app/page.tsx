'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Root() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const token  = useAuthStore(s => s.token)

  useEffect(() => {
    // Scroll to top on every load — kills browser scroll restoration
    window.scrollTo(0, 0)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    router.replace(token ? '/dashboard' : '/auth/login')
  }, [ready, token, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#07070f' }}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-violet-lo border-t-violet-hi"
          style={{ animation:'spin 0.8s linear infinite' }} />
        <div className="absolute inset-0 rounded-full bg-violet-hi blur-md opacity-20 animate-glow" />
      </div>
    </div>
  )
}
