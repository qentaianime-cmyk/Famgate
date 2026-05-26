'use client'
import { useRef, useState } from 'react'
import { Camera, User } from '@phosphor-icons/react'
import { clsx } from 'clsx'

interface AvatarUploadProps {
  value?: string | null
  onChange: (base64: string) => void
  size?: number
}

export function AvatarUpload({ value, onChange, size = 88 }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (result && typeof result === 'string') {
        onChange(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
      // Reset so same file can be re-selected
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The label wraps everything — this is what makes mobile work */}
      <label
        htmlFor="avatar-input"
        className={clsx(
          'relative cursor-pointer group rounded-full overflow-hidden transition-all duration-200 block',
          dragging && 'ring-2 ring-gold ring-offset-2 ring-offset-void'
        )}
        style={{ width: size, height: size }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {/* Avatar background */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: '#1A1A1A', border: '2px solid #222' }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Avatar preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <User size={size * 0.4} color="#444" />
          )}
        </div>

        {/* Hover/active overlay */}
        <div
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.65)' }}
        >
          <Camera size={20} color="#F5A623" />
          <span style={{ fontSize: 10, color: '#F5A623', fontWeight: 600 }}>
            {value ? 'Change' : 'Upload'}
          </span>
        </div>
      </label>

      {/* The actual input — hidden but accessible via label */}
      <input
        ref={inputRef}
        id="avatar-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="sr-only"
        onChange={handleChange}
      />

      {/* Status text */}
      <div className="text-center">
        {value ? (
          <p style={{ fontSize: 12, color: '#22C55E' }}>✓ Photo selected</p>
        ) : (
          <p style={{ fontSize: 12, color: '#444' }}>Tap to choose a photo</p>
        )}
        <p style={{ fontSize: 11, color: '#333', marginTop: 2 }}>JPEG, PNG or WebP · Max 2 MB</p>
      </div>
    </div>
  )
}
