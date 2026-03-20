'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNextWednesday8pmET(): Date {
  // Get current time in ET
  const now = new Date()
  const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  const etNow = new Date(etString)

  const day = etNow.getDay() // 0=Sun, 3=Wed
  let daysUntilWed = (3 - day + 7) % 7

  // If today is Wednesday, check if it's before or after 8 PM ET
  if (daysUntilWed === 0) {
    if (etNow.getHours() >= 20) {
      daysUntilWed = 7 // after 8 PM, go to next Wednesday
    }
  }

  // Build the target date in ET
  const target = new Date(etNow)
  target.setDate(etNow.getDate() + daysUntilWed)
  target.setHours(20, 0, 0, 0)

  // Convert back to a real Date by computing the offset
  const diff = target.getTime() - etNow.getTime()
  return new Date(now.getTime() + diff)
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date()
  const diff = Math.max(0, target.getTime() - now.getTime())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export default function TrainingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const target = getNextWednesday8pmET()

    function update() {
      setTimeLeft(getTimeLeft(target))
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return null

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-2.5 shadow-sm">
      {/* Pulsing green dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>

      <span className="text-sm font-medium text-gray-700">Next live training:</span>

      <div className="flex items-center gap-1.5">
        <CountdownUnit value={timeLeft.days} label="D" />
        <span className="text-gray-300 font-medium">:</span>
        <CountdownUnit value={timeLeft.hours} label="H" />
        <span className="text-gray-300 font-medium">:</span>
        <CountdownUnit value={timeLeft.minutes} label="M" />
        <span className="text-gray-300 font-medium">:</span>
        <CountdownUnit value={timeLeft.seconds} label="S" />
      </div>
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold tabular-nums text-gray-900">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-semibold uppercase text-gray-400">{label}</span>
    </span>
  )
}
