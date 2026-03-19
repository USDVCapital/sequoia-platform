'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import type { ReactNode, MouseEventHandler, CSSProperties } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-black hover:bg-neutral-800 focus-visible:ring-black shadow-sm',
  secondary:
    'bg-gold-500 hover:bg-gold-600 focus-visible:ring-gold-500 shadow-sm',
  outline:
    'border border-black/20 hover:bg-neutral-100 focus-visible:ring-black bg-transparent',
  ghost:
    'hover:bg-neutral-100 focus-visible:ring-black bg-transparent',
}

// Inline styles to guarantee text color — Tailwind utility classes lose to
// unlayered CSS in the cascade, so we must use inline styles for anchor elements.
const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#000000' },
  outline: { color: '#000000' },
  ghost: { color: '#525252' },
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes} style={variantStyles[variant]}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  )
}
