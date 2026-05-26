'use client'
import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'
import { Eye, EyeSlash } from '@phosphor-icons/react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, type, ...props }, ref) => {
    const [showPass, setShowPass] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-[#888] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={isPassword && showPass ? 'text' : type}
            className={clsx(
              'w-full bg-surface border rounded-xl px-4 py-3 text-sm text-white placeholder-[#444]',
              'transition-all duration-200',
              'focus:outline-none focus:border-gold/60 focus:bg-elevated focus:shadow-[0_0_0_3px_rgba(245,166,35,0.08)]',
              icon && 'pl-10',
              isPassword && 'pr-10',
              error ? 'border-red-900/80' : 'border-border',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
            >
              {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
