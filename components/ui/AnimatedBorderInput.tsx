'use client'
import { useRef, useState, forwardRef } from 'react'
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AnimatedBorderInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:  string
  error?:  string
  hint?:   string
  icon?:   React.ReactNode
}

export const AnimatedBorderInput = forwardRef<HTMLInputElement, AnimatedBorderInputProps>(
  ({ label, error, hint, icon, type, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const isPass = type === 'password'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
            {label}
          </label>
        )}

        {/* Animated border wrapper */}
        <div className={cn(
          'relative rounded-xl p-[1px] transition-all duration-300',
          focused && !error
            ? 'bg-gradient-to-r from-ember-500 via-orange-400 to-ember-600 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            : error
            ? 'bg-red-500/70'
            : 'bg-zinc-800',
        )}>
          {/* Animated shimmer on focus */}
          {focused && !error && (
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite',
              }}
            />
          )}

          <div className="relative rounded-[11px] bg-zinc-900 overflow-hidden">
            {icon && (
              <span className={cn(
                'absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200',
                focused ? 'text-ember-400' : 'text-zinc-600'
              )}>
                {icon}
              </span>
            )}

            <input
              ref={ref}
              type={isPass && showPass ? 'text' : type}
              onFocus={e => { setFocused(true); props.onFocus?.(e) }}
              onBlur={e => { setFocused(false); props.onBlur?.(e) }}
              className={cn(
                'w-full h-12 bg-transparent text-sm text-zinc-100',
                'placeholder-zinc-600 outline-none',
                icon ? 'pl-10' : 'pl-4',
                isPass ? 'pr-10' : 'pr-4',
                // Autofill kill
                '[&:-webkit-autofill]:shadow-[0_0_0_100px_#18181b_inset]',
                '[&:-webkit-autofill]:[--webkit-text-fill-color:#fafafa]',
                className
              )}
              {...props}
            />

            {isPass && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors z-10"
              >
                {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 animate-fade-in">
            <WarningCircle size={12} weight="fill" /> {error}
          </p>
        )}
        {!error && hint && <p className="text-xs text-zinc-600">{hint}</p>}
      </div>
    )
  }
)
AnimatedBorderInput.displayName = 'AnimatedBorderInput'
