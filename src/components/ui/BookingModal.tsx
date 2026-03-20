'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoaded(false)
      return
    }

    // Load the Roam embed script
    const script = document.createElement('script')
    script.src = 'https://ro.am/lobbylinks/embed.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && typeof (window as any).Roam !== 'undefined') {
        const parentElement = containerRef.current
        ;(window as any).Roam.initLobbyEmbed({
          url: 'https://ro.am/toddbillings/',
          parentElement,
          lobbyConfiguration: 'booking_only',
          accentColor: '#C8A84E',
          theme: 'light',
          onSizeChange: (_width: number, height: number) => {
            parentElement.style.height = `${height}px`
          },
        })
        setLoaded(true)
      }
    }
    document.body.appendChild(script)

    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      // Clean up script
      const existing = document.querySelector('script[src="https://ro.am/lobbylinks/embed.js"]')
      if (existing) existing.remove()
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
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Schedule a Call</h2>
            <p className="text-sm text-neutral-500">Pick a time that works for you</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close booking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Roam embed container */}
        <div className="px-6 py-6">
          {!loaded && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-gold-500" />
              <span className="ml-3 text-sm text-neutral-500">Loading calendar...</span>
            </div>
          )}
          <div
            id="roam-lobby"
            ref={containerRef}
            style={{ minWidth: '320px', minHeight: loaded ? undefined : '0px' }}
          />
        </div>
      </div>
    </div>
  )
}
