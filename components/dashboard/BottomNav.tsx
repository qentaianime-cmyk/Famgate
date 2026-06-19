'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, ArrowsLeftRight, Gear, User, Plus } from '@phosphor-icons/react'
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
      {/* Added "relative" to this div class so the floating button centers perfectly inside it */}
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 relative">
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

        {/* Floating create-order button is placed right here, after the loop closes */}
        <Link href="/dashboard/create-order"
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
            border: '3px solid var(--bg)',
          }}
        >
          <Plus size={22} color="#fff" weight="bold" />
        </Link> 
      </div>
    </nav>
  )
}
