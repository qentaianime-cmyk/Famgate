'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, ArrowSquareOut } from '@phosphor-icons/react'
import { ApiKeyCard }   from '@/components/dashboard/ApiKeyCard'
import { SecureModal }  from '@/components/dashboard/SecureModal'
import { PageHeader }   from '@/components/dashboard/PageHeader'
import { AnimatedInput } from '@/components/ui/AnimatedInput'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { settingsApi }  from '@/lib/api'
import Link from 'next/link'

interface Settings {
  fampay_upi_id: string; gmail_user: string; gmail_method?: string; gmail_configured: boolean
  webhook_url: string; api_key_live: string; api_key_test: string
}

export default function SettingsPage() {
  const [s,         setS]         = useState<Settings | null>(null)
  const [upi,       setUpi]       = useState('')
  const [webhook,   setWebhook]   = useState('')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [regenModal,setRegenModal]= useState(false)
  const [keys,      setKeys]      = useState<{ live:string; test:string } | null>(null)

  useEffect(() => {
    settingsApi.get().then(r => {
      setS(r.data)
      setUpi(r.data.fampay_upi_id || '')
      setWebhook(r.data.webhook_url || '')
      setKeys({ live:r.data.api_key_live, test:r.data.api_key_test })
    })
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await settingsApi.save({ upi_id:upi, webhook_url:webhook })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  const regenKeys = async () => {
    const res = await settingsApi.regenKeys()
    setKeys({ live:res.data.api_key_live, test:res.data.api_key_test })
    setRegenModal(false)
  }

  if (!s) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-violet-lo border-t-violet-hi animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5">
      <PageHeader title="Config" subtitle="Gateway & API management" />

      {/* API Keys */}
      <section className="space-y-3">
        <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
          API Keys
        </p>
        {keys && (
          <>
            <ApiKeyCard label="Live Key" apiKey={keys.live} type="live" />
            <ApiKeyCard label="Test Key" apiKey={keys.test} type="test" />
          </>
        )}
        <button
          onClick={() => setRegenModal(true)}
          className="w-full py-3 rounded-xl text-sm font-syne font-bold transition-all"
          style={{
            background:'rgba(244,63,94,0.06)',
            border:'1px solid rgba(244,63,94,0.2)',
            color:'var(--rose)',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(244,63,94,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(244,63,94,0.2)')}
        >
          ⚡ Regenerate API Keys
        </button>
      </section>

      {/* Gateway Config */}
      <section className="space-y-4">
        <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
          Gateway
        </p>

        <AnimatedInput
          label="UPI ID"
          placeholder="yourname@upi"
          value={upi}
          onChange={e => setUpi(e.target.value)}
          hint="Payments land in your UPI-linked bank account"
        />

        <AnimatedInput
          label="Webhook URL (optional)"
          type="url"
          placeholder="https://yoursite.com/webhook"
          value={webhook}
          onChange={e => setWebhook(e.target.value)}
          hint="POST fired on every confirmed payment"
        />

        <MagneticButton type="button" loading={saving} onClick={save}
          className={`w-full h-12 rounded-xl text-sm font-syne font-bold tracking-tight ${
            saved ? 'text-green-400 bg-green-900/30 ring-1 ring-green-500/30' : 'text-white bg-violet-gradient'
          }`}>
          {saved ? '✓ Saved' : 'Save changes'}
        </MagneticButton>
      </section>

      {/* Gmail status */}
      <section className="rounded-2xl p-4 space-y-3"
        style={{ background:'var(--card)', border:'1px solid var(--bd)' }}>
        <p className="text-[11px] font-syne font-semibold tracking-[0.1em] uppercase text-ink-3">
          Gmail Connection
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {s.gmail_configured
              ? <CheckCircle size={18} color="var(--green)" weight="fill" />
              : <XCircle    size={18} color="var(--rose)"  weight="fill" />
            }
            <div>
              <p className="text-sm font-manrope text-ink-1">
                {s.gmail_user || 'Not connected'}
              </p>
              <p className="text-xs text-ink-3 font-manrope">
            {s.gmail_configured ? s.gmail_method === 'oauth'
    ? 'Connected via Google OAuth'
    : 'Connected via App Password'
  : 'Setup required'}
              </p>
            </div>
          </div>
        
<Link href="/setup/step/3?reconnect=true"
  className="...">
  {s.gmail_configured ? 'Reconnect' : 'Connect'} <ArrowSquareOut size={12} />
</Link>
        </div>
      </section>

      {/* Regen modal */}
      <SecureModal
        open={regenModal}
        onClose={() => setRegenModal(false)}
        onConfirm={regenKeys}
        title="Regenerate API Keys"
        body="Your current live and test keys will be permanently invalidated. Any active integrations will break immediately."
        danger="regenerate"
      />
    </div>
  )
}
