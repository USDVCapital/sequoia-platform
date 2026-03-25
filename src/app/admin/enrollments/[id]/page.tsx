'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, DollarSign, Calendar, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

interface Enrollment {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  employee_count: number
  monthly_rate: number
  status: string
  consultant_id: string | null
  created_at: string
  updated_at: string
  consultant?: { full_name: string; tier: string } | null
}

export default function EnrollmentDetailPage() {
  const params = useParams()
  const enrollmentId = params.id as string
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase
        .from('wellness_enrollments')
        .select('*, consultant:consultants(full_name, tier)')
        .eq('id', enrollmentId)
        .single()
      setEnrollment(data as Enrollment | null)
      setLoading(false)
    }
    fetch()
  }, [enrollmentId])

  const handleStatusChange = async (newStatus: string) => {
    if (!enrollment) return
    const supabase = createClient()
    await supabase.from('wellness_enrollments').update({ status: newStatus }).eq('id', enrollment.id)
    setEnrollment(prev => prev ? { ...prev, status: newStatus } : prev)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Enrollment not found.</p>
        <Link href="/admin/enrollments" className="text-sm text-gold-600 hover:text-gold-700 mt-2 inline-block">Back to Enrollments</Link>
      </div>
    )
  }

  const monthlyRevenue = enrollment.monthly_rate * enrollment.employee_count
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/enrollments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sequoia-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Enrollments
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-sequoia-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sequoia-600" />
              {enrollment.company_name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{enrollment.contact_name} &middot; {enrollment.contact_email}</p>
            {enrollment.contact_phone && <p className="text-xs text-gray-400">{enrollment.contact_phone}</p>}
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[enrollment.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {enrollment.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="icon-box-sequoia w-9 h-9"><Users size={16} /></div>
            <div>
              <p className="text-xs text-gray-400">Employees</p>
              <p className="text-lg font-bold text-sequoia-900">{enrollment.employee_count}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="icon-box-gold w-9 h-9"><DollarSign size={16} /></div>
            <div>
              <p className="text-xs text-gray-400">Monthly Rate</p>
              <p className="text-lg font-bold text-sequoia-900">{fmt(enrollment.monthly_rate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="icon-box-gold w-9 h-9"><DollarSign size={16} /></div>
            <div>
              <p className="text-xs text-gray-400">Monthly Revenue</p>
              <p className="text-lg font-bold text-sequoia-900">{fmt(monthlyRevenue)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="icon-box-gold w-9 h-9"><DollarSign size={16} /></div>
            <div>
              <p className="text-xs text-gray-400">Annual Revenue</p>
              <p className="text-lg font-bold text-sequoia-900">{fmt(annualRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User size={14} /> Consultant
          </h3>
          <p className="font-semibold text-sequoia-900">{enrollment.consultant?.full_name ?? 'Unassigned'}</p>
          {enrollment.consultant_id && (
            <Link href={`/admin/consultants/${enrollment.consultant_id}`} className="text-xs text-gold-600 hover:text-gold-700 mt-1 inline-block">
              View consultant profile →
            </Link>
          )}
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={14} /> Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Created</span>
              <span className="font-medium text-gray-800">{fmtDate(enrollment.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Updated</span>
              <span className="font-medium text-gray-800">{fmtDate(enrollment.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {['pending', 'active', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                enrollment.status === s
                  ? 'bg-sequoia-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
