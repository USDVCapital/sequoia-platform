'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DataTable, { type Column } from '@/components/admin/DataTable'
import type { Consultant } from '@/lib/supabase/types'

function formatTier(tier: string): string {
  return tier.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const tierBadgeColors: Record<string, string> = {
  associate: 'bg-brand-neutral-100 text-brand-neutral-700 border-brand-neutral-200',
  active: 'bg-blue-100 text-blue-700 border-blue-200',
  senior: 'bg-purple-100 text-purple-700 border-purple-200',
  managing_director: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

type ViewFilter = 'all' | 'at_risk' | 'new' | 'training_incomplete'

const VIEW_LABELS: Record<ViewFilter, string> = {
  all: 'All Consultants',
  at_risk: 'Agents at Risk',
  new: 'New This Month',
  training_incomplete: 'Training Incomplete',
}

const VIEW_DESCRIPTIONS: Record<ViewFilter, string> = {
  all: 'Manage all registered consultants',
  at_risk: 'Churned consultants — completed training but now inactive',
  new: 'Consultants who joined in the last 30 days',
  training_incomplete: 'Consultants who have not yet finished onboarding',
}

export default function AdminConsultantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = (searchParams.get('view') as ViewFilter) || 'all'
  const [consultants, setConsultants] = useState<(Consultant & { deal_count?: number; onboarding_completed?: boolean })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [consultantsRes, leadsRes] = await Promise.all([
        supabase.from('consultants').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('consultant_id'),
      ])

      const leads = leadsRes.data ?? []
      const dealCounts = new Map<string, number>()
      leads.forEach((l) => {
        dealCounts.set(l.consultant_id, (dealCounts.get(l.consultant_id) ?? 0) + 1)
      })

      const enriched = (consultantsRes.data ?? []).map((c) => ({
        ...c,
        deal_count: dealCounts.get(c.id) ?? 0,
      }))

      setConsultants(enriched)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredByView = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    switch (view) {
      case 'at_risk':
        return consultants.filter((c) => !c.is_active && c.onboarding_completed)
      case 'new':
        return consultants.filter((c) => new Date(c.created_at) >= thirtyDaysAgo)
      case 'training_incomplete':
        return consultants.filter((c) => !c.onboarding_completed)
      default:
        return consultants
    }
  }, [consultants, view])

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-sequoia-900">{String(row.full_name)}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      hideOnMobile: true,
    },
    {
      key: 'tier',
      label: 'Tier',
      sortable: true,
      render: (row) => {
        const tier = String(row.tier)
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${tierBadgeColors[tier] ?? 'badge-sequoia'}`}>
            {formatTier(tier)}
          </span>
        )
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
          row.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'deal_count',
      label: 'Deals',
      sortable: true,
      hideOnMobile: true,
    },
    {
      key: 'created_at',
      label: 'Joined',
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {VIEW_LABELS[view]}
        </h2>
        <p className="text-sequoia-300 mt-1 text-sm">
          {VIEW_DESCRIPTIONS[view]}
        </p>
      </div>

      {view !== 'all' && (
        <div className="flex items-center gap-3 px-1">
          <Link
            href="/admin/consultants"
            className="text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 underline underline-offset-2"
          >
            &larr; View all consultants
          </Link>
          <span className="text-sm text-brand-neutral-400">
            Showing {filteredByView.length} consultant{filteredByView.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="card-sequoia p-5">
        <DataTable
          columns={columns}
          data={filteredByView as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search by name or email..."
          searchKeys={['full_name', 'email']}
          filters={[
            {
              label: 'All Tiers',
              key: 'tier',
              options: [
                { label: 'Associate', value: 'associate' },
                { label: 'Active', value: 'active' },
                { label: 'Senior', value: 'senior' },
                { label: 'Managing Director', value: 'managing_director' },
              ],
            },
            {
              label: 'All Status',
              key: 'is_active',
              options: [
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
              ],
            },
          ]}
          onRowClick={(row) => router.push(`/admin/consultants/${row.id}`)}
        />
      </div>
    </div>
  )
}
