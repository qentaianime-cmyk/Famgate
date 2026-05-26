'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Step1Welcome } from '@/components/setup/Step1Welcome'
import { Step2Google } from '@/components/setup/Step2Google'
import { Step3Gmail } from '@/components/setup/Step3Gmail'
import { Step4UPI } from '@/components/setup/Step4UPI'

export default function SetupStepPage() {
  const params = useParams()
  const router = useRouter()
  const stepId = Number(params.id)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (isNaN(stepId) || stepId < 1 || stepId > 4) {
      router.replace('/setup/step/1')
    }
  }, [stepId, router])

  const goNext = () => {
    setDirection(1)
    if (stepId < 4) router.push(`/setup/step/${stepId + 1}`)
    else router.push('/dashboard')
  }

  const goBack = () => {
    setDirection(-1)
    if (stepId > 1) router.push(`/setup/step/${stepId - 1}`)
  }

  const stepProps = { onNext: goNext, onBack: goBack, direction }

  if (stepId === 1) return <Step1Welcome {...stepProps} />
  if (stepId === 2) return <Step2Google {...stepProps} />
  if (stepId === 3) return <Step3Gmail {...stepProps} />
  if (stepId === 4) return <Step4UPI {...stepProps} />
  return null
}
