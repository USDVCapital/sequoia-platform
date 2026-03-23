'use client'

import { useState, useRef, useCallback } from 'react'
import { ShieldCheck, Upload, FileText, X, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StepComplianceProps {
  consultantId: string
  onNext: () => void
}

interface UploadedFile {
  name: string
  path: string
}

export default function StepCompliance({ consultantId, onNext }: StepComplianceProps) {
  const [agreed, setAgreed] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (fileList: FileList) => {
    setError(null)
    setUploading(true)
    const supabase = createClient()

    try {
      for (const file of Array.from(fileList)) {
        if (file.size > 10 * 1024 * 1024) {
          setError('Each file must be under 10 MB')
          continue
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `${consultantId}/${Date.now()}_${safeName}`

        const { error: uploadError } = await supabase.storage
          .from('compliance-docs')
          .upload(path, file, { contentType: file.type })

        if (uploadError) {
          setError(uploadError.message)
          continue
        }

        setFiles(prev => [...prev, { name: file.name, path }])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [consultantId])

  const removeFile = async (path: string) => {
    const supabase = createClient()
    await supabase.storage.from('compliance-docs').remove([path])
    setFiles(prev => prev.filter(f => f.path !== path))
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 mb-5">
          <ShieldCheck className="w-7 h-7 text-gold-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Compliance & Agreements
        </h2>
        <p className="text-sequoia-300 max-w-sm mx-auto">
          Review our policies and upload required identification documents.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6 mb-8">
        {/* Terms agreement */}
        <div className="bg-sequoia-800/50 border border-sequoia-700/50 rounded-2xl p-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-sequoia-600 bg-sequoia-800 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0 cursor-pointer accent-[#C8A84E]"
            />
            <span className="text-sm text-sequoia-200 leading-relaxed">
              I have read and agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 underline underline-offset-2 inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 underline underline-offset-2 inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </label>
        </div>

        {/* Document upload */}
        <div>
          <h3 className="text-sm font-medium text-sequoia-200 mb-3">
            Upload ID & W-9 <span className="text-sequoia-500">(optional)</span>
          </h3>

          {/* Upload area */}
          <div
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sequoia-700/60 rounded-xl bg-sequoia-800/30 hover:border-sequoia-600 hover:bg-sequoia-800/50 transition-all cursor-pointer"
          >
            <Upload className="w-6 h-6 text-sequoia-500 mb-2" />
            <p className="text-sm text-sequoia-400">
              {uploading ? 'Uploading...' : 'Click to upload or drag files here'}
            </p>
            <p className="text-xs text-sequoia-600 mt-1">PDF, JPG, or PNG up to 10 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFileUpload(e.target.files)
            }}
          />

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((f) => (
                <div
                  key={f.path}
                  className="flex items-center gap-3 px-3 py-2 bg-sequoia-800/40 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="text-sm text-sequoia-200 truncate flex-1">{f.name}</span>
                  <button
                    onClick={() => removeFile(f.path)}
                    className="p-1 text-sequoia-500 hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}

          {/* Security note */}
          <div className="mt-4 flex items-start gap-2 p-3 bg-sequoia-800/30 rounded-lg border border-sequoia-700/30">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-xs text-sequoia-400 leading-relaxed">
              Your documents are encrypted and only visible to Sequoia admin staff.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!agreed}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
