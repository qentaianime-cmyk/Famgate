'use client'
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

const buttonVariants = cva(
  // Base — shared by all variants
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-semibold text-sm rounded-xl',
    'transition-all duration-150 ease-out',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none outline-none',
    'active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-ember-500 text-white',
          'shadow-[0_1px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
          'hover:bg-ember-400 hover:-translate-y-px',
          'hover:shadow-[0_4px_24px_rgba(249,115,22,0.35)]',
          'focus-visible:ring-2 focus-visible:ring-ember-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
        ],
        ghost: [
          'bg-transparent text-zinc-300 border border-zinc-800',
          'hover:bg-zinc-900 hover:border-zinc-700 hover:text-white',
        ],
        subtle: [
          'bg-zinc-900 text-zinc-300 border border-zinc-800',
          'hover:bg-zinc-800 hover:border-zinc-700 hover:text-white',
          'hover:-translate-y-px',
        ],
        danger: [
          'bg-transparent text-red-400 border border-red-900/50',
          'hover:bg-red-950/40 hover:border-red-800',
        ],
        link: [
          'text-ember-500 underline-offset-4 hover:underline p-0 h-auto',
        ],
      },
      size: {
        sm:   'h-8 px-3 text-xs rounded-lg',
        md:   'h-10 px-4 text-sm',
        lg:   'h-12 px-5 text-sm',
        xl:   'h-14 px-6 text-base rounded-2xl',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size:    'lg',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
