'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'

interface StepWelcomeProps {
  userName: string
  userPhone: string
  onNext: (data: { fullName: string; phone: string }) => void
}

export default function StepWelcome({ userName, userPhone, onNext }: StepWelcomeProps) {
  const [fullName, setFullName] = useState(userName)
  const [phone, setPhone] = useState(userPhone || '')

  const canProceed = fullName.trim().length > 0

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero greeting */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 mb-6">
          <Image src="/logo-gold.png" alt="Sequoia" width={40} height={40} className="object-contain" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Welcome to Sequoia, {userName.split(' ')[0]}!
        </h1>
        <p className="text-sequoia-300 text-lg max-w-md mx-auto">
          We&apos;re excited to have you on board. Let&apos;s set up your account in just a few steps.
        </p>
      </div>

      {/* What to expect */}
      <div className="bg-sequoia-800/50 border border-sequoia-700/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-gold-500 shrink-0" />
          <p className="text-sm font-medium text-sequoia-200">
            7 quick steps &middot; About 5 minutes
          </p>
        </div>
        <ul className="space-y-2 text-sm text-sequoia-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Confirm your profile details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Upload your headshot
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Share your professional background
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Review compliance documents
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Watch your first training
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
            Set your income goals
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5 max-w-md mx-auto mb-8">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-sequoia-200 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-sequoia-800/60 border border-sequoia-700/60 rounded-xl text-white placeholder-sequoia-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-sequoia-200 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-sequoia-800/60 border border-sequoia-700/60 rounded-xl text-white placeholder-sequoia-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => onNext({ fullName: fullName.trim(), phone: phone.trim() })}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          Let&apos;s Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
