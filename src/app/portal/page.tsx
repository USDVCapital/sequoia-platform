'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  Wallet,
  Users,
  Star,
  ArrowRight,
  Play,
  Send,
  CheckCircle2,
  Circle,
  Activity,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  BookOpen,
  Package,
  ChevronRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

interface QuickStat {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  accent?: React.ReactNode
}

interface TodoItem {
  id: string
  text: string
  href: string
  icon: React.ReactNode
  cta: string
}

interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

interface ActivityItem {
  id: string
  text: string
  timeAgo: string
  icon: React.ReactNode
  iconBg: string
}

// Quick stats
const STATS: QuickStat[] = [
  {
    label: 'Pipeline Value',
    value: '$125,000',
    subtext: 'Total active deals',
    icon: <DollarSign size={20} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
  },
  {
    label: 'Pending Commissions',
    value: '$2,340',
    subtext: 'Est. next payout',
    icon: <Wallet size={20} aria-hidden="true" />,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
  {
    label: 'Wellness Enrollees',
    value: '47',
    subtext: '3 away from Senior tier',
    icon: <Users size={20} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
    accent: (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-brand-neutral-500 mb-1">
          <span>Active Consultant</span>
          <span className="font-medium text-sequoia-700">Senior at 50</span>
        </div>
        <div className="h-2 w-full rounded-full bg-brand-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sequoia-600 to-sequoia-500 transition-all"
            style={{ width: '94%' }}
            role="progressbar"
            aria-valuenow={47}
            aria-valuemin={0}
            aria-valuemax={50}
            aria-label="Progress to Senior tier"
          />
        </div>
      </div>
    ),
  },
  {
    label: 'Status Tier',
    value: 'Active Consultant',
    subtext: '94% to Senior tier',
    icon: <Star size={20} aria-hidden="true" />,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
]

// What to do today
const TODO_ITEMS: TodoItem[] = [
  {
    id: 'leads-follow-up',
    text: 'You have 3 leads in application stage — follow up now',
    href: '/portal/pipeline',
    icon: <TrendingUp size={16} aria-hidden="true" />,
    cta: 'View Pipeline',
  },
  {
    id: 'training-replay',
    text: 'Wednesday training replay available — watch now',
    href: '/portal/training',
    icon: <Play size={16} aria-hidden="true" />,
    cta: 'Watch Replay',
  },
  {
    id: 'first-wellness-lead',
    text: 'Submit your first Wellness lead this week',
    href: '/portal/pipeline/new',
    icon: <Send size={16} aria-hidden="true" />,
    cta: 'Submit Lead',
  },
]

// Onboarding checklist
const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'profile',       label: 'Complete your profile',           done: true  },
  { id: 'wellness-vid',  label: 'Watch Wellness Program overview',  done: true  },
  { id: 'comp-vid',      label: 'Watch Compensation 6.0 video',     done: false },
  { id: 'first-lead',    label: 'Submit your first lead',           done: false },
]

// Activity feed
const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: 'funded-deal',
    text: 'Joseph C. funded $652,000 commercial deal',
    timeAgo: '2 hours ago',
    icon: <DollarSign size={16} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100 text-sequoia-700',
  },
  {
    id: 'wellness-enroll',
    text: 'Emily S. enrolled 15 new wellness employees',
    timeAgo: '5 hours ago',
    icon: <Users size={16} aria-hidden="true" />,
    iconBg: 'bg-gold-100 text-gold-700',
  },
  {
    id: 'training',
    text: 'Weekly training: Advanced Underwriting Tips',
    timeAgo: 'Yesterday',
    icon: <BookOpen size={16} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100 text-sequoia-700',
  },
  {
    id: 'new-product',
    text: 'New product: EV Charging Station financing available',
    timeAgo: '2 days ago',
    icon: <Package size={16} aria-hidden="true" />,
    iconBg: 'bg-brand-neutral-100 text-brand-neutral-600',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WelcomeBanner() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-sequoia px-6 py-6 sm:px-8 sm:py-7 shadow-brand-lg">
      {/* Decorative ring */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 bg-white"
        aria-hidden="true"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-sequoia-300" aria-hidden="true" />
            <p className="text-sequoia-300 text-sm font-medium">{dateStr}</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Todd!
          </h2>
          <p className="mt-1.5 text-sequoia-200 text-sm sm:text-base max-w-lg">
            You&rsquo;re 3 enrollees away from Senior tier. Keep the momentum going — your pipeline is looking strong.
          </p>
        </div>

        <div className="flex gap-2 sm:shrink-0">
          <Link
            href="/portal/pipeline/new"
            className="btn-gold inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl"
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            Submit Lead
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuickStats() {
  return (
    <section aria-labelledby="quick-stats-heading">
      <h2 id="quick-stats-heading" className="sr-only">Quick Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-sequoia p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-neutral-500 mb-0.5">
              {stat.label}
            </p>
            <p className="text-2xl font-extrabold text-sequoia-900 tracking-tight leading-none mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-brand-neutral-500">{stat.subtext}</p>
            {stat.accent}
          </div>
        ))}
      </div>
    </section>
  )
}

function WhatToDoToday() {
  return (
    <section aria-labelledby="today-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="today-heading" className="text-base font-bold text-sequoia-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
          What to Do Today
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TODO_ITEMS.map((item, i) => (
          <div
            key={item.id}
            className="card-sequoia p-4 flex flex-col gap-3"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-sequoia-100 text-sequoia-700 shrink-0">
                {item.icon}
              </div>
              <p className="text-sm text-brand-neutral-700 leading-snug">{item.text}</p>
            </div>
            <Link
              href={item.href}
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors"
            >
              {item.cta}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function OnboardingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST)

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    )
  }

  const done = items.filter((i) => i.done).length
  const total = items.length
  const pct = Math.round((done / total) * 100)

  return (
    <section aria-labelledby="checklist-heading" className="card-sequoia p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="checklist-heading" className="text-base font-bold text-sequoia-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Getting Started Checklist
        </h2>
        <span className="badge-gold text-xs">
          {done}/{total} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-brand-neutral-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-sequoia-700">{pct}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-brand-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sequoia-700 to-sequoia-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Onboarding checklist progress"
          />
        </div>
      </div>

      {/* Checklist items */}
      <ul className="space-y-2.5" role="list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 w-full text-left group"
              aria-pressed={item.done}
            >
              {item.done ? (
                <CheckCircle2
                  className="h-5 w-5 text-sequoia-600 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className="h-5 w-5 text-brand-neutral-300 group-hover:text-sequoia-400 transition-colors shrink-0"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-sm transition-colors ${
                  item.done
                    ? 'line-through text-brand-neutral-400'
                    : 'text-brand-neutral-700 group-hover:text-sequoia-800'
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ActivityFeed() {
  return (
    <section aria-labelledby="activity-heading" className="card-sequoia p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="activity-heading" className="text-base font-bold text-sequoia-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
          Recent Activity
        </h2>
        <Link
          href="/portal/community"
          className="text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="divide-y divide-brand-neutral-100" role="list">
        {ACTIVITY_ITEMS.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${item.iconBg}`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-brand-neutral-700 leading-snug">{item.text}</p>
              <p className="text-xs text-brand-neutral-400 mt-0.5">{item.timeAgo}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DealOfTheWeek() {
  return (
    <section aria-labelledby="deal-heading">
      <div
        className="relative overflow-hidden rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-100 via-white to-sequoia-50 p-5 sm:p-6 shadow-brand-gold"
      >
        {/* Decorative accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{
            background:
              'radial-gradient(circle at top right, var(--gold-400), transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-gold">
              <Star className="h-3 w-3" aria-hidden="true" />
              Deal of the Week
            </span>
          </div>

          <h2 id="deal-heading" className="text-xl sm:text-2xl font-extrabold text-sequoia-900 tracking-tight mb-1">
            $1.2M Multi-Family Acquisition
          </h2>
          <p className="text-brand-neutral-600 text-sm mb-4 max-w-prose">
            This week&rsquo;s spotlight deal — a 24-unit multi-family acquisition funded through Sequoia&rsquo;s lending network. Closed in under 18 days from application to funding.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-1.5 border border-gold-200">
              <div className="w-6 h-6 rounded-full bg-sequoia-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                MR
              </div>
              <div>
                <p className="font-semibold text-sequoia-900 text-xs leading-none mb-0.5">Marcus Rivera</p>
                <p className="text-brand-neutral-500 text-xs">Lead Consultant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-brand-neutral-600 text-xs">
              <TrendingUp className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
              <span>Funded via Sequoia Lending Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------

export default function PortalDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Quick Stats */}
      <QuickStats />

      {/* What to Do Today */}
      <WhatToDoToday />

      {/* Two-column section: checklist + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OnboardingChecklist />
        <ActivityFeed />
      </div>

      {/* Deal of the Week */}
      <DealOfTheWeek />
    </div>
  )
}
