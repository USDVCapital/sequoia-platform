'use client'

import Link from 'next/link'
import {
  Building2,
  Banknote,
  Heart,
  Zap,
  TrendingUp,
  Users,
  Network,
  ArrowRight,
  CheckCircle2,
  Quote,
  Star,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'
import CountUp from '@/components/motion/CountUp'

// ─── Data ─────────────────────────────────────────────────────────────────────

const verticals = [
  {
    icon: <Building2 size={28} />,
    title: 'Real Estate Loans',
    description:
      'Commercial mortgages, fix-and-flip bridge loans, construction financing, and DSCR rental portfolios — matched to the right lender in days, not weeks.',
    href: '/solutions/real-estate',
  },
  {
    icon: <Banknote size={28} />,
    title: 'Business Funding',
    description:
      'SBA 7(a) and 504 loans, revenue-based advances, equipment financing, and lines of credit from our network of 500+ vetted institutional lenders.',
    href: '/solutions/business-funding',
  },
  {
    icon: <Heart size={28} />,
    title: 'Business Services & Wellness',
    description:
      'The EHMP Wellness Program helps employers slash FICA taxes while giving employees real benefits — and consultants earn $12–$18 per employee each month.',
    href: '/solutions/wellness',
  },
  {
    icon: <Zap size={28} />,
    title: 'Clean Energy',
    description:
      'Solar, battery storage, and commercial efficiency projects with utility-grade financing. Reduce operating costs and qualify for federal tax incentives.',
    href: '/solutions/clean-energy',
  },
]

const testimonials = [
  {
    quote:
      "Sequoia found us a construction lender in under a week when three other brokers had given up. Allen's team actually understood our project and matched us with exactly the right partner.",
    name: 'Marcus T.',
    title: 'Real Estate Developer, Sacramento CA',
    rating: 5,
  },
  {
    quote:
      "I joined the consultant network skeptical about recurring income claims. Six months later I'm earning a consistent $4,200/month just from the Wellness Program placements. This is the real deal.",
    name: 'Linda K.',
    title: 'Independent Business Consultant, Orange County CA',
    rating: 5,
  },
  {
    quote:
      "The EHMP program was the easiest conversation I've ever had with an employer client. The tax savings sell themselves — and we both win every single month.",
    name: 'Raymond S.',
    title: 'Sequoia Consultant, San Jose CA',
    rating: 5,
  },
  {
    quote:
      'We had been turned down twice for an SBA loan. Sequoia restructured our application, connected us to the right lender, and we closed $1.2M in 45 days. Incredible outcome.',
    name: 'Priya N.',
    title: 'Restaurant Group Owner, Los Angeles CA',
    rating: 5,
  },
]

const partners = [
  'EXP Commercial Realty',
  'Keller Williams Commercial',
  'National ACE',
  'Cal Asia Chamber of Commerce',
  'Pacific Business Bank',
  'Western Alliance Bank',
  'SmartBiz Loans',
  'Lendio',
]

const wellnessFeatures = [
  'Employers save thousands in annual FICA taxes',
  'Employees receive tangible wellness benefits at no extra cost',
  'Consultants earn $12–$18 per enrolled employee every month',
  'No complex implementation — onboarding typically takes under 30 days',
  'Fully IRS-compliant Section 125 plan structure',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-hero overflow-hidden">
        {/* Subtle radial highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 60% 40%, color-mix(in srgb, var(--sequoia-700) 18%, transparent) 0%, transparent 70%)',
          }}
        />

        <div className="container-brand relative z-10 section-padding-lg">
          {/* Badge */}
          <FadeIn delay={0} direction="up">
            <div className="flex justify-center mb-6">
              <span className="badge-dark">
                Trusted Since 2015 · Nationwide Reach
              </span>
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0} direction="up">
            <h1 className="text-center text-gradient-hero text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none max-w-4xl mx-auto">
              Fueling Growth &amp; Expanding Possibilities
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.1} direction="up">
            <p className="mt-6 text-center text-sequoia-200 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Your trusted partner for business solutions, commercial lending, and
              recurring income opportunities.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.2} direction="up">
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" href="/solutions">
                Find Funding for My Business
                <ArrowRight size={18} />
              </Button>
              <Button variant="secondary" size="lg" href="/opportunity">
                Build a Consulting Business
                <ArrowRight size={18} />
              </Button>
            </div>
          </FadeIn>

          {/* Social proof bar */}
          <FadeIn delay={0.3} direction="up">
            <div className="mt-14 glass rounded-2xl py-5 px-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-white/20 gap-0">
                <div className="flex items-center gap-3 px-6 py-3 sm:py-0 first:pt-0 last:pb-0">
                  <TrendingUp size={20} className="text-gold-400 shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">
                    $70M+ Funded in 2025
                  </span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 sm:py-0">
                  <Network size={20} className="text-gold-400 shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">
                    500+ Vetted Lending Partners
                  </span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 sm:py-0">
                  <Users size={20} className="text-gold-400 shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">
                    2,500+ Consultant Network
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom wave transition */}
        <div aria-hidden="true" className="relative">
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 64L1440 64L1440 24C1200 56 960 8 720 32C480 56 240 8 0 24L0 64Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. FOUR VERTICALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="What We Do"
              heading="Our Solutions"
              subheading="From commercial real estate loans to employee wellness programs, we connect businesses and consultants with the right solutions at the right time."
              align="center"
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {verticals.map((v) => (
              <StaggerItem key={v.title} direction="up">
                <Card href={v.href} className="group flex flex-col gap-4 hover:border-sequoia-700/40">
                  <div className="icon-box-sequoia group-hover:bg-sequoia-200 transition-colors duration-200">
                    {v.icon}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-sequoia-900 leading-snug">
                      {v.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">
                      {v.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-sequoia-700 group-hover:text-sequoia-900 transition-colors duration-150">
                    Learn More <ArrowRight size={14} />
                  </span>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. WHY SEQUOIA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Why Sequoia"
              heading="Built on Results, Driven by Solutions"
              align="center"
            />
          </FadeIn>

          {/* Stat cards */}
          <StaggerContainer className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StaggerItem direction="up">
              <StatCard
                icon={<TrendingUp size={22} />}
                value={<CountUp end={70} prefix="$" suffix="M+" duration={2} />}
                label="Funded in 2025"
                trend="+24% YoY"
              />
            </StaggerItem>
            <StaggerItem direction="up">
              <StatCard
                icon={<Network size={22} />}
                value={<CountUp end={500} suffix="+" duration={2} />}
                label="Vetted Lending Partners"
              />
            </StaggerItem>
            <StaggerItem direction="up">
              <StatCard
                icon={<Users size={22} />}
                value={<CountUp end={2500} suffix="+" duration={2} />}
                label="Consultant Network"
              />
            </StaggerItem>
          </StaggerContainer>

          {/* Allen Wu quote */}
          <FadeIn direction="up" className="mt-14 max-w-3xl mx-auto text-center">
            <p className="text-lg leading-relaxed text-gray-700">
              Sequoia Enterprise Solutions was built on the belief that the right
              solution changes everything — for the client, for the consultant,
              and for the community. We don't push products; we engineer outcomes.
            </p>
            <blockquote className="mt-8 relative">
              <Quote
                size={40}
                className="absolute -top-4 -left-2 text-sequoia-200 opacity-60"
                aria-hidden="true"
              />
              <p className="text-xl italic font-medium text-sequoia-800 leading-snug relative z-10 px-8">
                "We are a group of solution-driven professionals. The 'solution'
                has to work not only for our clients, but also for our agents."
              </p>
              <footer className="mt-4 text-sm font-semibold text-gold-700 uppercase tracking-widest">
                — Allen Wu, Founder &amp; CEO, Sequoia Enterprise Solutions
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. WELLNESS PROGRAM SPOTLIGHT
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-brand-xl border border-sequoia-100">
            {/* Left — content */}
            <FadeIn direction="left">
              <div className="bg-white p-10 lg:p-14 flex flex-col justify-center gap-6">
                <span className="badge-gold self-start">Featured Program</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sequoia-900 leading-tight tracking-tight">
                  The Wellness Program That{' '}
                  <span className="text-gradient-gold">Pays You Every Month</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-base max-w-prose">
                  The EHMP (Employer Health Management Program) is Sequoia's
                  highest-velocity door-opener product. It's a fully IRS-compliant
                  Section 125 plan that creates a three-way win: employers
                  dramatically cut payroll tax costs, employees receive real
                  wellness benefits, and consultants earn predictable recurring
                  commissions.
                </p>
                <ul className="space-y-3">
                  {wellnessFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2
                        size={18}
                        className="text-sequoia-600 shrink-0 mt-0.5"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Button variant="primary" size="lg" href="/solutions/wellness">
                    Learn About Wellness
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </FadeIn>

            {/* Right — highlight panel */}
            <FadeIn direction="right">
              <div className="bg-gradient-sequoia p-10 lg:p-14 flex flex-col justify-center gap-8">
                <p className="text-sequoia-200 text-sm font-semibold uppercase tracking-widest">
                  Consultant Earnings Snapshot
                </p>
                <div className="space-y-6">
                  {[
                    { employees: '50', monthly: '$600–$900', annual: '$7,200–$10,800' },
                    { employees: '100', monthly: '$1,200–$1,800', annual: '$14,400–$21,600' },
                    { employees: '250', monthly: '$3,000–$4,500', annual: '$36,000–$54,000' },
                  ].map((row) => (
                    <div
                      key={row.employees}
                      className="glass rounded-xl p-5 flex flex-col gap-1"
                    >
                      <span className="text-sequoia-300 text-xs font-semibold uppercase tracking-wider">
                        {row.employees} Employees
                      </span>
                      <span className="text-white text-2xl font-bold">
                        {row.monthly}
                        <span className="text-sequoia-300 text-sm font-normal ml-1">
                          /month
                        </span>
                      </span>
                      <span className="text-sequoia-300 text-sm">
                        {row.annual} / year
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sequoia-300 text-xs leading-relaxed">
                  Earnings based on $12–$18 per enrolled employee per month.
                  Results vary by plan and enrollment.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. CONSULTANT CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-sequoia-dark relative overflow-hidden">
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--gold-500) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -bottom-24 w-[360px] h-[360px] rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, var(--sequoia-600) 0%, transparent 70%)',
          }}
        />

        <FadeIn direction="up" className="container-brand relative z-10 text-center">
          <span className="badge-dark">Consultant Opportunity</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            What Would an Extra{' '}
            <span className="text-gradient-gold">$3,500/Month</span> Mean for
            You?
          </h2>
          <p className="mt-6 text-sequoia-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Sequoia consultants build real recurring income by introducing
            employers to the EHMP Wellness Program. No cold calling scripts. No
            inventory. No quotas. Just a compelling conversation that delivers
            value on day one — and a commission check every month after that.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" size="lg" href="/opportunity">
              Explore the Opportunity
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/opportunity#faq"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              How Does It Work?
            </Button>
          </div>

          {/* Quick proof points */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: 'Day 1', label: 'Income potential from first placement' },
              { value: 'Monthly', label: 'Recurring commissions, automatically' },
              { value: 'Remote', label: 'Work from anywhere, any schedule' },
            ].map((p) => (
              <div key={p.value} className="glass rounded-xl p-6 text-center">
                <p className="text-3xl font-extrabold text-gold-400">{p.value}</p>
                <p className="mt-2 text-sequoia-200 text-sm leading-snug">{p.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Client Stories"
              heading="What Our Clients and Consultants Say"
              subheading="Real outcomes from real people — business owners who got funded and consultants who built income they didn't think was possible."
              align="center"
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <StaggerItem key={t.name} direction="up">
                <Card className="flex flex-col gap-5">
                  {/* Stars */}
                  <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-gold-500 fill-gold-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1">
                    <p className="text-gray-700 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </blockquote>

                  {/* Attribution */}
                  <footer className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-sequoia-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t.title}</p>
                  </footer>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. PARTNERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-sequoia-50">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Our Network"
              heading="Trusted By Industry Leaders"
              subheading="Sequoia works alongside top real estate firms, chambers of commerce, financial institutions, and lending platforms nationwide."
              align="center"
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <StaggerItem key={partner} direction="up">
                <div className="flex items-center justify-center rounded-xl border border-sequoia-100 bg-white px-6 py-5 shadow-sm text-center">
                  <span className="text-xs sm:text-sm font-semibold text-sequoia-700 leading-snug">
                    {partner}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Final CTA band */}
          <FadeIn direction="up" className="mt-16 rounded-2xl bg-gradient-sequoia p-10 text-center flex flex-col items-center gap-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white max-w-xl leading-tight">
              Ready to grow with Sequoia?
            </h3>
            <p className="text-sequoia-200 max-w-md text-base leading-relaxed">
              Whether you need capital for your business or you're ready to build
              a recurring income stream, we're here to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" href="/solutions">
                Explore Funding Solutions
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/contact"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/60"
              >
                Contact Us
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
