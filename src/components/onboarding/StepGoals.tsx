'use client'

import { useState } from 'react'
import { Target, DollarSign, Users, Handshake } from 'lucide-react'

interface StepGoalsProps {
  onNext: (goals: { monthlyIncome: number; ehmpEnrollees: number; dealsToClose: number }) => void
}

export default function StepGoals({ onNext }: StepGoalsProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [ehmpEnrollees, setEhmpEnrollees] = useState(100)
  const [dealsToClose, setDealsToClose] = useState(12)

  const goals = [
    {
      label: 'Monthly Income Goal',
      icon: DollarSign,
      value: monthlyIncome,
      min: 1000,
      max: 50000,
      step: 1000,
      onChange: setMonthlyIncome,
      format: (v: number) => `$${v.toLocaleString()}`,
      color: 'text-green-400',
    },
    {
      label: 'EHMP Enrollees Goal',
      icon: Users,
      value: ehmpEnrollees,
      min: 10,
      max: 1000,
      step: 10,
      onChange: setEhmpEnrollees,
      format: (v: number) => v.toLocaleString(),
      color: 'text-blue-400',
    },
    {
      label: 'Deals to Close Goal',
      icon: Handshake,
      value: dealsToClose,
      min: 1,
      max: 50,
      step: 1,
      onChange: setDealsToClose,
      format: (v: number) => v.toString(),
      color: 'text-gold-400',
    },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 mb-5">
          <Target className="w-7 h-7 text-gold-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Set Your Goals
        </h2>
        <p className="text-sequoia-300 max-w-sm mx-auto">
          Define what success looks like for you. You can always adjust these later.
        </p>
      </div>

      <div className="grid gap-5 max-w-lg mx-auto mb-8">
        {goals.map(({ label, icon: Icon, value, min, max, step, onChange, format, color }) => (
          <div
            key={label}
            className="bg-sequoia-800/50 border border-sequoia-700/50 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sequoia-700/50">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sequoia-200">{label}</p>
              </div>
              <span className="text-xl font-bold text-white tabular-nums">
                {format(value)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-sequoia-700 accent-[#C8A84E]"
              style={{
                background: `linear-gradient(to right, #C8A84E 0%, #C8A84E ${((value - min) / (max - min)) * 100}%, #404040 ${((value - min) / (max - min)) * 100}%, #404040 100%)`,
              }}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-sequoia-600">{format(min)}</span>
              <span className="text-xs text-sequoia-600">{format(max)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => onNext({ monthlyIncome, ehmpEnrollees, dealsToClose })}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/20"
          style={{ color: '#FFFFFF' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
