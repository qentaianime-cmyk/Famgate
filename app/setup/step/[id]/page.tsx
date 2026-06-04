'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState }  from 'react'
import { Step1Welcome } from '@/components/setup/Step1Welcome'
import { Step2Google }  from '@/components/setup/Step2Google'
import { Step3Gmail }   from '@/components/setup/Step3Gmail'
import { Step4UPI }     from '@/components/setup/Step4UPI'

export default function StepPage() {
  const params = useParams()
  const router = useRouter()
  const id     = Number(params.id)
  const [dir,  setDir] = useState(1)

  useEffect(() => {
    if (isNaN(id) || id < 1 || id > 4) router.replace('/setup/step/1')
  }, [id, router])

  const fwd  = () => { setDir(1);  router.push(id < 4 ? `/setup/step/${id+1}` : '/dashboard') }
  const back = () => { setDir(-1); if (id > 1) router.push(`/setup/step/${id-1}`) }
  const p    = { onNext: fwd, onBack: back, direction: dir }

  if (id === 1) return <Step1Welcome {...p} />
  if (id === 2) return <Step2Google  {...p} />
  if (id === 3) return <Step3Gmail   {...p} />
  if (id === 4) return <Step4UPI     {...p} />
  return null
}
