'use client'

import { useState, useEffect } from 'react'
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
  ChevronDown,
  Banknote,
  Shield,
  Wallet,
  Receipt,
  BadgeCheck,
  Battery,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
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

// ─── Accordion Data ──────────────────────────────────────────────────────────

type AccordionTab = 'Real Estate Loans' | 'Business Funding' | 'Business Services' | 'Clean Energy'

interface AccordionProduct {
  name: string
  summary: string
  specs: string[]
  href: string
  ctaLabel?: string
}

const accordionData: Record<AccordionTab, AccordionProduct[]> = {
  'Real Estate Loans': [
    {
      name: 'Fix & Flip',
      summary: 'Short-term rehab financing for value-add investment properties.',
      specs: [
        'Up to 90% of purchase price, 100% of rehab costs',
        'Max 70% of after-repair value (ARV)',
        '620+ credit score required',
        '6–18 month terms',
        'Loan range: $100K–$5M',
      ],
      href: '/apply',
    },
    {
      name: 'DSCR Rental',
      summary: 'Long-term rental financing based on property cash flow, not personal income.',
      specs: [
        'Non-owner-occupied investment properties',
        'Minimum 1.0 DSCR (debt service coverage ratio)',
        '75% max LTV',
        'No personal income verification required',
        '640+ credit score',
        '30-year fixed-rate terms available',
      ],
      href: '/apply',
    },
    {
      name: 'Multifamily Bridge',
      summary: 'Bridge financing for apartment buildings and larger multifamily assets.',
      specs: [
        '5+ unit properties',
        'Up to 80% LTV',
        '12–36 month terms',
        'Interest-only payments available',
      ],
      href: '/apply',
    },
    {
      name: 'Commercial Real Estate',
      summary: 'Financing for office, retail, industrial, and specialty commercial properties.',
      specs: [
        'Office, retail, industrial, and specialty assets',
        '75% max LTV',
        '5–25 year amortization',
        'Loan range: $500K–$50M',
      ],
      href: '/apply',
    },
    {
      name: 'Construction',
      summary: 'Ground-up construction financing with draw schedules.',
      specs: [
        'Ground-up new construction',
        'Up to 85% of total project cost',
        'Structured draw schedule',
        '12–24 month terms',
      ],
      href: '/apply',
    },
    {
      name: 'Land Loans',
      summary: 'Financing for raw land, entitled lots, and development-ready parcels.',
      specs: [
        'Raw and entitled land',
        '65% max LTV',
        '12–36 month terms',
      ],
      href: '/apply',
    },
    {
      name: 'Hard Money / Bridge',
      summary: 'Fast, asset-based lending for time-sensitive deals.',
      specs: [
        'Asset-based underwriting',
        '620+ credit score',
        '3–5 day funding turnaround',
        '70% max LTV',
        'Loan range: $100K–$10M',
      ],
      href: '/apply',
    },
  ],
  'Business Funding': [
    {
      name: 'SBA 7(a)',
      summary: 'The most versatile SBA loan for working capital, expansion, and acquisitions.',
      specs: [
        'Up to $5M in loan amount',
        '680+ credit score required',
        'Minimum 2 years in business',
        '10–25 year repayment terms',
      ],
      href: '/apply',
    },
    {
      name: 'SBA 504',
      summary: 'Owner-occupied commercial real estate and heavy equipment financing.',
      specs: [
        'For owner-occupied CRE and major equipment',
        '$5.5M SBA portion (up to $5.5M)',
        'Only 10% equity injection required',
        '20–25 year fixed-rate terms',
      ],
      href: '/apply',
    },
    {
      name: 'Equipment Financing',
      summary: 'Finance machinery, technology, and essential business equipment.',
      specs: [
        'Up to 100% of equipment value',
        '600+ credit score',
        'Minimum 1 year in business',
        '2–7 year repayment terms',
      ],
      href: '/apply',
    },
    {
      name: 'Working Capital / MCA',
      summary: 'Fast revenue-based funding for immediate cash flow needs.',
      specs: [
        'Revenue-based qualification',
        '550+ credit score',
        'Same-day funding available',
        'Funding range: $10K–$500K',
      ],
      href: '/apply',
    },
    {
      name: 'Business Line of Credit',
      summary: 'Revolving credit line for ongoing operational flexibility.',
      specs: [
        'Revolving credit facility',
        '620+ credit score',
        'Credit range: $10K–$250K',
      ],
      href: '/apply',
    },
    {
      name: 'Business Acquisition',
      summary: 'Financing to purchase an existing business via SBA or conventional programs.',
      specs: [
        'SBA or conventional structuring',
        'Up to 90% of purchase price',
        'Target business must have 3+ years of operating history',
      ],
      href: '/apply',
    },
    {
      name: 'Invoice Factoring',
      summary: 'Unlock cash tied up in unpaid invoices immediately.',
      specs: [
        'Advance up to 90% of invoice value',
        'No minimum credit score required',
        'Same-day funding available',
      ],
      href: '/apply',
    },
    {
      name: 'Commercial Vehicle / Fleet',
      summary: 'Financing for trucks, vans, and commercial fleet vehicles.',
      specs: [
        '580+ credit score',
        'Up to 72 month terms',
      ],
      href: '/apply',
    },
  ],
  'Business Services': [
    {
      name: 'EHMP Wellness Program',
      summary: 'IRS-compliant Section 125 wellness benefits that save employers money.',
      specs: [
        'Section 125 compliant employer wellness plan',
        'Consultants earn $12–$18 per employee per month in commission',
        'Zero net cost to employers through FICA tax savings',
        'Onboarding typically under 30 days',
      ],
      href: '/solutions/wellness',
      ctaLabel: 'Learn More',
    },
    {
      name: 'Payroll Services',
      summary: 'Full-service payroll processing with tax filing and HR support.',
      specs: [
        'Full-service payroll processing',
        'Automated tax filing and compliance',
        'HR support and employee onboarding tools',
      ],
      href: '/apply',
    },
    {
      name: 'Business Insurance',
      summary: 'Comprehensive commercial insurance packages for every business.',
      specs: [
        'Commercial general liability (CGL)',
        'Professional liability / E&O',
        'Workers compensation',
        'Commercial auto insurance',
      ],
      href: '/apply',
    },
    {
      name: 'Merchant Services',
      summary: 'Payment processing, POS systems, and merchant cash advance.',
      specs: [
        'Payment processing and POS solutions',
        'Merchant cash advance available',
        'No long-term contracts required',
      ],
      href: '/apply',
    },
    {
      name: 'Business Credit Building',
      summary: 'Build strong business credit to unlock better rates and terms.',
      specs: [
        '6–12 month program to achieve Tier 1 business credit',
        'Separate business credit profile from personal',
        'Access to better rates and higher limits',
      ],
      href: '/apply',
    },
  ],
  'Clean Energy': [
    {
      name: 'Commercial Solar',
      summary: 'Zero-down solar installations with strong ROI and federal tax credits.',
      specs: [
        'Zero-down financing available',
        '20–25 year project terms',
        '15–25% projected ROI',
        'Federal and state tax credits applicable',
      ],
      href: '/apply',
    },
    {
      name: 'EV Charging Infrastructure',
      summary: 'Level 2 and DC fast charging stations for properties and fleets.',
      specs: [
        'Level 2 and DC fast charging stations',
        '30% federal tax credit available',
        'Property and fleet installations',
      ],
      href: '/apply',
    },
  ],
}

const tabKeys: AccordionTab[] = ['Real Estate Loans', 'Business Funding', 'Business Services', 'Clean Energy']

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
  const [activeTab, setActiveTab] = useState<AccordionTab>('Real Estate Loans')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    document.title = 'Business Funding & Services Solutions — Sequoia Enterprise Solutions'
  }, [])

  function toggleItem(key: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <HeroVideo />

        <div className="container-brand relative z-10 section-padding-lg text-center">
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
              <a href="#real-estate" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
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

      {/* ── Product Accordion ── */}
      <section className="section-padding bg-white" id="all-solutions">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Full Catalog"
              heading="Every Solution, in One Place"
              subheading="Browse every product we offer across real estate, business funding, services, and clean energy."
              align="center"
            />
          </FadeIn>

          {/* Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer border ${
                  activeTab === tab
                    ? 'bg-sequoia-700 text-white border-sequoia-700'
                    : 'bg-white text-gray-600 border-neutral-200 hover:border-sequoia-300 hover:text-sequoia-700'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-60 text-xs">
                  ({accordionData[tab].length})
                </span>
              </button>
            ))}
          </div>

          {/* Accordion cards */}
          <div className="mt-8 max-w-3xl mx-auto space-y-3">
            {accordionData[activeTab].map((product) => {
              const key = `${activeTab}-${product.name}`
              const isOpen = expandedItems.has(key)
              return (
                <div
                  key={key}
                  className={`rounded-xl border transition-colors duration-150 ${
                    isOpen
                      ? 'border-sequoia-200 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-sequoia-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(key)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-sequoia-900">{product.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500 truncate">{product.summary}</p>
                    </div>
                    <ChevronDown
                      className={`size-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="border-t border-neutral-200 pt-4">
                        <ul className="space-y-2">
                          {product.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A84E]" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5">
                          <a
                            href={product.href}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-sequoia-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sequoia-800 transition-colors"
                          >
                            {product.ctaLabel || 'Apply Now'}
                            <ArrowRight className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

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
              <a href="tel:+13013378035" className="btn-ghost-light inline-flex items-center gap-2" style={{ color: '#FFFFFF' }}>
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
