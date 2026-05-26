'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/setup/step/1')
  }, [router])
  return null
}
