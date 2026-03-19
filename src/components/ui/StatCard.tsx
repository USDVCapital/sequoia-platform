import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  trend?: string
}

function isTrendPositive(trend: string): boolean {
  return trend.startsWith('+')
}

export default function StatCard({ icon, value, label, trend }: StatCardProps) {
  const positive = trend ? isTrendPositive(trend) : null

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {icon}
        </div>
        {trend && (
          <span
            className={clsx(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
              positive
                ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      </div>
    </div>
  )
}
