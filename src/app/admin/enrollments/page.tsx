'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DataTable, { type Column } from '@/components/admin/DataTable'
import StatsCard from '@/components/admin/StatsCard'
import type { WellnessEnrollment, Consultant } from '@/lib/supabase/types'
import { DollarSign } from 'lucide-react'

type EnrollmentWithConsultant = WellnessEnrollment & { consultant?: Pick<Consultant, 'full_name' | 'tier'> | null }

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminEnrollmentsPage() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<EnrollmentWithConsultant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase
        .from('wellness_enrollments')
        .select('*, consultant:consultants(full_name, tier)')
        .order('created_at', { ascending: false })
      setEnrollments(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const monthlyRevenue = enrollments
    .filter((e) => e.status === 'active')
    .reduce((sum, e) => sum + e.monthly_rate * e.employee_count, 0)

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'company_name',
      label: 'Company',
      sortable: true,
      render: (row) => <span className="font-semibold text-sequoia-900">{String(row.company_name)}</span>,
    },
    {
      key: 'contact_name',
      label: 'Contact',
      hideOnMobile: true,
    },
    {
      key: 'employee_count',
      label: 'Employees',
      sortable: true,
      render: (row) => Number(row.employee_count).toLocaleString(),
    },
    {
      key: 'monthly_rate',
      label: 'Monthly Rate',
      sortable: true,
      hideOnMobile: true,
      render: (row) => formatCurrency(Number(row.monthly_rate)),
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Enrollments</h2>
        <p className="text-sequoia-300 mt-1 text-sm">EHMP wellness enrollment management</p>
      </div>

      {/* Monthly Revenue Summary */}
      <div className="max-w-sm">
        <StatsCard
          icon={DollarSign}
          label="Est. Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          subtext={`${enrollments.filter((e) => e.status === 'active').length} active companies`}
          accentColor="gold"
        />
      </div>

      <div className="card-sequoia p-5">
        <DataTable
          columns={columns}
          data={enrollments as unknown as Record<string, unknown>[]}
          onRowClick={(row) => router.push(`/admin/enrollments/${row.id}`)}
          searchPlaceholder="Search by company..."
          searchKeys={['company_name', 'contact_name']}
          filters={[
            {
              label: 'All Statuses',
              key: 'status',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Active', value: 'active' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
