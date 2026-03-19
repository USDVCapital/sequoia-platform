import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-neutral-100 text-neutral-800 ring-neutral-300/40',
  warning: 'bg-gold-100 text-gold-800 ring-gold-600/20',
  info: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  neutral: 'bg-neutral-100 text-neutral-600 ring-neutral-300/40',
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
