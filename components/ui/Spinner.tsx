import { cn } from '@/lib/utils'

interface SpinnerProps { size?: number; className?: string }

export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <span
      className={cn('inline-block rounded-full border-2 border-zinc-700 border-t-ember-500', className)}
      style={{
        width: size, height: size,
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
