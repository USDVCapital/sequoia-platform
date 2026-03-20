'use client'

import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #C8A84E 0%, transparent 70%)' }}
      />

      <div className="relative z-10 text-center px-6 py-20 max-w-2xl">
        {/* Large 404 with gold gradient */}
        <h1
          className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter select-none"
          style={{
            background: 'linear-gradient(135deg, #C8A84E 0%, #E8D48B 40%, #C8A84E 60%, #A08030 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          This page has wandered into the forest
        </h2>

        <p className="mt-4 text-lg text-white/60 leading-relaxed max-w-md mx-auto">
          Even the tallest Sequoia starts from a single seed — but this page doesn&apos;t exist yet.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="secondary" size="lg">
            Return Home
          </Button>
          <Button href="/contact" variant="outline-light" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}
