'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DataTable, { type Column } from '@/components/admin/DataTable'
import type { Lead, Consultant } from '@/lib/supabase/types'
import { Check, X, Banknote } from 'lucide-react'

type LeadWithConsultant = Lead & { consultant?: Pick<Consultant, 'full_name' | 'tier'> | null }

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusBadgeColors: Record<string, string> = {
  application: 'bg-blue-100 text-blue-700 border-blue-200',
  in_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  funded: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  declined: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminDealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<LeadWithConsultant[]>([])
  const [loading, setLoading] = useState(true)
  const [actionDealId, setActionDealId] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState('')
  const [showFundModal, setShowFundModal] = useState(false)
  const [fundingDealId, setFundingDealId] = useState<string | null>(null)

  async function fetchDeals() {
    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*, consultant:consultants(full_name, tier)')
      .order('created_at', { ascending: false })

    const leads = data ?? []

    // Resolve referral_slug for deals with no consultant assigned
    const unassigned = leads.filter(d => !d.consultant_id && d.referral_slug)
    if (unassigned.length > 0) {
      const slugs = [...new Set(unassigned.map(d => d.referral_slug as string))]
      const { data: referrers } = await supabase
        .from('consultants')
        .select('slug, full_name, tier')
        .in('slug', slugs)
      const slugMap = new Map((referrers ?? []).map(r => [r.slug, r]))

      for (const deal of leads) {
        if (!deal.consultant && deal.referral_slug) {
          const ref = slugMap.get(deal.referral_slug as string)
          if (ref) {
            (deal as Record<string, unknown>).consultant = { full_name: ref.full_name, tier: ref.tier }
          }
        }
      }
    }

    setDeals(leads)
    setLoading(false)
  }

  useEffect(() => { fetchDeals() }, [])

  const handleStatusChange = async (dealId: string, newStatus: string, fundedAmount?: number) => {
    setActionDealId(dealId)
    const supabase = createClient()
    const update: Record<string, unknown> = { status: newStatus }
    if (fundedAmount !== undefined) update.funded_amount = fundedAmount
    await supabase.from('leads').update(update).eq('id', dealId)
    await fetchDeals()
    setActionDealId(null)
  }

  const handleFundSubmit = async () => {
    if (!fundingDealId || !fundAmount) return
    await handleStatusChange(fundingDealId, 'funded', parseFloat(fundAmount))
    setShowFundModal(false)
    setFundAmount('')
    setFundingDealId(null)
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-sequoia-900">{String(row.client_name)}</span>
          {row.business_name ? (
            <span className="block text-xs text-brand-neutral-500">{String(row.business_name)}</span>
          ) : null}
        </div>
      ),
    },
    { key: 'funding_type', label: 'Type', sortable: true, hideOnMobile: true },
    {
      key: 'estimated_amount',
      label: 'Amount',
      hideOnMobile: true,
      render: (row) => {
        if (row.funded_amount) return formatCurrency(Number(row.funded_amount))
        if (row.estimated_amount) return String(row.estimated_amount)
        return '--'
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = String(row.status)
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeColors[status] ?? 'badge-sequoia'}`}>
            {status.replace('_', ' ')}
          </span>
        )
      },
    },
    {
      key: 'consultant',
      label: 'Consultant',
      hideOnMobile: true,
      render: (row) => {
        const c = row.consultant as { full_name: string } | null
        return c?.full_name ?? '--'
      },
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      hideOnMobile: true,
      render: (row) => formatDate(String(row.created_at)),
    },
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => {
        const status = String(row.status)
        const dealId = String(row.id)
        const isActing = actionDealId === dealId

        return (
          <div className="flex items-center gap-1.5">
            {(status === 'application' || status === 'in_review') && (
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusChange(dealId, 'approved') }}
                disabled={isActing}
                className="p-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Approve"
              >
                <Check size={14} />
              </button>
            )}
            {status === 'approved' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFundingDealId(dealId)
                  setShowFundModal(true)
                }}
                disabled={isActing}
                className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                title="Fund"
              >
                <Banknote size={14} />
              </button>
            )}
            {status !== 'declined' && status !== 'funded' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusChange(dealId, 'declined') }}
                disabled={isActing}
                className="p-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Decline"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Deals</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Manage all deals across consultants</p>
      </div>

      <div className="card-sequoia p-5">
        <DataTable
          columns={columns}
          data={deals as unknown as Record<string, unknown>[]}
          onRowClick={(row) => router.push(`/admin/deals/${row.id}`)}
          searchPlaceholder="Search by client name..."
          searchKeys={['client_name', 'business_name']}
          filters={[
            {
              label: 'All Statuses',
              key: 'status',
              options: [
                { label: 'Application', value: 'application' },
                { label: 'In Review', value: 'in_review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Funded', value: 'funded' },
                { label: 'Declined', value: 'declined' },
              ],
            },
          ]}
        />
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card-sequoia p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-sequoia-900 mb-4">Fund Deal</h3>
            <label className="block text-sm font-semibold text-brand-neutral-600 mb-1">
              Funded Amount ($)
            </label>
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="e.g. 250000"
              className="input-brand mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowFundModal(false); setFundAmount(''); setFundingDealId(null) }}
                className="btn-outline text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFundSubmit}
                disabled={!fundAmount}
                className="btn-gold text-sm"
              >
                Confirm Fund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
