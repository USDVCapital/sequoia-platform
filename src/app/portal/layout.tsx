'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Trophy,
  MessageSquare,
  User,
  Bot,
  FolderOpen,
  Bell,
  PlusCircle,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const navItems = [
  { label: 'Dashboard',    href: '/portal',            icon: LayoutDashboard },
  { label: 'My Pipeline',  href: '/portal/pipeline',   icon: FileText        },
  { label: 'Training',     href: '/portal/training',   icon: GraduationCap   },
  { label: 'Leaderboard',  href: '/portal/leaderboard', icon: Trophy         },
  { label: 'Community',    href: '/portal/community',  icon: MessageSquare   },
  { label: 'Materials',    href: '/portal/materials',  icon: FolderOpen      },
  { label: 'My Profile',   href: '/portal/profile',    icon: User            },
  { label: 'CEA AI',       href: '/portal/ai',         icon: Bot             },
]

// ---------------------------------------------------------------------------
// Derive page title from pathname
// ---------------------------------------------------------------------------

function getPageTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).pop() ?? ''
  const map: Record<string, string> = {
    portal:      'Dashboard',
    pipeline:    'My Pipeline',
    training:    'Training',
    leaderboard: 'Leaderboard',
    community:   'Community',
    materials:   'Marketing Materials',
    profile:     'My Profile',
    ai:          'CEA AI',
  }
  return map[segment] ?? 'Dashboard'
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

interface SidebarProps {
  pathname: string
  onClose?: () => void
}

function Sidebar({ pathname, onClose }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full w-64 bg-sequoia-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sequoia-800/60">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sequoia-700/50 shrink-0">
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
            Consultant Portal
          </span>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto p-1.5 rounded-md text-sequoia-400 hover:text-white hover:bg-sequoia-800 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Portal navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          // Exact match for dashboard, prefix match for sub-pages
          const isActive =
            href === '/portal'
              ? pathname === '/portal' || pathname === '/portal/'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-sequoia-700 text-white shadow-sm'
                  : 'text-sequoia-300 hover:bg-sequoia-800 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${
                  isActive ? 'text-white' : 'text-sequoia-400 group-hover:text-sequoia-200'
                }`}
                size={18}
                aria-hidden="true"
              />
              {label}
              {isActive && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-sequoia-400" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-sequoia-800/60 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar placeholder */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sequoia-600 text-white font-bold text-sm shrink-0">
            TB
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Todd Billings</p>
            <p className="text-xs text-sequoia-400 truncate">ID: 222902</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-sequoia-400 hover:bg-sequoia-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Portal Layout
// ---------------------------------------------------------------------------

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pageTitle = getPageTitle(pathname)

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-brand-neutral-50">

      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar pathname={pathname} />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile portal navigation"
      >
        <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-brand-neutral-200 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-brand-neutral-500 hover:bg-brand-neutral-100 hover:text-brand-neutral-700 transition-colors"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* Page title */}
            <h1 className="text-lg font-bold text-sequoia-900 tracking-tight">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-brand-neutral-500 hover:bg-brand-neutral-100 hover:text-brand-neutral-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {/* Unread badge */}
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600" />
              </span>
            </button>

            {/* Submit a Lead CTA */}
            <Link
              href="/portal/pipeline/new"
              className="btn-gold inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Submit a Lead</span>
              <span className="sm:hidden">Lead</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
