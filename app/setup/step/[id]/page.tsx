'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Step1Welcome } from '@/components/setup/Step1Welcome'
import { Step2Google }  from '@/components/setup/Step2Google'
import { Step3Gmail }   from '@/components/setup/Step3Gmail'
import { Step4UPI }     from '@/components/setup/Step4UPI'

export default function SetupStepPage() {
  const params  = useParams()
  const router  = useRouter()
  const stepId  = Number(params.id)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    if (isNaN(stepId) || stepId < 1 || stepId > 4)
      router.replace('/setup/step/1')
  }, [stepId, router])

  const goNext = () => { setDir(1);  router.push(stepId < 4 ? `/setup/step/${stepId + 1}` : '/dashboard') }
  const goBack = () => { setDir(-1); if (stepId > 1) router.push(`/setup/step/${stepId - 1}`) }
  const p = { onNext: goNext, onBack: goBack, direction: dir }

  if (stepId === 1) return <Step1Welcome {...p} />
  if (stepId === 2) return <Step2Google  {...p} />
  if (stepId === 3) return <Step3Gmail   {...p} />
  if (stepId === 4) return <Step4UPI     {...p} />
  return null
}
