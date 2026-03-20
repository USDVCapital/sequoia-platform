'use client'

import { useState } from 'react'
import {
  Trophy,
  Medal,
  TrendingUp,
  Users,
  Star,
  ChevronUp,
  BarChart2,
  Award,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type MetricTab = 'Funded Volume' | 'Wellness Enrollees'
type PeriodTab = 'Monthly' | 'All Time'
type Tier = 'Associate' | 'Active' | 'Senior' | 'Managing Director'

interface Consultant {
  id: number
  name: string
  tier: Tier
  fundedVolumeMonthly: number
  fundedVolumeAllTime: number
  wellnessMonthly: number
  wellnessAllTime: number
  isCurrentUser?: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const CONSULTANTS: Consultant[] = [
  { id: 1, name: 'Marcus Rivera', tier: 'Managing Director', fundedVolumeMonthly: 4_820_000, fundedVolumeAllTime: 22_400_000, wellnessMonthly: 48, wellnessAllTime: 312 },
  { id: 2, name: 'Priya Nair', tier: 'Managing Director', fundedVolumeMonthly: 3_950_000, fundedVolumeAllTime: 19_100_000, wellnessMonthly: 41, wellnessAllTime: 284 },
  { id: 3, name: 'James Caldwell', tier: 'Senior', fundedVolumeMonthly: 2_780_000, fundedVolumeAllTime: 11_600_000, wellnessMonthly: 37, wellnessAllTime: 198 },
  { id: 4, name: 'Sarah Chen', tier: 'Senior', fundedVolumeMonthly: 2_210_000, fundedVolumeAllTime: 9_800_000, wellnessMonthly: 30, wellnessAllTime: 175 },
  { id: 5, name: 'Todd Billings', tier: 'Active', fundedVolumeMonthly: 1_650_000, fundedVolumeAllTime: 4_250_000, wellnessMonthly: 22, wellnessAllTime: 88, isCurrentUser: true },
  { id: 6, name: 'Denise Okafor', tier: 'Active', fundedVolumeMonthly: 1_420_000, fundedVolumeAllTime: 3_910_000, wellnessMonthly: 19, wellnessAllTime: 74 },
  { id: 7, name: 'Kevin Torres', tier: 'Active', fundedVolumeMonthly: 1_080_000, fundedVolumeAllTime: 2_700_000, wellnessMonthly: 17, wellnessAllTime: 61 },
  { id: 8, name: 'Amara Williams', tier: 'Associate', fundedVolumeMonthly: 720_000, fundedVolumeAllTime: 1_200_000, wellnessMonthly: 13, wellnessAllTime: 42 },
  { id: 9, name: 'Ryan Park', tier: 'Associate', fundedVolumeMonthly: 490_000, fundedVolumeAllTime: 920_000, wellnessMonthly: 9, wellnessAllTime: 31 },
  { id: 10, name: 'Lisa Fontaine', tier: 'Associate', fundedVolumeMonthly: 310_000, fundedVolumeAllTime: 580_000, wellnessMonthly: 6, wellnessAllTime: 18 },
]

// ── Config ────────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<Tier, { bg: string; text: string; border: string }> = {
  'Managing Director': { bg: 'bg-gold-100', text: 'text-gold-800', border: 'border-gold-300' },
  Senior: { bg: 'bg-sequoia-100', text: 'text-sequoia-800', border: 'border-sequoia-300' },
  Active: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Associate: { bg: 'bg-[var(--neutral-100)]', text: 'text-[var(--neutral-600)]', border: 'border-[var(--neutral-200)]' },
}

const MEDAL_CONFIG: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-gradient-to-br from-gold-400 to-gold-600', text: 'text-white', label: 'Gold' },
  2: { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', text: 'text-white', label: 'Silver' },
  3: { bg: 'bg-gradient-to-br from-amber-600 to-amber-700', text: 'text-white', label: 'Bronze' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function getMetric(c: Consultant, metric: MetricTab, period: PeriodTab) {
  if (metric === 'Funded Volume') {
    return period === 'Monthly' ? c.fundedVolumeMonthly : c.fundedVolumeAllTime
  }
  return period === 'Monthly' ? c.wellnessMonthly : c.wellnessAllTime
}

function formatMetric(value: number, metric: MetricTab) {
  if (metric === 'Funded Volume') return formatCurrency(value)
  return `${value} enrolled`
}

function getSortedRankings(metric: MetricTab, period: PeriodTab) {
  return [...CONSULTANTS].sort((a, b) => getMetric(b, metric, period) - getMetric(a, metric, period))
}

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [metricTab, setMetricTab] = useState<MetricTab>('Funded Volume')
  const [periodTab, setPeriodTab] = useState<PeriodTab>('Monthly')

  const sorted = getSortedRankings(metricTab, periodTab)
  const currentUser = sorted.find((c) => c.isCurrentUser)
  const userRank = currentUser ? sorted.indexOf(currentUser) + 1 : null
  const userMetric = currentUser ? getMetric(currentUser, metricTab, periodTab) : 0

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-sequoia-dark">
        <div className="container-brand py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sequoia-300 text-sm font-medium uppercase tracking-widest mb-1">
                Consultant Portal
              </p>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy size={28} className="text-gold-400" />
                Leaderboard
              </h1>
              <p className="text-sequoia-200 mt-1 text-sm">
                See where you stand among Sequoia's top performers.
              </p>
            </div>

            {/* Period toggle */}
            <div className="flex items-center self-start sm:self-auto bg-white/10 rounded-full p-1">
              {(['Monthly', 'All Time'] as PeriodTab[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodTab(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    periodTab === p
                      ? 'bg-white text-sequoia-900'
                      : 'text-sequoia-200 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-brand py-8">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ── Main leaderboard ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Metric tabs */}
            <div className="flex gap-2 mb-6">
              {(['Funded Volume', 'Wellness Enrollees'] as MetricTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMetricTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer border ${
                    metricTab === tab
                      ? 'bg-sequoia-800 text-white border-sequoia-800 shadow-sm'
                      : 'bg-white text-[var(--neutral-600)] border-[var(--neutral-200)] hover:border-sequoia-300 hover:text-sequoia-700'
                  }`}
                >
                  {tab === 'Funded Volume' ? <BarChart2 size={15} /> : <Users size={15} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Rankings list */}
            <div className="space-y-2">
              {sorted.map((consultant, index) => {
                const rank = index + 1
                const medal = MEDAL_CONFIG[rank]
                const tierConfig = TIER_CONFIG[consultant.tier]
                const isUser = consultant.isCurrentUser
                const metricValue = getMetric(consultant, metricTab, periodTab)

                return (
                  <div
                    key={consultant.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 ${
                      isUser
                        ? 'border-gold-400 bg-gold-50 shadow-[var(--shadow-gold)]'
                        : 'border-[var(--neutral-200)] bg-white hover:border-sequoia-300 hover:shadow-[var(--shadow-sm)]'
                    }`}
                  >
                    {/* Rank badge */}
                    <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full font-black text-sm">
                      {medal ? (
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center ${medal.bg}`}>
                          {rank === 1 ? (
                            <Trophy size={16} className="text-white" />
                          ) : (
                            <Medal size={15} className="text-white" />
                          )}
                        </span>
                      ) : (
                        <span className="text-[var(--neutral-500)] font-bold text-base w-9 text-center">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isUser
                          ? 'bg-gradient-gold text-sequoia-950'
                          : rank <= 3
                          ? 'bg-sequoia-800 text-white'
                          : 'bg-[var(--neutral-100)] text-[var(--neutral-600)]'
                      }`}
                    >
                      {getInitials(consultant.name)}
                    </div>

                    {/* Name + tier */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-bold text-sm truncate ${
                            isUser ? 'text-gold-800' : 'text-[var(--sequoia-900)]'
                          }`}
                        >
                          {consultant.name}
                          {isUser && (
                            <span className="ml-2 text-xs text-gold-700 font-semibold">(You)</span>
                          )}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${tierConfig.bg} ${tierConfig.text} ${tierConfig.border}`}
                        >
                          {consultant.tier}
                        </span>
                      </div>
                    </div>

                    {/* Metric */}
                    <div className="text-right shrink-0">
                      <p
                        className={`font-black text-base ${
                          rank === 1
                            ? 'text-gold-700'
                            : isUser
                            ? 'text-gold-800'
                            : 'text-[var(--sequoia-900)]'
                        }`}
                      >
                        {formatMetric(metricValue, metricTab)}
                      </p>
                      {rank === 1 && (
                        <p className="text-gold-700 text-xs font-semibold flex items-center justify-end gap-0.5">
                          <Star size={10} className="fill-gold-700 text-gold-700" /> Top Performer
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Your Ranking Sidebar ───────────────────────────────────── */}
          <div className="xl:w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="card-sequoia p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-gold-600" />
                  <h3 className="font-bold text-[var(--sequoia-900)]">Your Ranking</h3>
                </div>

                {/* User rank display */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center text-2xl font-black text-sequoia-950 mx-auto mb-3">
                    {userRank ? `#${userRank}` : '—'}
                  </div>
                  <p className="font-bold text-[var(--sequoia-900)] text-lg">Todd Billings</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                    Active
                  </span>
                </div>

                <div className="divider-sequoia my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--neutral-500)]">{metricTab}</span>
                    <span className="font-bold text-[var(--sequoia-900)]">
                      {formatMetric(userMetric, metricTab)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--neutral-500)]">Period</span>
                    <span className="font-semibold text-[var(--sequoia-900)]">{periodTab}</span>
                  </div>
                  {userRank && userRank > 1 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--neutral-500)]">To move up</span>
                      <span className="font-semibold text-sequoia-700 flex items-center gap-1">
                        <ChevronUp size={13} />
                        {formatMetric(
                          getMetric(sorted[userRank - 2], metricTab, periodTab) - userMetric + 1,
                          metricTab,
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tier progress card */}
              <div className="card-sequoia p-5 bg-gradient-card">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-sequoia-700" />
                  <h4 className="font-bold text-[var(--sequoia-900)] text-sm">Tier Progress</h4>
                </div>
                <p className="text-xs text-[var(--neutral-500)] mb-3">
                  You are <strong className="text-sequoia-800">Active</strong>. Reach Senior by funding $500K more this month.
                </p>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-[var(--neutral-100)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sequoia-700 to-sequoia-500"
                    style={{ width: '68%' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-[var(--neutral-400)]">Active</span>
                  <span className="text-xs text-[var(--neutral-400)]">Senior</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
