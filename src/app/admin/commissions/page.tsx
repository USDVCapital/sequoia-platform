'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { type Column } from '@/components/admin/DataTable'
import StatsCard from '@/components/admin/StatsCard'
import type { Commission, Consultant } from '@/lib/supabase/types'
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react'

type CommissionWithConsultant = Commission & { consultant?: Pick<Consultant, 'full_name' | 'tier'> | null }

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<CommissionWithConsultant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkApproving, setBulkApproving] = useState(false)

  async function fetchCommissions() {
    const supabase = createClient()
    const { data } = await supabase
      .from('commissions')
      .select('*, consultant:consultants(full_name, tier)')
      .order('created_at', { ascending: false })
    setCommissions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCommissions() }, [])

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return
    setBulkApproving(true)
    const supabase = createClient()
    await supabase
      .from('commissions')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .in('id', Array.from(selectedIds))
    setSelectedIds(new Set())
    await fetchCommissions()
    setBulkApproving(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    const pendingIds = commissions.filter((c) => c.status === 'pending').map((c) => c.id)
    if (selectedIds.size === pendingIds.length && pendingIds.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pendingIds))
    }
  }

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const totalPending = commissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const paidThisMonth = commissions
    .filter((c) => {
      if (c.status !== 'paid' || !c.paid_at) return false
      const d = new Date(c.paid_at)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const totalPaidAllTime = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: '_select',
      label: '',
      render: (row) => {
        if (String(row.status) !== 'pending') return null
        return (
          <input
            type="checkbox"
            checked={selectedIds.has(String(row.id))}
            onChange={(e) => { e.stopPropagation(); toggleSelect(String(row.id)) }}
            className="h-4 w-4 rounded border-brand-neutral-300 text-gold-600 focus:ring-gold-500"
          />
        )
      },
    },
    {
      key: 'consultant',
      label: 'Consultant',
      render: (row) => {
        const c = row.consultant as { full_name: string } | null
        return <span className="font-semibold text-sequoia-900">{c?.full_name ?? '--'}</span>
      },
    },
    {
      key: 'source_label',
      label: 'Source',
      hideOnMobile: true,
      render: (row) => String(row.source_label ?? row.source_type ?? '--'),
    },
    {
      key: 'commission_type',
      label: 'Type',
      hideOnMobile: true,
      render: (row) => String(row.commission_type).replace(/_/g, ' '),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="font-semibold">{formatCurrency(Number(row.amount))}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = String(row.status)
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[status] ?? 'badge-sequoia'}`}>
            {status}
          </span>
        )
      },
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      hideOnMobile: true,
      render: (row) => formatDate(String(row.created_at)),
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Commissions</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Review and approve consultant commissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={Clock} label="Total Pending" value={formatCurrency(totalPending)} accentColor="gold" />
        <StatsCard icon={CheckCircle} label="Paid This Month" value={formatCurrency(paidThisMonth)} />
        <StatsCard icon={TrendingUp} label="Paid All Time" value={formatCurrency(totalPaidAllTime)} />
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gold-50 border border-gold-200 rounded-lg">
          <span className="text-sm font-semibold text-gold-700">
            {selectedIds.size} commission{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkApprove}
            disabled={bulkApproving}
            className="btn-gold text-sm py-1.5 px-4"
          >
            {bulkApproving ? 'Approving...' : 'Approve Selected'}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-brand-neutral-500 hover:text-brand-neutral-700"
          >
            Clear
          </button>
        </div>
      )}

      <div className="card-sequoia p-5">
        {/* Select All pending */}
        {commissions.some((c) => c.status === 'pending') && (
          <div className="mb-3">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-gold-600 hover:text-gold-700"
            >
              {selectedIds.size === commissions.filter((c) => c.status === 'pending').length
                ? 'Deselect all pending'
                : 'Select all pending'}
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={commissions as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search by consultant..."
          searchKeys={['source_label']}
          filters={[
            {
              label: 'All Statuses',
              key: 'status',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
