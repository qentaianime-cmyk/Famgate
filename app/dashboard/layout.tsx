'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token  = useAuthStore(s => s.token)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])
  useEffect(() => {
    if (ready && !token) router.replace('/auth/login')
  }, [ready, token, router])

  if (!ready || !token) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#07070f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-violet-lo border-t-violet-hi"
        style={{ animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return <DashboardLayout>{children}</DashboardLayout>
}
