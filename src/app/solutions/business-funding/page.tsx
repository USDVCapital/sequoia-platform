'use client'

import {
  Landmark,
  Building,
  Truck,
  TrendingUp,
  CreditCard,
  Briefcase,
  FileCheck,
  Car,
  ArrowRight,
  Phone,
  Clock,
  DollarSign,
} from 'lucide-react'
import { useBooking } from '@/contexts/BookingContext'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

const products = [
  {
    icon: Landmark,
    name: 'SBA 7(a)',
    specs: [
      'Up to $5M',
      '680+ credit score',
      '2+ years in business',
      '10-25 year terms',
      'Working capital & expansion',
      'Competitive SBA rates',
    ],
    description:
      'The most versatile SBA loan program. Use proceeds for working capital, equipment, real estate, or business expansion with favorable government-backed terms.',
  },
  {
    icon: Building,
    name: 'SBA 504',
    specs: [
      'Owner-occupied CRE + equipment',
      '$5.5M SBA portion',
      '10% equity from borrower',
      '20-25 year fixed rate',
      'Below-market rates',
      'Job creation requirement',
    ],
    description:
      'Fixed-rate, long-term financing for major assets like commercial real estate and heavy equipment. Low down payments with below-market fixed rates.',
  },
  {
    icon: Truck,
    name: 'Equipment Financing',
    specs: [
      '100% of equipment value',
      '600+ credit score',
      '1+ year in business',
      '2-7 year terms',
      'New & used equipment',
      'Equipment serves as collateral',
    ],
    description:
      'Finance machinery, technology, and essential business equipment with the asset itself serving as collateral. Preserve your working capital.',
  },
  {
    icon: TrendingUp,
    name: 'Working Capital / MCA',
    specs: [
      'Revenue-based qualification',
      '6 months bank statements',
      '550+ credit score',
      'Same-day funding available',
      '$10K - $500K',
      'Flexible repayment',
    ],
    description:
      'Fast access to capital based on your revenue, not just your credit score. Bridge cash flow gaps or seize time-sensitive opportunities.',
  },
  {
    icon: CreditCard,
    name: 'Business Line of Credit',
    specs: [
      'Revolving credit line',
      '620+ credit score',
      '1+ year in business',
      '$10K - $250K',
      'Draw only what you need',
      'Pay interest on used amount',
    ],
    description:
      'Flexible revolving credit you can draw from as needed. Only pay interest on what you use, with the ability to replenish as you repay.',
  },
  {
    icon: Briefcase,
    name: 'Business Acquisition',
    specs: [
      'SBA or conventional',
      'Up to 90% of purchase price',
      '3+ years business history',
      'Seller financing options',
      'Management experience valued',
      'Goodwill financing available',
    ],
    description:
      'Finance the purchase of an existing business with proven cash flow. SBA and conventional options available with flexible structures.',
  },
  {
    icon: FileCheck,
    name: 'Invoice Factoring',
    specs: [
      'Up to 90% of invoice value',
      'No credit minimum for business',
      'Same-day funding available',
      'Based on customer creditworthiness',
      'No long-term contracts',
      'Scalable with revenue',
    ],
    description:
      'Convert outstanding invoices to immediate cash. Approval is based on your customers\' creditworthiness, not yours. Scales as your revenue grows.',
  },
  {
    icon: Car,
    name: 'Commercial Vehicle / Fleet',
    specs: [
      '580+ credit score',
      'New and used vehicles',
      'Up to 72 month terms',
      'Fleet programs available',
      'Commercial trucks & vans',
      'Competitive rates',
    ],
    description:
      'Finance commercial vehicles, delivery vans, and entire fleets. Flexible terms for new and used vehicles with fleet discount programs.',
  },
]

const stats = [
  { icon: DollarSign, value: '500+', label: 'Lending Partners' },
  { icon: Clock, value: 'Same Day', label: 'Fastest Funding' },
  { icon: CreditCard, value: '$10K-$50M', label: 'Funding Range' },
  { icon: TrendingUp, value: '8', label: 'Funding Programs' },
]

export default function BusinessFundingPage() {
  const { openBooking } = useBooking()
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroVideo />
        <div className="container-brand relative z-10 section-padding-lg">
          <div className="max-w-3xl">
            <FadeIn direction="up" delay={0}>
              <span className="badge-dark mb-6 inline-flex items-center gap-2">
                <Briefcase className="size-3.5" />
                Business Funding
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
                Business Funding{' '}
                <span className="text-gold-400">Solutions</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl">
                From SBA loans to same-day working capital, we match your business with the right
                funding program from our network of 500+ vetted lending partners. Every stage of
                growth, every type of capital need.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/apply" variant="secondary" size="lg">
                  Start Your Application
                </Button>
                <a href="#products" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
                  View All Programs
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
                  <div className="rounded-2xl px-4 sm:px-8 py-6 text-center bg-neutral-50 border border-neutral-200">
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
              eyebrow="Funding Programs"
              heading="8 Business Funding Programs"
              subheading="Whether you need SBA-backed long-term financing or same-day working capital, we have a program built for your business."
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
              Not sure which funding program fits?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Our advisors take the time to understand your business and match you with the optimal
              funding solution — at no cost to you.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button variant="secondary" size="lg" onClick={() => openBooking()}>
                Request a Free Consultation
              </Button>
              <button
                onClick={() => openBooking()}
                className="btn-ghost-light inline-flex items-center gap-2 cursor-pointer"
                style={{ color: '#FFFFFF' }}
              >
                <Phone className="size-4" />
                Talk to an Advisor
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
