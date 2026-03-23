'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Camera, X, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StepProfilePhotoProps {
  consultantId: string
  currentAvatarUrl: string | null
  onNext: (avatarUrl: string | null) => void
  onSkip: () => void
}

export default function StepProfilePhoto({ consultantId, currentAvatarUrl, onNext, onSkip }: StepProfilePhotoProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    setError(null)
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB')
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleUploadAndNext = async () => {
    if (!file) {
      // Use existing avatar or skip
      onNext(currentAvatarUrl)
      return
    }

    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const path = `${consultantId}/avatar.jpg`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      onNext(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearPhoto = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 mb-5">
          <Camera className="w-7 h-7 text-gold-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Add Your Profile Photo
        </h2>
        <p className="text-sequoia-300 max-w-sm mx-auto">
          Help your team and clients recognize you with a professional headshot.
        </p>
      </div>

      {/* Upload zone */}
      <div className="max-w-sm mx-auto mb-8">
        {preview ? (
          <div className="relative flex flex-col items-center">
            {/* Preview circle */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gold-500/30 shadow-xl shadow-gold-500/10 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={clearPhoto}
              className="inline-flex items-center gap-1.5 text-sm text-sequoia-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Remove photo
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center w-48 h-48 mx-auto rounded-full border-2 border-dashed transition-all duration-200 cursor-pointer ${
              dragOver
                ? 'border-gold-500 bg-gold-500/10'
                : 'border-sequoia-600 hover:border-sequoia-500 bg-sequoia-800/40'
            }`}
          >
            <Upload className={`w-8 h-8 mb-2 ${dragOver ? 'text-gold-500' : 'text-sequoia-500'}`} />
            <p className="text-sm text-sequoia-400 text-center px-4">
              Drop image here or click to browse
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      {error && (
        <p className="text-center text-sm text-red-400 mb-4">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
        <button
          onClick={handleUploadAndNext}
          disabled={uploading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {file ? 'Upload & Continue' : 'Continue'}
            </>
          )}
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-sequoia-400 hover:text-sequoia-200 transition-colors cursor-pointer"
        >
          I&apos;ll do this later
        </button>
      </div>
    </div>
  )
}
