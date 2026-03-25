'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/admin/StatsCard'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Heart,
  DollarSign,
  UserCheck,
  UserX,
  Eye,
} from 'lucide-react'
import type { Consultant, Lead, Commission } from '@/lib/supabase/types'

function formatTier(tier: string): string {
  return tier.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
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

const statusBadgeColors: Record<string, string> = {
  application: 'bg-blue-100 text-blue-700 border-blue-200',
  in_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  funded: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  declined: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
}

export default function ConsultantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { startImpersonation } = useAuth()
  const [consultant, setConsultant] = useState<Consultant | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [enrolleeCount, setEnrolleeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tierValue, setTierValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [consultantRes, leadsRes, commissionsRes, enrollmentsRes] = await Promise.all([
        supabase.from('consultants').select('*').eq('id', id).single(),
        supabase.from('leads').select('*').eq('consultant_id', id).order('created_at', { ascending: false }),
        supabase.from('commissions').select('*').eq('consultant_id', id).order('created_at', { ascending: false }),
        supabase.from('wellness_enrollments').select('employee_count, status').eq('consultant_id', id),
      ])

      setConsultant(consultantRes.data)
      setTierValue(consultantRes.data?.tier ?? 'associate')
      setLeads(leadsRes.data ?? [])
      setCommissions(commissionsRes.data ?? [])
      const activeEnrollees = (enrollmentsRes.data ?? [])
        .filter((e) => e.status === 'active')
        .reduce((sum, e) => sum + e.employee_count, 0)
      setEnrolleeCount(activeEnrollees)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleTierChange = async (newTier: string) => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('consultants').update({ tier: newTier }).eq('id', id)
    setTierValue(newTier)
    setConsultant((prev) => prev ? { ...prev, tier: newTier as Consultant['tier'] } : prev)
    setSaving(false)
  }

  const handleToggleActive = async () => {
    if (!consultant) return
    setSaving(true)
    const supabase = createClient()
    const newVal = !consultant.is_active
    await supabase.from('consultants').update({ is_active: newVal }).eq('id', id)
    setConsultant((prev) => prev ? { ...prev, is_active: newVal } : prev)
    setSaving(false)
  }

  if (loading || !consultant) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  const fundedVolume = leads
    .filter((l) => l.status === 'funded' && l.funded_amount)
    .reduce((sum, l) => sum + Number(l.funded_amount), 0)

  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/consultants')}
        className="flex items-center gap-2 text-sm text-brand-neutral-500 hover:text-brand-neutral-700 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Consultants
      </button>

      {/* Profile Header */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-sequoia-600 text-white font-bold text-xl shrink-0">
            {consultant.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {consultant.full_name}
            </h2>
            <p className="text-sequoia-300 text-sm mt-0.5">{consultant.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${tierBadgeColors[consultant.tier]}`}>
                {formatTier(consultant.tier)}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                consultant.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                {consultant.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-sequoia-400">
                ID: {consultant.consultant_id} &middot; Joined {formatDate(consultant.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={TrendingUp} label="Funded Volume" value={formatCurrency(fundedVolume)} accentColor="gold" />
        <StatsCard icon={FileText} label="Total Deals" value={leads.length} />
        <StatsCard icon={Heart} label="EHMP Enrollees" value={enrolleeCount} />
        <StatsCard icon={DollarSign} label="Total Commissions" value={formatCurrency(totalCommissions)} accentColor="gold" />
      </div>

      {/* Admin Actions */}
      <div className="card-sequoia p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">Admin Actions</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-neutral-500 uppercase mb-1">
              Tier
            </label>
            <select
              value={tierValue}
              onChange={(e) => handleTierChange(e.target.value)}
              disabled={saving}
              className="input-brand w-auto min-w-[180px]"
            >
              <option value="associate">Associate</option>
              <option value="active">Active</option>
              <option value="senior">Senior</option>
              <option value="managing_director">Managing Director</option>
            </select>
          </div>
          <button
            onClick={handleToggleActive}
            disabled={saving}
            className={`btn-primary text-sm ${consultant.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {consultant.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
            <span style={{ color: '#FFFFFF' }}>
              {consultant.is_active ? 'Deactivate' : 'Activate'}
            </span>
          </button>
          <button
            onClick={() => {
              startImpersonation(consultant.id, consultant.full_name, consultant.email)
              router.push('/portal')
            }}
            className="btn-primary text-sm bg-amber-600 hover:bg-amber-700"
          >
            <Eye size={16} />
            <span style={{ color: '#FFFFFF' }}>View as Agent</span>
          </button>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="card-sequoia p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">Recent Deals</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-neutral-200">
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Client</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 hidden sm:table-cell">Type</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 hidden sm:table-cell">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 10).map((lead) => (
                <tr key={lead.id} className="border-b border-brand-neutral-100">
                  <td className="py-2 px-3 font-semibold text-sequoia-900">{lead.client_name}</td>
                  <td className="py-2 px-3 text-brand-neutral-600 hidden sm:table-cell">{lead.funding_type}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeColors[lead.status] ?? 'badge-sequoia'}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-brand-neutral-600 hidden sm:table-cell">
                    {lead.funded_amount ? formatCurrency(Number(lead.funded_amount)) : lead.estimated_amount ?? '--'}
                  </td>
                  <td className="py-2 px-3 text-brand-neutral-500 hidden md:table-cell">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-brand-neutral-400">No deals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="card-sequoia p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">Recent Commissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-neutral-200">
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Source</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Type</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.slice(0, 10).map((c) => (
                <tr key={c.id} className="border-b border-brand-neutral-100">
                  <td className="py-2 px-3 text-sequoia-900">{c.source_label ?? c.source_type}</td>
                  <td className="py-2 px-3 text-brand-neutral-600">{c.commission_type.replace(/_/g, ' ')}</td>
                  <td className="py-2 px-3 font-semibold text-sequoia-900">{formatCurrency(Number(c.amount))}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeColors[c.status] ?? 'badge-sequoia'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-brand-neutral-500 hidden sm:table-cell">{formatDate(c.created_at)}</td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-brand-neutral-400">No commissions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
