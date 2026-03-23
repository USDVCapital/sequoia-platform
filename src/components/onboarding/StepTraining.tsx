'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { GraduationCap, Play, CheckCircle } from 'lucide-react'

interface StepTrainingProps {
  onNext: () => void
}

const REQUIRED_SECONDS = 120 // 2 minutes for demo purposes

export default function StepTraining({ onNext }: StepTrainingProps) {
  const [elapsed, setElapsed] = useState(0)
  const [started, setStarted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const completed = elapsed >= REQUIRED_SECONDS

  const startTimer = useCallback(() => {
    if (started || completed) return
    setStarted(true)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1
        if (next >= REQUIRED_SECONDS && intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        return next
      })
    }, 1000)
  }, [started, completed])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const progressPct = Math.min((elapsed / REQUIRED_SECONDS) * 100, 100)
  const minutesLeft = Math.max(0, Math.ceil((REQUIRED_SECONDS - elapsed) / 60))

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 mb-5">
          <GraduationCap className="w-7 h-7 text-gold-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your First Training
        </h2>
        <p className="text-sequoia-300 max-w-md mx-auto">
          Watch the 2026 strategy overview to hit the ground running. Watch for at least 2 minutes to continue.
        </p>
      </div>

      {/* Video container */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-sequoia-800 border border-sequoia-700/50 shadow-xl">
          <iframe
            src="https://www.youtube.com/embed/tekFBzCrmB4?enablejsapi=1&rel=0"
            title="The Year of the Hero | 2026 Strategy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Progress tracking */}
      <div className="max-w-2xl mx-auto mb-8">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-sequoia-200">
              {completed ? (
                <span className="flex items-center gap-1.5 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Training requirement met!
                </span>
              ) : started ? (
                `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} remaining`
              ) : (
                'Press play to begin tracking'
              )}
            </span>
            <span className="text-xs text-sequoia-500">
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')} / {Math.floor(REQUIRED_SECONDS / 60)}:{(REQUIRED_SECONDS % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="h-2 bg-sequoia-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPct}%`,
                backgroundColor: completed ? '#22c55e' : '#C8A84E',
              }}
            />
          </div>
        </div>

        {/* Start tracking button */}
        {!started && !completed && (
          <div className="flex justify-center mt-4">
            <button
              onClick={startTimer}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sequoia-800 hover:bg-sequoia-700 border border-sequoia-700/60 rounded-xl text-sm font-medium text-sequoia-200 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-gold-500" />
              I&apos;m watching &mdash; start timer
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!completed}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
