'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Brain,
  MessageSquare,
  AlertTriangle,
  Users,
  DollarSign,
  Download,
  Send,
  Sparkles,
  TrendingUp,
  UserMinus,
  UserPlus,
  GraduationCap,
  X,
  FileText,
  Zap,
  Crown,
  BarChart3,
  ClipboardList,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────

interface AlertData {
  agentsAtRisk: number
  newThisMonth: number
  trainingIncomplete: number
  pendingCommissions: number
  pendingCommissionAmount: number
}

interface MembershipData {
  activeCount: number
  inactiveCount: number
  monthlyRevenue: number
  annualRevenue: number
  monthlyOpportunity: number
  annualOpportunity: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface BusinessMetrics {
  totalConsultants: number
  activeConsultants: number
  inactiveConsultants: number
  totalDeals: number
  fundedDeals: number
  totalFundedVolume: number
  totalCommissions: number
  pendingCommissions: number
  pendingCommissionAmount: number
  paidCommissions: number
  paidCommissionAmount: number
  newAgentsThisMonth: number
  incompleteOnboarding: number
  totalSubmissions: number
  unreviewedSubmissions: number
}

interface TopEarner {
  name: string
  total: number
}

interface InsightData {
  topEarners: TopEarner[]
  currentMonthDeals: number
  lastMonthDeals: number
  pendingToApprove: number
  unreviewedSubs: number
  incompleteOnboarding: number
}

// ── Helpers ──────────────────────────────────────────────────

const MEMBERSHIP_PRICE = 29.99

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val)

const formatCurrencyPrecise = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)

function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(h => {
          const val = String(row[h] ?? '')
          return val.includes(',') ? `"${val}"` : val
        })
        .join(',')
    ),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Renders a trusted HTML string (generated entirely by our own code,
 * NOT from user input) into React elements. All values come from
 * Supabase numeric data and hardcoded templates in generateResponse().
 */
function SafeHTML({ html }: { html: string }) {
  // This is safe: the HTML is constructed by generateResponse() using
  // only our own template strings + numeric values from Supabase.
  // No user-supplied HTML is ever rendered.
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// ── Component ────────────────────────────────────────────────

export default function CommandCenterPage() {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<AlertData>({
    agentsAtRisk: 0,
    newThisMonth: 0,
    trainingIncomplete: 0,
    pendingCommissions: 0,
    pendingCommissionAmount: 0,
  })
  const [membership, setMembership] = useState<MembershipData>({
    activeCount: 0,
    inactiveCount: 0,
    monthlyRevenue: 0,
    annualRevenue: 0,
    monthlyOpportunity: 0,
    annualOpportunity: 0,
  })
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [insights, setInsights] = useState<InsightData>({
    topEarners: [],
    currentMonthDeals: 0,
    lastMonthDeals: 0,
    pendingToApprove: 0,
    unreviewedSubs: 0,
    incompleteOnboarding: 0,
  })
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content:
        '<strong>Welcome to your Command Center, Allen.</strong><br/><br/>I have access to your full business data. Ask me anything about your agents, revenue, deals, commissions, training, or team performance.<br/><br/>Try asking:<br/>- "How is my revenue looking?"<br/>- "Who are my top performers?"<br/>- "Show me agents at risk of churning"<br/>- "What\'s my reactivation opportunity?"',
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [draftModalOpen, setDraftModalOpen] = useState(false)
  const [draftMessage, setDraftMessage] = useState('')
  const [exportingRevenue, setExportingRevenue] = useState(false)
  const [exportingRoster, setExportingRoster] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Data Fetching ──────────────────────────────────────────

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    setLoading(true)
    const supabase = createClient()

    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

      const [
        consultantsRes,
        commissionsRes,
        leadsRes,
        submissionsRes,
        currentMonthDealsRes,
        lastMonthDealsRes,
      ] = await Promise.all([
        supabase.from('consultants').select('id, full_name, is_active, onboarding_completed, created_at'),
        supabase.from('commissions').select('id, consultant_id, amount, status, created_at'),
        supabase.from('leads').select('id, status, funded_amount, created_at'),
        supabase.from('contact_submissions').select('id, reviewed'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', currentMonthStart),
        supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
      ])

      const consultants = consultantsRes.data ?? []
      const commissions = commissionsRes.data ?? []
      const leads = leadsRes.data ?? []
      const submissions = submissionsRes.data ?? []

      // ── Alert Data ──
      const agentsAtRisk = consultants.filter(c => !c.is_active && c.onboarding_completed).length
      const newThisMonth = consultants.filter(c => c.created_at && c.created_at >= thirtyDaysAgoISO).length
      const trainingIncomplete = consultants.filter(c => !c.onboarding_completed).length
      const pendingComms = commissions.filter(c => c.status === 'pending')
      const pendingCommissionCount = pendingComms.length
      const pendingCommissionAmount = pendingComms.reduce((sum, c) => sum + Number(c.amount), 0)

      setAlerts({
        agentsAtRisk,
        newThisMonth,
        trainingIncomplete,
        pendingCommissions: pendingCommissionCount,
        pendingCommissionAmount,
      })

      // ── Membership Data ──
      const activeCount = consultants.filter(c => c.is_active).length
      const inactiveCount = consultants.filter(c => !c.is_active).length
      const monthlyRevenue = MEMBERSHIP_PRICE * activeCount
      const annualRevenue = monthlyRevenue * 12
      const monthlyOpportunity = MEMBERSHIP_PRICE * inactiveCount
      const annualOpportunity = monthlyOpportunity * 12

      setMembership({
        activeCount,
        inactiveCount,
        monthlyRevenue,
        annualRevenue,
        monthlyOpportunity,
        annualOpportunity,
      })

      // ── Business Metrics (for AI chat) ──
      const fundedLeads = leads.filter(l => l.status === 'funded')
      const totalFundedVolume = fundedLeads.reduce((sum, l) => sum + (Number(l.funded_amount) || 0), 0)
      const totalCommissionAmount = commissions.reduce((sum, c) => sum + Number(c.amount), 0)
      const paidComms = commissions.filter(c => c.status === 'paid')
      const paidAmount = paidComms.reduce((sum, c) => sum + Number(c.amount), 0)
      const unreviewedSubs = submissions.filter(s => !s.reviewed).length

      const businessMetrics: BusinessMetrics = {
        totalConsultants: consultants.length,
        activeConsultants: activeCount,
        inactiveConsultants: inactiveCount,
        totalDeals: leads.length,
        fundedDeals: fundedLeads.length,
        totalFundedVolume,
        totalCommissions: totalCommissionAmount,
        pendingCommissions: pendingCommissionCount,
        pendingCommissionAmount,
        paidCommissions: paidComms.length,
        paidCommissionAmount: paidAmount,
        newAgentsThisMonth: newThisMonth,
        incompleteOnboarding: trainingIncomplete,
        totalSubmissions: submissions.length,
        unreviewedSubmissions: unreviewedSubs,
      }
      setMetrics(businessMetrics)

      // ── Top Earners ──
      const earningsMap = new Map<string, number>()
      for (const c of commissions) {
        if (!c.consultant_id) continue
        earningsMap.set(c.consultant_id, (earningsMap.get(c.consultant_id) || 0) + Number(c.amount))
      }
      const sortedEarners = [...earningsMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
      const topEarners: TopEarner[] = sortedEarners.map(([cid, total]) => {
        const consultant = consultants.find(c => c.id === cid)
        return { name: consultant?.full_name ?? 'Unknown', total }
      })

      // ── Insights ──
      setInsights({
        topEarners,
        currentMonthDeals: currentMonthDealsRes.count ?? 0,
        lastMonthDeals: lastMonthDealsRes.count ?? 0,
        pendingToApprove: pendingCommissionCount,
        unreviewedSubs,
        incompleteOnboarding: trainingIncomplete,
      })
    } catch (err) {
      console.error('Command Center data fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── AI Chat (Smart Mock) ───────────────────────────────────

  const generateResponse = useCallback(
    (question: string): string => {
      if (!metrics) {
        return '<strong>Loading business data...</strong><br/>Please wait a moment while I gather your metrics.'
      }

      const q = question.toLowerCase()
      const m = metrics

      if (q.match(/revenue|money|earning|income|profit/)) {
        return `<strong>Revenue &amp; Earnings Overview</strong><br/><br/>
Here is your current financial snapshot:<br/><br/>
<strong>Funded Volume:</strong> ${formatCurrency(m.totalFundedVolume)}<br/>
<strong>Total Commissions Generated:</strong> ${formatCurrency(m.totalCommissions)}<br/>
<strong>Commissions Paid Out:</strong> ${formatCurrency(m.paidCommissionAmount)} (${m.paidCommissions} records)<br/>
<strong>Pending Commissions:</strong> ${formatCurrency(m.pendingCommissionAmount)} (${m.pendingCommissions} awaiting approval)<br/><br/>
<strong>Membership Revenue:</strong><br/>
- Monthly: ${formatCurrencyPrecise(membership.monthlyRevenue)} (${membership.activeCount} active agents x $29.99)<br/>
- Annual projection: ${formatCurrencyPrecise(membership.annualRevenue)}<br/><br/>
${m.pendingCommissions > 0 ? `<em style="color:#C8A84E;">Action needed: You have ${m.pendingCommissions} pending commissions totaling ${formatCurrency(m.pendingCommissionAmount)} awaiting approval.</em>` : '<em style="color:#22c55e;">All commissions are up to date.</em>'}`
      }

      if (q.match(/agent|consultant|team|people|staff|roster/)) {
        const retentionRate = m.totalConsultants > 0 ? ((m.activeConsultants / m.totalConsultants) * 100).toFixed(1) : '0'
        return `<strong>Team Overview</strong><br/><br/>
<strong>Total Agents:</strong> ${m.totalConsultants}<br/>
<strong>Active:</strong> ${m.activeConsultants} <span style="color:#22c55e;">(${retentionRate}% retention)</span><br/>
<strong>Inactive:</strong> ${m.inactiveConsultants}<br/>
<strong>New This Month:</strong> ${m.newAgentsThisMonth}<br/>
<strong>Training Incomplete:</strong> ${m.incompleteOnboarding}<br/><br/>
${m.incompleteOnboarding > 0 ? `<em style="color:#f59e0b;">Heads up: ${m.incompleteOnboarding} agent${m.incompleteOnboarding > 1 ? 's have' : ' has'} not completed onboarding training. Consider reaching out to keep them engaged.</em><br/><br/>` : ''}
${m.newAgentsThisMonth > 0 ? `<em style="color:#22c55e;">Great momentum! ${m.newAgentsThisMonth} new agent${m.newAgentsThisMonth > 1 ? 's' : ''} joined in the last 30 days.</em>` : '<em>No new agents this month. Consider ramping up recruitment efforts.</em>'}`
      }

      if (q.match(/deal|pipeline|fund|lead/)) {
        const fundingRate = m.totalDeals > 0 ? ((m.fundedDeals / m.totalDeals) * 100).toFixed(1) : '0'
        const avgDealSize = m.fundedDeals > 0 ? m.totalFundedVolume / m.fundedDeals : 0
        return `<strong>Deal Pipeline Analysis</strong><br/><br/>
<strong>Total Deals:</strong> ${m.totalDeals}<br/>
<strong>Funded:</strong> ${m.fundedDeals} (${fundingRate}% conversion rate)<br/>
<strong>Total Funded Volume:</strong> ${formatCurrency(m.totalFundedVolume)}<br/>
<strong>Avg Deal Size:</strong> ${formatCurrency(avgDealSize)}<br/><br/>
<strong>This Month vs Last Month:</strong><br/>
- Current month: ${insights.currentMonthDeals} deals<br/>
- Last month: ${insights.lastMonthDeals} deals<br/>
${insights.currentMonthDeals > insights.lastMonthDeals
            ? `<em style="color:#22c55e;">Trending up! ${insights.currentMonthDeals - insights.lastMonthDeals} more deals this month.</em>`
            : insights.currentMonthDeals < insights.lastMonthDeals
              ? `<em style="color:#ef4444;">Down ${insights.lastMonthDeals - insights.currentMonthDeals} deals compared to last month. May need attention.</em>`
              : '<em>Holding steady with last month.</em>'}`
      }

      if (q.match(/risk|churn|inactive|leave|lost|drop/)) {
        const churnRate = m.totalConsultants > 0 ? ((m.inactiveConsultants / m.totalConsultants) * 100).toFixed(1) : '0'
        return `<strong>At-Risk &amp; Churn Analysis</strong><br/><br/>
<strong>Churned Agents:</strong> ${alerts.agentsAtRisk} (completed onboarding but now inactive)<br/>
<strong>Inactive Agents Total:</strong> ${m.inactiveConsultants}<br/>
<strong>Churn Rate:</strong> ${churnRate}%<br/><br/>
<strong>Revenue Impact of Churn:</strong><br/>
- Monthly membership loss: ${formatCurrencyPrecise(membership.monthlyOpportunity)}<br/>
- Annual opportunity cost: <span style="color:#C8A84E;font-weight:bold;">${formatCurrencyPrecise(membership.annualOpportunity)}</span><br/><br/>
<em style="color:#f59e0b;">Recommendation: Focus on reactivating the ${alerts.agentsAtRisk} agents who already completed training. They know the business and are your highest-probability recoveries.</em>`
      }

      if (q.match(/top|best|star|performer|leader|mvp|winner/)) {
        if (insights.topEarners.length === 0) {
          return '<strong>Top Performers</strong><br/><br/>No commission data available yet. Once deals are funded and commissions are processed, your top earners will appear here.'
        }
        const earnerLines = insights.topEarners
          .map(
            (e, i) =>
              `${i === 0 ? '<span style="color:#C8A84E;">&#9733;</span>' : `${i + 1}.`} <strong>${e.name}</strong> &mdash; ${formatCurrency(e.total)}`
          )
          .join('<br/>')
        return `<strong>Top Performers</strong><br/><br/>
Your highest earners:<br/><br/>
${earnerLines}<br/><br/>
<em>These are the agents driving the most revenue. Consider recognizing them publicly to motivate the rest of the team.</em>`
      }

      if (q.match(/training|onboarding|learn|course|complet/)) {
        const completionRate = m.totalConsultants > 0 ? (((m.totalConsultants - m.incompleteOnboarding) / m.totalConsultants) * 100).toFixed(1) : '0'
        return `<strong>Training &amp; Onboarding Status</strong><br/><br/>
<strong>Total Agents:</strong> ${m.totalConsultants}<br/>
<strong>Training Complete:</strong> ${m.totalConsultants - m.incompleteOnboarding} (${completionRate}%)<br/>
<strong>Training Incomplete:</strong> <span style="color:#f59e0b;">${m.incompleteOnboarding}</span><br/><br/>
${m.incompleteOnboarding > 0
            ? `<em style="color:#f59e0b;">Action: Send a training reminder to the ${m.incompleteOnboarding} agent${m.incompleteOnboarding > 1 ? 's' : ''} who have not completed onboarding. Agents who complete training are significantly more likely to close their first deal.</em>`
            : '<em style="color:#22c55e;">All agents have completed their onboarding training. Great work!</em>'}`
      }

      if (q.match(/reactivat|membership|subscription|recurring/)) {
        return `<strong>Reactivation &amp; Membership Opportunity</strong><br/><br/>
<strong>Current Membership Revenue:</strong><br/>
- ${membership.activeCount} active agents x $29.99 = ${formatCurrencyPrecise(membership.monthlyRevenue)}/month<br/>
- Annual: ${formatCurrencyPrecise(membership.annualRevenue)}<br/><br/>
<strong>Reactivation Opportunity:</strong><br/>
- ${membership.inactiveCount} inactive agents<br/>
- Potential recovery: ${formatCurrencyPrecise(membership.monthlyOpportunity)}/month<br/>
- <span style="color:#C8A84E;font-weight:bold;font-size:1.1em;">Annual opportunity: ${formatCurrencyPrecise(membership.annualOpportunity)}</span><br/><br/>
<em>Strategy: Start with agents who were most recently active. A personal phone call from you has the highest conversion rate for reactivation. Consider a limited-time incentive for returning agents.</em>`
      }

      // Default: business health summary
      const healthScore = Math.min(
        100,
        Math.round(
          (m.activeConsultants > 0 ? 25 : 0) +
            (m.fundedDeals > 0 ? 25 : 0) +
            (m.incompleteOnboarding === 0 ? 25 : 15) +
            (m.pendingCommissions < 5 ? 25 : 15)
        )
      )
      return `<strong>Business Health Summary</strong><br/><br/>
<span style="font-size:1.3em;color:${healthScore >= 75 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444'};font-weight:bold;">Health Score: ${healthScore}/100</span><br/><br/>
<strong>Key Metrics:</strong><br/>
- <strong>${m.activeConsultants}</strong> active agents (${m.totalConsultants} total)<br/>
- <strong>${m.fundedDeals}</strong> funded deals worth <strong>${formatCurrency(m.totalFundedVolume)}</strong><br/>
- <strong>${formatCurrency(m.totalCommissions)}</strong> in total commissions<br/>
- <strong>${m.newAgentsThisMonth}</strong> new agents this month<br/><br/>
<strong>Needs Attention:</strong><br/>
${m.pendingCommissions > 0 ? `- ${m.pendingCommissions} pending commissions (${formatCurrency(m.pendingCommissionAmount)})<br/>` : ''}
${m.incompleteOnboarding > 0 ? `- ${m.incompleteOnboarding} agents need to complete training<br/>` : ''}
${alerts.agentsAtRisk > 0 ? `- ${alerts.agentsAtRisk} agents at risk of churning<br/>` : ''}
${m.unreviewedSubmissions > 0 ? `- ${m.unreviewedSubmissions} unreviewed submissions<br/>` : ''}
${m.pendingCommissions === 0 && m.incompleteOnboarding === 0 && alerts.agentsAtRisk === 0 && m.unreviewedSubmissions === 0 ? '- Everything looks great!<br/>' : ''}<br/>
<em>Ask me about any specific area for a deeper dive.</em>`
    },
    [metrics, membership, alerts, insights]
  )

  const handleSendMessage = useCallback(async () => {
    const text = chatInput.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = generateResponse(text)
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      content: response,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
  }, [chatInput, generateResponse])

  // ── Export Handlers ────────────────────────────────────────

  async function handleExportRevenue() {
    setExportingRevenue(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('commissions')
        .select('id, consultant_id, amount, status, commission_type, waterfall_level, created_at')
        .order('created_at', { ascending: false })
      if (data && data.length > 0) {
        downloadCSV(data as Record<string, unknown>[], `sequoia-revenue-report-${new Date().toISOString().slice(0, 10)}.csv`)
      }
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExportingRevenue(false)
    }
  }

  async function handleExportRoster() {
    setExportingRoster(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('consultants')
        .select('id, full_name, email, phone, rank, is_active, onboarding_completed, created_at')
        .order('full_name')
      if (data && data.length > 0) {
        downloadCSV(data as Record<string, unknown>[], `sequoia-agent-roster-${new Date().toISOString().slice(0, 10)}.csv`)
      }
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExportingRoster(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
            <Brain size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sequoia-600" />
          </div>
          <p className="text-sm text-brand-neutral-500">Initializing Command Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Command Center
            </h2>
            <p className="text-sequoia-300 mt-0.5 text-sm">
              AI-powered business intelligence and communications
            </p>
          </div>
        </div>
      </div>

      {/* ── Alert Cards Row ── */}
      <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        <Link
          href="/admin/consultants?view=at_risk"
          className="flex-none w-[220px] sm:w-auto sm:flex-1 snap-start card-sequoia p-4 hover:shadow-md hover:border-red-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
              <UserMinus size={18} />
            </div>
            <span className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              Agents at Risk
            </span>
          </div>
          <p className="text-3xl font-extrabold text-red-600">{alerts.agentsAtRisk}</p>
          <p className="text-xs text-brand-neutral-400 mt-1">Churned (completed training, now inactive)</p>
        </Link>

        <Link
          href="/admin/consultants?view=new"
          className="flex-none w-[220px] sm:w-auto sm:flex-1 snap-start card-sequoia p-4 hover:shadow-md hover:border-green-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-500 group-hover:bg-green-100 transition-colors">
              <UserPlus size={18} />
            </div>
            <span className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              New This Month
            </span>
          </div>
          <p className="text-3xl font-extrabold text-green-600">{alerts.newThisMonth}</p>
          <p className="text-xs text-brand-neutral-400 mt-1">Joined in the last 30 days</p>
        </Link>

        <Link
          href="/admin/consultants?view=training_incomplete"
          className="flex-none w-[220px] sm:w-auto sm:flex-1 snap-start card-sequoia p-4 hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors">
              <GraduationCap size={18} />
            </div>
            <span className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              Training Incomplete
            </span>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{alerts.trainingIncomplete}</p>
          <p className="text-xs text-brand-neutral-400 mt-1">Onboarding not yet finished</p>
        </Link>

        <Link
          href="/admin/commissions?status=pending"
          className="flex-none w-[220px] sm:w-auto sm:flex-1 snap-start card-sequoia p-4 hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors" style={{ color: '#C8A84E' }}>
              <DollarSign size={18} />
            </div>
            <span className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              Pending Commissions
            </span>
          </div>
          <p className="text-3xl font-extrabold" style={{ color: '#C8A84E' }}>
            {alerts.pendingCommissions}
          </p>
          <p className="text-xs mt-1" style={{ color: '#C8A84E' }}>
            {formatCurrency(alerts.pendingCommissionAmount)} total
          </p>
        </Link>
      </div>

      {/* ── Membership Revenue Opportunity ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3a 50%, #1a3a2a 100%)' }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} style={{ color: '#C8A84E' }} />
            <h3 className="text-lg font-bold text-white">Membership Revenue Opportunity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Current Revenue */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                Active Membership Revenue
              </h4>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-emerald-200/80">Active Agents</span>
                  <span className="text-lg font-bold text-white">{membership.activeCount}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-emerald-200/80">Monthly Revenue</span>
                  <span className="text-lg font-bold text-white">{formatCurrencyPrecise(membership.monthlyRevenue)}</span>
                </div>
                <div className="h-px bg-emerald-700/50" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-emerald-200/80">Annual Projection</span>
                  <span className="text-xl font-extrabold text-emerald-300">{formatCurrencyPrecise(membership.annualRevenue)}</span>
                </div>
                <p className="text-xs text-emerald-400/60">${MEMBERSHIP_PRICE}/agent/month x {membership.activeCount} active agents</p>
              </div>
            </div>

            {/* Right: Opportunity */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#C8A84E' }}>
                Reactivation Opportunity
              </h4>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-emerald-200/80">Inactive Agents</span>
                  <span className="text-lg font-bold text-red-300">{membership.inactiveCount}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-emerald-200/80">Revenue Left on Table</span>
                  <span className="text-lg font-bold" style={{ color: '#C8A84E' }}>
                    {formatCurrencyPrecise(membership.monthlyOpportunity)}/mo
                  </span>
                </div>
                <div className="h-px" style={{ backgroundColor: 'rgba(200,168,78,0.3)' }} />
                <div className="text-center py-3">
                  <p className="text-xs uppercase tracking-wider text-emerald-300/60 mb-1">
                    Annual Opportunity
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: '#C8A84E' }}>
                    {formatCurrencyPrecise(membership.annualOpportunity)}
                  </p>
                  <p className="text-xs mt-2 text-emerald-200/60">
                    Reactivate your inactive agents to unlock this revenue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Chat Interface ── */}
      <div className="card-sequoia overflow-hidden">
        <div className="flex items-center gap-2 p-5 pb-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'rgba(200,168,78,0.1)' }}>
            <Brain size={16} style={{ color: '#C8A84E' }} />
          </div>
          <h3 className="text-lg font-bold text-sequoia-900">AI Business Assistant</h3>
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Chat Messages */}
        <div className="h-[400px] overflow-y-auto p-5 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-50 border border-amber-200 text-sequoia-900'
                    : 'text-white'
                }`}
                style={
                  msg.role === 'ai'
                    ? { backgroundColor: 'var(--sequoia-900, #1a2e1a)' }
                    : undefined
                }
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} style={{ color: '#C8A84E' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C8A84E' }}>
                      Sequoia AI
                    </span>
                  </div>
                )}
                <SafeHTML html={msg.content} />
                <p
                  className={`text-[10px] mt-2 ${
                    msg.role === 'user' ? 'text-amber-400' : 'text-emerald-600/50'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: 'var(--sequoia-900, #1a2e1a)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} style={{ color: '#C8A84E' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C8A84E' }}>
                    Sequoia AI
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-brand-neutral-200 p-4">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-3"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about your business..."
              className="flex-1 rounded-lg border border-brand-neutral-200 bg-brand-neutral-50 px-4 py-2.5 text-sm text-sequoia-900 placeholder:text-brand-neutral-400 focus:outline-none focus:ring-2 focus:ring-sequoia-500/30 focus:border-sequoia-500 transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 shrink-0"
              style={{ backgroundColor: 'var(--sequoia-700, #2d5a3a)' }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Revenue overview', 'Top performers', 'Agents at risk', 'Pipeline status', 'Training stats'].map(
              suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setChatInput(suggestion)
                    chatInputRef.current?.focus()
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-neutral-200 text-brand-neutral-500 hover:border-sequoia-300 hover:text-sequoia-700 hover:bg-sequoia-50 transition-all"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Insights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Star Agents */}
        <div className="card-sequoia p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={16} style={{ color: '#C8A84E' }} />
            <h3 className="text-sm font-bold text-sequoia-900">Star Agents</h3>
          </div>
          {insights.topEarners.length === 0 ? (
            <p className="text-sm text-brand-neutral-400 text-center py-4">No commission data yet</p>
          ) : (
            <div className="space-y-3">
              {insights.topEarners.map((earner, i) => (
                <div key={earner.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        i === 0
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : i === 1
                            ? 'bg-gray-100 text-gray-600 border border-gray-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-sequoia-900 truncate max-w-[120px]">
                      {earner.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#C8A84E' }}>
                    {formatCurrency(earner.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Growth Metrics */}
        <div className="card-sequoia p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-sequoia-900">Growth Metrics</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-brand-neutral-500 mb-1">This Month&apos;s Deals</p>
              <p className="text-2xl font-extrabold text-sequoia-900">{insights.currentMonthDeals}</p>
            </div>
            <div>
              <p className="text-xs text-brand-neutral-500 mb-1">Last Month&apos;s Deals</p>
              <p className="text-2xl font-extrabold text-brand-neutral-400">{insights.lastMonthDeals}</p>
            </div>
            <div className="h-px bg-brand-neutral-100" />
            <div className="flex items-center gap-2">
              {insights.currentMonthDeals >= insights.lastMonthDeals ? (
                <>
                  <BarChart3 size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600">
                    {insights.lastMonthDeals > 0
                      ? `+${(((insights.currentMonthDeals - insights.lastMonthDeals) / insights.lastMonthDeals) * 100).toFixed(0)}% growth`
                      : insights.currentMonthDeals > 0
                        ? 'New deals this month!'
                        : 'No deals yet this month'}
                  </span>
                </>
              ) : (
                <>
                  <BarChart3 size={14} className="text-red-500" />
                  <span className="text-xs font-semibold text-red-600">
                    {(((insights.lastMonthDeals - insights.currentMonthDeals) / insights.lastMonthDeals) * 100).toFixed(0)}% decrease
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="card-sequoia p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={16} className="text-amber-500" />
            <h3 className="text-sm font-bold text-sequoia-900">Action Items</h3>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/commissions"
              className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-brand-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <DollarSign size={14} style={{ color: '#C8A84E' }} />
                <span className="text-sm text-sequoia-900">Pending Commissions</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#C8A84E' }}>
                {insights.pendingToApprove}
              </span>
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-brand-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-blue-500" />
                <span className="text-sm text-sequoia-900">Unreviewed Submissions</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{insights.unreviewedSubs}</span>
            </Link>
            <Link
              href="/admin/consultants"
              className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-brand-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={14} className="text-amber-500" />
                <span className="text-sm text-sequoia-900">Incomplete Onboarding</span>
              </div>
              <span className="text-sm font-bold text-amber-600">{insights.incompleteOnboarding}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Quick Actions Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setDraftModalOpen(true)}
          className="group rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md hover:border-sequoia-300 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-box-sequoia w-9 h-9">
              <MessageSquare size={16} />
            </div>
            <h3 className="text-sm font-bold text-sequoia-900">Draft Agent Communication</h3>
          </div>
          <p className="text-xs text-gray-400">Compose a message for your agents</p>
        </button>

        <button
          type="button"
          onClick={handleExportRevenue}
          disabled={exportingRevenue}
          className="group rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md hover:border-sequoia-300 transition-all text-left cursor-pointer disabled:opacity-60"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-box-gold w-9 h-9">
              <Download size={16} />
            </div>
            <h3 className="text-sm font-bold text-sequoia-900">
              {exportingRevenue ? 'Exporting...' : 'Export Revenue Report'}
            </h3>
          </div>
          <p className="text-xs text-gray-400">Download commissions data as CSV</p>
        </button>

        <button
          type="button"
          onClick={handleExportRoster}
          disabled={exportingRoster}
          className="group rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md hover:border-sequoia-300 transition-all text-left cursor-pointer disabled:opacity-60"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-box-sequoia w-9 h-9">
              <Users size={16} />
            </div>
            <h3 className="text-sm font-bold text-sequoia-900">
              {exportingRoster ? 'Exporting...' : 'Export Agent Roster'}
            </h3>
          </div>
          <p className="text-xs text-gray-400">Download consultant list as CSV</p>
        </button>
      </div>

      {/* ── Draft Communication Modal ── */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDraftModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-neutral-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} style={{ color: '#C8A84E' }} />
                <h3 className="text-lg font-bold text-sequoia-900">Draft Communication</h3>
              </div>
              <button
                type="button"
                onClick={() => setDraftModalOpen(false)}
                className="p-1.5 rounded-md text-brand-neutral-400 hover:text-brand-neutral-600 hover:bg-brand-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="draft-subject" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  id="draft-subject"
                  type="text"
                  placeholder="Message subject..."
                  className="w-full rounded-lg border border-brand-neutral-200 px-4 py-2.5 text-sm text-sequoia-900 placeholder:text-brand-neutral-400 focus:outline-none focus:ring-2 focus:ring-sequoia-500/30 focus:border-sequoia-500"
                />
              </div>
              <div>
                <label htmlFor="draft-body" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  id="draft-body"
                  value={draftMessage}
                  onChange={e => setDraftMessage(e.target.value)}
                  placeholder="Write your message to agents..."
                  rows={8}
                  className="w-full rounded-lg border border-brand-neutral-200 px-4 py-2.5 text-sm text-sequoia-900 placeholder:text-brand-neutral-400 focus:outline-none focus:ring-2 focus:ring-sequoia-500/30 focus:border-sequoia-500 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDraftModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-brand-neutral-500 hover:text-brand-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftModalOpen(false)
                    setDraftMessage('')
                  }}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--sequoia-700, #2d5a3a)' }}
                >
                  <div className="flex items-center gap-2">
                    <Send size={14} />
                    Save Draft
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
