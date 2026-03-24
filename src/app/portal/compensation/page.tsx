'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  Users,
  Heart,
  Building2,
  Briefcase,
  Hammer,
  Leaf,
  Trophy,
  ChevronRight,
  Star,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Award,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

interface PyramidLevel {
  level: number
  label?: string
  rate: string
  detail?: string
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const tabs: Tab[] = [
  { id: 'membership',   label: 'Membership Overrides', icon: <Users size={16} /> },
  { id: 'ehmp',         label: 'EHMP / Wellness',      icon: <Heart size={16} /> },
  { id: 'realestate',   label: 'Real Estate Loans',     icon: <Building2 size={16} /> },
  { id: 'funding',      label: 'Business Funding',      icon: <Briefcase size={16} /> },
  { id: 'restoration',  label: 'Property Restoration',  icon: <Hammer size={16} /> },
  { id: 'energy',       label: 'Clean Energy',          icon: <Leaf size={16} /> },
  { id: 'ranks',        label: 'Rank Advancement',      icon: <Trophy size={16} /> },
]

// ---------------------------------------------------------------------------
// Pyramid component (Tailwind only, no SVG)
// ---------------------------------------------------------------------------

function OverridePyramid({ levels }: { levels: PyramidLevel[] }) {
  // levels[0] = top (narrowest), levels[last] = bottom (widest)
  const widths = ['w-[40%]', 'w-[52%]', 'w-[64%]', 'w-[76%]', 'w-[88%]', 'w-[100%]']

  return (
    <div className="flex flex-col items-center gap-1 py-4">
      {levels.map((lvl, i) => (
        <div
          key={lvl.level}
          className={`${widths[i] ?? 'w-full'} rounded-md px-4 py-2.5 text-center transition-all
            ${i === 0
              ? 'bg-gold-500 text-white font-semibold shadow-md'
              : i === 1
                ? 'bg-gold-400 text-white font-medium'
                : 'bg-gold-100 text-sequoia-900 font-medium'
            }`}
        >
          <span className="text-sm">
            Level {lvl.level}: {lvl.rate}
          </span>
          {lvl.detail && (
            <span className="ml-2 text-xs opacity-75">{lvl.detail}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab content components
// ---------------------------------------------------------------------------

function MembershipTab() {
  const levels: PyramidLevel[] = [
    { level: 1, rate: '20%', detail: '= $5.99/mo per active LC' },
    { level: 2, rate: '10%', detail: '= $2.99/mo' },
    { level: 3, rate: '5%',  detail: '= $1.50/mo' },
    { level: 4, rate: '5%',  detail: '= $1.50/mo' },
    { level: 5, rate: '5%',  detail: '= $1.50/mo' },
    { level: 6, rate: '5%',  detail: '= $1.50/mo' },
  ]

  return (
    <div className="space-y-6">
      {/* Fee callout */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gold-100 p-2">
            <DollarSign size={20} className="text-gold-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sequoia-900">
              Membership Fee: $29.99/month
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Each active Licensed Consultant pays $29.99/month. You earn overrides on 6 levels
              of your downline membership fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pyramid */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-2 text-base font-semibold text-sequoia-900">
          6-Level Override Structure
        </h3>
        <p className="mb-4 text-sm text-neutral-500">
          Percentage of each $29.99 membership fee you earn per level
        </p>
        <OverridePyramid levels={levels} />
      </div>

      {/* Example */}
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-medium text-gold-800">
          <Star size={14} className="mr-1 inline -translate-y-px" />
          Example: 10 personally enrolled LCs paying $29.99 = <strong>$59.90/month</strong> from
          Level 1 alone. Add deeper levels for exponential growth.
        </p>
      </div>
    </div>
  )
}

function EhmpTab() {
  const tiers = [
    { range: '5 – 199 employees',  pepm: '$20 PEPM' },
    { range: '200 – 499 employees', pepm: '$22 PEPM' },
    { range: '500+ employees',      pepm: '$24 PEPM' },
  ]

  const overrides = [
    { level: 1, rate: '$1.00 per employee' },
    { level: 2, rate: '$1.00 per employee' },
    { level: 3, rate: '$0.50 per employee' },
  ]

  return (
    <div className="space-y-6">
      {/* Commission tiers */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-sequoia-900">
          Agent Commission (PEPM)
        </h3>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left">
                <th className="px-4 py-2.5 font-medium text-neutral-600">Group Size</th>
                <th className="px-4 py-2.5 font-medium text-neutral-600">Commission</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t.range} className="border-t border-neutral-100">
                  <td className="px-4 py-2.5 text-sequoia-900">{t.range}</td>
                  <td className="px-4 py-2.5 font-semibold text-gold-700">{t.pepm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team overrides */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-sequoia-900">
          Team Overrides (3 Levels)
        </h3>
        <div className="flex flex-col items-center gap-1">
          {overrides.map((o, i) => {
            const widths = ['w-[50%]', 'w-[75%]', 'w-[100%]']
            return (
              <div
                key={o.level}
                className={`${widths[i]} rounded-md px-4 py-2.5 text-center font-medium text-sm
                  ${i === 0
                    ? 'bg-gold-500 text-white'
                    : i === 1
                      ? 'bg-gold-300 text-sequoia-900'
                      : 'bg-gold-100 text-sequoia-900'
                  }`}
              >
                Level {o.level}: {o.rate}
              </div>
            )
          })}
        </div>
      </div>

      {/* Income callout */}
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <div className="flex items-center gap-3">
          <ArrowUpRight size={24} className="text-gold-600" />
          <div>
            <p className="text-lg font-bold text-gold-800">
              500+ employees = $10,600+/month = $127,000+/year
            </p>
            <p className="text-sm text-gold-700">
              A single mid-size employer group can generate six-figure annual recurring revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RealEstateTab() {
  const levels: PyramidLevel[] = [
    { level: 1, rate: '10%', detail: 'Requires 1+ PQLC' },
    { level: 2, rate: '5%', detail: 'Requires 3+ PQLC' },
    { level: 3, rate: '3%', detail: 'Requires 5+ PQLC' },
    { level: 4, rate: '1.5%', detail: 'Requires 8+ PQLC' },
    { level: 5, rate: '1.5%', detail: 'Requires 12+ PQLC' },
    { level: 6, rate: '1%', detail: 'Requires 15+ PQLC' },
  ]

  return (
    <div className="space-y-6">
      {/* Two commission tiers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-lg bg-gold-100 p-2">
              <DollarSign size={18} className="text-gold-700" />
            </div>
            <h3 className="text-base font-semibold text-sequoia-900">Referral Commission</h3>
          </div>
          <p className="text-4xl font-extrabold text-gold-600 mb-2">23%</p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            For new LCs who refer business but don&apos;t get involved with the project.
            First 3 deals require working with a Loan Advisor for Certification Training.
          </p>
          <div className="mt-3 rounded-lg bg-neutral-50 border border-neutral-200 p-3">
            <p className="text-xs text-neutral-500">Example: $1M loan at 2 points</p>
            <p className="text-sm font-semibold text-sequoia-900">Total Commission: $20,000</p>
            <p className="text-sm font-bold text-gold-700">Your Referral: $4,600</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-gold-400 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-lg bg-gold-100 p-2">
              <Award size={18} className="text-gold-700" />
            </div>
            <h3 className="text-base font-semibold text-sequoia-900">Personal Commission</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">After Certification</span>
          </div>
          <p className="text-4xl font-extrabold text-gold-600 mb-2">46%</p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            After completing Sequoia On Job Training (3 deals with advisor) and actively working the project —
            follow up, collect documents, set up meetings, etc. Double the commission.
          </p>
          <div className="mt-3 rounded-lg bg-gold-50 border border-gold-200 p-3">
            <p className="text-xs text-gold-700">Example: $1M loan at 2 points</p>
            <p className="text-sm font-semibold text-sequoia-900">Total Commission: $20,000</p>
            <p className="text-sm font-bold text-gold-700">Your Commission: $9,200</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-600">
          <strong>Note:</strong> Agent commission rates vary by deal — loan type, size, and lender terms
          determine the total points charged. Common products include Bridge Loans, Hard Money, Fix &amp; Flip,
          DSCR, Commercial, SBA, Construction, and Ground-Up.
        </p>
      </div>

      {/* Revenue sharing pyramid */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-2 text-base font-semibold text-sequoia-900">
          Revenue Sharing — 6 Levels
        </h3>
        <p className="mb-4 text-sm text-neutral-500">
          Percentage of team revenue paid as override. Requires Personal Qualifying Loan Consultants (PQLC) at each level.
        </p>
        <OverridePyramid levels={levels} />
      </div>
    </div>
  )
}

function BusinessFundingTab() {
  const levels: PyramidLevel[] = [
    { level: 1, rate: '10%', detail: 'Requires 1+ PQLC' },
    { level: 2, rate: '5%', detail: 'Requires 3+ PQLC' },
    { level: 3, rate: '3%', detail: 'Requires 5+ PQLC' },
    { level: 4, rate: '1.5%', detail: 'Requires 8+ PQLC' },
    { level: 5, rate: '1.5%', detail: 'Requires 12+ PQLC' },
    { level: 6, rate: '1%', detail: 'Requires 15+ PQLC' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gold-100 p-2">
            <Briefcase size={20} className="text-gold-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sequoia-900">
              Agent Commission: 5 – 8% of funded amount
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Commissions vary by product type and deal size. MCA, term loans, lines of credit,
              equipment financing, and SBA loans all qualify.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-2 text-base font-semibold text-sequoia-900">
          6-Level Override Pyramid
        </h3>
        <p className="mb-4 text-sm text-neutral-500">
          Percentage of the agent&apos;s commission paid as override
        </p>
        <OverridePyramid levels={levels} />
      </div>

      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-medium text-gold-800">
          <Star size={14} className="mr-1 inline -translate-y-px" />
          Example: A $200,000 funded deal at 6% = <strong>$12,000</strong> agent commission.
          Your Level 1 override = <strong>$1,200</strong>.
        </p>
      </div>
    </div>
  )
}

function PropertyRestorationTab() {
  const levels: PyramidLevel[] = [
    { level: 1, rate: '1.00%' },
    { level: 2, rate: '0.75%' },
    { level: 3, rate: '0.50%' },
    { level: 4, rate: '0.50%' },
    { level: 5, rate: '0.25%' },
    { level: 6, rate: '0.25%' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gold-100 p-2">
            <Hammer size={20} className="text-gold-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sequoia-900">
              Agent Commission: 8% of project value
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Covers fire, water, mold, storm, and general restoration projects. Commission is
              based on the total project value approved by the insurance carrier or property owner.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-2 text-base font-semibold text-sequoia-900">
          6-Level Override Pyramid
        </h3>
        <p className="mb-4 text-sm text-neutral-500">
          Percentage of project value paid as override
        </p>
        <OverridePyramid levels={levels} />
      </div>
    </div>
  )
}

function CleanEnergyTab() {
  const levels: PyramidLevel[] = [
    { level: 1, rate: '10%', detail: 'Requires 1+ PQLC' },
    { level: 2, rate: '5%', detail: 'Requires 3+ PQLC' },
    { level: 3, rate: '3%', detail: 'Requires 5+ PQLC' },
    { level: 4, rate: '1.5%', detail: 'Requires 8+ PQLC' },
    { level: 5, rate: '1.5%', detail: 'Requires 12+ PQLC' },
    { level: 6, rate: '1%', detail: 'Requires 15+ PQLC' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gold-100 p-2">
            <Leaf size={20} className="text-gold-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sequoia-900">
              Agent Commission: $500 – $2,000 per installation
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Solar, battery storage, and EV charger installations. Commission varies by system
              size and product type.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-2 text-base font-semibold text-sequoia-900">
          6-Level Override Pyramid
        </h3>
        <p className="mb-4 text-sm text-neutral-500">
          Percentage of the agent&apos;s commission paid as override
        </p>
        <OverridePyramid levels={levels} />
      </div>

      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-medium text-gold-800">
          <Star size={14} className="mr-1 inline -translate-y-px" />
          Example: A $1,500 installation commission with 10 installs/month =
          <strong> $15,000/month</strong> in agent earnings alone.
        </p>
      </div>
    </div>
  )
}

function RankAdvancementTab() {
  const ranks = [
    {
      rank: 'LC 1',
      title: 'Licensed Consultant 1',
      requirement: 'Entry level — complete onboarding',
      bonus: '—',
      isCurrent: true,
    },
    {
      rank: 'LC 2',
      title: 'Licensed Consultant 2',
      requirement: '2 personally recruited active LCs',
      bonus: '$25',
      isCurrent: false,
    },
    {
      rank: 'LC 3',
      title: 'Licensed Consultant 3',
      requirement: '4 personally recruited active LCs',
      bonus: '$50',
      isCurrent: false,
    },
    {
      rank: 'Senior LC',
      title: 'Senior Licensed Consultant',
      requirement: '6 personally recruited + 50 total team',
      bonus: '$100',
      isCurrent: false,
    },
    {
      rank: 'MD',
      title: 'Managing Director',
      requirement: '10 personally recruited + 200 total team',
      bonus: '$250',
      isCurrent: false,
    },
    {
      rank: 'ED',
      title: 'Executive Director',
      requirement: '15 personally recruited + 500 total team',
      bonus: '$500',
      isCurrent: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Rank ladder */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-sequoia-900">
          Rank Ladder
        </h3>
        <div className="space-y-3">
          {ranks.map((r, i) => (
            <div
              key={r.rank}
              className={`relative flex items-center gap-4 rounded-lg border p-4 transition-all
                ${r.isCurrent
                  ? 'border-gold-400 bg-gold-50 shadow-sm'
                  : 'border-neutral-200 bg-white'
                }`}
            >
              {/* Connector line */}
              {i < ranks.length - 1 && (
                <div className="absolute left-7 top-full z-10 h-3 w-px bg-neutral-300" />
              )}

              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold
                  ${r.isCurrent
                    ? 'bg-gold-500 text-white'
                    : 'bg-neutral-100 text-neutral-500'
                  }`}
              >
                {i + 1}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sequoia-900">{r.rank}</span>
                  <span className="text-xs text-neutral-500">— {r.title}</span>
                  {r.isCurrent && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                      <CheckCircle2 size={12} />
                      You are here
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-neutral-600">{r.requirement}</p>
              </div>

              {/* Bonus */}
              <div className="shrink-0 text-right">
                <p className="text-xs text-neutral-500">Bonus</p>
                <p className={`text-sm font-bold ${r.bonus === '—' ? 'text-neutral-400' : 'text-gold-700'}`}>
                  {r.bonus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-medium text-gold-800">
          <Trophy size={14} className="mr-1 inline -translate-y-px" />
          Rank advancement bonuses are one-time payouts. Maintain rank to keep higher override
          percentages and unlock leadership incentive pools.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CompensationPage() {
  const [activeTab, setActiveTab] = useState('membership')

  useEffect(() => {
    document.title = 'Compensation Plan — Sequoia Enterprise Solutions'
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'membership':  return <MembershipTab />
      case 'ehmp':        return <EhmpTab />
      case 'realestate':  return <RealEstateTab />
      case 'funding':     return <BusinessFundingTab />
      case 'restoration': return <PropertyRestorationTab />
      case 'energy':      return <CleanEnergyTab />
      case 'ranks':       return <RankAdvancementTab />
      default:            return <MembershipTab />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sequoia-900">Compensation Plan</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Complete reference for commissions, overrides, and rank advancement
          </p>
        </div>

        <a
          href="/Compensation Materials/SPM 7.5.pdf"
          download
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-600"
        >
          <Download size={16} />
          Download Full PDF
        </a>
      </div>

      {/* Tab bar */}
      <div className="rounded-xl border border-neutral-200 bg-white p-1.5">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-sequoia-900'
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active tab label (mobile) */}
      <div className="flex items-center gap-2 sm:hidden">
        <ChevronRight size={14} className="text-gold-500" />
        <span className="text-sm font-semibold text-sequoia-900">
          {tabs.find((t) => t.id === activeTab)?.label}
        </span>
      </div>

      {/* Tab content */}
      {renderContent()}
    </div>
  )
}
