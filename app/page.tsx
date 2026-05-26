'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function RootPage() {
  const router = useRouter()
  const token = useAuthStore(s => s.token)

  useEffect(() => {
    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/auth/login')
    }
  }, [token, router])

  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  )
}
