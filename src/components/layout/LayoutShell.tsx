'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrainingAnnouncementBar from '@/components/ui/TrainingAnnouncementBar'
import ScrollToTop from '@/components/motion/ScrollToTop'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname.startsWith('/portal')
  const isAdmin = pathname.startsWith('/admin')
  const isOnboarding = pathname.startsWith('/onboarding')

  if (isPortal || isAdmin || isOnboarding) {
    // Portal, admin, and onboarding pages have their own layouts — no navbar/footer
    return <>{children}</>
  }

  return (
    <>
      <TrainingAnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
