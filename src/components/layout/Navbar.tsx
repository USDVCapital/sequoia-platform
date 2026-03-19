'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { TreePine, ChevronDown, Menu, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const solutionsLinks = [
  { label: 'Real Estate Loans', href: '/solutions/real-estate-loans' },
  { label: 'Business Funding', href: '/solutions/business-funding' },
  { label: 'Business Services', href: '/solutions/business-services' },
  { label: 'Clean Energy', href: '/solutions/clean-energy' },
  { label: 'Wellness Program', href: '/solutions/wellness-program' },
]

const consultantLinks = [
  { label: 'Opportunity', href: '/consultants/opportunity' },
  { label: 'Training Library', href: '/consultants/training-library' },
  { label: 'Leaderboard', href: '/consultants/leaderboard' },
]

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

  // Close on outside click
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
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-sequoia-700 transition-colors py-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-sequoia-50 hover:text-sequoia-700 transition-colors"
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
        className="flex w-full items-center justify-between py-3 text-base font-medium text-gray-800"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-3 mb-1 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="py-2 text-sm text-gray-600 hover:text-sequoia-700 transition-colors"
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
// Navbar
// ---------------------------------------------------------------------------

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Sequoia Enterprise Solutions – home"
          >
            <TreePine className="h-7 w-7 text-sequoia-700" aria-hidden="true" />
            <div className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-sequoia-900">
                SEQUOIA
              </span>
              <span className="block text-[0.6rem] font-medium uppercase tracking-widest text-gray-500">
                Enterprise Solutions
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Primary navigation"
          >
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-sequoia-700 transition-colors py-2"
            >
              About Us
            </Link>

            <Dropdown label="Solutions" items={solutionsLinks} />
            <Dropdown label="For Consultants" items={consultantLinks} />

            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-sequoia-700 transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/get-funding"
              className="inline-flex items-center justify-center rounded-md bg-sequoia-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-sequoia-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sequoia-700 focus-visible:ring-offset-2"
            >
              Get Funding
            </Link>
            <Link
              href="/consultant-login"
              className="inline-flex items-center justify-center rounded-md border border-sequoia-700 bg-transparent px-5 py-2.5 text-sm font-medium text-sequoia-700 hover:bg-sequoia-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sequoia-700 focus-visible:ring-offset-2"
            >
              Consultant Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
        <div className="flex items-center justify-between border-b border-gray-100 px-5 h-16 shrink-0">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-2"
            aria-label="Sequoia Enterprise Solutions – home"
          >
            <TreePine className="h-6 w-6 text-sequoia-700" aria-hidden="true" />
            <span className="font-extrabold tracking-tight text-sequoia-900">
              SEQUOIA
            </span>
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-gray-100">
          <div className="pb-3">
            <Link
              href="/about"
              onClick={closeMobile}
              className="block py-3 text-base font-medium text-gray-800 hover:text-sequoia-700 transition-colors"
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
              className="block py-3 text-base font-medium text-gray-800 hover:text-sequoia-700 transition-colors"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Drawer CTAs */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-5 flex flex-col gap-3">
          <Link
            href="/get-funding"
            onClick={closeMobile}
            className="flex items-center justify-center rounded-md bg-sequoia-700 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-sequoia-800 transition-colors"
          >
            Get Funding
          </Link>
          <Link
            href="/consultant-login"
            onClick={closeMobile}
            className="flex items-center justify-center rounded-md border border-sequoia-700 bg-transparent px-5 py-3 text-sm font-medium text-sequoia-700 hover:bg-sequoia-50 transition-colors"
          >
            Consultant Login
          </Link>
        </div>
      </div>
    </>
  )
}
