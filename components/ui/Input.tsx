'use client'
import { forwardRef, useState } from 'react'
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string
  error?:   string
  hint?:    string
  icon?:    React.ReactNode
  suffix?:  React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, type, className, ...props }, ref) => {
    const [showPass, setShowPass] = useState(false)
    const isPass = type === 'password'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Left icon */}
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none z-10 transition-colors group-focus-within:text-zinc-400">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            type={isPass && showPass ? 'text' : type}
            className={cn(
              // Layout
              'w-full h-12 rounded-xl text-sm text-zinc-100 placeholder-zinc-600',
              // Background — zinc-900 NOT transparent so autofill override works
              'bg-zinc-900',
              // Border
              'border transition-all duration-200',
              error
                ? 'border-red-500/70 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
                : 'border-zinc-800 focus:border-ember-500/70 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]',
              // Padding
              icon   ? 'pl-10' : 'pl-4',
              (isPass || suffix) ? 'pr-10' : 'pr-4',
              // Autofill override already in globals.css but reinforce here
              '[&:-webkit-autofill]:shadow-[0_0_0_100px_#18181b_inset]',
              '[&:-webkit-autofill]:[--webkit-text-fill-color:#fafafa]',
              'outline-none',
              className
            )}
            {...props}
          />

          {/* Right: password toggle or suffix */}
          {isPass ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors z-10"
            >
              {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          ) : suffix ? (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 z-10">
              {suffix}
            </span>
          ) : null}
        </div>

        {/* Error or hint */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <WarningCircle size={12} weight="fill" />
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-zinc-600">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
