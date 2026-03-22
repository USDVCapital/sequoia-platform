'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoaded(false)
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden" style={{ height: '90vh', maxHeight: '700px' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Schedule a Call</h2>
            <p className="text-sm text-neutral-500">Book a 30-minute consultation with Sequoia</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close booking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Calendly embed */}
        <div className="relative w-full" style={{ height: 'calc(100% - 65px)' }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-gold-500" />
              <span className="ml-3 text-sm text-neutral-500">Loading calendar...</span>
            </div>
          )}
          <iframe
            src="https://calendly.com/seqsolution/30min"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a call with Sequoia Enterprise Solutions"
            onLoad={() => setLoaded(true)}
            className={loaded ? 'opacity-100' : 'opacity-0'}
            style={{ transition: 'opacity 0.3s ease' }}
          />
        </div>
      </div>
    </div>
  )
}
