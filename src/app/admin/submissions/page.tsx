'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import DataTable, { type Column } from '@/components/admin/DataTable'
import type { ContactSubmission } from '@/lib/supabase/types'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const roleColors: Record<string, string> = {
  applicant: 'bg-blue-100 text-blue-700 border-blue-200',
  general: 'bg-brand-neutral-100 text-brand-neutral-700 border-brand-neutral-200',
  enrollment: 'bg-green-100 text-green-700 border-green-200',
  partner: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default function AdminSubmissionsPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [markingId, setMarkingId] = useState<string | null>(null)

  async function fetchSubmissions() {
    const supabase = createClient()
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setSubmissions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [])

  const handleMarkReviewed = async (submissionId: string) => {
    setMarkingId(submissionId)
    const supabase = createClient()
    await supabase.from('contact_submissions').update({
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null,
    }).eq('id', submissionId)
    await fetchSubmissions()
    setMarkingId(null)
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (row) => <span className="font-semibold text-sequoia-900">{String(row.full_name)}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      hideOnMobile: true,
    },
    {
      key: 'role',
      label: 'Type',
      render: (row) => {
        const role = String(row.role)
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${roleColors[role] ?? 'badge-sequoia'}`}>
            {role}
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
    {
      key: 'reviewed',
      label: 'Reviewed',
      render: (row) => {
        const reviewed = Boolean(row.reviewed)
        return reviewed ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <CheckCircle size={14} /> Yes
          </span>
        ) : (
          <span className="badge-gold text-xs">Pending</span>
        )
      },
    },
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => {
        const id = String(row.id)
        const reviewed = Boolean(row.reviewed)
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedId(expandedId === id ? null : id)
              }}
              className="p-1.5 rounded-md bg-brand-neutral-100 text-brand-neutral-600 hover:bg-brand-neutral-200 transition-colors"
              title="Toggle message"
            >
              {expandedId === id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {!reviewed && (
              <button
                onClick={(e) => { e.stopPropagation(); handleMarkReviewed(id) }}
                disabled={markingId === id}
                className="p-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Mark as reviewed"
              >
                <CheckCircle size={14} />
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Submissions</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Contact form submissions and applications</p>
      </div>

      <div className="card-sequoia p-5">
        <DataTable
          columns={columns}
          data={submissions as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search by name or email..."
          searchKeys={['full_name', 'email']}
          filters={[
            {
              label: 'All Types',
              key: 'role',
              options: [
                { label: 'Applicant', value: 'applicant' },
                { label: 'General', value: 'general' },
                { label: 'Enrollment', value: 'enrollment' },
                { label: 'Partner', value: 'partner' },
              ],
            },
          ]}
        />

        {/* Expanded Message Preview */}
        {expandedId && (
          <div className="mt-4 p-4 bg-brand-neutral-50 rounded-lg border border-brand-neutral-200">
            <h4 className="text-sm font-bold text-sequoia-900 mb-2">Message</h4>
            <p className="text-sm text-brand-neutral-700 whitespace-pre-wrap">
              {submissions.find((s) => s.id === expandedId)?.message ?? 'No message'}
            </p>
            {submissions.find((s) => s.id === expandedId)?.phone && (
              <p className="text-xs text-brand-neutral-500 mt-2">
                Phone: {submissions.find((s) => s.id === expandedId)?.phone}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
