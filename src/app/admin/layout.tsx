'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Heart,
  ClipboardCheck,
  Inbox,
  Film,
  BarChart3,
  GitBranch,
  Package,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ArrowLeftRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const adminNavItems = [
  { label: 'Dashboard',    href: '/admin',              icon: LayoutDashboard },
  { label: 'Consultants',  href: '/admin/consultants',  icon: Users           },
  { label: 'Deals',        href: '/admin/deals',        icon: FileText        },
  { label: 'Enrollments',  href: '/admin/enrollments',  icon: Heart           },
  { label: 'Commissions',  href: '/admin/commissions',  icon: DollarSign      },
  { label: 'Products',     href: '/admin/products',     icon: Package         },
  { label: 'Submissions',  href: '/admin/submissions',  icon: Inbox           },
  { label: 'Content',      href: '/admin/content',      icon: Film            },
  { label: 'Analytics',    href: '/admin/analytics',    icon: BarChart3       },
  { label: 'Genealogy',   href: '/admin/genealogy',    icon: GitBranch       },
]

// ---------------------------------------------------------------------------
// Derive page title from pathname
// ---------------------------------------------------------------------------

function getPageTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)
  // /admin/X/[id] -> "X Detail"
  if (segment.length >= 3 && segment[1] === 'consultants') return 'Consultant Detail'
  if (segment.length >= 3 && segment[1] === 'deals') return 'Deal Detail'
  if (segment.length >= 3 && segment[1] === 'enrollments') return 'Enrollment Detail'
  if (segment.length >= 3 && segment[1] === 'commissions') return 'Commission Detail'
  const last = segment.pop() ?? 'admin'
  const map: Record<string, string> = {
    admin:        'Dashboard',
    consultants:  'Consultants',
    deals:        'Deals',
    enrollments:  'Enrollments',
    commissions:  'Commissions',
    products:     'Products',
    submissions:  'Submissions',
    content:      'Content',
    analytics:    'Analytics',
    genealogy:    'Genealogy',
  }
  return map[last] ?? 'Admin'
}

// ---------------------------------------------------------------------------
// Admin Sidebar
// ---------------------------------------------------------------------------

interface SidebarProps {
  pathname: string
  userName: string
  userInitials: string
  onClose?: () => void
  onLogout: () => void
}

function AdminSidebar({ pathname, userName, userInitials, onClose, onLogout }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full w-64 bg-sequoia-900 text-white">
      {/* Logo & Branding */}
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
          <span className="block text-[0.6rem] font-medium uppercase tracking-widest" style={{ color: '#C8A84E' }}>
            Admin Panel
          </span>
        </div>
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {adminNavItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin' || pathname === '/admin/'
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

        {/* Switch to Portal */}
        <div className="my-3 border-t border-sequoia-800/60" />
        <Link
          href="/portal"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gold-400 hover:bg-sequoia-800 hover:text-gold-300 transition-all duration-150 group"
        >
          <ArrowLeftRight className="h-4.5 w-4.5 shrink-0 text-gold-500 group-hover:text-gold-400" size={18} aria-hidden="true" />
          Switch to Portal
        </Link>
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-sequoia-800/60 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sequoia-600 text-white font-bold text-sm shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-sequoia-400 truncate">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-sequoia-400 hover:bg-sequoia-800 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Admin Layout
// ---------------------------------------------------------------------------

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isLoading, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pageTitle = getPageTitle(pathname)

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isLoggedIn, pathname, router])

  // Role guard: redirect non-admins to portal
  useEffect(() => {
    if (!isLoading && isLoggedIn && user && user.role !== 'admin') {
      router.replace('/portal')
    }
  }, [isLoading, isLoggedIn, user, router])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
  }

  // Show loading state only while auth is initializing
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in — redirect handled by useEffect above
  if (!isLoggedIn || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-neutral-50">
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    )
  }

  // Not admin — redirect handled by useEffect above
  if (user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-neutral-50">
        <p className="text-sm text-gray-500">Access denied. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-neutral-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar
          pathname={pathname}
          userName={user.name}
          userInitials={user.initials}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile admin navigation"
      >
        <AdminSidebar
          pathname={pathname}
          userName={user.name}
          userInitials={user.initials}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-brand-neutral-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-brand-neutral-500 hover:bg-brand-neutral-100 hover:text-brand-neutral-700 transition-colors"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold text-sequoia-900 tracking-tight">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-gold text-xs">Admin</span>
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
