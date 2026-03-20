'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

const YOUTUBE_URL = 'https://www.youtube.com/@seqsolution'
const DISMISS_KEY = 'seq_training_bar_dismissed'
const DISMISS_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function getETNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  )
}

function isWednesdayLive(now: Date): boolean {
  // Wednesday = 3
  if (now.getDay() !== 3) return false
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const totalMinutes = hours * 60 + minutes
  // 7:45 PM = 19*60+45 = 1185, 10:00 PM = 22*60 = 1320
  return totalMinutes >= 1185 && totalMinutes <= 1320
}

function getNextWednesday8PM(): Date {
  const now = getETNow()
  const target = new Date(now)
  const dayOfWeek = now.getDay()
  // Days until next Wednesday
  let daysUntil = (3 - dayOfWeek + 7) % 7
  // If it's Wednesday but past 10 PM, go to next week
  if (daysUntil === 0) {
    const totalMinutes = now.getHours() * 60 + now.getMinutes()
    if (totalMinutes > 1320) daysUntil = 7
  }
  target.setDate(target.getDate() + daysUntil)
  target.setHours(20, 0, 0, 0)
  return target
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0s'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

export default function TrainingAnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash
  const [countdown, setCountdown] = useState('')
  const [isLive, setIsLive] = useState(false)

  // Check dismissal on mount
  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY)
    if (stored) {
      const dismissedAt = parseInt(stored, 10)
      if (Date.now() - dismissedAt < DISMISS_DURATION) {
        setDismissed(true)
        return
      }
      localStorage.removeItem(DISMISS_KEY)
    }
    setDismissed(false)
  }, [])

  const updateCountdown = useCallback(() => {
    const now = getETNow()
    const live = isWednesdayLive(now)
    setIsLive(live)

    if (!live) {
      const target = getNextWednesday8PM()
      const diff = target.getTime() - now.getTime()
      setCountdown(formatCountdown(diff))
    }
  }, [])

  useEffect(() => {
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [updateCountdown])

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="relative z-[60] flex items-center justify-center bg-black px-4 py-2" style={{ minHeight: '36px' }}>
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: '#D4A843' }}
      >
        {isLive ? (
          <>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span>Training is LIVE right now &mdash; Join on YouTube</span>
          </>
        ) : (
          <span>
            Next Live Training: Wednesday at 8 PM ET &mdash; {countdown} &mdash; Join on YouTube
          </span>
        )}
      </a>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-white/10"
        aria-label="Dismiss training announcement"
        style={{ color: '#D4A843' }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
