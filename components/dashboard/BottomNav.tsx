'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, ArrowsLeftRight, Gear, User } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const TABS = [
  { href:'/dashboard',              icon:House,            label:'Home'     },
  { href:'/dashboard/transactions', icon:ArrowsLeftRight,  label:'Ledger'   },
  { href:'/dashboard/settings',     icon:Gear,             label:'Config'   },
  { href:'/dashboard/profile',      icon:User,             label:'Profile'  },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background:'rgba(13,12,26,0.85)',
        backdropFilter:'blur(24px)',
        borderTop:'1px solid rgba(255,255,255,0.06)',
        paddingBottom:'env(safe-area-inset-bottom, 8px)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {TABS.map(({ href, icon:Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl relative transition-all duration-200">

              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.2)' }}
                  transition={{ type:'spring', stiffness:400, damping:35 }}
                />
              )}

              <Icon
                size={20}
                weight={active ? 'fill' : 'regular'}
                style={{ color: active ? '#a78bfa' : 'var(--ink-3)', position:'relative', zIndex:1 }}
              />
              <span
                className="text-[10px] font-syne font-semibold relative z-10"
                style={{ color: active ? '#a78bfa' : 'var(--ink-4)' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
