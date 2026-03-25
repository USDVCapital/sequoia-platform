'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  accentColor?: 'gold' | 'default'
  href?: string
}

export default function StatsCard({ icon: Icon, label, value, subtext, accentColor = 'default', href }: StatsCardProps) {
  const iconBoxClass = accentColor === 'gold' ? 'icon-box-gold' : 'icon-box-sequoia'

  const content = (
    <div className="flex items-start gap-4">
      <div className={iconBoxClass}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 mb-1">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-sequoia-900 tracking-tight leading-none">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-brand-neutral-400 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="card-sequoia p-5 block hover:shadow-md transition-shadow cursor-pointer">
        {content}
      </Link>
    )
  }

  return (
    <div className="card-sequoia p-5">
      {content}
    </div>
  )
}
