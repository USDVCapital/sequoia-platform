'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, DollarSign, Briefcase, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react'
import { calculateWaterfall, getWaterfallSummary } from '@/lib/waterfall-engine'
import type { WaterfallPayout } from '@/lib/supabase/types'

// ── Mock data ────────────────────────────────────────────────

const mockDeal = {
  id: 'deal-001',
  clientName: 'Robert Chen',
  businessName: 'Chen Capital Group LLC',
  fundingType: 'SBA 7(a) Loan',
  productCategory: 'business_funding' as const,
  amount: 425000,
  fundedAmount: 425000,
  status: 'funded' as const,
  consultantName: 'Jordan Blake',
  consultantId: 'c-jordan',
  consultantRank: 'lc_2',
  createdAt: '2026-02-14',
  updatedAt: '2026-03-18',
}

const mockUpline = [
  { level: 1, consultantId: 'sp1', fullName: 'Marcus Rivera', rank: 'senior_lc', isActive: true },
  { level: 2, consultantId: 'sp2', fullName: 'Priya Nair', rank: 'lc_3', isActive: true },
  { level: 3, consultantId: 'sp3', fullName: 'Allen Wu', rank: 'executive_director', isActive: true },
]

const statusSteps = ['application', 'in_review', 'approved', 'funded'] as const
const approvalSteps = ['pending', 'reviewed', 'approved', 'paid'] as const

const statusBadge: Record<string, string> = {
  application: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  funded: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
}

const rankLabels: Record<string, string> = {
  lc_1: 'LC 1', lc_2: 'LC 2', lc_3: 'LC 3',
  senior_lc: 'Senior LC', managing_director: 'MD', executive_director: 'ED',
}

const rankColors: Record<string, string> = {
  lc_1: 'bg-gray-100 text-gray-600', lc_2: 'bg-blue-100 text-blue-600',
  lc_3: 'bg-indigo-100 text-indigo-600', senior_lc: 'bg-purple-100 text-purple-600',
  managing_director: 'bg-amber-100 text-amber-700', executive_director: 'bg-yellow-100 text-yellow-800',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ── Page Component ───────────────────────────────────────────

export default function AdminDealDetailPage() {
  const [deal, setDeal] = useState(mockDeal)
  const [grossCommission, setGrossCommission] = useState(12750)
  const [isCertified, setIsCertified] = useState(false)
  const [payouts, setPayouts] = useState<WaterfallPayout[]>([])
  const [editedAmounts, setEditedAmounts] = useState<Record<number, number>>({})
  const [approvalStatus, setApprovalStatus] = useState<string>('pending')

  useEffect(() => { document.title = 'Deal Detail | Sequoia Admin' }, [])

  const handleCalculate = () => {
    const result = calculateWaterfall({
      dealId: deal.id,
      grossCommission,
      productCategory: deal.productCategory,
      agentId: deal.consultantId,
      agentName: deal.consultantName,
      agentRank: deal.consultantRank,
      isCertified,
      upline: mockUpline,
    })
    setPayouts(result)
    setEditedAmounts({})
  }

  const handleAmountEdit = (idx: number, value: number) => {
    setEditedAmounts(prev => ({ ...prev, [idx]: value }))
  }

  const handleStatusChange = (newStatus: string) => {
    setDeal(prev => ({ ...prev, status: newStatus as typeof prev.status }))
  }

  const handleApproveCommissions = () => {
    setApprovalStatus('reviewed')
  }

  const summary = payouts.length > 0 ? getWaterfallSummary(payouts) : null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/admin/deals"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sequoia-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Deals
      </Link>

      {/* Deal header card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-sequoia-900">{deal.clientName}</h2>
            <p className="text-sm text-gray-500">{deal.businessName}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge[deal.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {deal.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-400 block text-xs mb-0.5">Funding Type</span><span className="font-medium text-gray-800">{deal.fundingType}</span></div>
          <div><span className="text-gray-400 block text-xs mb-0.5">Product Category</span><span className="font-medium text-gray-800 capitalize">{deal.productCategory.replace(/_/g, ' ')}</span></div>
          <div><span className="text-gray-400 block text-xs mb-0.5">Amount</span><span className="font-medium text-gray-800">{fmt(deal.amount)}</span></div>
          <div><span className="text-gray-400 block text-xs mb-0.5">Consultant</span><span className="font-medium text-gray-800">{deal.consultantName}</span></div>
          <div><span className="text-gray-400 block text-xs mb-0.5">Created</span><span className="font-medium text-gray-800">{fmtDate(deal.createdAt)}</span></div>
          <div><span className="text-gray-400 block text-xs mb-0.5">Last Updated</span><span className="font-medium text-gray-800">{fmtDate(deal.updatedAt)}</span></div>
        </div>
      </div>

      {/* Status workflow */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Workflow</h3>
        <div className="flex flex-wrap gap-2">
          {statusSteps.map(step => (
            <button
              key={step}
              onClick={() => handleStatusChange(step)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                deal.status === step
                  ? 'bg-sequoia-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step === 'in_review' ? 'In Review' : step}
            </button>
          ))}
          <button
            onClick={() => handleStatusChange('declined')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              (deal.status as string) === 'declined'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            Declined
          </button>
        </div>
      </div>

      {/* Commission Waterfall Section */}
      {(deal.status === 'funded' || deal.fundedAmount > 0) && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-5">
          <h3 className="text-lg font-bold text-sequoia-900">Commission Waterfall</h3>

          {/* Inputs */}
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gross Commission ($)</label>
              <input
                type="number"
                value={grossCommission}
                onChange={e => setGrossCommission(Number(e.target.value))}
                className="w-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Agent Status</label>
              <button
                onClick={() => setIsCertified(!isCertified)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  isCertified
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-amber-50 border-amber-300 text-amber-700'
                }`}
              >
                {isCertified ? 'Personal (46%)' : 'Referral (23%)'}
              </button>
            </div>
            <button
              onClick={handleCalculate}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-sequoia-900 text-white hover:bg-sequoia-800 transition-colors"
            >
              Calculate Waterfall
            </button>
          </div>

          {/* Waterfall cascade */}
          {payouts.length > 0 && (
            <div className="space-y-1.5">
              {payouts.map((p, idx) => {
                const edited = editedAmounts[idx] !== undefined
                const displayAmount = edited ? editedAmounts[idx] : p.amount
                const isSequoia = p.role === 'sequoia_overhead'
                const isAgent = p.role.startsWith('agent_')
                const isBonusPool = p.role === 'bonus_pool'
                const isRecaptured = p.isRecaptured

                let rowBg = 'bg-white'
                let borderColor = 'border-neutral-200'
                if (isSequoia) { rowBg = 'bg-sequoia-900'; borderColor = 'border-sequoia-700' }
                else if (isAgent) { rowBg = 'bg-gradient-to-r from-amber-50 to-yellow-50'; borderColor = 'border-gold-500' }
                else if (isBonusPool) { rowBg = 'bg-blue-50'; borderColor = 'border-blue-200' }
                else if (isRecaptured) { rowBg = 'bg-gray-50'; borderColor = 'border-gray-200' }

                if (edited) borderColor = 'border-gold-500 ring-1 ring-gold-500'

                const levelLabel = p.waterfallLevel === -1 ? 'Overhead'
                  : p.waterfallLevel === 0 ? 'Agent'
                  : p.waterfallLevel === 99 ? 'Pool'
                  : `L${p.waterfallLevel} Override`

                return (
                  <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${borderColor} ${rowBg} transition-all`}>
                    {/* Avatar */}
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0 ${
                      isSequoia ? 'bg-sequoia-700 text-white'
                        : isRecaptured ? 'bg-gray-200 text-gray-500'
                        : 'bg-sequoia-100 text-sequoia-700'
                    }`}>
                      {p.consultantId ? initials(p.consultantName) : isSequoia ? 'SQ' : isBonusPool ? 'BP' : '--'}
                    </div>

                    {/* Name & rank */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${isSequoia ? 'text-white' : 'text-gray-800'}`}>
                          {p.consultantName}
                        </span>
                        {p.consultantRank && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${rankColors[p.consultantRank] ?? 'bg-gray-100 text-gray-600'}`}>
                            {rankLabels[p.consultantRank] ?? p.consultantRank}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${isSequoia ? 'text-sequoia-300' : isRecaptured ? 'text-gray-400 italic' : 'text-gray-400'}`}>
                        {levelLabel}
                        {isRecaptured && ' — Recaptured \u2192 Sequoia'}
                      </span>
                    </div>

                    {/* Rate */}
                    <span className={`text-xs font-mono w-12 text-right ${isSequoia ? 'text-sequoia-300' : 'text-gray-500'}`}>
                      {(p.rate * 100).toFixed(1)}%
                    </span>

                    {/* Editable amount */}
                    <div className="w-28">
                      <input
                        type="number"
                        step="0.01"
                        value={displayAmount}
                        onChange={e => handleAmountEdit(idx, Number(e.target.value))}
                        className={`w-full text-right text-sm font-semibold rounded-md border px-2 py-1 outline-none ${
                          isSequoia
                            ? 'bg-sequoia-800 border-sequoia-600 text-white focus:ring-gold-500'
                            : edited
                              ? 'border-gold-500 bg-yellow-50 text-gray-900 ring-1 ring-gold-500'
                              : 'border-neutral-200 bg-white text-gray-900 focus:ring-gold-500'
                        } focus:ring-2`}
                      />
                    </div>
                  </div>
                )
              })}

              {/* Total line */}
              {summary && (
                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-neutral-300 mt-2">
                  <span className="text-sm font-bold text-gray-700">Total (100%)</span>
                  <span className="text-sm font-bold text-sequoia-900">
                    {fmt(Object.keys(editedAmounts).length > 0
                      ? payouts.reduce((sum, p, idx) => sum + (editedAmounts[idx] ?? p.amount), 0)
                      : summary.grossCommission
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Approve button */}
          {payouts.length > 0 && (
            <div className="space-y-4 pt-2">
              <button
                onClick={handleApproveCommissions}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold text-sequoia-900 transition-all hover:brightness-110 shadow-sm"
                style={{ backgroundColor: '#C8A84E' }}
              >
                Approve & Create Commissions
              </button>

              {/* Approval step indicator */}
              <div className="flex items-center gap-1">
                {approvalSteps.map((step, i) => {
                  const stepIdx = approvalSteps.indexOf(approvalStatus as typeof approvalSteps[number])
                  const isComplete = i <= stepIdx
                  return (
                    <div key={step} className="flex items-center gap-1">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        <span className="capitalize">{step}</span>
                      </div>
                      {i < approvalSteps.length - 1 && (
                        <ChevronDown className="h-3 w-3 text-gray-300 -rotate-90" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
