'use client'

import {
  Sun,
  Zap,
  Leaf,
  TrendingDown,
  DollarSign,
  ArrowRight,
  Phone,
  CheckCircle2,
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
    icon: Sun,
    name: 'Commercial Solar',
    specs: [
      'Zero-down financing available',
      '20-25 year terms',
      '15-25% ROI typical',
      'Federal tax credits (ITC)',
      'Accelerated depreciation (MACRS)',
      'Net metering eligible',
    ],
    description:
      'Reduce your operating costs with commercial-scale solar installations. Zero-down financing options with significant tax incentives make solar one of the strongest ROI investments available for commercial properties.',
    benefits: [
      'Eliminate or drastically reduce electricity costs',
      'Lock in energy rates for 25+ years',
      'Increase property value',
      'Qualify for 30% Investment Tax Credit (ITC)',
      'Accelerate depreciation via MACRS',
      'Generate renewable energy credits (RECs)',
    ],
  },
  {
    icon: Zap,
    name: 'EV Charging Stations',
    specs: [
      'Level 2 and DC fast charging',
      'Financing available',
      '30% federal tax credit',
      'Revenue generation potential',
      'Fleet & property installs',
      'Smart charging management',
    ],
    description:
      'Future-proof your property or fleet with EV charging infrastructure. Federal incentives cover up to 30% of costs, and charging stations generate new revenue streams while attracting tenants and customers.',
    benefits: [
      'Attract EV-driving tenants, customers, and employees',
      'Generate revenue from charging fees',
      '30% federal tax credit (up to $100K per station)',
      'Qualify for state and local incentives',
      'Increase property value and marketability',
      'Support fleet electrification goals',
    ],
  },
]

const impactStats = [
  { value: '30%', label: 'Federal Tax Credit (ITC)' },
  { value: '25+', label: 'Year System Lifespan' },
  { value: '15-25%', label: 'Typical ROI Range' },
  { value: '$0', label: 'Down Payment Options' },
]

export default function CleanEnergyPage() {
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
                <Leaf className="size-3.5" />
                Clean Energy Solutions
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
                Clean Energy{' '}
                <span className="text-gold-400">Solutions</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl">
                Lower your operating costs, qualify for significant federal incentives, and
                future-proof your business with commercial solar and EV charging infrastructure.
                Sustainable solutions that deliver real financial returns.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="secondary" size="lg" onClick={() => openBooking()}>
                  Schedule a Consultation
                </Button>
                <a href="#products" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
                  Explore Solutions
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-brand">
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {impactStats.map((stat) => (
              <StaggerItem key={stat.label} direction="up">
                <div className="rounded-2xl px-4 sm:px-8 py-6 text-center bg-neutral-50 border border-neutral-200">
                  <p className="text-3xl font-extrabold tracking-tight text-black">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Product Cards */}
      <section id="products" className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Solutions"
              heading="Sustainable Energy for Your Business"
              subheading="Commercial solar and EV charging are among the strongest ROI investments available today, backed by significant federal and state incentives."
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <StaggerItem key={product.name} direction="up">
                  <Card className="h-full">
                    <div className="flex flex-col gap-5 h-full">
                      <div className="flex items-center gap-3">
                        <div className="icon-box-sequoia">
                          <Icon className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-sequoia-900">{product.name}</h3>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-600">
                        {product.description}
                      </p>

                      {/* Key Specs */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-2">
                          Key Specs
                        </p>
                        <ul className="space-y-1.5">
                          {product.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-2 text-xs text-neutral-600">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-2">
                          Benefits
                        </p>
                        <ul className="space-y-1.5">
                          {product.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2 text-sm text-neutral-700">
                              <CheckCircle2 className="size-4 shrink-0 text-gold-600 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-2">
                        <button
                          onClick={() => openBooking()}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors group cursor-pointer"
                        >
                          Schedule a Consultation
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Environmental Impact"
              heading="Good for Business. Good for the Planet."
              subheading="Clean energy investments deliver measurable financial returns while reducing your carbon footprint and supporting environmental sustainability."
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                icon: TrendingDown,
                title: 'Lower Operating Costs',
                description: 'Commercial solar typically reduces electricity costs by 50-75%, with savings locked in for 25+ years.',
              },
              {
                icon: DollarSign,
                title: 'Significant Tax Benefits',
                description: 'Federal ITC, accelerated depreciation, and state incentives can cover 40-60% of total project costs.',
              },
              {
                icon: Leaf,
                title: 'Carbon Reduction',
                description: 'Meet ESG goals and reduce your carbon footprint. A 100kW system offsets approximately 130 tons of CO2 annually.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <StaggerItem key={item.title} direction="up">
                  <Card>
                    <div className="flex flex-col gap-3">
                      <div className="icon-box-sequoia">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-semibold text-sequoia-900">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
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
              Get Started
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              Ready to reduce costs and go green?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Schedule a free consultation to explore how commercial solar or EV charging can
              deliver real financial returns for your business.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button variant="secondary" size="lg" onClick={() => openBooking()}>
                Schedule a Consultation
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
