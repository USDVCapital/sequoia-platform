'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/admin/StatsCard'
import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  Heart,
  TrendingUp,
  ClipboardCheck,
  CheckCircle,
  Film,
  ArrowRight,
} from 'lucide-react'

interface DashboardStats {
  totalConsultants: number
  activeConsultants: number
  totalDeals: number
  pendingCommissions: number
  ehmpEnrollees: number
  totalFundedVolume: number
}

interface RecentDeal {
  id: string
  client_name: string
  funding_type: string
  status: string
  created_at: string
}

interface RecentSubmission {
  id: string
  full_name: string
  email: string
  role: string
  reviewed: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultants: 0,
    activeConsultants: 0,
    totalDeals: 0,
    pendingCommissions: 0,
    ehmpEnrollees: 0,
    totalFundedVolume: 0,
  })
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [
        consultantsRes,
        leadsRes,
        commissionsRes,
        enrollmentsRes,
        recentDealsRes,
        recentSubsRes,
      ] = await Promise.all([
        supabase.from('consultants').select('id, is_active'),
        supabase.from('leads').select('id, status, funded_amount'),
        supabase.from('commissions').select('id, amount, status'),
        supabase.from('wellness_enrollments').select('id, employee_count, status'),
        supabase.from('leads').select('id, client_name, funding_type, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_submissions').select('id, full_name, email, role, reviewed, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const consultants = consultantsRes.data ?? []
      const leads = leadsRes.data ?? []
      const commissions = commissionsRes.data ?? []
      const enrollments = enrollmentsRes.data ?? []

      const pendingAmount = commissions
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0)

      const fundedVolume = leads
        .filter((l) => l.status === 'funded' && l.funded_amount)
        .reduce((sum, l) => sum + Number(l.funded_amount), 0)

      const ehmpCount = enrollments
        .filter((e) => e.status === 'active')
        .reduce((sum, e) => sum + e.employee_count, 0)

      setStats({
        totalConsultants: consultants.length,
        activeConsultants: consultants.filter((c) => c.is_active).length,
        totalDeals: leads.length,
        pendingCommissions: pendingAmount,
        ehmpEnrollees: ehmpCount,
        totalFundedVolume: fundedVolume,
      })

      setRecentDeals(recentDealsRes.data ?? [])
      setRecentSubmissions(recentSubsRes.data ?? [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      application: 'bg-blue-100 text-blue-700 border-blue-200',
      in_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      funded: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      declined: 'bg-red-100 text-red-700 border-red-200',
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[status] ?? 'badge-sequoia'}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header gradient */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-sequoia-300 mt-1 text-sm">
          Sequoia Enterprise Solutions platform overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={Users} label="Total Consultants" value={stats.totalConsultants} href="/admin/consultants" />
        <StatsCard icon={UserCheck} label="Active Consultants" value={stats.activeConsultants} href="/admin/consultants" />
        <StatsCard icon={FileText} label="Total Deals" value={stats.totalDeals} href="/admin/deals" />
        <StatsCard icon={DollarSign} label="Pending Commissions" value={formatCurrency(stats.pendingCommissions)} accentColor="gold" href="/admin/commissions" />
        <StatsCard icon={Heart} label="EHMP Enrollees" value={stats.ehmpEnrollees.toLocaleString()} href="/admin/enrollments" />
        <StatsCard icon={TrendingUp} label="Total Funded Volume" value={formatCurrency(stats.totalFundedVolume)} accentColor="gold" href="/admin/deals" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="card-sequoia p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-sequoia-900">Recent Deals</h3>
            <Link href="/admin/deals" className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentDeals.map((deal) => (
              <Link key={deal.id} href={`/admin/deals/${deal.id}`} className="flex items-center justify-between py-2 border-b border-brand-neutral-100 last:border-0 hover:bg-brand-neutral-50 rounded px-2 -mx-2 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-sequoia-900">{deal.client_name}</p>
                  <p className="text-xs text-brand-neutral-500">{deal.funding_type} &middot; {formatDate(deal.created_at)}</p>
                </div>
                {statusBadge(deal.status)}
              </Link>
            ))}
            {recentDeals.length === 0 && (
              <p className="text-sm text-brand-neutral-400 text-center py-4">No deals yet</p>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card-sequoia p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-sequoia-900">Recent Submissions</h3>
            <Link href="/admin/submissions" className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((sub) => (
              <Link key={sub.id} href="/admin/submissions" className="flex items-center justify-between py-2 border-b border-brand-neutral-100 last:border-0 hover:bg-brand-neutral-50 rounded px-2 -mx-2 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-sequoia-900">{sub.full_name}</p>
                  <p className="text-xs text-brand-neutral-500">{sub.role} &middot; {formatDate(sub.created_at)}</p>
                </div>
                {sub.reviewed ? (
                  <span className="badge-sequoia text-xs">Reviewed</span>
                ) : (
                  <span className="badge-gold text-xs">New</span>
                )}
              </Link>
            ))}
            {recentSubmissions.length === 0 && (
              <p className="text-sm text-brand-neutral-400 text-center py-4">No submissions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-sequoia p-5">
        <h3 className="text-base font-bold text-sequoia-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/submissions" className="btn-primary text-sm">
            <ClipboardCheck size={16} />
            <span style={{ color: '#FFFFFF' }}>Review Submissions</span>
          </Link>
          <Link href="/admin/commissions" className="btn-primary text-sm">
            <CheckCircle size={16} />
            <span style={{ color: '#FFFFFF' }}>Approve Commissions</span>
          </Link>
          <Link href="/admin/content" className="btn-gold text-sm">
            <Film size={16} />
            Add Training Video
          </Link>
        </div>
      </div>
    </div>
  )
}
