'use client'

import { useState } from 'react'
import { Briefcase } from 'lucide-react'

interface StepBackgroundProps {
  initialBackground: string
  initialBio: string
  onNext: (data: { professionalBackground: string; bio: string }) => void
}

const BG_MAX = 1000
const BIO_MAX = 300

export default function StepBackground({ initialBackground, initialBio, onNext }: StepBackgroundProps) {
  const [background, setBackground] = useState(initialBackground)
  const [bio, setBio] = useState(initialBio)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 mb-5">
          <Briefcase className="w-7 h-7 text-gold-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Professional Background
        </h2>
        <p className="text-sequoia-300 max-w-sm mx-auto">
          Share your experience so clients and team members can learn about you.
        </p>
      </div>

      <div className="space-y-6 max-w-lg mx-auto mb-8">
        {/* Professional Background */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="background" className="text-sm font-medium text-sequoia-200">
              Professional Background
            </label>
            <span className={`text-xs ${background.length > BG_MAX ? 'text-red-400' : 'text-sequoia-500'}`}>
              {background.length}/{BG_MAX}
            </span>
          </div>
          <textarea
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            rows={5}
            maxLength={BG_MAX}
            className="w-full px-4 py-3 bg-sequoia-800/60 border border-sequoia-700/60 rounded-xl text-white placeholder-sequoia-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all resize-none"
            placeholder="Describe your professional experience, industry expertise, and what brought you to Sequoia..."
          />
        </div>

        {/* Short Bio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="bio" className="text-sm font-medium text-sequoia-200">
              Short Bio
            </label>
            <span className={`text-xs ${bio.length > BIO_MAX ? 'text-red-400' : 'text-sequoia-500'}`}>
              {bio.length}/{BIO_MAX}
            </span>
          </div>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={BIO_MAX}
            className="w-full px-4 py-3 bg-sequoia-800/60 border border-sequoia-700/60 rounded-xl text-white placeholder-sequoia-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all resize-none"
            placeholder="A brief intro that appears on your profile card..."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => onNext({ professionalBackground: background.trim(), bio: bio.trim() })}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
