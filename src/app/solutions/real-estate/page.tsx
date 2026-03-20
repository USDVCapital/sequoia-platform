'use client'

import {
  Hammer,
  Building2,
  Building,
  Landmark,
  HardHat,
  TreePine,
  Zap,
  ArrowRight,
  Phone,
  Clock,
  CreditCard,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

const products = [
  {
    icon: Hammer,
    name: 'Fix & Flip',
    specs: [
      '$100K - $5M loan amounts',
      '90% purchase / 100% rehab',
      '70% ARV max',
      '620+ credit score',
      '6-18 month terms',
      '5-10 day funding',
    ],
    description:
      'Short-term bridge financing for investors acquiring and renovating properties for resale. Fast closings with flexible draw schedules.',
  },
  {
    icon: Building2,
    name: 'DSCR Rental',
    specs: [
      '1-4 unit + small multifamily',
      'Min 1.0 DSCR',
      '75% LTV max',
      'No income verification',
      '640+ credit score',
      '30-year fixed available',
    ],
    description:
      'Qualify based on property cash flow, not personal income. Ideal for investors building long-term rental portfolios.',
  },
  {
    icon: Building,
    name: 'Multifamily Bridge',
    specs: [
      '5+ units',
      '80% LTV max',
      '12-36 month terms',
      'Interest-only payments',
      'Value-add strategies',
      'Flexible prepayment',
    ],
    description:
      'Bridge financing for apartment acquisitions and value-add repositioning. Stabilize, improve NOI, then refinance into permanent debt.',
  },
  {
    icon: Landmark,
    name: 'Commercial Real Estate',
    specs: [
      'Office / retail / industrial',
      '75% LTV max',
      '5-25 year amortization',
      '$500K - $50M',
      'Fixed and variable rates',
      'Owner-occupied & investment',
    ],
    description:
      'Permanent financing for stabilized commercial properties. Competitive rates with flexible structures for experienced operators.',
  },
  {
    icon: HardHat,
    name: 'Construction',
    specs: [
      'Ground-up new builds',
      '85% of total cost',
      'Draw schedule disbursements',
      '12-24 month terms',
      'Spec & custom homes',
      'Commercial & residential',
    ],
    description:
      'Finance ground-up construction from single homes to large-scale developments. Structured draw schedules with inspection-based releases.',
  },
  {
    icon: TreePine,
    name: 'Land Loans',
    specs: [
      'Raw & entitled land',
      '65% LTV max',
      '12-36 month terms',
      'Development parcels',
      'Entitled lots preferred',
      'Flexible exit strategies',
    ],
    description:
      'Financing for raw land acquisitions and entitled development parcels. Bridge the gap between acquisition and construction.',
  },
  {
    icon: Zap,
    name: 'Hard Money / Bridge',
    specs: [
      'Asset-based underwriting',
      '620+ credit score',
      '3-5 day funding',
      '70% LTV max',
      '$100K - $10M',
      'Interest-only available',
    ],
    description:
      'Speed-focused lending for time-sensitive acquisitions. Asset-based underwriting means fast approvals and rapid closings.',
  },
]

const stats = [
  { icon: DollarSign, value: '500+', label: 'Lending Partners' },
  { icon: Clock, value: '3-5 Days', label: 'Fastest Funding' },
  { icon: CreditCard, value: '$100K-$50M', label: 'Loan Range' },
  { icon: TrendingUp, value: '95%', label: 'Approval Rate' },
]

export default function RealEstatePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroVideo />
        <div className="container-brand relative z-10 section-padding-lg">
          <div className="max-w-3xl">
            <FadeIn direction="up" delay={0}>
              <span className="badge-dark mb-6 inline-flex items-center gap-2">
                <Building2 className="size-3.5" />
                Real Estate Financing
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
                Real Estate Financing{' '}
                <span className="text-gold-400">Solutions</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl">
                From fix-and-flip bridge loans to long-term DSCR rentals and ground-up construction,
                we connect you with the right lender from our network of 500+ vetted partners.
                Competitive rates, fast closings, and expert guidance at every step.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/apply" variant="secondary" size="lg">
                  Start Your Application
                </Button>
                <a href="#products" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
                  View All Products
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-brand">
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <StaggerItem key={stat.label} direction="up">
                  <div className="rounded-2xl px-8 py-6 text-center bg-neutral-50 border border-neutral-200">
                    <div className="flex justify-center mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold tracking-tight text-black">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Product Cards */}
      <section id="products" className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Loan Products"
              heading="7 Real Estate Financing Programs"
              subheading="Each program is tailored to a specific strategy. Find the right fit for your next deal, or let our team match you with the optimal solution."
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <StaggerItem key={product.name} direction="up">
                  <Card className="h-full">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="icon-box-sequoia">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-sequoia-900">{product.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {product.description}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {product.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-2 text-xs text-neutral-600">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href="/apply"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors group"
                      >
                        Apply Now
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-sequoia-dark section-padding">
        <div className="container-brand text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
              Free Consultation
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              Not sure which loan product fits your deal?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Our advisors analyze your deal structure and match you with the best lender from our
              network of 500+ partners — at no cost to you.
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
