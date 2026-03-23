'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, Camera, Briefcase, ShieldCheck, GraduationCap, Target, User } from 'lucide-react'

interface StepCompleteProps {
  userName: string
  onEnterPortal: () => void
}

// CSS confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#C8A84E', '#D9BA52', '#F3E4A0', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
  const color = colors[index % colors.length]
  const left = `${Math.random() * 100}%`
  const delay = `${Math.random() * 3}s`
  const duration = `${2.5 + Math.random() * 2}s`
  const size = `${4 + Math.random() * 6}px`
  const rotation = `${Math.random() * 360}deg`

  return (
    <div
      className="absolute top-0 opacity-0"
      style={{
        left,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        transform: `rotate(${rotation})`,
        animation: `confetti-fall ${duration} ${delay} ease-in forwards`,
      }}
    />
  )
}

export default function StepComplete({ userName, onEnterPortal }: StepCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  const completedItems = [
    { icon: User, label: 'Profile details confirmed' },
    { icon: Camera, label: 'Profile photo set' },
    { icon: Briefcase, label: 'Professional background added' },
    { icon: ShieldCheck, label: 'Compliance agreements accepted' },
    { icon: GraduationCap, label: 'First training completed' },
    { icon: Target, label: 'Goals configured' },
  ]

  return (
    <div className="animate-in fade-in duration-500 relative">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Confetti keyframes injected via style tag */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(-10px) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.5);
          }
        }
      `}</style>

      <div className="text-center mb-10">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 mb-6 animate-in zoom-in duration-500">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          You&apos;re All Set!
        </h2>
        <p className="text-sequoia-300 text-lg max-w-md mx-auto">
          Congratulations, {userName.split(' ')[0]}! Your account is fully set up and ready to go.
        </p>
      </div>

      {/* Summary */}
      <div className="max-w-md mx-auto mb-10">
        <div className="bg-sequoia-800/50 border border-sequoia-700/50 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-sequoia-300 uppercase tracking-wider mb-3">
            Setup Summary
          </h3>
          {completedItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10">
                <Icon className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-sequoia-200">{label}</span>
              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Enter portal CTA */}
      <div className="flex justify-center">
        <button
          onClick={onEnterPortal}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gold-500 hover:bg-gold-600 rounded-xl text-lg font-bold transition-all duration-200 cursor-pointer shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-[1.02] active:scale-[0.98]"
          style={{ color: '#FFFFFF' }}
        >
          Enter Your Portal
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
