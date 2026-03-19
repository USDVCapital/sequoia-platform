'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const solutionsLinks = [
  { label: 'All Solutions', href: '/solutions' },
  { label: 'Wellness Program', href: '/solutions/wellness' },
]

const consultantLinks = [
  { label: 'Opportunity', href: '/opportunity' },
  { label: 'Training Library', href: '/resources' },
  { label: 'Enroll', href: '/enroll' },
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
        className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors py-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900 py-1.5 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
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
        className={`sticky top-0 z-40 w-full bg-white dark:bg-black transition-all duration-200 ${
          scrolled
            ? 'border-b border-neutral-200 dark:border-white/10'
            : 'border-b border-neutral-100 dark:border-white/5'
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
              className="text-sm font-medium text-neutral-600 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors py-2"
            >
              About Us
            </Link>

            <Dropdown label="Solutions" items={solutionsLinks} />
            <Dropdown label="For Consultants" items={consultantLinks} />

            <Link
              href="/contact"
              className="text-sm font-medium text-neutral-600 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:bg-white dark:hover:bg-neutral-100"
              style={{ color: '#FFFFFF' }}
            >
              Get Funding
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md border border-black/20 bg-transparent px-5 py-2.5 text-sm font-medium text-black hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Consultant Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
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
        </nav>

        {/* Drawer CTAs */}
        <div className="shrink-0 border-t border-neutral-100 px-5 py-5 flex flex-col gap-3">
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
        </div>
      </div>
    </>
  )
}
