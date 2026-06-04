'use client'
import { forwardRef, useState } from 'react'
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:  string
  error?:  string
  hint?:   string
  icon?:   React.ReactNode
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, hint, icon, type, className, ...props }, ref) => {
    const [focused,  setFocused]  = useState(false)
    const [showPass, setShowPass] = useState(false)
    const isPass = type === 'password'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-3 font-manrope">
            {label}
          </label>
        )}

        {/* Animated 1px border wrapper */}
        <div
          className="relative rounded-xl transition-all duration-300"
          style={{
            padding: '1px',
            background: error
              ? 'rgba(244,63,94,0.6)'
              : focused
              ? 'linear-gradient(135deg,#7c3aed,#4f46e5,#3b82f6)'
              : 'rgba(255,255,255,0.07)',
            boxShadow: focused && !error
              ? '0 0 20px rgba(124,58,237,0.2)'
              : 'none',
          }}
        >
          {/* Shimmer on focus */}
          {focused && !error && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.25),transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s linear infinite',
              }}
            />
          )}

          <div className="relative rounded-[11px] overflow-hidden" style={{ background:'var(--card)' }}>
            {icon && (
              <span className={cn(
                'absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200',
                focused ? 'text-violet-hi' : 'text-ink-3'
              )}>
                {icon}
              </span>
            )}

            <input
              ref={ref}
              type={isPass && showPass ? 'text' : type}
              onFocus={e => { setFocused(true); props.onFocus?.(e) }}
              onBlur={e  => { setFocused(false); props.onBlur?.(e) }}
              className={cn(
                'w-full h-12 bg-transparent text-sm font-manrope',
                'text-ink-1 placeholder-ink-4 outline-none',
                icon ? 'pl-10' : 'pl-4',
                isPass ? 'pr-10' : 'pr-4',
                // Autofill override
                '[&:-webkit-autofill]:shadow-[0_0_0_100px_#0d0c1a_inset]',
                '[&:-webkit-autofill]:[--webkit-text-fill-color:#ededff]',
                className,
              )}
              {...props}
            />

            {isPass && (
              <button
                type="button" tabIndex={-1}
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors z-10"
              >
                {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs font-manrope"
            style={{ color:'var(--rose)' }}>
            <WarningCircle size={12} weight="fill" /> {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-ink-3 font-manrope">{hint}</p>
        )}
      </div>
    )
  }
)
AnimatedInput.displayName = 'AnimatedInput'
