'use client'
import { useState } from 'react'
import { Camera, User } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface Props { value?: string | null; onChange: (b64: string) => void; size?: number }

export function AvatarUpload({ value, onChange, size = 96 }: Props) {
  const [drag, setDrag] = useState(false)

  const handleFile = (f: File) => {
    if (!f?.type.startsWith('image/')) return
    if (f.size > 2097152) { alert('Max 2 MB'); return }
    const r = new FileReader()
    r.onload = e => { if (typeof e.target?.result === 'string') onChange(e.target.result) }
    r.readAsDataURL(f)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label
        htmlFor="av-input"
        className={cn(
          'relative cursor-pointer rounded-full block transition-all duration-200',
          'ring-2 ring-ink-4 hover:ring-violet-hi',
          drag && 'ring-violet scale-105'
        )}
        style={{ width: size, height: size }}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center"
          style={{ background:'var(--surface)' }}>
          {value
            ? <img src={value} alt="avatar" className="w-full h-full object-cover" />
            : <User size={size * 0.38} className="text-ink-3" />
          }
        </div>
        <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1
          bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Camera size={18} className="text-violet-hi" />
          <span className="text-[10px] text-violet-hi font-semibold font-manrope">
            {value ? 'Change' : 'Upload'}
          </span>
        </div>
      </label>
      <input
        id="av-input" type="file" accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = '' } }}
      />
      <div className="text-center">
        {value
          ? <p className="text-xs font-manrope" style={{ color:'var(--green)' }}>✓ Photo ready</p>
          : <p className="text-xs text-ink-3 font-manrope">Tap to add photo</p>
        }
        <p className="text-[11px] text-ink-4 font-manrope mt-0.5">JPEG · PNG · WebP · 2 MB max</p>
      </div>
    </div>
  )
}
