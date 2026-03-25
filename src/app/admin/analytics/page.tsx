'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/admin/StatsCard'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  PiggyBank,
  BarChart3,
  Layers,
  Package,
  Crown,
  CalendarRange,
  Loader2,
  Calendar,
  UserCheck,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ── Types ────────────────────────────────────────────────────

interface KPIData {
  grossFundedVolume: number
  grossCommissions: number
  netRevenueToSequoia: number
  totalCommissionsPaid: number
  bonusPool: number
  activeDeals: number
}

interface WaterfallRow {
  waterfall_level: number | null
  total_amount: number
  record_count: number
  avg_amount: number
}

interface ProductRow {
  product_category: string
  funded_deals: number
  total_funded_volume: number
  total_commissions: number
}

interface TopConsultant {
  consultant_id: string
  full_name: string
  rank: string
  total_earnings: number
  deal_count: number
}

interface MonthlyRow {
  month: string
  deals_funded: number
  total_funded_volume: number
  total_commissions: number
  sequoia_revenue: number
}

interface MembershipData {
  activeAgents: number
  inactiveAgents: number
}

interface RawCommission {
  id: string
  consultant_id: string | null
  amount: number
  waterfall_level: number | null
  gross_commission: number | null
  commission_type: string | null
  deal_id: string | null
  created_at: string
  status: string | null
}

interface RawLead {
  id: string
  status: string
  funded_amount: number | null
  product_category: string | null
  created_at: string
}

// ── Time Period Filter ───────────────────────────────────────

type TimePeriod = 'all' | 'mtd' | 'ytd' | '30d' | '90d' | '1y'

const TIME_PERIODS: { label: string; value: TimePeriod }[] = [
  { label: 'All Time', value: 'all' },
  { label: 'Month to Date', value: 'mtd' },
  { label: 'Year to Date', value: 'ytd' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last Year', value: '1y' },
]

function getStartDate(period: TimePeriod): Date | null {
  const now = new Date()
  switch (period) {
    case 'all': return null
    case 'mtd': return new Date(now.getFullYear(), now.getMonth(), 1)
    case 'ytd': return new Date(now.getFullYear(), 0, 1)
    case '30d': return new Date(now.getTime() - 30 * 86400000)
    case '90d': return new Date(now.getTime() - 90 * 86400000)
    case '1y': return new Date(now.getTime() - 365 * 86400000)
  }
}

// ── Helpers ──────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(val: number): string {
  return fmt.format(val)
}

function formatCompact(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return formatCurrency(val)
}

function waterfallLabel(level: number | null): string {
  if (level === null) return 'Unknown'
  if (level === -1) return 'Sequoia Overhead'
  if (level === 0) return 'Agent (Direct)'
  if (level >= 1 && level <= 6) return `Level ${level} Override`
  if (level === 99) return 'Bonus Pool'
  return `Level ${level}`
}

function waterfallBarColor(level: number | null): string {
  if (level === -1) return '#0D2B1E'
  if (level === 0) return '#C8A84E'
  if (level === 99) return '#6b7280'
  return '#3b82f6'
}

function rankLabel(rank: string): string {
  const labels: Record<string, string> = {
    lc_1: 'LC 1',
    lc_2: 'LC 2',
    lc_3: 'LC 3',
    senior_lc: 'Senior LC',
    managing_director: 'Managing Director',
    executive_director: 'Executive Director',
  }
  return labels[rank] || rank
}

function rankBadgeColor(rank: string): string {
  const colors: Record<string, string> = {
    lc_1: 'bg-gray-100 text-gray-700 border-gray-200',
    lc_2: 'bg-blue-50 text-blue-700 border-blue-200',
    lc_3: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    senior_lc: 'bg-purple-50 text-purple-700 border-purple-200',
    managing_director: 'bg-amber-50 text-amber-700 border-amber-200',
    executive_director: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  }
  return colors[rank] || 'bg-gray-100 text-gray-600 border-gray-200'
}

function formatMonth(dateStr: string): string {
  const [y, m] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(m) - 1]} ${y}`
}

const PRODUCT_COLORS: Record<string, string> = {
  real_estate_lending: '#2d7a50',
  business_funding: '#3b82f6',
  business_services: '#f59e0b',
  clean_energy: '#10b981',
  wellness: '#14b8a6',
  uncategorized: '#6b7280',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTooltipStyle: any = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    fontSize: '13px',
  },
}

// ── Component ────────────────────────────────────────────────

export default function FinancialAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all')
  const [rawCommissions, setRawCommissions] = useState<RawCommission[]>([])
  const [rawFundedLeads, setRawFundedLeads] = useState<RawLead[]>([])
  const [activeDealsCount, setActiveDealsCount] = useState(0)
  const [consultantsMap, setConsultantsMap] = useState<Record<string, { full_name: string; rank: string }>>({})
  const [membership, setMembership] = useState<MembershipData>({ activeAgents: 0, inactiveAgents: 0 })

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    const supabase = createClient()

    try {
      const [
        commissionsRes,
        leadsRes,
        activeDealsRes,
        activeAgentsRes,
        totalAgentsRes,
      ] = await Promise.all([
        supabase.from('commissions').select('id, consultant_id, amount, waterfall_level, gross_commission, commission_type, deal_id, created_at, status'),
        supabase.from('leads').select('id, status, funded_amount, product_category, created_at').eq('status', 'funded'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).in('status', ['application', 'in_review', 'approved']),
        supabase.from('consultants').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('consultants').select('id', { count: 'exact', head: true }),
      ])

      const commissions = (commissionsRes.data ?? []) as RawCommission[]
      const fundedLeads = (leadsRes.data ?? []) as RawLead[]
      const activeCount = activeDealsRes.count ?? 0
      const activeAgents = activeAgentsRes.count ?? 0
      const totalAgents = totalAgentsRes.count ?? 0

      setRawCommissions(commissions)
      setRawFundedLeads(fundedLeads)
      setActiveDealsCount(activeCount)
      setMembership({ activeAgents, inactiveAgents: totalAgents - activeAgents })

      // Fetch consultants for top earners
      const consultantIds = [...new Set(commissions.map(c => c.consultant_id).filter(Boolean))]
      let cMap: Record<string, { full_name: string; rank: string }> = {}
      if (consultantIds.length > 0) {
        const { data: consultants } = await supabase
          .from('consultants')
          .select('id, full_name, rank')
          .in('id', consultantIds)
        if (consultants) {
          cMap = Object.fromEntries(consultants.map(c => [c.id, { full_name: c.full_name, rank: c.rank }]))
        }
      }
      setConsultantsMap(cMap)
    } catch (err) {
      console.error('Failed to load financial analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Filter raw data by time period ──────────────────────────

  const filteredCommissions = useMemo(() => {
    const start = getStartDate(timePeriod)
    if (!start) return rawCommissions
    return rawCommissions.filter(c => new Date(c.created_at) >= start)
  }, [rawCommissions, timePeriod])

  const filteredLeads = useMemo(() => {
    const start = getStartDate(timePeriod)
    if (!start) return rawFundedLeads
    return rawFundedLeads.filter(l => new Date(l.created_at) >= start)
  }, [rawFundedLeads, timePeriod])

  // ── Compute all derived data from filtered sets ─────────────

  const kpis = useMemo<KPIData>(() => {
    const grossFundedVolume = filteredLeads.reduce((sum, l) => sum + (Number(l.funded_amount) || 0), 0)

    // Gross Commissions: unique by deal_id
    const seenDealIds = new Set<string>()
    let grossCommissions = 0
    for (const c of filteredCommissions) {
      if (c.gross_commission && c.deal_id && !seenDealIds.has(c.deal_id)) {
        grossCommissions += Number(c.gross_commission)
        seenDealIds.add(c.deal_id)
      }
    }

    // Bonus Pool: waterfall_level = 99
    const bonusPool = filteredCommissions
      .filter(c => c.waterfall_level === 99)
      .reduce((sum, c) => sum + Number(c.amount), 0)

    // Net Revenue to Sequoia = overhead + recaptured overrides + bonus pool
    const overheadAndRecaptured = filteredCommissions
      .filter(c => c.waterfall_level === -1 || (c.waterfall_level !== null && c.waterfall_level >= 1 && c.waterfall_level <= 6 && !c.consultant_id))
      .reduce((sum, c) => sum + Number(c.amount), 0)
    const netRevenueToSequoia = overheadAndRecaptured + bonusPool

    // Total Commissions Paid: only to actual consultants (level >= 0, has consultant_id, exclude bonus pool)
    const totalCommissionsPaid = filteredCommissions
      .filter(c => c.waterfall_level !== null && c.waterfall_level >= 0 && c.waterfall_level !== 99 && c.consultant_id)
      .reduce((sum, c) => sum + Number(c.amount), 0)

    return {
      grossFundedVolume,
      grossCommissions,
      netRevenueToSequoia,
      totalCommissionsPaid,
      bonusPool,
      activeDeals: activeDealsCount,
    }
  }, [filteredCommissions, filteredLeads, activeDealsCount])

  const waterfallBreakdown = useMemo<WaterfallRow[]>(() => {
    const waterfallMap = new Map<number, { total: number; count: number }>()
    for (const c of filteredCommissions) {
      const level = c.waterfall_level ?? -999
      const existing = waterfallMap.get(level) || { total: 0, count: 0 }
      existing.total += Number(c.amount)
      existing.count += 1
      waterfallMap.set(level, existing)
    }
    const rows: WaterfallRow[] = []
    for (const [level, data] of waterfallMap) {
      if (level === -999) continue
      rows.push({
        waterfall_level: level,
        total_amount: data.total,
        record_count: data.count,
        avg_amount: data.count > 0 ? data.total / data.count : 0,
      })
    }
    rows.sort((a, b) => (a.waterfall_level ?? 0) - (b.waterfall_level ?? 0))
    return rows
  }, [filteredCommissions])

  const productBreakdown = useMemo<ProductRow[]>(() => {
    const leadMap = new Map<string, { product_category: string; funded_amount: number }>()
    for (const l of filteredLeads) {
      leadMap.set(l.id, {
        product_category: l.product_category || 'uncategorized',
        funded_amount: Number(l.funded_amount) || 0,
      })
    }

    const productMap = new Map<string, { deals: Set<string>; volume: number; commissions: number }>()
    for (const l of filteredLeads) {
      const cat = l.product_category || 'uncategorized'
      const existing = productMap.get(cat) || { deals: new Set<string>(), volume: 0, commissions: 0 }
      existing.deals.add(l.id)
      existing.volume += Number(l.funded_amount) || 0
      productMap.set(cat, existing)
    }
    for (const c of filteredCommissions) {
      if (c.deal_id) {
        const lead = leadMap.get(c.deal_id)
        if (lead) {
          const existing = productMap.get(lead.product_category)
          if (existing) {
            existing.commissions += Number(c.amount)
          }
        }
      }
    }
    const rows: ProductRow[] = []
    for (const [cat, data] of productMap) {
      rows.push({
        product_category: cat,
        funded_deals: data.deals.size,
        total_funded_volume: data.volume,
        total_commissions: data.commissions,
      })
    }
    rows.sort((a, b) => b.total_funded_volume - a.total_funded_volume)
    return rows
  }, [filteredCommissions, filteredLeads])

  const topConsultants = useMemo<TopConsultant[]>(() => {
    const earningsMap = new Map<string, { total: number; deals: Set<string> }>()
    for (const c of filteredCommissions) {
      if (!c.consultant_id || c.waterfall_level === -1 || c.waterfall_level === 99) continue
      const existing = earningsMap.get(c.consultant_id) || { total: 0, deals: new Set<string>() }
      existing.total += Number(c.amount)
      if (c.deal_id) existing.deals.add(c.deal_id)
      earningsMap.set(c.consultant_id, existing)
    }
    const earners: TopConsultant[] = []
    for (const [cid, data] of earningsMap) {
      const consultant = consultantsMap[cid]
      earners.push({
        consultant_id: cid,
        full_name: consultant?.full_name ?? 'Unknown',
        rank: consultant?.rank ?? 'lc_1',
        total_earnings: data.total,
        deal_count: data.deals.size,
      })
    }
    earners.sort((a, b) => b.total_earnings - a.total_earnings)
    return earners.slice(0, 10)
  }, [filteredCommissions, consultantsMap])

  const monthlyTrend = useMemo<MonthlyRow[]>(() => {
    const monthMap = new Map<string, { dealIds: Set<string>; volume: number; commissions: number; sequoiaRevenue: number }>()

    for (const l of filteredLeads) {
      const month = l.created_at.substring(0, 7)
      const existing = monthMap.get(month) || { dealIds: new Set<string>(), volume: 0, commissions: 0, sequoiaRevenue: 0 }
      existing.dealIds.add(l.id)
      existing.volume += Number(l.funded_amount) || 0
      monthMap.set(month, existing)
    }

    for (const c of filteredCommissions) {
      const month = c.created_at.substring(0, 7)
      const existing = monthMap.get(month) || { dealIds: new Set<string>(), volume: 0, commissions: 0, sequoiaRevenue: 0 }
      existing.commissions += Number(c.amount)
      if (c.waterfall_level === -1 || (c.waterfall_level !== null && c.waterfall_level >= 1 && c.waterfall_level <= 6 && !c.consultant_id)) {
        existing.sequoiaRevenue += Number(c.amount)
      }
      monthMap.set(month, existing)
    }

    const rows: MonthlyRow[] = []
    for (const [month, data] of monthMap) {
      rows.push({
        month,
        deals_funded: data.dealIds.size,
        total_funded_volume: data.volume,
        total_commissions: data.commissions,
        sequoia_revenue: data.sequoiaRevenue,
      })
    }
    rows.sort((a, b) => a.month.localeCompare(b.month))
    return rows
  }, [filteredCommissions, filteredLeads])

  // ── Chart data transforms ──────────────────────────────────

  const trendChartData = useMemo(() => {
    return monthlyTrend.map(row => ({
      name: formatMonth(row.month),
      'Funded Volume': row.total_funded_volume,
      'Sequoia Revenue': row.sequoia_revenue,
    }))
  }, [monthlyTrend])

  const pieChartData = useMemo(() => {
    const total = productBreakdown.reduce((s, r) => s + r.total_funded_volume, 0)
    return productBreakdown.map(row => ({
      name: productCategoryLabel(row.product_category),
      value: row.total_funded_volume,
      pct: total > 0 ? ((row.total_funded_volume / total) * 100).toFixed(1) : '0',
      color: PRODUCT_COLORS[row.product_category] || '#6b7280',
    }))
  }, [productBreakdown])

  const barChartData = useMemo(() => {
    return waterfallBreakdown.map(row => ({
      name: waterfallLabel(row.waterfall_level),
      amount: row.total_amount,
      fill: waterfallBarColor(row.waterfall_level),
    }))
  }, [waterfallBreakdown])

  // ── Membership revenue calculations ──────────────────────

  const MONTHLY_FEE = 29.99
  const monthlyMembershipRevenue = membership.activeAgents * MONTHLY_FEE
  const monthlyMissedOpportunity = membership.inactiveAgents * MONTHLY_FEE
  const annualMembershipRevenue = monthlyMembershipRevenue * 12
  const annualMissedOpportunity = monthlyMissedOpportunity * 12

  const productCategoryLabelFn = (cat: string): string => {
    const labels: Record<string, string> = {
      real_estate_lending: 'Real Estate Lending',
      business_funding: 'Business Funding',
      business_services: 'Business Services',
      clean_energy: 'Clean Energy',
      wellness: 'Wellness / EHMP',
      uncategorized: 'Uncategorized',
    }
    return labels[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Analytics
          </h2>
          <p className="text-sequoia-300 mt-1 text-sm">
            Revenue, commissions, and business performance overview
          </p>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="card-sequoia p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar size={14} />
            <span className="font-medium">Period:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TIME_PERIODS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimePeriod(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  timePeriod === value
                    ? 'bg-sequoia-900 text-white border-sequoia-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-sequoia-300 hover:text-sequoia-700'
                }`}
                style={timePeriod === value ? { color: '#FFFFFF' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={20} className="animate-spin text-gold-600" />
          <span className="text-sm text-brand-neutral-500">Loading financial data...</span>
        </div>
      )}

      {/* KPI Cards */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              icon={TrendingUp}
              label="Gross Funded Volume"
              value={formatCompact(kpis.grossFundedVolume)}
              subtext="Total funded deal volume"
              accentColor="gold"
              href="/admin/deals"
            />
            <StatsCard
              icon={DollarSign}
              label="Gross Commissions"
              value={formatCompact(kpis.grossCommissions)}
              subtext="Total commissions generated"
              accentColor="gold"
              href="/admin/commissions"
            />
            <StatsCard
              icon={Building2}
              label="Net Revenue to Sequoia"
              value={formatCompact(kpis.netRevenueToSequoia)}
              subtext="Overhead + recaptured + bonus pool"
              accentColor="gold"
            />
            <StatsCard
              icon={Users}
              label="Total Commissions Paid"
              value={formatCompact(kpis.totalCommissionsPaid)}
              subtext="Payouts to consultants"
              href="/admin/commissions"
            />
            <StatsCard
              icon={PiggyBank}
              label="Bonus Pool"
              value={formatCompact(kpis.bonusPool)}
              subtext="Reserved for rank bonuses"
            />
            <StatsCard
              icon={BarChart3}
              label="Active Deals"
              value={kpis.activeDeals.toLocaleString()}
              subtext="In pipeline (app / review / approved)"
              href="/admin/deals"
            />
          </div>

          {/* Membership Revenue Card */}
          <div className="card-sequoia overflow-hidden">
            <div className="flex items-center gap-2 p-5 pb-3">
              <UserCheck size={18} className="text-gold-600" />
              <h3 className="text-lg font-bold text-sequoia-900">Membership Revenue ($29.99/mo per agent)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 pt-2">
              {/* Active Revenue */}
              <div className="rounded-lg border border-brand-neutral-200 p-5">
                <p className="text-sm text-brand-neutral-500 uppercase tracking-wider font-semibold mb-1">Active Agents</p>
                <p className="text-3xl font-extrabold text-sequoia-900">{membership.activeAgents.toLocaleString()}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-neutral-500">Monthly Revenue</span>
                    <span className="font-semibold text-sequoia-800">{formatCurrency(monthlyMembershipRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-neutral-500">Annual Projection</span>
                    <span className="font-bold text-sequoia-900">{formatCurrency(annualMembershipRevenue)}</span>
                  </div>
                </div>
              </div>
              {/* Missed Opportunity */}
              <div className="rounded-lg border-2 border-dashed p-5" style={{ borderColor: '#C8A84E' }}>
                <p className="text-sm uppercase tracking-wider font-semibold mb-1" style={{ color: '#C8A84E' }}>Inactive Agents (Opportunity)</p>
                <p className="text-3xl font-extrabold" style={{ color: '#C8A84E' }}>{membership.inactiveAgents.toLocaleString()}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-neutral-500">Monthly Opportunity</span>
                    <span className="font-semibold" style={{ color: '#C8A84E' }}>{formatCurrency(monthlyMissedOpportunity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-neutral-500">Annual Opportunity</span>
                    <span className="text-2xl font-extrabold" style={{ color: '#C8A84E' }}>{formatCurrency(annualMissedOpportunity)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#0D2B1E' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: '#C8A84E' }} />
              <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
            </div>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 12 }} tickFormatter={(v: number) => formatCompact(v)} />
                  <Tooltip
                    {...ChartTooltipStyle}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '13px' }} />
                  <Line
                    type="monotone"
                    dataKey="Funded Volume"
                    stroke="#2d7a50"
                    strokeWidth={2.5}
                    dot={{ fill: '#2d7a50', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sequoia Revenue"
                    stroke="#C8A84E"
                    strokeWidth={2.5}
                    dot={{ fill: '#C8A84E', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-white/40 text-sm">
                No monthly data available for the selected period
              </div>
            )}
          </div>

          {/* Commission Breakdown: Chart + Table side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="card-sequoia overflow-hidden p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-gold-600" />
                <h3 className="text-lg font-bold text-sequoia-900">Commission Distribution</h3>
              </div>
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => formatCompact(v)} />
                    <Tooltip
                      {...ChartTooltipStyle}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {barChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-brand-neutral-400 text-sm">
                  No commission data available
                </div>
              )}
            </div>

            {/* Commission Breakdown Table */}
            <div className="card-sequoia overflow-hidden">
              <div className="flex items-center gap-2 p-5 pb-0">
                <Layers size={18} className="text-gold-600" />
                <h3 className="text-lg font-bold text-sequoia-900">Commission Breakdown by Level</h3>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--sequoia-800)] text-white">
                      <th className="text-left px-5 py-3 font-semibold">Level</th>
                      <th className="text-right px-5 py-3 font-semibold">Total Amount</th>
                      <th className="text-right px-5 py-3 font-semibold">Records</th>
                      <th className="text-right px-5 py-3 font-semibold">Avg per Deal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-neutral-100">
                    {waterfallBreakdown.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-brand-neutral-400">
                          No commission data available
                        </td>
                      </tr>
                    ) : (
                      waterfallBreakdown.map((row) => (
                        <tr key={row.waterfall_level} className="hover:bg-brand-neutral-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-sequoia-900">
                            {waterfallLabel(row.waterfall_level)}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold" style={{ color: row.waterfall_level === -1 ? '#C8A84E' : undefined }}>
                            {formatCurrency(row.total_amount)}
                          </td>
                          <td className="px-5 py-3 text-right text-brand-neutral-600">
                            {row.record_count.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right text-brand-neutral-600">
                            {formatCurrency(row.avg_amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {waterfallBreakdown.length > 0 && (
                    <tfoot>
                      <tr className="bg-brand-neutral-50 font-bold">
                        <td className="px-5 py-3 text-sequoia-900">Total</td>
                        <td className="px-5 py-3 text-right" style={{ color: '#C8A84E' }}>
                          {formatCurrency(waterfallBreakdown.reduce((s, r) => s + r.total_amount, 0))}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {waterfallBreakdown.reduce((s, r) => s + r.record_count, 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">--</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* Product Mix: Pie Chart + Table side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="card-sequoia overflow-hidden p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-gold-600" />
                <h3 className="text-lg font-bold text-sequoia-900">Product Mix</h3>
              </div>
              {pieChartData.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                        label={false}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        {...ChartTooltipStyle}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 px-2">
                    {pieChartData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-brand-neutral-600">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}: {entry.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-brand-neutral-400 text-sm">
                  No product data available
                </div>
              )}
            </div>

            {/* Revenue by Product Table */}
            <div className="card-sequoia overflow-hidden">
              <div className="flex items-center gap-2 p-5 pb-0">
                <Package size={18} className="text-gold-600" />
                <h3 className="text-lg font-bold text-sequoia-900">Revenue by Product Category</h3>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--sequoia-800)] text-white">
                      <th className="text-left px-5 py-3 font-semibold">Product</th>
                      <th className="text-right px-5 py-3 font-semibold">Deals</th>
                      <th className="text-right px-5 py-3 font-semibold">Volume</th>
                      <th className="text-right px-5 py-3 font-semibold">Commissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-neutral-100">
                    {productBreakdown.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-brand-neutral-400">
                          No product data available
                        </td>
                      </tr>
                    ) : (
                      productBreakdown.map((row) => (
                        <tr key={row.product_category} className="hover:bg-brand-neutral-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-sequoia-900">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: PRODUCT_COLORS[row.product_category] || '#6b7280' }}
                              />
                              {productCategoryLabelFn(row.product_category)}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right text-brand-neutral-600">
                            {row.funded_deals.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold" style={{ color: '#C8A84E' }}>
                            {formatCurrency(row.total_funded_volume)}
                          </td>
                          <td className="px-5 py-3 text-right text-brand-neutral-600">
                            {formatCurrency(row.total_commissions)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {productBreakdown.length > 0 && (
                    <tfoot>
                      <tr className="bg-brand-neutral-50 font-bold">
                        <td className="px-5 py-3 text-sequoia-900">Total</td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {productBreakdown.reduce((s, r) => s + r.funded_deals, 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right" style={{ color: '#C8A84E' }}>
                          {formatCurrency(productBreakdown.reduce((s, r) => s + r.total_funded_volume, 0))}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {formatCurrency(productBreakdown.reduce((s, r) => s + r.total_commissions, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* Top Consultants by Earnings */}
          <div className="card-sequoia overflow-hidden">
            <div className="flex items-center gap-2 p-5 pb-0">
              <Crown size={18} className="text-gold-600" />
              <h3 className="text-lg font-bold text-sequoia-900">Top Consultants by Earnings</h3>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--sequoia-800)] text-white">
                    <th className="text-left px-5 py-3 font-semibold w-10">#</th>
                    <th className="text-left px-5 py-3 font-semibold">Consultant</th>
                    <th className="text-left px-5 py-3 font-semibold">Rank</th>
                    <th className="text-right px-5 py-3 font-semibold">Total Earnings</th>
                    <th className="text-right px-5 py-3 font-semibold">Deals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-neutral-100">
                  {topConsultants.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-brand-neutral-400">
                        No consultant data available
                      </td>
                    </tr>
                  ) : (
                    topConsultants.map((c, idx) => (
                      <tr key={c.consultant_id} className="hover:bg-brand-neutral-50 transition-colors">
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            idx === 0
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : idx === 1
                                ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                : idx === 2
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-brand-neutral-50 text-brand-neutral-500 border border-brand-neutral-200'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-sequoia-900">
                          {c.full_name}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${rankBadgeColor(c.rank)}`}>
                            {rankLabel(c.rank)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-bold" style={{ color: '#C8A84E' }}>
                          {formatCurrency(c.total_earnings)}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {c.deal_count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Trend Table */}
          <div className="card-sequoia overflow-hidden">
            <div className="flex items-center gap-2 p-5 pb-0">
              <CalendarRange size={18} className="text-gold-600" />
              <h3 className="text-lg font-bold text-sequoia-900">Monthly Trend</h3>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--sequoia-800)] text-white">
                    <th className="text-left px-5 py-3 font-semibold">Month</th>
                    <th className="text-right px-5 py-3 font-semibold">Deals Funded</th>
                    <th className="text-right px-5 py-3 font-semibold">Funded Volume</th>
                    <th className="text-right px-5 py-3 font-semibold">Total Commissions</th>
                    <th className="text-right px-5 py-3 font-semibold">Sequoia Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-neutral-100">
                  {monthlyTrend.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-brand-neutral-400">
                        No monthly data available
                      </td>
                    </tr>
                  ) : (
                    monthlyTrend.map((row) => (
                      <tr key={row.month} className="hover:bg-brand-neutral-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-sequoia-900">
                          {formatMonth(row.month)}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {row.deals_funded}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold" style={{ color: '#C8A84E' }}>
                          {formatCurrency(row.total_funded_volume)}
                        </td>
                        <td className="px-5 py-3 text-right text-brand-neutral-600">
                          {formatCurrency(row.total_commissions)}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold" style={{ color: '#C8A84E' }}>
                          {formatCurrency(row.sequoia_revenue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {monthlyTrend.length > 0 && (
                  <tfoot>
                    <tr className="bg-brand-neutral-50 font-bold">
                      <td className="px-5 py-3 text-sequoia-900">Total</td>
                      <td className="px-5 py-3 text-right text-brand-neutral-600">
                        {monthlyTrend.reduce((s, r) => s + r.deals_funded, 0)}
                      </td>
                      <td className="px-5 py-3 text-right" style={{ color: '#C8A84E' }}>
                        {formatCurrency(monthlyTrend.reduce((s, r) => s + r.total_funded_volume, 0))}
                      </td>
                      <td className="px-5 py-3 text-right text-brand-neutral-600">
                        {formatCurrency(monthlyTrend.reduce((s, r) => s + r.total_commissions, 0))}
                      </td>
                      <td className="px-5 py-3 text-right" style={{ color: '#C8A84E' }}>
                        {formatCurrency(monthlyTrend.reduce((s, r) => s + r.sequoia_revenue, 0))}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function productCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    real_estate_lending: 'RE Lending',
    business_funding: 'Biz Funding',
    business_services: 'Biz Services',
    clean_energy: 'Clean Energy',
    wellness: 'Wellness',
    uncategorized: 'Other',
  }
  return labels[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
