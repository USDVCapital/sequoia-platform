import Link from 'next/link'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
}

const baseClasses =
  'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900'

const interactiveClasses =
  'hover:shadow-md hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer'

export default function Card({ children, className, href }: CardProps) {
  const classes = clsx(
    baseClasses,
    href && interactiveClasses,
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
