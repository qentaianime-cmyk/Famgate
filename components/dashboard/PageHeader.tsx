'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'

interface Props {
  title:    string
  subtitle?: string
  back?:    boolean
  action?:  React.ReactNode
}

export function PageHeader({ title, subtitle, back, action }: Props) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background:'var(--card)', border:'1px solid var(--bd)', color:'var(--ink-2)' }}
          >
            <ArrowLeft size={15} />
          </button>
        )}
        <div>
          <h1 className="font-syne font-bold text-xl text-ink-1 tracking-[-0.03em]">{title}</h1>
          {subtitle && <p className="text-xs text-ink-3 font-manrope mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
