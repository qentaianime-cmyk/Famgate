'use client'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'danger'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'gold', loading, children, className, disabled, ...props }: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-outfit font-semibold text-sm rounded-xl px-5 py-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none'

  const variants = {
    gold: 'bg-gold text-black hover:bg-yellow-400 active:scale-[0.98] shadow-[0_0_24px_rgba(245,166,35,0.25)]',
    ghost: 'bg-transparent border border-border text-white hover:border-gold/40 hover:bg-elevated active:scale-[0.98]',
    danger: 'bg-transparent border border-red-900/50 text-red-400 hover:bg-red-950/40 active:scale-[0.98]',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
