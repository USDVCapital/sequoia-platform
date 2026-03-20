'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  Users,
  Trophy,
  Bot,
  UserCircle,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const solutionsLinks = [
  { label: 'All Solutions', href: '/solutions' },
  { label: 'Real Estate Loans', href: '/solutions/real-estate' },
  { label: 'Business Funding', href: '/solutions/business-funding' },
  { label: 'Wellness Program', href: '/solutions/wellness' },
  { label: 'Clean Energy', href: '/solutions/clean-energy' },
]

const consultantLinks = [
  { label: 'Opportunity', href: '/opportunity' },
  { label: 'Training Library', href: '/resources' },
  { label: 'Enroll', href: '/enroll' },
]

const portalLinks = [
  { label: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { label: 'My Pipeline', href: '/portal/pipeline', icon: TrendingUp },
  { label: 'Training', href: '/portal/training', icon: GraduationCap },
  { label: 'Community', href: '/portal/community', icon: Users },
  { label: 'Leaderboard', href: '/portal/leaderboard', icon: Trophy },
  { label: 'CEA AI', href: '/portal/ai', icon: Bot },
  { label: 'My Profile', href: '/portal/profile', icon: UserCircle },
]

const notifColors: Record<string, string> = {
  deal_update: 'bg-blue-500',
  training_reminder: 'bg-gold-500',
  leaderboard_update: 'bg-green-500',
  community_mention: 'bg-purple-500',
}

// ---------------------------------------------------------------------------
// Desktop dropdown
// ---------------------------------------------------------------------------

interface DropdownProps {
  label: string
  items: { label: string; href: string }[]
}

function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-black transition-colors py-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-neutral-200 bg-white py-1.5 shadow-lg z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notification Bell
// ---------------------------------------------------------------------------

function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = () => {
    setOpen((v) => !v)
    if (!open && unreadCount > 0) {
      markAllRead()
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-neutral-200 bg-white shadow-lg z-50">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900">Notifications</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-neutral-500 text-center">No notifications</p>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-neutral-50 last:border-0 ${
                    !n.read ? 'bg-neutral-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notifColors[n.type] || 'bg-neutral-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-800 leading-snug">{n.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">{n.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Avatar Dropdown
// ---------------------------------------------------------------------------

function AvatarDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    router.push('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-gold-500 text-black text-sm font-bold hover:bg-gold-400 transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {user?.initials || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-lg z-50">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{user?.tier}</p>
          </div>
          <div className="py-1.5">
            {portalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
              >
                <link.icon size={16} className="text-neutral-400" />
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-neutral-100 py-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile accordion section
// ---------------------------------------------------------------------------

interface MobileAccordionProps {
  label: string
  items: { label: string; href: string }[]
  onNavigate: () => void
}

function MobileAccordion({ label, items, onNavigate }: MobileAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-base font-medium text-neutral-800"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-3 mb-1 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="py-2 text-sm text-neutral-600 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Portal secondary nav bar
// ---------------------------------------------------------------------------

function PortalSecondaryNav() {
  const quickLinks = [
    { label: 'Dashboard', href: '/portal' },
    { label: 'Pipeline', href: '/portal/pipeline' },
    { label: 'Training', href: '/portal/training' },
    { label: 'Community', href: '/portal/community' },
    { label: 'Leaderboard', href: '/portal/leaderboard' },
    { label: 'CEA AI', href: '/portal/ai' },
  ]

  return (
    <div className="bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1" aria-label="Portal navigation">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-gold-400 rounded-md hover:bg-neutral-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const handleMobileLogout = () => {
    closeMobile()
    logout()
    router.push('/')
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 ${
          scrolled
            ? 'border-b border-neutral-200'
            : 'border-b border-neutral-100'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Sequoia Enterprise Solutions – home"
          >
            <Image
              src="/logo-black.png"
              alt="Sequoia Enterprise Solutions"
              width={160}
              height={40}
              style={{ height: '40px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Primary navigation"
          >
            <Link
              href="/about"
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors py-2"
            >
              About Us
            </Link>

            <Dropdown label="Solutions" items={solutionsLinks} />
            <Dropdown label="For Consultants" items={consultantLinks} />

            <Link
              href="/contact"
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs — changes based on auth state */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <NotificationBell />
                <AvatarDropdown />
              </>
            ) : (
              <>
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  style={{ color: '#FFFFFF' }}
                >
                  Get Funding
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md border border-black/20 bg-transparent px-5 py-2.5 text-sm font-medium text-black hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  Consultant Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Portal secondary nav (only when logged in) */}
      {isLoggedIn && <PortalSecondaryNav />}

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-80 max-w-full bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 h-16 shrink-0">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center"
            aria-label="Sequoia Enterprise Solutions – home"
          >
            <Image
              src="/logo-black.png"
              alt="Sequoia Enterprise Solutions"
              width={120}
              height={32}
              style={{ height: '32px', width: 'auto' }}
            />
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
          <div className="pb-3">
            <Link
              href="/about"
              onClick={closeMobile}
              className="block py-3 text-base font-medium text-neutral-800 hover:text-black transition-colors"
            >
              About Us
            </Link>
          </div>

          <div className="py-1">
            <MobileAccordion
              label="Solutions"
              items={solutionsLinks}
              onNavigate={closeMobile}
            />
          </div>

          <div className="py-1">
            <MobileAccordion
              label="For Consultants"
              items={consultantLinks}
              onNavigate={closeMobile}
            />
          </div>

          <div className="pt-3">
            <Link
              href="/contact"
              onClick={closeMobile}
              className="block py-3 text-base font-medium text-neutral-800 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Portal links when logged in */}
          {isLoggedIn && (
            <div className="pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 py-2">
                Portal
              </p>
              {portalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="flex items-center gap-3 py-2.5 text-sm text-neutral-700 hover:text-black transition-colors"
                >
                  <link.icon size={16} className="text-neutral-400" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Drawer CTAs */}
        <div className="shrink-0 border-t border-neutral-100 px-5 py-5 flex flex-col gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleMobileLogout}
              className="flex items-center justify-center gap-2 rounded-md border border-red-200 bg-transparent px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/apply"
                onClick={closeMobile}
                className="flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                style={{ color: '#FFFFFF' }}
              >
                Get Funding
              </Link>
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex items-center justify-center rounded-md border border-black/20 bg-transparent px-5 py-3 text-sm font-medium text-black hover:bg-neutral-100 transition-colors"
              >
                Consultant Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
