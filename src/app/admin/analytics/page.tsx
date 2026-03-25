'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'

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

// ── Component ────────────────────────────────────────────────

export default function FinancialAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPIData>({
    grossFundedVolume: 0,
    grossCommissions: 0,
    netRevenueToSequoia: 0,
    totalCommissionsPaid: 0,
    bonusPool: 0,
    activeDeals: 0,
  })
  const [waterfallBreakdown, setWaterfallBreakdown] = useState<WaterfallRow[]>([])
  const [productBreakdown, setProductBreakdown] = useState<ProductRow[]>([])
  const [topConsultants, setTopConsultants] = useState<TopConsultant[]>([])
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyRow[]>([])

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    const supabase = createClient()

    try {
      // Fetch all data in parallel
      const [
        commissionsRes,
        leadsRes,
        activeDealsRes,
      ] = await Promise.all([
        supabase.from('commissions').select('id, consultant_id, amount, waterfall_level, gross_commission, commission_type, deal_id, created_at, status'),
        supabase.from('leads').select('id, status, funded_amount, product_category, created_at').eq('status', 'funded'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).in('status', ['application', 'in_review', 'approved']),
      ])

      const commissions = commissionsRes.data ?? []
      const fundedLeads = leadsRes.data ?? []
      const activeDealsCount = activeDealsRes.count ?? 0

      // Also fetch consultants for top earners
      const consultantIds = [...new Set(commissions.map(c => c.consultant_id).filter(Boolean))]
      let consultantsMap: Record<string, { full_name: string; rank: string }> = {}
      if (consultantIds.length > 0) {
        const { data: consultants } = await supabase
          .from('consultants')
          .select('id, full_name, rank')
          .in('id', consultantIds)
        if (consultants) {
          consultantsMap = Object.fromEntries(consultants.map(c => [c.id, { full_name: c.full_name, rank: c.rank }]))
        }
      }

      // ── KPI Calculations ──

      // Gross Funded Volume: sum of funded_amount from funded leads
      const grossFundedVolume = fundedLeads.reduce((sum, l) => sum + (Number(l.funded_amount) || 0), 0)

      // Gross Commissions: sum of gross_commission (use distinct deal_ids)
      const seenDealIds = new Set<string>()
      let grossCommissions = 0
      for (const c of commissions) {
        if (c.gross_commission && c.deal_id && !seenDealIds.has(c.deal_id)) {
          grossCommissions += Number(c.gross_commission)
          seenDealIds.add(c.deal_id)
        }
      }

      // Net Revenue to Sequoia: overhead (waterfall_level = -1) + recaptured (waterfall_level 1-6, consultant_id IS NULL)
      const netRevenueToSequoia = commissions
        .filter(c => c.waterfall_level === -1 || (c.waterfall_level !== null && c.waterfall_level >= 1 && c.waterfall_level <= 6 && !c.consultant_id))
        .reduce((sum, c) => sum + Number(c.amount), 0)

      // Total Commissions Paid: waterfall_level >= 0 AND consultant_id IS NOT NULL
      const totalCommissionsPaid = commissions
        .filter(c => c.waterfall_level !== null && c.waterfall_level >= 0 && c.consultant_id)
        .reduce((sum, c) => sum + Number(c.amount), 0)

      // Bonus Pool: waterfall_level = 99
      const bonusPool = commissions
        .filter(c => c.waterfall_level === 99)
        .reduce((sum, c) => sum + Number(c.amount), 0)

      setKpis({
        grossFundedVolume,
        grossCommissions,
        netRevenueToSequoia,
        totalCommissionsPaid,
        bonusPool,
        activeDeals: activeDealsCount,
      })

      // ── Waterfall Breakdown ──
      const waterfallMap = new Map<number, { total: number; count: number }>()
      for (const c of commissions) {
        const level = c.waterfall_level ?? -999
        const existing = waterfallMap.get(level) || { total: 0, count: 0 }
        existing.total += Number(c.amount)
        existing.count += 1
        waterfallMap.set(level, existing)
      }
      const waterfallRows: WaterfallRow[] = []
      for (const [level, data] of waterfallMap) {
        if (level === -999) continue // skip null levels
        waterfallRows.push({
          waterfall_level: level,
          total_amount: data.total,
          record_count: data.count,
          avg_amount: data.count > 0 ? data.total / data.count : 0,
        })
      }
      waterfallRows.sort((a, b) => (a.waterfall_level ?? 0) - (b.waterfall_level ?? 0))
      setWaterfallBreakdown(waterfallRows)

      // ── Product Breakdown ──
      // Build a map of deal_id -> product_category from funded leads
      const leadMap = new Map<string, { product_category: string; funded_amount: number }>()
      for (const l of fundedLeads) {
        leadMap.set(l.id, {
          product_category: l.product_category || 'uncategorized',
          funded_amount: Number(l.funded_amount) || 0,
        })
      }

      // Group by product_category
      const productMap = new Map<string, { deals: Set<string>; volume: number; commissions: number }>()
      for (const l of fundedLeads) {
        const cat = l.product_category || 'uncategorized'
        const existing = productMap.get(cat) || { deals: new Set<string>(), volume: 0, commissions: 0 }
        existing.deals.add(l.id)
        existing.volume += Number(l.funded_amount) || 0
        productMap.set(cat, existing)
      }
      // Add commission totals by matching deal_id to leads
      for (const c of commissions) {
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
      const productRows: ProductRow[] = []
      for (const [cat, data] of productMap) {
        productRows.push({
          product_category: cat,
          funded_deals: data.deals.size,
          total_funded_volume: data.volume,
          total_commissions: data.commissions,
        })
      }
      productRows.sort((a, b) => b.total_funded_volume - a.total_funded_volume)
      setProductBreakdown(productRows)

      // ── Top Consultants ──
      const earningsMap = new Map<string, { total: number; deals: Set<string> }>()
      for (const c of commissions) {
        if (!c.consultant_id || c.waterfall_level === -1 || c.waterfall_level === 99) continue
        const existing = earningsMap.get(c.consultant_id) || { total: 0, deals: new Set<string>() }
        existing.total += Number(c.amount)
        if (c.deal_id) existing.deals.add(c.deal_id)
        earningsMap.set(c.consultant_id, existing)
      }
      const topEarners: TopConsultant[] = []
      for (const [cid, data] of earningsMap) {
        const consultant = consultantsMap[cid]
        topEarners.push({
          consultant_id: cid,
          full_name: consultant?.full_name ?? 'Unknown',
          rank: consultant?.rank ?? 'lc_1',
          total_earnings: data.total,
          deal_count: data.deals.size,
        })
      }
      topEarners.sort((a, b) => b.total_earnings - a.total_earnings)
      setTopConsultants(topEarners.slice(0, 10))

      // ── Monthly Trend ──
      const monthMap = new Map<string, { dealIds: Set<string>; volume: number; commissions: number; sequoiaRevenue: number }>()

      // Group funded leads by month
      for (const l of fundedLeads) {
        const month = l.created_at.substring(0, 7) // YYYY-MM
        const existing = monthMap.get(month) || { dealIds: new Set<string>(), volume: 0, commissions: 0, sequoiaRevenue: 0 }
        existing.dealIds.add(l.id)
        existing.volume += Number(l.funded_amount) || 0
        monthMap.set(month, existing)
      }

      // Add commission data by month
      for (const c of commissions) {
        const month = c.created_at.substring(0, 7)
        const existing = monthMap.get(month) || { dealIds: new Set<string>(), volume: 0, commissions: 0, sequoiaRevenue: 0 }
        existing.commissions += Number(c.amount)
        if (c.waterfall_level === -1 || (c.waterfall_level !== null && c.waterfall_level >= 1 && c.waterfall_level <= 6 && !c.consultant_id)) {
          existing.sequoiaRevenue += Number(c.amount)
        }
        monthMap.set(month, existing)
      }

      const monthlyRows: MonthlyRow[] = []
      for (const [month, data] of monthMap) {
        monthlyRows.push({
          month,
          deals_funded: data.dealIds.size,
          total_funded_volume: data.volume,
          total_commissions: data.commissions,
          sequoia_revenue: data.sequoiaRevenue,
        })
      }
      monthlyRows.sort((a, b) => a.month.localeCompare(b.month))
      setMonthlyTrend(monthlyRows)
    } catch (err) {
      console.error('Failed to load financial analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const productCategoryLabel = (cat: string): string => {
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
              subtext="Overhead + recaptured overrides"
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

          {/* Commission Breakdown by Level */}
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

          {/* Revenue by Product Category */}
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
                    <th className="text-right px-5 py-3 font-semibold">Funded Deals</th>
                    <th className="text-right px-5 py-3 font-semibold">Funded Volume</th>
                    <th className="text-right px-5 py-3 font-semibold">Total Commissions</th>
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
                          {productCategoryLabel(row.product_category)}
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

          {/* Monthly Trend */}
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
