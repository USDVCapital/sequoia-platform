'use client'

import {
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const summaryCards = [
  {
    label: 'Open Period',
    value: '$2,340',
    subtext: 'Estimated',
    icon: <Clock size={20} aria-hidden="true" />,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
  {
    label: 'Last Period',
    value: '$1,890',
    subtext: 'Paid March 1, 2026',
    icon: <DollarSign size={20} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
  },
  {
    label: 'This Year',
    value: '$8,640',
    subtext: '2026 total',
    icon: <Calendar size={20} aria-hidden="true" />,
    iconBg: 'bg-sequoia-100',
    iconColor: 'text-sequoia-700',
  },
  {
    label: 'All Time',
    value: '$24,750',
    subtext: 'Since Nov 2025',
    icon: <TrendingUp size={20} aria-hidden="true" />,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-700',
  },
]

interface EarningsRow {
  date: string
  dealSource: string
  type: string
  amount: string
  status: 'Paid' | 'Pending'
}

const earningsData: EarningsRow[] = [
  {
    date: 'Mar 15',
    dealSource: 'Green Valley Dental — EHMP',
    type: 'Wellness Commission',
    amount: '$846',
    status: 'Pending',
  },
  {
    date: 'Mar 1',
    dealSource: 'Metro Logistics — Working Capital',
    type: 'Loan Referral',
    amount: '$1,850',
    status: 'Paid',
  },
  {
    date: 'Feb 15',
    dealSource: 'Sunrise Capital — Fix & Flip',
    type: 'Loan Referral',
    amount: '$1,890',
    status: 'Paid',
  },
  {
    date: 'Feb 1',
    dealSource: 'EHMP Monthly Residuals (47 employees)',
    type: 'Wellness Residual',
    amount: '$846',
    status: 'Paid',
  },
  {
    date: 'Jan 15',
    dealSource: 'Harbor View — Multifamily',
    type: 'Loan Referral',
    amount: '$2,100',
    status: 'Paid',
  },
  {
    date: 'Jan 1',
    dealSource: 'EHMP Monthly Residuals (42 employees)',
    type: 'Wellness Residual',
    amount: '$756',
    status: 'Paid',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EarningsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-sequoia-900 tracking-tight">Earnings</h2>
        <p className="text-sm text-brand-neutral-500 mt-1">Track your commissions, residuals, and payouts.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="card-sequoia p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-neutral-500 mb-0.5">
              {card.label}
            </p>
            <p className="text-2xl font-extrabold text-sequoia-900 tracking-tight leading-none mb-1">
              {card.value}
            </p>
            <p className="text-xs text-brand-neutral-500">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* Earnings Table */}
      <div className="card-sequoia overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-neutral-100">
          <h3 className="text-base font-bold text-sequoia-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-sequoia-600" aria-hidden="true" />
            Earnings History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-neutral-100 bg-brand-neutral-50/50">
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Date</th>
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Deal / Source</th>
                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Type</th>
                <th className="text-right py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Amount</th>
                <th className="text-center py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-neutral-100">
              {earningsData.map((row, i) => (
                <tr key={i} className="hover:bg-brand-neutral-50/50 transition-colors">
                  <td className="py-3 px-5 text-brand-neutral-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-5 text-brand-neutral-800 font-medium">{row.dealSource}</td>
                  <td className="py-3 px-5 text-brand-neutral-500 whitespace-nowrap">{row.type}</td>
                  <td className="py-3 px-5 text-right font-bold text-sequoia-900 whitespace-nowrap">{row.amount}</td>
                  <td className="py-3 px-5 text-center">
                    {row.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={12} aria-hidden="true" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-50 text-gold-700 border border-gold-200">
                        <Clock size={12} aria-hidden="true" />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
