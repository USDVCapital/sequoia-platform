'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
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
  Target,
  Calculator,
  ExternalLink,
  Edit3,
  Save,
  User,
  Video,
  Radio,
  FileText,
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

interface OnboardingItem {
  id: string
  label: string
  description: string
  href: string
  icon: React.ReactNode
  completedAt?: string | null
}

interface ActivityItem {
  id: string
  text: string
  timeAgo: string
  icon: React.ReactNode
  iconBg: string
}

interface GoalsData {
  monthlyIncome: number
  ehmpEnrollees: number
  dealsToClose: number
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
    href: '/apply',
    icon: <Send size={16} aria-hidden="true" />,
    cta: 'Submit Lead',
  },
]

// Onboarding checklist items
const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: 'complete-profile',
    label: 'Complete your profile',
    description: 'Add headshot, bio, phone',
    href: '/portal/profile',
    icon: <User size={16} aria-hidden="true" />,
  },
  {
    id: 'watch-first30',
    label: 'Watch "Your First 30 Days" training video',
    description: 'Get up to speed quickly',
    href: '/portal/training',
    icon: <Video size={16} aria-hidden="true" />,
  },
  {
    id: 'join-wednesday',
    label: 'Join the Wednesday live training',
    description: 'Live every Wed 8 PM ET',
    href: 'https://www.youtube.com/@seqsolution',
    icon: <Radio size={16} aria-hidden="true" />,
  },
  {
    id: 'submit-first-deal',
    label: 'Submit your first deal or EHMP lead',
    description: 'Start building your pipeline',
    href: '/portal/pipeline',
    icon: <FileText size={16} aria-hidden="true" />,
  },
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
// localStorage helpers
// ---------------------------------------------------------------------------

const CHECKLIST_KEY = 'sequoia-onboarding-checklist'
const GOALS_KEY = 'sequoia-goals-2026'

interface ChecklistState {
  [id: string]: { done: boolean; completedAt: string | null }
}

function loadChecklist(): ChecklistState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function saveChecklist(state: ChecklistState) {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state))
  } catch {}
}

function loadGoals(): GoalsData {
  if (typeof window === 'undefined') return { monthlyIncome: 5000, ehmpEnrollees: 100, dealsToClose: 12 }
  try {
    const raw = localStorage.getItem(GOALS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { monthlyIncome: 5000, ehmpEnrollees: 100, dealsToClose: 12 }
}

function saveGoals(goals: GoalsData) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  } catch {}
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WelcomeBanner() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Consultant'
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
            Welcome back, {firstName}!
          </h2>
          <p className="mt-1.5 text-sequoia-200 text-sm sm:text-base max-w-lg">
            You&rsquo;re 3 enrollees away from Senior tier. Keep the momentum going — your pipeline is looking strong.
          </p>
        </div>

        <div className="flex gap-2 sm:shrink-0">
          <Link
            href="/apply"
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
        {TODO_ITEMS.map((item) => (
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
  const [checklist, setChecklist] = useState<ChecklistState>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setChecklist(loadChecklist())
    setMounted(true)
  }, [])

  const toggle = useCallback((id: string) => {
    setChecklist((prev) => {
      const current = prev[id]
      const next = {
        ...prev,
        [id]: {
          done: !current?.done,
          completedAt: !current?.done ? new Date().toISOString() : null,
        },
      }
      saveChecklist(next)
      return next
    })
  }, [])

  const doneCount = ONBOARDING_ITEMS.filter((item) => checklist[item.id]?.done).length
  const total = ONBOARDING_ITEMS.length
  const pct = Math.round((doneCount / total) * 100)
  const allDone = doneCount === total

  return (
    <section aria-labelledby="checklist-heading" className="card-sequoia p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="checklist-heading" className="text-base font-bold text-sequoia-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Getting Started Checklist
        </h2>
        <span className="badge-gold text-xs">
          {doneCount}/{total} complete
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

      {/* Checklist items as interactive cards */}
      <div className="space-y-2.5">
        {ONBOARDING_ITEMS.map((item) => {
          const isDone = checklist[item.id]?.done ?? false
          const completedAt = checklist[item.id]?.completedAt
          const isExternal = item.href.startsWith('http')

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                isDone
                  ? 'border-sequoia-200 bg-sequoia-50/50'
                  : 'border-brand-neutral-200 bg-white hover:border-sequoia-300 hover:shadow-sm'
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="shrink-0 focus:outline-none focus:ring-2 focus:ring-sequoia-500 focus:ring-offset-1 rounded"
                aria-pressed={isDone}
                aria-label={`Mark "${item.label}" as ${isDone ? 'incomplete' : 'complete'}`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-sequoia-600" aria-hidden="true" />
                ) : (
                  <Circle className="h-5 w-5 text-brand-neutral-300 hover:text-sequoia-400 transition-colors" aria-hidden="true" />
                )}
              </button>

              {/* Icon */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${isDone ? 'bg-sequoia-100 text-sequoia-600' : 'bg-brand-neutral-100 text-brand-neutral-500'}`}>
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-brand-neutral-400' : 'text-brand-neutral-800'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-brand-neutral-400 mt-0.5">{item.description}</p>
                {isDone && completedAt && mounted && (
                  <p className="text-xs text-sequoia-500 mt-0.5">
                    Completed {new Date(completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Link */}
              {isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors flex items-center gap-1"
                >
                  Open
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="shrink-0 text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors flex items-center gap-1"
                >
                  Open
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Completion message */}
      {allDone && (
        <div className="mt-4 rounded-xl bg-gradient-to-r from-sequoia-700 to-sequoia-600 p-4 text-center">
          <p className="text-white font-bold text-sm">
            You&rsquo;re ready. Your first deal is within reach.
          </p>
        </div>
      )}
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
              This Week&rsquo;s Featured Deal
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sequoia-100 text-sequoia-800 border border-sequoia-200">
              Fix &amp; Flip
            </span>
          </div>

          <h2 id="deal-heading" className="text-xl sm:text-2xl font-extrabold text-sequoia-900 tracking-tight mb-1">
            $652,000 Fix &amp; Flip Deal
          </h2>
          <p className="text-brand-neutral-600 text-sm mb-4 max-w-prose">
            Joseph found this mixed-use property client through a real estate agent referral — his third deal in 90 days.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
            <div className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-1.5 border border-gold-200">
              <div className="w-6 h-6 rounded-full bg-sequoia-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                JC
              </div>
              <div>
                <p className="font-semibold text-sequoia-900 text-xs leading-none mb-0.5">Joseph Cordeira</p>
                <p className="text-brand-neutral-500 text-xs">Sequoia Consultant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-brand-neutral-600 text-xs">
              <TrendingUp className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
              <span>Funded via Sequoia Lending Network</span>
            </div>
          </div>

          <Link
            href="/portal/training"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors"
          >
            See How He Did It
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function GoalsWidget() {
  const [goals, setGoals] = useState<GoalsData>({ monthlyIncome: 5000, ehmpEnrollees: 100, dealsToClose: 12 })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<GoalsData>(goals)

  useEffect(() => {
    const loaded = loadGoals()
    setGoals(loaded)
    setDraft(loaded)
  }, [])

  function handleSave() {
    setGoals(draft)
    saveGoals(draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(goals)
    setEditing(false)
  }

  // Current progress (mock data)
  const currentIncome = 2340
  const currentEnrollees = 47
  const currentDeals = 3

  const goalRows = [
    {
      label: 'Monthly Income Goal',
      current: currentIncome,
      goal: goals.monthlyIncome,
      draftValue: draft.monthlyIncome,
      key: 'monthlyIncome' as const,
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      label: 'EHMP Enrollees Goal',
      current: currentEnrollees,
      goal: goals.ehmpEnrollees,
      draftValue: draft.ehmpEnrollees,
      key: 'ehmpEnrollees' as const,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Deals to Close',
      current: currentDeals,
      goal: goals.dealsToClose,
      draftValue: draft.dealsToClose,
      key: 'dealsToClose' as const,
      format: (v: number) => v.toString(),
    },
  ]

  return (
    <section aria-labelledby="goals-heading" className="card-sequoia p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="goals-heading" className="text-base font-bold text-sequoia-900 flex items-center gap-2">
          <Target className="h-4 w-4 text-gold-600" aria-hidden="true" />
          My 2026 Goals
        </h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            Update Goals
          </button>
        )}
      </div>

      <div className="space-y-4">
        {goalRows.map((row) => {
          const pct = Math.min(100, Math.round((row.current / row.goal) * 100))
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-brand-neutral-700">{row.label}</span>
                {editing ? (
                  <input
                    type="number"
                    min={1}
                    value={row.draftValue}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [row.key]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-24 text-right text-sm font-semibold text-sequoia-900 border border-brand-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sequoia-500 focus:border-sequoia-500"
                  />
                ) : (
                  <span className="text-sm font-semibold text-sequoia-900">
                    {row.format(row.current)} / {row.format(row.goal)}
                  </span>
                )}
              </div>
              <div className="h-2 w-full rounded-full bg-brand-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={row.current}
                  aria-valuemin={0}
                  aria-valuemax={row.goal}
                  aria-label={`${row.label} progress`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {editing && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-brand-neutral-100">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sequoia-700 text-white text-xs font-semibold hover:bg-sequoia-800 transition-colors"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-lg border border-brand-neutral-200 text-xs font-semibold text-brand-neutral-600 hover:bg-brand-neutral-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  )
}

function EHMPCalculator() {
  const [employees, setEmployees] = useState(50)
  const monthly = employees * 18
  const annual = monthly * 12

  return (
    <section aria-labelledby="ehmp-calc-heading" className="card-sequoia p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gold-100 text-gold-700">
          <Calculator size={16} aria-hidden="true" />
        </div>
        <h2 id="ehmp-calc-heading" className="text-base font-bold text-sequoia-900">
          EHMP Quick Calculator
        </h2>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="employee-count" className="block text-sm font-medium text-brand-neutral-600 mb-1.5">
            How many employees?
          </label>
          <input
            id="employee-count"
            type="number"
            min={1}
            value={employees}
            onChange={(e) => setEmployees(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full text-sm font-semibold text-sequoia-900 border border-brand-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sequoia-500 focus:border-sequoia-500"
          />
        </div>

        <div className="rounded-xl bg-sequoia-50 border border-sequoia-200 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-brand-neutral-600">Monthly:</span>
            <span className="text-lg font-extrabold text-sequoia-900">${monthly.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-neutral-600">Annual:</span>
            <span className="text-lg font-extrabold text-sequoia-900">${annual.toLocaleString()}</span>
          </div>
        </div>

        <Link
          href="/solutions/wellness"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors"
        >
          See full projection
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
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

      {/* Goals + EHMP Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoalsWidget />
        <EHMPCalculator />
      </div>
    </div>
  )
}
