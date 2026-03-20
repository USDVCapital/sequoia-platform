'use client'

import { useState } from 'react'
import {
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Star,
  Play,
  ArrowRight,
  Building2,
  Briefcase,
  HeartPulse,
  Layers,
  BookOpen,
  Globe,
  BarChart3,
  Zap,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import Badge from '@/components/ui/Badge'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

const incomeStreams = [
  {
    icon: <HeartPulse size={28} />,
    title: 'Wellness Program Commissions',
    badge: 'Fastest Path to Income',
    badgeVariant: 'warning' as const,
    headline: '$12–$18 per employee / month — recurring',
    highlight: '200 employees = $3,600/month',
    description:
      'Our Employee Health & Wellness Management Program (EHMP) pays you monthly residuals for every enrolled employee. Present once, earn every month.',
    points: [
      'Recurring monthly commissions — no re-selling',
      'One discovery session closes most deals',
      'Every business with employees is a prospect',
    ],
  },
  {
    icon: <Building2 size={28} />,
    title: 'Loan Referral Commissions',
    badge: 'High Ticket',
    badgeVariant: 'info' as const,
    headline: 'Earn on every funded commercial deal',
    highlight: 'Deals range from $300K to $100M+',
    description:
      "You don't originate loans — you refer clients to our network of 500+ vetted lending partners. We handle underwriting and closing; you earn the referral fee.",
    points: [
      'Real estate, business acquisition, construction & more',
      'SBA, DSCR, bridge, hard money, clean energy financing',
      'No license required to refer',
    ],
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Revenue Share & Bonus Pool',
    badge: 'Team Leverage',
    badgeVariant: 'success' as const,
    headline: 'Earn from your team\'s production',
    highlight: 'Compound your income as you grow',
    description:
      "When you introduce other professionals to Sequoia, you participate in a revenue share on their funded deals and wellness enrollments — building true residual income.",
    points: [
      'Revenue share paid on team production',
      'Quarterly bonus pools for top performers',
      'Build a national consulting team',
    ],
  },
]

const valueItems = [
  { icon: <Users size={18} />, text: 'Access to 500+ vetted lending partners' },
  { icon: <Layers size={18} />, text: 'Full product suite: Real Estate, Business Funding, Services, Clean Energy' },
  { icon: <Zap size={18} />, text: 'CEA AI Assistant for instant product guidance' },
  { icon: <BookOpen size={18} />, text: 'Weekly live training every Wednesday at 8 PM ET' },
  { icon: <Play size={18} />, text: '190+ on-demand training videos' },
  { icon: <Globe size={18} />, text: 'Personal replicated website' },
  { icon: <BarChart3 size={18} />, text: 'Back office with real-time deal tracking' },
]

const audiences = [
  { icon: <Building2 size={20} />, title: 'Real Estate Agents', desc: 'Turn client relationships into commercial lending referrals.' },
  { icon: <Briefcase size={20} />, title: 'Loan Officers', desc: 'Expand your product menu with 500+ funding solutions.' },
  { icon: <HeartPulse size={20} />, title: 'Insurance Agents', desc: 'Add wellness programs alongside your existing book.' },
  { icon: <BarChart3 size={20} />, title: 'CPAs & Accountants', desc: 'Help business clients access capital — and get paid for it.' },
  { icon: <DollarSign size={20} />, title: 'Financial Advisors', desc: 'Broaden your value proposition with lending solutions.' },
  { icon: <Users size={20} />, title: 'Any Professional with a Network', desc: 'If you know business owners, you have prospects.' },
]

const successStories = [
  {
    name: 'Emily',
    title: 'Real Estate Professional',
    quote: 'Closed $500K+ in commercial loans in her first year — without ever changing careers. The training and lending network made it straightforward.',
    stat: '$500K+',
    statLabel: 'Commercial Volume, Year 1',
  },
  {
    name: 'Joseph Cordeira',
    title: 'Sequoia Consultant',
    quote: "Funded a $652,000 deal through Sequoia's lending network. The back office and partner relationships made the process seamless from referral to close.",
    stat: '$652,000',
    statLabel: 'Single Deal Funded',
  },
  {
    name: 'Fortune Homes Team',
    title: 'Real Estate Team',
    quote: "Excellent customer service — Sequoia delivers every time. We've referred multiple clients for business funding and the experience has been first-class.",
    stat: '5 / 5',
    statLabel: 'Client Satisfaction',
  },
]

const faqs = [
  {
    q: 'Do I need a license to join Sequoia?',
    a: 'No. As a Sequoia consultant, you operate as a referral agent — not a licensed mortgage originator. You introduce clients to our lending partners and wellness program; our credentialed team handles the regulated activities. Always confirm any state-specific referral rules with your own legal counsel.',
  },
  {
    q: 'How fast can I earn my first commission?',
    a: 'The Employee Health & Wellness Management Program (EHMP) is the fastest path to your first paycheck. A single employer discovery session can result in an enrollment within days. Many new consultants earn their first wellness commission within their first 30 days.',
  },
  {
    q: 'What training and support is provided?',
    a: 'You get access to weekly live Zoom trainings every Wednesday at 8 PM ET, a library of 190+ on-demand training videos, the CEA AI Assistant for instant product guidance, and a dedicated back office. You are never building this alone.',
  },
  {
    q: 'Can I do this part-time alongside my current job?',
    a: 'Absolutely. Most consultants start part-time, spending a few hours per week on discovery calls and referrals. The recurring nature of wellness commissions means income can compound even when you are not actively working. Many consultants transition full-time only after replacing their salary.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-sequoia-50 transition-colors duration-150 cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-base">{q}</span>
        <ChevronDown
          size={20}
          className={`text-sequoia-700 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 bg-white text-gray-600 text-sm leading-relaxed max-w-none">
          {a}
        </div>
      )}
    </div>
  )
}

export default function OpportunityPage() {
  return (
    <div className="bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-hero relative overflow-hidden">
        {/* decorative rings */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full border border-white/5" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-gold-600/5 blur-3xl" />
        </div>

        <div className="container-brand section-padding-lg relative z-10">
          <div className="max-w-3xl">
            <StaggerContainer staggerDelay={0.15}>
              <StaggerItem direction="up">
                <span className="badge-gold mb-6 inline-flex">
                  <Star size={12} className="text-gold-700" />
                  Consultant Opportunity
                </span>
              </StaggerItem>

              <StaggerItem direction="up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  What Would an Extra{' '}
                  <span className="text-gradient-gold">$3,500/Month</span>{' '}
                  in Recurring Income Mean for You?
                </h1>
              </StaggerItem>

              <StaggerItem direction="up">
                <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
                  Join 2,500+ professionals earning through commercial lending, business consulting,
                  and wellness program referrals — all under one platform, for one flat monthly fee.
                </p>
              </StaggerItem>

              <StaggerItem direction="up">
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a href="/enroll" className="btn-gold text-base px-8 py-4">
                    Join Sequoia for $29.99/month
                    <ArrowRight size={18} />
                  </a>
                  <a href="/resources" className="btn-ghost-light text-base" style={{ color: '#FFFFFF' }}>
                    Watch Training Videos
                    <Play size={16} />
                  </a>
                </div>
              </StaggerItem>

              <StaggerItem direction="up">
                <div className="mt-12 flex flex-wrap gap-6">
                  {[
                    { value: '2,500+', label: 'Active Consultants' },
                    { value: '500+', label: 'Lending Partners' },
                    { value: '$29.99', label: 'Per Month, All-In' },
                    { value: '190+', label: 'Training Videos' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="text-xs text-white/70 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── Three Income Streams ─────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="How You Earn"
              heading="Three Income Streams, One Platform"
              subheading="Sequoia consultants earn through recurring wellness commissions, loan referral fees, and team revenue share — diversified income from a single $29.99/month membership."
            />
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {incomeStreams.map((stream) => (
              <StaggerItem key={stream.title} direction="up">
                <Card className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="icon-box-sequoia">{stream.icon}</div>
                    <Badge variant={stream.badgeVariant}>{stream.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{stream.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{stream.headline}</p>
                  </div>

                  <div className="rounded-lg bg-sequoia-50 border border-sequoia-200 px-4 py-3">
                    <p className="text-sequoia-800 font-bold text-base">{stream.highlight}</p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{stream.description}</p>

                  <ul className="space-y-2">
                    {stream.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-sequoia-600 mt-0.5 flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── $29.99 Value Stack ───────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <FadeIn direction="left">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold-700 mb-2">
                  Everything Included
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  The Full Platform for{' '}
                  <span className="text-gradient-sequoia">$29.99/Month</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8 max-w-lg">
                  No hidden fees. No upsells. One flat monthly fee gives you everything you need
                  to run a professional consulting business from day one.
                </p>

                <ul className="space-y-4">
                  {valueItems.map((item) => (
                    <li key={item.text} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sequoia-100 text-sequoia-700 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="text-gray-800 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <a href="/enroll" className="btn-primary inline-flex">
                    Start for $29.99/month
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Price card */}
            <FadeIn direction="right">
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-sm card-sequoia p-8 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-gold text-xs">Most Popular</span>
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
                    Consultant Membership
                  </p>
                  <div className="flex items-end justify-center gap-1 my-4">
                    <span className="text-6xl font-black text-sequoia-900">$29</span>
                    <span className="text-2xl font-bold text-sequoia-700 mb-2">.99</span>
                    <span className="text-gray-500 mb-2">/mo</span>
                  </div>

                  <div className="divider-gold my-5" />

                  <ul className="text-left space-y-3 mb-8">
                    {valueItems.map((item) => (
                      <li key={item.text} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={15} className="text-sequoia-600 mt-0.5 flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>

                  <a href="/enroll" className="btn-gold w-full justify-center">
                    Enroll Now
                  </a>

                  <p className="text-xs text-gray-400 mt-3">
                    Cancel anytime. No long-term contracts.
                  </p>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Who This Is For ──────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Is This for You?"
              heading="Built for Professionals with a Network"
              subheading="If you work with business owners, homeowners, or employers — you already have the most valuable asset in consulting: relationships."
            />
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {audiences.map((a) => (
              <StaggerItem key={a.title} direction="up">
                <Card className="flex items-start gap-4">
                  <div className="icon-box-sequoia flex-shrink-0">{a.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Success Stories ──────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-sequoia-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold-600/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-sequoia-600/10 blur-3xl" />
        </div>

        <div className="container-brand relative z-10">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Real Results"
              heading={<span className="text-white">Consultants Who Are Already Winning</span>}
              subheading=""
            />
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((s) => (
              <StaggerItem key={s.name} direction="up">
                <div className="card-sequoia-dark p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>

                  <blockquote className="text-white/80 text-sm leading-relaxed flex-1">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>

                  <div className="divider-sequoia" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-bold text-white">{s.name}</p>
                      <p className="text-xs text-white/60">{s.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-gold-400">{s.stat}</p>
                      <p className="text-xs text-white/60">{s.statLabel}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Common Questions"
              heading="Everything You Need to Know"
              subheading="Straight answers to the questions every new consultant asks before enrolling."
            />
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="mt-12 max-w-2xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-sequoia">
        <FadeIn direction="up">
          <div className="container-brand text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
              Take the First Step
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
              Ready to Build Your Consulting Business?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Join 2,500+ professionals who are already earning through Sequoia's platform.
              Get started today for $29.99/month — cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/enroll" className="btn-gold text-base px-8 py-4">
                Enroll Now — $29.99/month
                <ArrowRight size={18} />
              </a>
              <a href="/resources" className="btn-ghost-light text-base" style={{ color: '#FFFFFF' }}>
                Explore Training Library
                <BookOpen size={16} />
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  )
}
