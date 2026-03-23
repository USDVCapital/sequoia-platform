'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, isLoading, user } = useAuth()

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login?redirect=/onboarding')
    }
  }, [isLoading, isLoggedIn, router])

  // If already onboarded, send to portal
  useEffect(() => {
    if (!isLoading && isLoggedIn && user?.onboardingCompleted) {
      router.replace('/portal')
    }
  }, [isLoading, isLoggedIn, user, router])

  if (isLoading || !isLoggedIn || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-sequoia-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-700 border-t-gold-500" />
          <p className="text-sm text-sequoia-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sequoia-900 text-white">
      {/* Top bar with logo */}
      <header className="flex items-center px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sequoia-800/80 shrink-0">
            <Image
              src="/logo-gold.png"
              alt="Sequoia logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-white">
              SEQUOIA
            </span>
            <span className="block text-[0.6rem] font-medium uppercase tracking-widest text-sequoia-400">
              Onboarding
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
