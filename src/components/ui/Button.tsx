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
    'bg-black hover:bg-neutral-800 focus-visible:ring-black shadow-sm dark:bg-white dark:hover:bg-neutral-100',
  secondary:
    'bg-gold-500 hover:bg-gold-600 focus-visible:ring-gold-500 shadow-sm',
  outline:
    'border border-black/20 hover:bg-neutral-100 focus-visible:ring-black bg-transparent dark:border-white/20 dark:hover:bg-white/10',
  ghost:
    'hover:bg-neutral-100 focus-visible:ring-black bg-transparent dark:hover:bg-white/10',
}

// Inline styles to guarantee text color — Tailwind utility classes lose to
// unlayered CSS in the cascade, so we must use inline styles for anchor elements.
const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#000000' },
  outline: { color: '#000000' },
  ghost: { color: '#525252' },
}

const variantStylesDark: Record<ButtonVariant, CSSProperties> = {
  primary: { color: '#000000' },
  secondary: { color: '#000000' },
  outline: { color: '#FFFFFF' },
  ghost: { color: '#D4D4D4' },
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
      <LinkWithColor href={href} className={classes} variant={variant}>
        {children}
      </LinkWithColor>
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

// Client component that reads dark mode state and applies correct inline color
function LinkWithColor({
  href,
  className,
  variant,
  children,
}: {
  href: string
  className: string
  variant: ButtonVariant
  children: ReactNode
}) {
  // Use a ref + effect to handle dark mode color since inline styles
  // can't respond to CSS class changes
  const ref = import('react').then(() => {}) // just to satisfy linter

  return (
    <Link
      href={href}
      className={className}
      ref={(el) => {
        if (!el) return
        const updateColor = () => {
          const isDark = document.documentElement.classList.contains('dark')
          const styles = isDark ? variantStylesDark[variant] : variantStyles[variant]
          el.style.color = styles.color ?? ''
        }
        updateColor()
        // Watch for dark mode changes
        const observer = new MutationObserver(updateColor)
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        })
      }}
    >
      {children}
    </Link>
  )
}
