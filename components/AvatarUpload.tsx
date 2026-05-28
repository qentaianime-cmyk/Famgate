'use client'
import { useRef, useState } from 'react'
import { Camera, User } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  value?:    string | null
  onChange:  (base64: string) => void
  size?:     number
}

export function AvatarUpload({ value, onChange, size = 96 }: AvatarUploadProps) {
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file?.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) { alert('Max 2 MB'); return }
    const reader = new FileReader()
    reader.onload = e => {
      if (typeof e.target?.result === 'string') onChange(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label
        htmlFor="avatar-input"
        className={cn(
          'relative cursor-pointer rounded-full overflow-hidden block transition-all duration-200',
          'ring-2 ring-zinc-800 hover:ring-ember-500/50',
          dragging && 'ring-ember-500 scale-105'
        )}
        style={{ width: size, height: size }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      >
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
          {value
            ? <img src={value} alt="Avatar" className="w-full h-full object-cover" />
            : <User size={size * 0.38} className="text-zinc-600" />
          }
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Camera size={18} className="text-ember-400" />
          <span className="text-[10px] text-ember-400 font-semibold">
            {value ? 'Change' : 'Upload'}
          </span>
        </div>
      </label>

      <input
        id="avatar-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) { handleFile(f); e.target.value = '' }
        }}
      />

      <div className="text-center">
        {value
          ? <p className="text-xs text-green-500 font-medium">✓ Photo ready</p>
          : <p className="text-xs text-zinc-600">Tap to add photo</p>
        }
        <p className="text-[11px] text-zinc-700 mt-0.5">JPEG, PNG, WebP · Max 2 MB</p>
      </div>
    </div>
  )
}
