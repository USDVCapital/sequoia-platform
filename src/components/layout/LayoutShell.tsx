'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrainingAnnouncementBar from '@/components/ui/TrainingAnnouncementBar'
import ScrollToTop from '@/components/motion/ScrollToTop'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname.startsWith('/portal')

  if (isPortal) {
    // Portal pages have their own layout (sidebar + header) — no navbar/footer
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
