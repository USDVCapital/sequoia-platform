'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Banknote,
  Heart,
  Zap,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Users,
  BadgeDollarSign,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

// ─── Mock Consultant Data ────────────────────────────────────────────────────

const CONSULTANTS: Record<
  string,
  {
    name: string
    title: string
    phone: string
    email: string
    initials: string
    avatarColor: string
  }
> = {
  'allen-wu': {
    name: 'Allen Wu',
    title: 'Founder & CEO',
    phone: '(301) 337-8035',
    email: 'allen@seqsolution.com',
    initials: 'AW',
    avatarColor: 'bg-gold-500',
  },
  'todd-billings': {
    name: 'Todd Billings',
    title: 'Senior Consultant',
    phone: '(555) 123-4567',
    email: 'todd@seqsolution.com',
    initials: 'TB',
    avatarColor: 'bg-sequoia-600',
  },
}

const services = [
  {
    icon: <Building2 size={28} />,
    title: 'Commercial Real Estate',
    description: 'Bridge, DSCR, Fix & Flip, Construction, SBA',
    product: 'bridge-loan',
  },
  {
    icon: <Banknote size={28} />,
    title: 'Business Funding',
    description: 'Working Capital, Equipment, AR Funding, MCA',
    product: 'working-capital',
  },
  {
    icon: <Heart size={28} />,
    title: 'Workplace Wellness (EHMP)',
    description: 'Zero-cost wellness benefit for employers',
    product: 'ehmp',
  },
  {
    icon: <Zap size={28} />,
    title: 'Clean Energy',
    description: 'Commercial Solar & EV Charging',
    product: 'commercial-solar',
  },
]

const trustPoints = [
  { icon: <ShieldCheck size={22} />, label: 'Backed by Sequoia Enterprise Solutions' },
  { icon: <Award size={22} />, label: 'BBB Accredited' },
  { icon: <CheckCircle2 size={22} />, label: 'Minority & Veteran Owned' },
]

const stats = [
  { value: '$93M+', label: 'Funded' },
  { value: '2,700+', label: 'Consultants' },
  { value: '400+', label: 'Deals Closed' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ConsultantPage() {
  const params = useParams()
  const slug = params.slug as string
  const consultant = CONSULTANTS[slug]

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-neutral-50">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-sequoia-900 mb-3">Consultant Not Found</h1>
          <p className="text-brand-neutral-500 mb-6">
            We couldn&apos;t find that consultant profile. Visit seqsolution.com to learn more.
          </p>
          <Button href="/" variant="primary">Go to Homepage</Button>
        </div>
      </div>
    )
  }

  const applyUrl = `/apply?ref=${slug}`

  return (
    <div className="min-h-screen bg-brand-neutral-50">
      {/* ── Consultant Banner ── */}
      <section className="bg-white border-b border-brand-neutral-200 sticky top-0 z-50">
        <div className="container-brand py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div
              className={`${consultant.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0`}
            >
              {consultant.initials}
            </div>
            <div>
              <div className="badge-gold mb-1">Your Sequoia Advisor</div>
              <p className="font-semibold text-sequoia-900 leading-tight">{consultant.name}</p>
              <p className="text-xs text-brand-neutral-500">Sequoia Lending Consultant</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={`tel:${consultant.phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1.5 text-sm text-brand-neutral-600 hover:text-sequoia-900 transition-colors"
            >
              <Phone size={14} /> {consultant.phone}
            </a>
            <a
              href={`mailto:${consultant.email}`}
              className="inline-flex items-center gap-1.5 text-sm text-brand-neutral-600 hover:text-sequoia-900 transition-colors"
            >
              <Mail size={14} /> {consultant.email}
            </a>
            <Button href={applyUrl} variant="secondary" size="sm">
              Apply for Funding
            </Button>
          </div>
        </div>
      </section>

      {/* ── Hero ── */}
      <section className="bg-gradient-hero section-padding-lg">
        <div className="container-brand text-center">
          <FadeIn direction="up">
            <span className="badge-dark mb-4 inline-block">Sequoia Enterprise Solutions</span>
            <h1 className="text-gradient-hero text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 mx-auto max-w-3xl">
              Fueling Growth &amp; Expanding Possibilities
            </h1>
            <p className="text-brand-neutral-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Get expert guidance from{' '}
              <span className="text-gold-400 font-semibold">{consultant.name}</span> for commercial
              lending, business funding, wellness programs, and clean energy solutions.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button href={applyUrl} variant="secondary" size="lg">
                Apply for Funding <ArrowRight size={18} />
              </Button>
              <Button
                href={`tel:${consultant.phone.replace(/\D/g, '')}`}
                variant="outline-light"
                size="lg"
              >
                <Phone size={18} /> Schedule a Call
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-sequoia-900 text-center mb-3">Our Solutions</h2>
            <p className="text-brand-neutral-500 text-center max-w-xl mx-auto mb-10">
              Comprehensive financial products matched to your business needs.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <StaggerItem key={svc.title}>
                <Link
                  href={`${applyUrl}&product=${svc.product}`}
                  className="card-sequoia block p-6 h-full group"
                >
                  <div className="icon-box-gold mb-4 group-hover:scale-105 transition-transform">
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-sequoia-900 mb-2">{svc.title}</h3>
                  <p className="text-sm text-brand-neutral-500 leading-relaxed">
                    {svc.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 mt-4">
                    Learn more <ArrowRight size={14} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Why Work With [Name] ── */}
      <section className="section-padding bg-brand-neutral-50">
        <div className="container-brand">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-sequoia-900 text-center mb-3">
              Why Work With {consultant.name.split(' ')[0]}
            </h2>
            <p className="text-brand-neutral-500 text-center max-w-lg mx-auto mb-10">
              Trusted expertise backed by a nationally recognized platform.
            </p>
          </FadeIn>

          {/* Trust Points */}
          <FadeIn direction="up" delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              {trustPoints.map((tp) => (
                <div
                  key={tp.label}
                  className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-sm border border-brand-neutral-200"
                >
                  <span className="text-gold-600">{tp.icon}</span>
                  <span className="text-sm font-medium text-sequoia-800">{tp.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn direction="up" delay={0.2}>
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="stat-number text-gradient-gold">{s.value}</p>
                  <p className="stat-label mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="bg-gradient-sequoia-dark section-padding">
        <div className="container-brand text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-brand-neutral-400 mb-8 max-w-md mx-auto">
              Apply now and {consultant.name.split(' ')[0]} will guide you through every step.
            </p>
            <Button href={applyUrl} variant="secondary" size="lg">
              Apply Now <ArrowRight size={18} />
            </Button>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-brand-neutral-400">
              <a
                href={`tel:${consultant.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone size={14} /> {consultant.phone}
              </a>
              <a
                href={`mailto:${consultant.email}`}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail size={14} /> {consultant.email}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Brand Footer ── */}
      <footer className="bg-sequoia-950 py-6">
        <div className="container-brand text-center">
          <p className="text-xs text-brand-neutral-500">
            &copy; {new Date().getFullYear()} Sequoia Enterprise Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
