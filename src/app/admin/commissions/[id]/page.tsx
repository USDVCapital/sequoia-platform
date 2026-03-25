'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DollarSign, User, FileText, Calendar, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const levelLabels: Record<number, string> = {
  [-1]: 'Sequoia Overhead',
  0: 'Agent Commission',
  1: 'L1 Override', 2: 'L2 Override', 3: 'L3 Override',
  4: 'L4 Override', 5: 'L5 Override', 6: 'L6 Override',
  99: 'Bonus Pool',
}

interface CommissionDetail {
  id: string
  consultant_id: string | null
  source_type: string
  source_id: string | null
  source_label: string | null
  commission_type: string
  amount: number
  status: string
  paid_at: string | null
  created_at: string
  deal_id: string | null
  waterfall_level: number | null
  override_rate: number | null
  gross_commission: number | null
  approval_status: string | null
  consultant?: { full_name: string; tier: string; rank?: string } | null
}

export default function CommissionDetailPage() {
  const params = useParams()
  const commissionId = params.id as string
  const [commission, setCommission] = useState<CommissionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase
        .from('commissions')
        .select('*, consultant:consultants(full_name, tier, rank)')
        .eq('id', commissionId)
        .single()
      setCommission(data as CommissionDetail | null)
      setLoading(false)
    }
    fetch()
  }, [commissionId])

  const handleStatusChange = async (newStatus: string) => {
    if (!commission) return
    const supabase = createClient()
    const update: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'paid') update.paid_at = new Date().toISOString()
    await supabase.from('commissions').update(update).eq('id', commission.id)
    setCommission(prev => prev ? { ...prev, status: newStatus, ...(newStatus === 'paid' ? { paid_at: new Date().toISOString() } : {}) } : prev)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  if (!commission) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Commission not found.</p>
        <Link href="/admin/commissions" className="text-sm text-gold-600 hover:text-gold-700 mt-2 inline-block">Back to Commissions</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/commissions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sequoia-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Commissions
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Commission</p>
            <h2 className="text-2xl font-bold text-sequoia-900">{fmt(commission.amount)}</h2>
            <p className="text-sm text-gray-500 mt-1">{commission.source_label || commission.commission_type.replace(/_/g, ' ')}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[commission.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {commission.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400 block text-xs mb-0.5">Type</span>
            <span className="font-medium text-gray-800 capitalize">{commission.commission_type.replace(/_/g, ' ')}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs mb-0.5">Source</span>
            <span className="font-medium text-gray-800 capitalize">{commission.source_type}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs mb-0.5">Created</span>
            <span className="font-medium text-gray-800">{fmtDate(commission.created_at)}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs mb-0.5">Paid</span>
            <span className="font-medium text-gray-800">{commission.paid_at ? fmtDate(commission.paid_at) : '—'}</span>
          </div>
        </div>
      </div>

      {/* Waterfall Info */}
      {commission.waterfall_level !== null && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Layers size={14} /> Waterfall Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block text-xs mb-0.5">Waterfall Level</span>
              <span className="font-semibold text-sequoia-900">{levelLabels[commission.waterfall_level] ?? `Level ${commission.waterfall_level}`}</span>
            </div>
            {commission.override_rate !== null && (
              <div>
                <span className="text-gray-400 block text-xs mb-0.5">Override Rate</span>
                <span className="font-semibold text-sequoia-900">{(commission.override_rate * 100).toFixed(2)}%</span>
              </div>
            )}
            {commission.gross_commission !== null && (
              <div>
                <span className="text-gray-400 block text-xs mb-0.5">Gross Commission</span>
                <span className="font-semibold text-sequoia-900">{fmt(commission.gross_commission)}</span>
              </div>
            )}
            {commission.approval_status && (
              <div>
                <span className="text-gray-400 block text-xs mb-0.5">Approval Status</span>
                <span className="font-semibold text-sequoia-900 capitalize">{commission.approval_status}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consultant & Deal Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User size={14} /> Consultant
          </h3>
          <p className="font-semibold text-sequoia-900">{commission.consultant?.full_name ?? 'Sequoia / Unassigned'}</p>
          {commission.consultant_id && (
            <Link href={`/admin/consultants/${commission.consultant_id}`} className="text-xs text-gold-600 hover:text-gold-700 mt-1 inline-block">
              View consultant profile →
            </Link>
          )}
        </div>

        {commission.deal_id && (
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={14} /> Source Deal
            </h3>
            <p className="text-sm text-gray-600">{commission.source_label || 'Deal'}</p>
            <Link href={`/admin/deals/${commission.deal_id}`} className="text-xs text-gold-600 hover:text-gold-700 mt-1 inline-block">
              View deal details →
            </Link>
          </div>
        )}
      </div>

      {/* Status Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {['pending', 'paid', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                commission.status === s
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
