import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-sequoia-100 text-sequoia-800 ring-sequoia-600/20',
  warning: 'bg-gold-100 text-gold-800 ring-gold-600/20',
  info: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  neutral: 'bg-gray-100 text-gray-700 ring-gray-500/20',
}

export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variantClasses[variant],
      )}
    >
      {children}
    </span>
  )
}
