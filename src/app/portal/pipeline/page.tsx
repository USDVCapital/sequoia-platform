'use client'

import { useState } from 'react'
import {
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  FileText,
  Building2,
  Briefcase,
  Home,
  Zap,
  Filter,
  ChevronRight,
  ChevronDown,
  Heart,
  Users,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type DealStatus = 'Application' | 'In Review' | 'Approved' | 'Funded' | 'Active'
type TabKey = 'All' | DealStatus

interface Deal {
  id: string
  client: string
  dealType: string
  amount: string
  status: DealStatus
  dateSubmitted: string
  icon: React.ReactNode
  advisor: string
  nextStep: string
  estimatedClose: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const DEALS: Deal[] = [
  {
    id: 'D-2001',
    client: 'Green Valley Dental Group',
    dealType: 'EHMP Wellness',
    amount: '47 employees',
    status: 'Active',
    dateSubmitted: '2026-03-01',
    icon: <Heart size={16} />,
    advisor: 'Marcus Rivera',
    nextStep: 'Quarterly wellness review scheduled',
    estimatedClose: 'Ongoing',
  },
  {
    id: 'D-2002',
    client: 'Sunrise Capital LLC',
    dealType: 'Fix & Flip',
    amount: '$425,000',
    status: 'Funded',
    dateSubmitted: '2026-02-15',
    icon: <Home size={16} />,
    advisor: 'Jessica Chen',
    nextStep: 'Rehab draw #2 pending inspection',
    estimatedClose: 'Funded Feb 15, 2026',
  },
  {
    id: 'D-2003',
    client: 'Metro Logistics Inc',
    dealType: 'Working Capital',
    amount: '$185,000',
    status: 'Approved',
    dateSubmitted: '2026-02-28',
    icon: <Briefcase size={16} />,
    advisor: 'David Park',
    nextStep: 'Final docs to be signed by borrower',
    estimatedClose: 'Mar 25, 2026',
  },
  {
    id: 'D-2004',
    client: 'Pacific Rim Realty',
    dealType: 'Commercial RE',
    amount: '$1,200,000',
    status: 'In Review',
    dateSubmitted: '2026-03-10',
    icon: <Building2 size={16} />,
    advisor: 'Sarah Thompson',
    nextStep: 'Appraisal ordered — awaiting report',
    estimatedClose: 'Apr 10, 2026',
  },
  {
    id: 'D-2005',
    client: 'Oakwood Properties',
    dealType: 'DSCR Rental',
    amount: '$650,000',
    status: 'In Review',
    dateSubmitted: '2026-03-12',
    icon: <Home size={16} />,
    advisor: 'Marcus Rivera',
    nextStep: 'Rent roll verification in progress',
    estimatedClose: 'Apr 15, 2026',
  },
  {
    id: 'D-2006',
    client: 'TechStart Solutions',
    dealType: 'SBA 7(a)',
    amount: '$350,000',
    status: 'Application',
    dateSubmitted: '2026-03-18',
    icon: <FileText size={16} />,
    advisor: 'Jessica Chen',
    nextStep: 'Collecting business tax returns (2023–2025)',
    estimatedClose: 'May 1, 2026',
  },
]

const TABS: TabKey[] = ['All', 'Application', 'In Review', 'Approved', 'Funded', 'Active']

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  DealStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  Application: {
    label: 'Application',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <FileText size={12} />,
  },
  'In Review': {
    label: 'In Review',
    bg: 'bg-gold-100',
    text: 'text-gold-800',
    icon: <Clock size={12} />,
  },
  Approved: {
    label: 'Approved',
    bg: 'bg-sequoia-100',
    text: 'text-sequoia-800',
    icon: <CheckCircle2 size={12} />,
  },
  Funded: {
    label: 'Funded',
    bg: 'bg-sequoia-200',
    text: 'text-sequoia-900',
    icon: <DollarSign size={12} />,
  },
  Active: {
    label: 'Active',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: <Heart size={12} />,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('All')
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null)

  const filtered = activeTab === 'All' ? DEALS : DEALS.filter((d) => d.status === activeTab)

  const tabCount = (tab: TabKey) =>
    tab === 'All' ? DEALS.length : DEALS.filter((d) => d.status === tab).length

  const toggleExpand = (id: string) => {
    setExpandedDeal((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Portal Header ────────────────────────────────────────────── */}
      <div className="bg-gradient-sequoia">
        <div className="container-brand py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sequoia-300 text-sm font-medium uppercase tracking-widest mb-1">
                Consultant Portal
              </p>
              <h1 className="text-3xl font-bold text-white">My Pipeline</h1>
              <p className="text-sequoia-200 mt-1 text-sm">
                Track all your submitted deals and their current status.
              </p>
            </div>
            <button className="btn-gold self-start sm:self-auto flex items-center gap-2 whitespace-nowrap">
              <PlusCircle size={16} />
              Submit New Lead
            </button>
          </div>

          {/* Summary stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { label: 'Total Deals', value: '6', sub: 'all time' },
              { label: 'In Review', value: '2', sub: 'pending' },
              { label: 'Approved', value: '1', sub: 'ready to fund' },
              { label: 'Funded', value: '1', sub: 'completed' },
              { label: 'Application', value: '1', sub: 'new submission' },
              { label: 'Active EHMP', value: '1', sub: 'wellness' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-3 sm:p-4">
                <p className="text-sequoia-200 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
                <p className="text-sequoia-300 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="container-brand py-8">

        {/* Tab filters */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Filter size={15} className="text-[var(--neutral-400)] shrink-0" />
          {TABS.map((tab) => {
            const count = tabCount(tab)
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border cursor-pointer ${
                  activeTab === tab
                    ? 'bg-sequoia-800 text-white border-sequoia-800 shadow-sm'
                    : 'bg-white text-[var(--neutral-600)] border-[var(--neutral-200)] hover:border-sequoia-300 hover:text-sequoia-700'
                }`}
              >
                {tab}
                <span className={`ml-1.5 text-xs font-medium ${activeTab === tab ? 'opacity-70' : 'opacity-50'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Deal table / cards */}
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-[var(--neutral-200)] bg-white overflow-hidden shadow-[var(--shadow-sm)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--neutral-100)] bg-[var(--neutral-50)]">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                      Deal Type
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--neutral-100)]">
                  {filtered.map((deal) => {
                    const status = STATUS_CONFIG[deal.status]
                    const isExpanded = expandedDeal === deal.id
                    return (
                      <>
                        <tr
                          key={deal.id}
                          onClick={() => toggleExpand(deal.id)}
                          className="hover:bg-sequoia-50 transition-colors duration-100 group cursor-pointer"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="icon-box-sequoia w-8 h-8 text-sequoia-700 shrink-0">
                                {deal.icon}
                              </span>
                              <div>
                                <p className="font-semibold text-[var(--sequoia-900)]">{deal.client}</p>
                                <p className="text-xs text-[var(--neutral-400)]">{deal.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[var(--neutral-600)]">{deal.dealType}</td>
                          <td className="px-5 py-4 text-right font-semibold text-[var(--sequoia-900)]">
                            {deal.amount}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[var(--neutral-500)] text-sm">
                            {formatDate(deal.dateSubmitted)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`flex items-center gap-1 text-sequoia-700 font-semibold text-xs transition-transform duration-200 ${isExpanded ? 'rotate-0' : ''}`}>
                              {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                            </span>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${deal.id}-details`} className="bg-sequoia-50/50">
                            <td colSpan={6} className="px-5 py-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pl-11">
                                <div>
                                  <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider mb-1">Advisor Assigned</p>
                                  <p className="text-sm font-semibold text-[var(--sequoia-900)]">{deal.advisor}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider mb-1">Next Step</p>
                                  <p className="text-sm font-medium text-[var(--neutral-700)]">{deal.nextStep}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider mb-1">Est. Close Date</p>
                                  <p className="text-sm font-semibold text-[var(--sequoia-900)]">{deal.estimatedClose}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {filtered.map((deal) => {
                const status = STATUS_CONFIG[deal.status]
                const isExpanded = expandedDeal === deal.id
                return (
                  <div key={deal.id} className="card-sequoia p-4">
                    <div
                      className="flex items-start justify-between gap-3 mb-3 cursor-pointer"
                      onClick={() => toggleExpand(deal.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="icon-box-sequoia w-9 h-9 shrink-0">{deal.icon}</span>
                        <div>
                          <p className="font-bold text-[var(--sequoia-900)] text-sm">{deal.client}</p>
                          <p className="text-xs text-[var(--neutral-400)]">{deal.id}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${status.bg} ${status.text}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[var(--neutral-400)] text-xs">Type</p>
                        <p className="font-medium text-[var(--neutral-700)]">{deal.dealType}</p>
                      </div>
                      <div>
                        <p className="text-[var(--neutral-400)] text-xs">Amount</p>
                        <p className="font-semibold text-[var(--sequoia-900)]">{deal.amount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[var(--neutral-400)] text-xs">Submitted</p>
                        <p className="font-medium text-[var(--neutral-700)]">{formatDate(deal.dateSubmitted)}</p>
                      </div>
                    </div>

                    {/* Expandable details */}
                    <button
                      onClick={() => toggleExpand(deal.id)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--neutral-200)] text-sequoia-700 text-sm font-semibold hover:bg-sequoia-50 transition-colors cursor-pointer"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                      {isExpanded ? <ChevronDown size={14} /> : <ArrowRight size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[var(--neutral-100)] space-y-2.5">
                        <div>
                          <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider">Advisor Assigned</p>
                          <p className="text-sm font-semibold text-[var(--sequoia-900)]">{deal.advisor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider">Next Step</p>
                          <p className="text-sm font-medium text-[var(--neutral-700)]">{deal.nextStep}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider">Est. Close Date</p>
                          <p className="text-sm font-semibold text-[var(--sequoia-900)]">{deal.estimatedClose}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="icon-box-sequoia w-16 h-16 mb-4">
        <FileText size={28} className="text-sequoia-400" />
      </div>
      <h3 className="text-lg font-bold text-[var(--sequoia-900)] mb-2">No deals here yet</h3>
      <p className="text-[var(--neutral-500)] text-sm max-w-xs">
        {`You don't have any deals with "${tab}" status right now.`}
      </p>
      <button className="btn-gold mt-6 flex items-center gap-2">
        <PlusCircle size={16} />
        Submit New Lead
      </button>
    </div>
  )
}
