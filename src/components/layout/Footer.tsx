import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Youtube, Instagram, Facebook } from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Apply for Funding', href: '/apply' },
]

const solutionLinks = [
  { label: 'All Solutions', href: '/solutions' },
  { label: 'Wellness Program', href: '/solutions/wellness' },
]

const consultantLinks = [
  { label: 'Join Sequoia', href: '/opportunity' },
  { label: 'Enroll', href: '/enroll' },
  { label: 'Training & Resources', href: '/resources' },
  { label: 'Consultant Login', href: '/login' },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/seqsolution/',
    Icon: Linkedin,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@seqsolution',
    Icon: Youtube,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/seqsolution/',
    Icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100085730042712',
    Icon: Facebook,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function FooterColumn({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
        {heading}
      </h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith('http')
  return (
    <li>
      <Link
        href={href}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="text-sm text-white/60 hover:text-white transition-colors"
      >
        {label}
      </Link>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* Brand + columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand block – takes 1 extra column on large screens */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center mb-4"
              aria-label="Sequoia Enterprise Solutions – home"
            >
              <Image
                src="/logo-gold.png"
                alt="Sequoia Enterprise Solutions"
                width={144}
                height={36}
                style={{ height: '36px', width: 'auto' }}
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Empowering businesses and consultants with capital solutions,
              clean-energy programs, and enterprise services.
            </p>
          </div>

          {/* Column 1 – Company */}
          <FooterColumn heading="Company">
            {companyLinks.map((l) => (
              <FooterLink key={l.href} href={l.href} label={l.label} />
            ))}
          </FooterColumn>

          {/* Column 2 – Solutions */}
          <FooterColumn heading="Solutions">
            {solutionLinks.map((l) => (
              <FooterLink key={l.href} href={l.href} label={l.label} />
            ))}
          </FooterColumn>

          {/* Column 3 – Consultants */}
          <FooterColumn heading="Consultants">
            {consultantLinks.map((l) => (
              <FooterLink key={l.href} href={l.href} label={l.label} />
            ))}
          </FooterColumn>

          {/* Column 4 – Connect */}
          <FooterColumn heading="Connect">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      {/* Gold accent divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/60 to-transparent" />

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-center text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>© 2026 Sequoia Enterprise Solutions. All rights reserved.</p>
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
              <address className="not-italic">
                9200 Corporate Blvd, Ste 142, Rockville, MD 20850
              </address>
              <a
                href="tel:+13013378035"
                className="hover:text-white/80 transition-colors"
              >
                301-337-8035
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
