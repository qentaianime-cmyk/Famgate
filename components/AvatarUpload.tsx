'use client'
import { useRef, useState } from 'react'
import { Camera, User } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import Image from 'next/image'

interface AvatarUploadProps {
  value?: string | null
  onChange: (base64: string) => void
  size?: number
}

export function AvatarUpload({ value, onChange, size = 88 }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) onChange(e.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className={clsx(
        'relative cursor-pointer group rounded-full overflow-hidden transition-all duration-200',
        dragging && 'ring-2 ring-gold'
      )}
      style={{ width: size, height: size }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-elevated border-2 border-border rounded-full flex items-center justify-center">
        {value ? (
          <Image src={value} alt="Avatar" fill className="object-cover" unoptimized />
        ) : (
          <User size={size * 0.4} className="text-[#444]" />
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Camera size={18} className="text-gold" />
        <span className="text-[10px] text-gold font-medium mt-1">Upload</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
