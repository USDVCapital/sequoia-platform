'use client'

import {
  Building2,
  Hammer,
  Building,
  Landmark,
  TreePine,
  HardHat,
  Truck,
  Briefcase,
  TrendingUp,
  ShoppingBag,
  FileCheck,
  PiggyBank,
  HeartPulse,
  Wrench,
  Calculator,
  Scale,
  CreditCard,
  Sun,
  Zap,
  ArrowRight,
  Phone,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

// ─── Data ─────────────────────────────────────────────────────────────────────

const realEstateLoans = [
  {
    icon: Building2,
    name: '1–4 Unit Investment',
    range: '$100K – $5M',
    description: 'Single-family rentals, duplexes, triplexes, and fourplexes.',
    href: '/apply',
  },
  {
    icon: Hammer,
    name: 'Fix & Flip',
    range: '$100K – $10M',
    description: 'Short-term bridge financing for value-add rehab projects.',
    href: '/apply',
  },
  {
    icon: Building,
    name: 'Multi-Family 5+',
    range: '$300K – $50M',
    description: 'Apartment complexes and larger residential income properties.',
    href: '/apply',
  },
  {
    icon: Landmark,
    name: 'Mixed Use',
    range: '$300K – $50M',
    description: 'Combined residential and commercial properties in one deal.',
    href: '/apply',
  },
  {
    icon: Building,
    name: 'Commercial',
    range: '$300K – $100M',
    description: 'Office, retail, industrial, and specialty commercial assets.',
    href: '/apply',
  },
  {
    icon: TreePine,
    name: 'Land',
    range: '$100K+',
    description: 'Raw land, entitled lots, and development-ready parcels.',
    href: '/apply',
  },
  {
    icon: HardHat,
    name: 'Construction',
    range: '$100K – $500M',
    description: 'Ground-up construction financing from spec homes to large developments.',
    href: '/apply',
  },
]

const businessFunding = [
  {
    icon: Truck,
    name: 'Equipment Funding',
    range: 'Flexible terms',
    description: 'Finance machinery, technology, and core business equipment.',
    href: '/apply',
  },
  {
    icon: Truck,
    name: 'Truck & Heavy Equipment',
    range: 'Flexible terms',
    description: 'Commercial vehicles, trailers, and heavy-duty fleet financing.',
    href: '/apply',
  },
  {
    icon: TrendingUp,
    name: 'Working Capital',
    range: 'Fast funding',
    description: 'Bridge cash flow gaps and fuel day-to-day operations.',
    href: '/apply',
  },
  {
    icon: Briefcase,
    name: 'Term Loan',
    range: 'Structured repayment',
    description: 'Fixed-term business loans for planned growth initiatives.',
    href: '/apply',
  },
  {
    icon: ShoppingBag,
    name: 'Business Acquisition',
    range: 'Custom structuring',
    description: 'Purchase an existing business with tailored acquisition financing.',
    href: '/apply',
  },
  {
    icon: FileCheck,
    name: 'AR Funding',
    range: 'Up to 90% advance',
    description: 'Unlock cash tied up in outstanding invoices and receivables.',
    href: '/apply',
  },
  {
    icon: Calculator,
    name: 'Gap Funding / NINA',
    range: 'Flexible programs',
    description: 'No-income, no-asset programs and gap financing solutions.',
    href: '/apply',
  },
  {
    icon: PiggyBank,
    name: 'Retirement Account Rollover',
    range: 'ROBS strategy',
    description: 'Fund your business using retirement savings without early penalties.',
    href: '/apply',
  },
]

const businessServices = [
  {
    icon: HeartPulse,
    name: 'Wellness Program (EHMP)',
    range: 'FICA tax savings',
    description:
      'Our flagship door-opener. Employers save on FICA taxes while employees gain real wellness benefits — at zero net cost.',
    href: '/solutions/wellness',
    featured: true,
  },
  {
    icon: Wrench,
    name: 'Property Restoration',
    range: 'Insurance-backed',
    description: 'Commercial and residential restoration services coordinated end-to-end.',
    href: '/apply',
  },
  {
    icon: Calculator,
    name: 'Cost Segregation',
    range: 'Tax acceleration',
    description: 'Accelerate depreciation on real estate assets and reduce your tax burden.',
    href: '/apply',
  },
  {
    icon: Scale,
    name: 'Tax Appeal',
    range: 'Property tax reduction',
    description: 'Challenge over-assessed property valuations to lower your tax liability.',
    href: '/apply',
  },
  {
    icon: CreditCard,
    name: 'Credit Services',
    range: 'Score improvement',
    description: 'Business and personal credit building strategies to unlock better rates.',
    href: '/apply',
  },
]

const cleanEnergy = [
  {
    icon: Sun,
    name: 'Commercial Solar',
    range: 'Custom project sizing',
    description:
      'Reduce operating costs with commercial-scale solar installations and available tax incentives.',
    href: '/apply',
  },
  {
    icon: Zap,
    name: 'EV Charging Stations',
    range: 'Fleet & property installs',
    description:
      'Future-proof your property or fleet with EV infrastructure that may qualify for federal credits.',
    href: '/apply',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

interface ProductCardProps {
  icon: React.ElementType
  name: string
  range: string
  description: string
  href: string
  featured?: boolean
  cta?: string
}

function ProductCard({
  icon: Icon,
  name,
  range,
  description,
  href,
  featured = false,
  cta = 'Apply Now',
}: ProductCardProps) {
  return (
    <Card
      className={
        featured
          ? 'relative border-gold-400/60 bg-gradient-to-br from-gold-100 to-sequoia-50 ring-1 ring-gold-400/40'
          : ''
      }
    >
      {featured && (
        <span className="badge-gold absolute -top-3 left-5">Door Opener</span>
      )}
      <div className="flex flex-col gap-4 h-full">
        <div className="icon-box-sequoia">
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-sequoia-900">{name}</h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gold-700">
            {range}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
        </div>
        <a
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors group"
        >
          {cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </Card>
  )
}

interface SolutionSectionProps {
  eyebrow: string
  heading: string
  subheading: string
  products: ProductCardProps[]
  bgClass?: string
}

function SolutionSection({
  eyebrow,
  heading,
  subheading,
  products,
  bgClass = '',
}: SolutionSectionProps) {
  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="container-brand">
        <FadeIn direction="up">
          <SectionHeading eyebrow={eyebrow} heading={heading} subheading={subheading} />
        </FadeIn>
        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.name} direction="up">
              <ProductCard {...product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SolutionsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-hero section-padding-lg relative overflow-hidden">
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-[600px] rounded-full bg-sequoia-600/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-[400px] rounded-full bg-gold-500/10 blur-3xl"
        />

        <div className="container-brand relative z-10 text-center">
          <FadeIn direction="up" delay={0}>
            <span className="badge-dark mb-6 inline-flex">Full-Spectrum Financing & Advisory</span>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero mx-auto max-w-4xl">
              Comprehensive Business Solutions
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
              From real estate loans to employee wellness programs, Sequoia Enterprise Solutions
              connects you with the right capital and services to grow — all through one trusted
              platform.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/apply" variant="secondary" size="lg">
                Start Your Application
              </Button>
              <a href="#real-estate" className="btn-ghost-light">
                Explore Solutions
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Real Estate Loans ── */}
      <div id="real-estate">
        <SolutionSection
          eyebrow="Real Estate Loans"
          heading="Investment Property Financing"
          subheading="From single-family rentals to large-scale construction, we match you with the right lender from our network of 500+ vetted partners."
          products={realEstateLoans}
          bgClass="bg-white"
        />
      </div>

      <div className="divider-sequoia container-brand" />

      {/* ── Business Funding ── */}
      <div id="business-funding">
        <SolutionSection
          eyebrow="Business Funding"
          heading="Capital for Every Stage of Growth"
          subheading="Whether you need equipment financing, working capital, or help acquiring an existing business, we have a program built for you."
          products={businessFunding}
          bgClass="bg-gradient-section"
        />
      </div>

      <div className="divider-sequoia container-brand" />

      {/* ── Business Services ── */}
      <div id="business-services">
        <SolutionSection
          eyebrow="Business Services"
          heading="Beyond Lending — Strategic Services"
          subheading="Our advisory services help you reduce taxes, improve credit, and unlock hidden value in your business and properties."
          products={businessServices.map((p) => ({
            ...p,
            cta: p.href === '/solutions/wellness' ? 'Learn More' : 'Apply Now',
          }))}
          bgClass="bg-white"
        />
      </div>

      <div className="divider-sequoia container-brand" />

      {/* ── Clean Energy ── */}
      <div id="clean-energy">
        <SolutionSection
          eyebrow="Clean Energy"
          heading="Sustainable Solutions That Save Money"
          subheading="Lower your operating costs and qualify for federal incentives with commercial solar and EV charging infrastructure."
          products={cleanEnergy.map((p) => ({ ...p, cta: 'Learn More' }))}
          bgClass="bg-gradient-section"
        />
      </div>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-sequoia-dark section-padding">
        <div className="container-brand text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
              Free Consultation
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              Not sure which solution fits?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Our advisors take the time to understand your goals and match you with the right
              program — at no cost to you.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/apply" variant="secondary" size="lg">
                Request a Free Consultation
              </Button>
              <a href="tel:+1-800-000-0000" className="btn-ghost-light inline-flex items-center gap-2">
                <Phone className="size-4" />
                Talk to an Advisor
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
