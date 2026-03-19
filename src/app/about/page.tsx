import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import Badge from '@/components/ui/Badge'
import {
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Award,
  Building2,
  Leaf,
  Heart,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Sequoia Enterprise Solutions',
  description:
    'Learn how Sequoia Enterprise Solutions grew from a fix-and-flip specialist into a full four-vertical business consulting and funding platform serving businesses nationwide.',
}

const milestones = [
  {
    icon: <TrendingUp size={20} />,
    stat: '$70.4M',
    label: 'Funded in 2025',
    detail: 'Exceeded our $50M annual goal by 40%',
    variant: 'success' as const,
  },
  {
    icon: <Building2 size={20} />,
    stat: '4',
    label: 'Business Verticals',
    detail: 'Commercial Lending, Real Estate, Wellness & Clean Energy',
    variant: 'success' as const,
  },
  {
    icon: <Heart size={20} />,
    stat: 'EHMP',
    label: 'Wellness Program Launched',
    detail: 'Employee Health & Maintenance Program live in 2025',
    variant: 'success' as const,
  },
  {
    icon: <Zap size={20} />,
    stat: 'CEA AI',
    label: 'AI Assistant Deployed',
    detail: 'Intelligent assistant powering client consultations',
    variant: 'success' as const,
  },
  {
    icon: <Leaf size={20} />,
    stat: '2',
    label: 'EV Charging Locations',
    detail: 'Clean energy infrastructure deployed in Chicago, IL',
    variant: 'success' as const,
  },
  {
    icon: <Users size={20} />,
    stat: '500+',
    label: 'Funding Sources',
    detail: 'Vetted lending partners across the country',
    variant: 'success' as const,
  },
]

const partnerships = [
  { name: 'EXP Commercial Realty', category: 'Real Estate' },
  { name: 'Keller Williams', category: 'Real Estate' },
  { name: 'CPA Firms Network', category: 'Financial Services' },
  { name: 'National ACE', category: 'Business Development' },
  { name: 'Cal Asia Chamber of Commerce', category: 'Community' },
  { name: 'Filipino Chamber of Commerce', category: 'Community' },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-hero section-padding-lg relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 40%, white 1px, transparent 1px), radial-gradient(circle at 75% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-brand relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge-dark mb-6 inline-flex">About Sequoia</span>
            <h1 className="text-gradient-hero text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Top Choice for Tailored Business Solutions &amp; Funding
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-sequoia-200 sm:text-xl">
              We started as specialists and grew into a full-service platform — because our clients
              needed more, and we answered the call.
            </p>
          </div>
        </div>
      </section>

      {/* ── Origin Story ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                heading="From Fix-and-Flip to Full-Platform"
                align="left"
              />
              <div className="mt-8 space-y-5 text-gray-600 leading-relaxed">
                <p>
                  Sequoia Enterprise Solutions began as a fix-and-flip financing specialist — a tight
                  niche where speed and trust mean everything. We built deep relationships with
                  investors and lenders, learning first-hand what it takes to close deals and move
                  capital efficiently.
                </p>
                <p>
                  That foundation gave us an edge. As our network grew, so did the needs of the
                  clients we served. Business owners wanted more than just a bridge loan — they
                  wanted a partner who understood the full landscape of growth capital. We responded
                  by expanding our lending access to{' '}
                  <strong className="text-sequoia-800 font-semibold">500+ vetted funding sources</strong>{' '}
                  spanning conventional, SBA, hard money, DSCR, and beyond.
                </p>
                <p>
                  Over time, we identified three more verticals where we could make a measurable
                  impact: commercial real estate, employee wellness, and clean energy. Today,{' '}
                  <strong className="text-sequoia-800 font-semibold">Sequoia Enterprise Solutions</strong>{' '}
                  is a four-vertical consulting and funding platform — built on the same
                  solution-first mindset that started it all.
                </p>
              </div>

              {/* Quick trust markers */}
              <ul className="mt-8 space-y-3">
                {[
                  'BBB Accredited Business',
                  'Licensed & bonded across multiple states',
                  'Solution-driven, not commission-driven',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={18} className="shrink-0 text-sequoia-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats block */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Funding Sources' },
                { value: '4', label: 'Business Verticals' },
                { value: '$70.4M', label: 'Funded in 2025' },
                { value: '$100M', label: '2026 Goal' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="card-sequoia flex flex-col items-center justify-center p-8 text-center"
                >
                  <p className="stat-number">{value}</p>
                  <p className="stat-label mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO Section ──────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-5 lg:items-start">

              {/* CEO card */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden p-0">
                  {/* Avatar placeholder with gradient */}
                  <div className="flex h-64 items-center justify-center bg-gradient-sequoia">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white shadow-lg ring-4 ring-white/30">
                      AW
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-xl font-bold text-sequoia-900">Allen Wu</p>
                    <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gold-600">
                      Chief Executive Officer
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Entrepreneur, lender advocate, and the driving force behind Sequoia&apos;s
                      expansion into a national multi-vertical platform.
                    </p>
                  </div>
                </Card>
              </div>

              {/* CEO content */}
              <div className="flex flex-col justify-center lg:col-span-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">
                  Leadership
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Vision &amp; Values
                </h2>

                {/* Blockquote */}
                <blockquote className="mt-6 border-l-4 border-gold-500 pl-5">
                  <p className="text-lg italic leading-relaxed text-gray-700">
                    &ldquo;We are a group of solution-driven professionals. The &lsquo;solution&rsquo; has to
                    work not only for our clients, but also for our agents.&rdquo;
                  </p>
                  <footer className="mt-3 text-sm font-semibold text-sequoia-700">
                    — Allen Wu, CEO
                  </footer>
                </blockquote>

                <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Under Allen&apos;s leadership, Sequoia has grown from a regional lending boutique
                    into a recognized national platform. His philosophy is simple: every solution
                    must create a genuine win for both the client receiving it and the professional
                    delivering it — otherwise it isn&apos;t a real solution.
                  </p>
                  <p>
                    In 2025, the team surpassed its $50M funding goal — closing the year at
                    <strong className="text-sequoia-800 font-semibold"> $70.4M funded</strong>. That
                    momentum is the foundation for Allen&apos;s bold 2026 vision:{' '}
                    <strong className="text-sequoia-800 font-semibold">
                      $100M in total funding deployed
                    </strong>
                    , backed by a fully expanded four-vertical platform, new technology investments, and
                    deeper community partnerships.
                  </p>
                </div>

                <div className="mt-8">
                  <Button href="/solutions" variant="outline" size="lg">
                    Explore Our Solutions
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2025 Milestones ──────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="2025 Milestones"
            heading="A Year of Record Growth"
            subheading="From breaking our funding record to launching new programs and technology — 2025 was the year Sequoia stepped up on every front."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map(({ icon, stat, label, detail, variant }) => (
              <Card key={label}>
                <div className="flex items-start gap-4">
                  <div className="icon-box-sequoia shrink-0">{icon}</div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-sequoia-900">{stat}</p>
                    <p className="mt-0.5 font-semibold text-gray-800">{label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Partnerships ─────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Partnerships"
            heading="Built on Trusted Relationships"
            subheading="Our network of strategic partners extends our reach and strengthens the solutions we bring to every client."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerships.map(({ name, category }) => (
              <Card key={name} className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sequoia-100">
                  <Building2 size={18} className="text-sequoia-700" />
                </div>
                <div>
                  <p className="font-semibold text-sequoia-900">{name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{category}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* BBB Accreditation callout */}
          <div className="mt-12 mx-auto max-w-2xl">
            <Card className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-100 ring-2 ring-gold-300">
                <Award size={24} className="text-gold-700" />
              </div>
              <div>
                <p className="font-bold text-sequoia-900">BBB Accredited Business</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Sequoia Enterprise Solutions holds BBB Accreditation — a mark of trust, transparency,
                  and commitment to resolving client concerns.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-sequoia-dark">
        <div className="container-brand">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Work with Us?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-sequoia-300">
              Whether you need funding, a business consultation, or you&apos;re a professional looking
              to partner — we have a seat at the table for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/apply" variant="secondary" size="lg">
                Get Funding
              </Button>
              <Button href="/careers" variant="ghost" size="lg" className="text-white hover:bg-white/10 border border-white/25">
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
