'use client'

import { useEffect, useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  Calculator,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = 'this-period' | 'last-period' | 'q1-2026' | 'ytd'
type TransactionStatus = 'Paid' | 'Pending' | 'Processing'

interface Transaction {
  date: string
  type: string
  source: string
  level: string
  amount: number
  status: TransactionStatus
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const periods: { key: Period; label: string }[] = [
  { key: 'this-period', label: 'This Period' },
  { key: 'last-period', label: 'Last Period' },
  { key: 'q1-2026', label: 'Q1 2026' },
  { key: 'ytd', label: 'YTD' },
]

const summaryCards = [
  {
    label: 'This Period',
    value: '$1,847.50',
    change: '+12%',
    changeColor: 'text-green-600',
    icon: DollarSign,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
  {
    label: 'Last Period',
    value: '$1,649.00',
    change: null,
    changeColor: '',
    icon: Clock,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
  },
  {
    label: 'This Year',
    value: '$14,230.00',
    change: '+34%',
    changeColor: 'text-green-600',
    icon: Calendar,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
  },
  {
    label: 'Projected Annual',
    value: '$22,140.00',
    change: null,
    changeColor: '',
    icon: TrendingUp,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
]

const incomeStreamData = [
  { name: 'EHMP Residual', amount: 680, fill: '#C8A84E' },
  { name: 'Real Estate Overrides', amount: 420, fill: '#16a34a' },
  { name: 'Business Funding', amount: 380, fill: '#2563eb' },
  { name: 'Membership Overrides', amount: 247.5, fill: '#0d9488' },
  { name: 'Property Restoration', amount: 120, fill: '#d97706' },
]

const levelOverrideData = [
  { month: 'Oct', l1: 420, l2: 280, l3: 180, l4: 120, l5: 60, l6: 30 },
  { month: 'Nov', l1: 480, l2: 310, l3: 200, l4: 140, l5: 70, l6: 35 },
  { month: 'Dec', l1: 520, l2: 340, l3: 220, l4: 150, l5: 75, l6: 40 },
  { month: 'Jan', l1: 560, l2: 370, l3: 240, l4: 160, l5: 80, l6: 45 },
  { month: 'Feb', l1: 600, l2: 400, l3: 260, l4: 170, l5: 85, l6: 50 },
  { month: 'Mar', l1: 650, l2: 430, l3: 280, l4: 180, l5: 90, l6: 55 },
]

const levelColors = {
  l1: '#0D3320',
  l2: '#1A5C3A',
  l3: '#2E8B57',
  l4: '#5CB87A',
  l5: '#82CC96',
  l6: '#A3D9B1',
}

const transactions: Transaction[] = [
  { date: 'Mar 22, 2026', type: 'EHMP Residual', source: 'Green Valley Dental (52 employees)', level: 'Direct', amount: 156.00, status: 'Pending' },
  { date: 'Mar 20, 2026', type: 'Membership Override', source: 'Jason Park — Gold Membership', level: 'Level 2', amount: 24.50, status: 'Processing' },
  { date: 'Mar 18, 2026', type: 'Real Estate Override', source: 'Sunrise Capital — Fix & Flip', level: 'Level 1', amount: 210.00, status: 'Processing' },
  { date: 'Mar 15, 2026', type: 'EHMP Residual', source: 'Metro Logistics (38 employees)', level: 'Direct', amount: 114.00, status: 'Paid' },
  { date: 'Mar 14, 2026', type: 'Business Funding Override', source: 'Harbor Tech — Working Capital', level: 'Level 1', amount: 190.00, status: 'Paid' },
  { date: 'Mar 12, 2026', type: 'Rank Bonus', source: 'Regional Director Quarterly Bonus', level: 'N/A', amount: 250.00, status: 'Paid' },
  { date: 'Mar 10, 2026', type: 'Membership Override', source: 'Lisa Chen — Platinum Membership', level: 'Level 3', amount: 18.00, status: 'Paid' },
  { date: 'Mar 8, 2026', type: 'Real Estate Override', source: 'Coastal Properties — Bridge Loan', level: 'Level 2', amount: 175.00, status: 'Paid' },
  { date: 'Mar 5, 2026', type: 'EHMP Residual', source: 'Bright Smiles Orthodontics (28 employees)', level: 'Direct', amount: 84.00, status: 'Paid' },
  { date: 'Mar 3, 2026', type: 'Business Funding Override', source: 'Summit Auto — Equipment Lease', level: 'Level 2', amount: 95.00, status: 'Paid' },
  { date: 'Mar 1, 2026', type: 'EHMP Residual', source: 'Valley Medical Group (64 employees)', level: 'Direct', amount: 192.00, status: 'Paid' },
  { date: 'Feb 27, 2026', type: 'Membership Override', source: 'David Kim — Gold Membership', level: 'Level 1', amount: 37.50, status: 'Paid' },
  { date: 'Feb 24, 2026', type: 'Real Estate Override', source: 'Lakefront Dev — Multifamily', level: 'Level 1', amount: 320.00, status: 'Paid' },
  { date: 'Feb 20, 2026', type: 'Business Funding Override', source: 'Pinnacle Staffing — Line of Credit', level: 'Level 3', amount: 65.00, status: 'Paid' },
  { date: 'Feb 18, 2026', type: 'EHMP Residual', source: 'NorthStar Construction (45 employees)', level: 'Direct', amount: 135.00, status: 'Paid' },
  { date: 'Feb 15, 2026', type: 'Rank Bonus', source: 'Monthly Consistency Bonus', level: 'N/A', amount: 100.00, status: 'Paid' },
  { date: 'Feb 12, 2026', type: 'Membership Override', source: 'Sarah Thompson — Platinum Membership', level: 'Level 2', amount: 24.50, status: 'Paid' },
  { date: 'Feb 10, 2026', type: 'Real Estate Override', source: 'Oakwood Homes — DSCR Loan', level: 'Level 1', amount: 185.00, status: 'Paid' },
  { date: 'Feb 6, 2026', type: 'Business Funding Override', source: 'Elite Catering — SBA Loan', level: 'Level 1', amount: 145.00, status: 'Paid' },
  { date: 'Feb 3, 2026', type: 'EHMP Residual', source: 'Bayview Veterinary (22 employees)', level: 'Direct', amount: 66.00, status: 'Paid' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 size={12} aria-hidden="true" />
        Paid
      </span>
    )
  }
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-50 text-gold-700 border border-gold-200">
        <Clock size={12} aria-hidden="true" />
        Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
      <Loader2 size={12} aria-hidden="true" />
      Processing
    </span>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EarningsPage() {
  const [activePeriod, setActivePeriod] = useState<Period>('this-period')

  useEffect(() => {
    document.title = 'Earnings — Sequoia Enterprise Solutions'
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-sequoia-900 tracking-tight">
          Commission Dashboard
        </h2>
        <p className="text-sm text-brand-neutral-500 mt-1">
          Track your commissions, residuals, overrides, and payouts.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 1. Period Selector                                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex gap-1 rounded-lg bg-brand-neutral-100 p-1 w-fit">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setActivePeriod(p.key)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              activePeriod === p.key
                ? 'bg-white text-sequoia-900 shadow-sm'
                : 'text-brand-neutral-500 hover:text-sequoia-900'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Earnings Summary Bar                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>
                {card.change && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-bold ${card.changeColor}`}
                  >
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-neutral-500 mb-0.5">
                {card.label}
              </p>
              <p className="text-2xl font-extrabold text-sequoia-900 tracking-tight leading-none">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Income Stream Breakdown — Horizontal Bar Chart                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">
          Income Stream Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={incomeStreamData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v: number) => `$${v}`}
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Level Override Breakdown — Stacked Bar Chart                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">
          Level Override Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={levelOverrideData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis
              tickFormatter={(v: number) => `$${v}`}
              fontSize={12}
            />
            <Tooltip
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  l1: 'Level 1',
                  l2: 'Level 2',
                  l3: 'Level 3',
                  l4: 'Level 4',
                  l5: 'Level 5',
                  l6: 'Level 6',
                }
                return [formatCurrency(Number(value)), labels[String(name)] ?? String(name)]
              }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Legend
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  l1: 'Level 1',
                  l2: 'Level 2',
                  l3: 'Level 3',
                  l4: 'Level 4',
                  l5: 'Level 5',
                  l6: 'Level 6',
                }
                return labels[value] ?? value
              }}
            />
            <Bar dataKey="l1" stackId="a" fill={levelColors.l1} name="l1" />
            <Bar dataKey="l2" stackId="a" fill={levelColors.l2} name="l2" />
            <Bar dataKey="l3" stackId="a" fill={levelColors.l3} name="l3" />
            <Bar dataKey="l4" stackId="a" fill={levelColors.l4} name="l4" />
            <Bar dataKey="l5" stackId="a" fill={levelColors.l5} name="l5" />
            <Bar
              dataKey="l6"
              stackId="a"
              fill={levelColors.l6}
              name="l6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Commission Transaction Table                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200">
          <h3 className="text-base font-bold text-sequoia-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
            Commission Transactions
          </h3>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-brand-neutral-50/50">
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Date
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Type
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Source
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Level
                </th>
                <th className="text-right py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Amount
                </th>
                <th className="text-center py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-brand-neutral-50/50 transition-colors"
                >
                  <td className="py-3 px-5 text-brand-neutral-500 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3 px-5 text-brand-neutral-800 font-medium whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="py-3 px-5 text-brand-neutral-600">
                    {row.source}
                  </td>
                  <td className="py-3 px-5 text-brand-neutral-500 whitespace-nowrap">
                    {row.level}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-sequoia-900 whitespace-nowrap">
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-neutral-100">
          {transactions.map((row, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-neutral-800 leading-snug">
                    {row.source}
                  </p>
                  <p className="text-xs text-brand-neutral-500 mt-0.5">
                    {row.type} &middot; {row.level}
                  </p>
                </div>
                <p className="text-base font-bold text-sequoia-900 shrink-0">
                  {formatCurrency(row.amount)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-neutral-400">
                  {row.date}
                </span>
                <StatusBadge status={row.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 6. Projected Monthly Residual                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gold-100 text-gold-700 shrink-0">
            <Calculator size={20} aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-sequoia-900">
              Projected Monthly Residual
            </h3>
            <p className="text-sm text-brand-neutral-600">
              Current EHMP residual:{' '}
              <span className="font-bold text-sequoia-900">$680/month</span>
            </p>
            <p className="text-sm text-brand-neutral-600">
              If your team adds 10 more employers:{' '}
              <span className="font-bold text-green-700">+$2,000/month</span>
            </p>
            <a
              href="/portal/income-calculator"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold-800 transition-colors mt-1"
            >
              Open Income Calculator
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
