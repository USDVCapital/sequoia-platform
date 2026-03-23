'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  Download,
  Calendar,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────

interface MonthlyVolume {
  month: string
  total_amount: number
  commission_count: number
}

interface ConsultantGrowth {
  month: string
  new_consultants: number
  total_consultants: number
}

interface EnrollmentTrend {
  month: string
  new_enrollees: number
  new_companies: number
}

interface FunnelData {
  status: string
  deal_count: number
  total_amount: number
}

// ── Chart Colors ─────────────────────────────────────────────

const COLORS = {
  gold: '#C8A84E',
  goldLight: '#E8D9A0',
  sequoiaMid: '#4a4a4a',
  emerald: '#059669',
  blue: '#3B82F6',
  purple: '#8B5CF6',
}

// ── Demo Data (used when Supabase views aren't available) ────

const DEMO_FUNDED_VOLUME: MonthlyVolume[] = [
  { month: '2025-11', total_amount: 425000, commission_count: 2 },
  { month: '2025-12', total_amount: 650000, commission_count: 3 },
  { month: '2026-01', total_amount: 1200000, commission_count: 5 },
  { month: '2026-02', total_amount: 2300000, commission_count: 8 },
  { month: '2026-03', total_amount: 1800000, commission_count: 6 },
]

const DEMO_GROWTH: ConsultantGrowth[] = [
  { month: '2025-06', new_consultants: 3, total_consultants: 3 },
  { month: '2025-07', new_consultants: 2, total_consultants: 5 },
  { month: '2025-08', new_consultants: 0, total_consultants: 5 },
  { month: '2025-09', new_consultants: 1, total_consultants: 6 },
  { month: '2025-10', new_consultants: 2, total_consultants: 8 },
  { month: '2025-11', new_consultants: 2, total_consultants: 10 },
  { month: '2025-12', new_consultants: 1, total_consultants: 11 },
]

const DEMO_ENROLLMENT: EnrollmentTrend[] = [
  { month: '2025-11', new_enrollees: 15, new_companies: 1 },
  { month: '2025-12', new_enrollees: 22, new_companies: 2 },
  { month: '2026-01', new_enrollees: 47, new_companies: 1 },
  { month: '2026-02', new_enrollees: 35, new_companies: 3 },
  { month: '2026-03', new_enrollees: 28, new_companies: 2 },
]

const DEMO_FUNNEL: FunnelData[] = [
  { status: 'Application', deal_count: 12, total_amount: 0 },
  { status: 'In Review', deal_count: 8, total_amount: 0 },
  { status: 'Approved', deal_count: 5, total_amount: 0 },
  { status: 'Funded', deal_count: 14, total_amount: 8400000 },
  { status: 'Declined', deal_count: 3, total_amount: 0 },
]

// ── Helpers ──────────────────────────────────────────────────

function formatMonth(dateStr: string): string {
  const [y, m] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(m) - 1]} ${y.slice(2)}`
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

// ── Component ────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [fundedVolume, setFundedVolume] = useState<MonthlyVolume[]>(DEMO_FUNDED_VOLUME)
  const [growth, setGrowth] = useState<ConsultantGrowth[]>(DEMO_GROWTH)
  const [enrollment, setEnrollment] = useState<EnrollmentTrend[]>(DEMO_ENROLLMENT)
  const [funnel, setFunnel] = useState<FunnelData[]>(DEMO_FUNNEL)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      try {
        const [volumeRes, growthRes, enrollmentRes, funnelRes] = await Promise.all([
          supabase.from('v_monthly_funded_volume').select('*').order('month', { ascending: true }),
          supabase.from('v_consultant_growth').select('*').order('month', { ascending: true }),
          supabase.from('v_enrollment_trend').select('*').order('month', { ascending: true }),
          supabase.from('v_conversion_funnel').select('*'),
        ])

        if (volumeRes.data?.length) setFundedVolume(volumeRes.data)
        if (growthRes.data?.length) setGrowth(growthRes.data)
        if (enrollmentRes.data?.length) setEnrollment(enrollmentRes.data)
        if (funnelRes.data?.length) setFunnel(funnelRes.data)
      } catch {
        // Views may not exist yet — use demo data
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalFundedVolume = fundedVolume.reduce((s, v) => s + Number(v.total_amount), 0)
  const totalDeals = fundedVolume.reduce((s, v) => s + v.commission_count, 0)
  const totalConsultants = growth.length ? growth[growth.length - 1].total_consultants : 0
  const totalEnrollees = enrollment.reduce((s, e) => s + e.new_enrollees, 0)

  const handleExportCSV = () => {
    const headers = ['Month', 'Funded Volume', 'Deals']
    const rows = fundedVolume.map((v) => [formatMonth(v.month), v.total_amount, v.commission_count])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sequoia-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Analytics</h2>
            <p className="text-sequoia-300 mt-1 text-sm">Business performance metrics and trends</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-gold self-start sm:self-auto flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Funded Volume', value: formatCurrency(totalFundedVolume), icon: DollarSign },
            { label: 'Total Deals', value: totalDeals.toString(), icon: TrendingUp },
            { label: 'Consultants', value: totalConsultants.toString(), icon: Users },
            { label: 'EHMP Enrollees', value: totalEnrollees.toString(), icon: Heart },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={14} className="text-gold-400" />
                <p className="text-sequoia-200 text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
              <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funded Volume by Month */}
        <div className="card-sequoia p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-gold-600" />
            <h3 className="text-lg font-bold text-[var(--sequoia-900)]">Funded Volume by Month</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundedVolume.map((v) => ({ ...v, month: formatMonth(v.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Funded Volume']} />
                <Bar dataKey="total_amount" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consultant Growth */}
        <div className="card-sequoia p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-600" />
            <h3 className="text-lg font-bold text-[var(--sequoia-900)]">Consultant Growth</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth.map((g) => ({ ...g, month: formatMonth(g.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_consultants" name="Total" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="new_consultants" name="New" stroke={COLORS.goldLight} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EHMP Enrollment Trend */}
        <div className="card-sequoia p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-emerald-600" />
            <h3 className="text-lg font-bold text-[var(--sequoia-900)]">EHMP Enrollment Trend</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollment.map((e) => ({ ...e, month: formatMonth(e.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="new_enrollees" name="Enrollees" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="new_companies" name="Companies" stroke={COLORS.purple} fill={COLORS.purple} fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card-sequoia p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gold-600" />
            <h3 className="text-lg font-bold text-[var(--sequoia-900)]">Deal Pipeline Funnel</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="status" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip formatter={(value) => [String(value), 'Deals']} />
                <Bar dataKey="deal_count" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Commission Payouts */}
      <div className="card-sequoia p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-gold-600" />
          <h3 className="text-lg font-bold text-[var(--sequoia-900)]">Funded Volume vs Commissions</h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fundedVolume.map((v) => ({
              month: formatMonth(v.month),
              funded: Number(v.total_amount),
              commissions: Math.round(Number(v.total_amount) * 0.0075),
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
              <Legend />
              <Bar dataKey="funded" name="Funded Volume" fill={COLORS.sequoiaMid} radius={[4, 4, 0, 0]} />
              <Bar dataKey="commissions" name="Commissions" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-[var(--neutral-400)] py-4">
          Loading live data from Supabase...
        </p>
      )}
    </div>
  )
}
