import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  heading: ReactNode
  subheading?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = 'center',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`mx-auto max-w-3xl ${alignClass}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          {subheading}
        </p>
      )}
    </div>
  )
}
