import type { ConsultantTier, ConsultantRank, CommissionType } from './supabase/types'

// ============================================================
// Sequoia Commission Engine — SPM Comp Plan 7.5 (Complete)
// ============================================================
// 7 Income Streams:
//   1. Membership Fee Override ($29.99/month, 6-level unilevel)
//   2. EHMP / Wellness (PEPM tiered + 3-level override)
//   3. Commercial Real Estate Loans (agent % + 6-level override)
//   4. Business Funding / MCA (agent % + 6-level override)
//   5. Property Restoration & Claims (8% agent + 6-level override)
//   6. Clean Energy / Solar ($500-$2K per install + 6-level override)
//   7. Business Services (residual + 3-level override)
// ============================================================

// ── 1. Membership Fee Override ──────────────────────────────

export const MEMBERSHIP_FEE = 29.99

export const MEMBERSHIP_OVERRIDES = [
  { level: 1, rate: 0.20, amount: +(MEMBERSHIP_FEE * 0.20).toFixed(2) }, // $5.99
  { level: 2, rate: 0.10, amount: +(MEMBERSHIP_FEE * 0.10).toFixed(2) }, // $2.99
  { level: 3, rate: 0.05, amount: +(MEMBERSHIP_FEE * 0.05).toFixed(2) }, // $1.50
  { level: 4, rate: 0.05, amount: +(MEMBERSHIP_FEE * 0.05).toFixed(2) }, // $1.50
  { level: 5, rate: 0.05, amount: +(MEMBERSHIP_FEE * 0.05).toFixed(2) }, // $1.50
  { level: 6, rate: 0.05, amount: +(MEMBERSHIP_FEE * 0.05).toFixed(2) }, // $1.50
]

export function calculateMembershipOverrides(activeLCsByLevel: number[]): {
  byLevel: { level: number; activeLCs: number; monthlyAmount: number }[]
  totalMonthly: number
} {
  const byLevel = MEMBERSHIP_OVERRIDES.map((o, i) => ({
    level: o.level,
    activeLCs: activeLCsByLevel[i] || 0,
    monthlyAmount: +((activeLCsByLevel[i] || 0) * o.amount).toFixed(2),
  }))
  const totalMonthly = +byLevel.reduce((sum, l) => sum + l.monthlyAmount, 0).toFixed(2)
  return { byLevel, totalMonthly }
}

// ── 2. EHMP / Wellness ──────────────────────────────────────

export interface EHMPTier {
  minEmployees: number
  maxEmployees: number | null
  pepm: number
  label: string
}

export const EHMP_PEPM_TIERS: EHMPTier[] = [
  { minEmployees: 5,   maxEmployees: 199,  pepm: 20, label: '5–199 employees' },
  { minEmployees: 200, maxEmployees: 499,  pepm: 22, label: '200–499 employees' },
  { minEmployees: 500, maxEmployees: null,  pepm: 24, label: '500+ employees' },
]

export const EHMP_REVENUE_SHARING = [
  { level: 1, amountPerEmployee: 1.00, minPQLCs: 1 },
  { level: 2, amountPerEmployee: 1.00, minPQLCs: 3 },
  { level: 3, amountPerEmployee: 0.50, minPQLCs: 5 },
]

export function getEHMPRate(totalEmployees: number): number {
  for (let i = EHMP_PEPM_TIERS.length - 1; i >= 0; i--) {
    if (totalEmployees >= EHMP_PEPM_TIERS[i].minEmployees) {
      return EHMP_PEPM_TIERS[i].pepm
    }
  }
  return EHMP_PEPM_TIERS[0].pepm
}

export function getEHMPTier(totalEmployees: number): EHMPTier {
  for (let i = EHMP_PEPM_TIERS.length - 1; i >= 0; i--) {
    if (totalEmployees >= EHMP_PEPM_TIERS[i].minEmployees) {
      return EHMP_PEPM_TIERS[i]
    }
  }
  return EHMP_PEPM_TIERS[0]
}

export function calculateEHMPIncome(input: {
  personalEmployers: number
  avgEmployeesPerEmployer: number
  l1Employers?: number
  l2Employers?: number
  l3Employers?: number
}): {
  personalMonthly: number
  personalAnnual: number
  l1Override: number
  l2Override: number
  l3Override: number
  totalMonthly: number
  totalAnnual: number
  pepmRate: number
} {
  const totalEmployees = input.personalEmployers * input.avgEmployeesPerEmployer
  const pepmRate = getEHMPRate(totalEmployees)
  const personalMonthly = totalEmployees * pepmRate
  const l1Employees = (input.l1Employers || 0) * input.avgEmployeesPerEmployer
  const l2Employees = (input.l2Employers || 0) * input.avgEmployeesPerEmployer
  const l3Employees = (input.l3Employers || 0) * input.avgEmployeesPerEmployer
  const l1Override = l1Employees * 1.00
  const l2Override = l2Employees * 1.00
  const l3Override = l3Employees * 0.50
  const totalMonthly = personalMonthly + l1Override + l2Override + l3Override

  return {
    personalMonthly,
    personalAnnual: personalMonthly * 12,
    l1Override,
    l2Override,
    l3Override,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
    pepmRate,
  }
}

// ── 3. Commercial Real Estate Loans ─────────────────────────

export const REAL_ESTATE_LOAN_PRODUCTS = [
  { type: 'Bridge Loans', agentRate: 0.015 },
  { type: 'Hard Money', agentRate: 0.015 },
  { type: 'Fix & Flip', agentRate: 0.015 },
  { type: 'DSCR', agentRate: 0.01 },
  { type: 'Commercial', agentRate: 0.01 },
  { type: 'SBA', agentRate: 0.01 },
  { type: 'Construction', agentRate: 0.015 },
  { type: 'Ground-Up', agentRate: 0.015 },
]

export const REAL_ESTATE_OVERRIDES = [
  { level: 1, rate: 0.10, minPQLCs: 1 },
  { level: 2, rate: 0.05, minPQLCs: 3 },
  { level: 3, rate: 0.03, minPQLCs: 5 },
  { level: 4, rate: 0.015, minPQLCs: 8 },
  { level: 5, rate: 0.015, minPQLCs: 12 },
  { level: 6, rate: 0.01, minPQLCs: 15 },
]

export function calculateRealEstateCommission(input: {
  loanAmount: number
  agentRate: number
  loansPersonal: number
  loansTeam: number
}): {
  agentCommission: number
  teamOverrideEstimate: number
  totalMonthly: number
} {
  const agentCommission = input.loansPersonal * input.loanAmount * input.agentRate
  // Simplified: assume team overrides at L1 rate on average agent commission
  const avgTeamAgentComm = input.loansTeam * input.loanAmount * 0.0125 // avg rate
  const teamOverrideEstimate = avgTeamAgentComm * 0.10
  return {
    agentCommission,
    teamOverrideEstimate,
    totalMonthly: agentCommission + teamOverrideEstimate,
  }
}

// ── 4. Business Funding / MCA ───────────────────────────────

export const BUSINESS_FUNDING_AGENT_RATE = 0.065 // average 5-8%

export const BUSINESS_FUNDING_OVERRIDES = [
  { level: 1, rate: 0.10, minPQLCs: 1 },
  { level: 2, rate: 0.05, minPQLCs: 3 },
  { level: 3, rate: 0.03, minPQLCs: 5 },
  { level: 4, rate: 0.015, minPQLCs: 8 },
  { level: 5, rate: 0.015, minPQLCs: 12 },
  { level: 6, rate: 0.01, minPQLCs: 15 },
]

export function calculateBusinessFundingCommission(input: {
  dealAmount: number
  dealsPersonal: number
  dealsTeam: number
}): {
  agentCommission: number
  teamOverrideEstimate: number
  totalMonthly: number
} {
  const agentCommission = input.dealsPersonal * input.dealAmount * BUSINESS_FUNDING_AGENT_RATE
  const avgTeamComm = input.dealsTeam * input.dealAmount * BUSINESS_FUNDING_AGENT_RATE
  const teamOverrideEstimate = avgTeamComm * 0.10
  return {
    agentCommission,
    teamOverrideEstimate,
    totalMonthly: agentCommission + teamOverrideEstimate,
  }
}

// ── 5. Property Restoration & Claims ────────────────────────

export const PROPERTY_RESTORATION_AGENT_RATE = 0.08

export const PROPERTY_RESTORATION_OVERRIDES = [
  { level: 1, rate: 0.01 },
  { level: 2, rate: 0.0075 },
  { level: 3, rate: 0.005 },
  { level: 4, rate: 0.005 },
  { level: 5, rate: 0.0025 },
  { level: 6, rate: 0.0025 },
]

// ── 6. Clean Energy / Solar ─────────────────────────────────

export const CLEAN_ENERGY_COMMISSION_RANGE = { min: 500, max: 2000, avg: 1250 }

export const CLEAN_ENERGY_OVERRIDES = [
  { level: 1, rate: 0.10, minPQLCs: 1 },
  { level: 2, rate: 0.05, minPQLCs: 3 },
  { level: 3, rate: 0.03, minPQLCs: 5 },
  { level: 4, rate: 0.015, minPQLCs: 8 },
  { level: 5, rate: 0.015, minPQLCs: 12 },
  { level: 6, rate: 0.01, minPQLCs: 15 },
]

// ── 7. Business Services ────────────────────────────────────
// Same 3-level override as EHMP: $1/$1/$0.50 per account/month

export const BUSINESS_SERVICES_OVERRIDES = [
  { level: 1, amountPerAccount: 1.00 },
  { level: 2, amountPerAccount: 1.00 },
  { level: 3, amountPerAccount: 0.50 },
]

// ── Rank System ─────────────────────────────────────────────

export interface RankRequirements {
  rank: ConsultantRank
  label: string
  personalRecruits: number
  totalTeamActive: number
  advancementBonus: number
}

export const RANK_REQUIREMENTS: RankRequirements[] = [
  { rank: 'lc_1',               label: 'LC 1',                personalRecruits: 0,  totalTeamActive: 0,   advancementBonus: 0 },
  { rank: 'lc_2',               label: 'LC 2',                personalRecruits: 2,  totalTeamActive: 0,   advancementBonus: 25 },
  { rank: 'lc_3',               label: 'LC 3',                personalRecruits: 4,  totalTeamActive: 0,   advancementBonus: 50 },
  { rank: 'senior_lc',          label: 'Senior LC',           personalRecruits: 6,  totalTeamActive: 50,  advancementBonus: 100 },
  { rank: 'managing_director',  label: 'Managing Director',   personalRecruits: 10, totalTeamActive: 200, advancementBonus: 250 },
  { rank: 'executive_director', label: 'Executive Director',  personalRecruits: 15, totalTeamActive: 500, advancementBonus: 500 },
]

export function getRankLabel(rank: ConsultantRank): string {
  return RANK_REQUIREMENTS.find(r => r.rank === rank)?.label ?? rank
}

export function getNextRank(currentRank: ConsultantRank): RankRequirements | null {
  const ranks = RANK_REQUIREMENTS.map(r => r.rank)
  const idx = ranks.indexOf(currentRank)
  if (idx === -1 || idx >= ranks.length - 1) return null
  return RANK_REQUIREMENTS[idx + 1]
}

export function getRankProgress(
  currentRank: ConsultantRank,
  personalRecruits: number,
  totalTeamActive: number,
): { percentage: number; nextRank: RankRequirements | null } {
  const next = getNextRank(currentRank)
  if (!next) return { percentage: 100, nextRank: null }

  const recruitProgress = next.personalRecruits > 0
    ? Math.min(personalRecruits / next.personalRecruits, 1)
    : 1
  const teamProgress = next.totalTeamActive > 0
    ? Math.min(totalTeamActive / next.totalTeamActive, 1)
    : 1
  const percentage = Math.round(((recruitProgress + teamProgress) / 2) * 100)

  return { percentage, nextRank: next }
}

export function qualifiesForRank(
  personalRecruits: number,
  totalTeamActive: number,
): ConsultantRank {
  let qualified: ConsultantRank = 'lc_1'
  for (const req of RANK_REQUIREMENTS) {
    if (personalRecruits >= req.personalRecruits && totalTeamActive >= req.totalTeamActive) {
      qualified = req.rank
    }
  }
  return qualified
}

// ── Tier Progression (legacy, for DB compatibility) ─────────

export interface TierRequirements {
  tier: ConsultantTier
  label: string
  minFundedVolume: number
  minWellnessEnrollees: number
  loanRate: string
  wellnessRate: string
}

export const TIER_REQUIREMENTS: TierRequirements[] = [
  { tier: 'associate',          label: 'Associate',           minFundedVolume: 0,          minWellnessEnrollees: 0,   loanRate: '1–1.5%', wellnessRate: '$20 PEPM' },
  { tier: 'active',             label: 'Active Consultant',   minFundedVolume: 500_000,    minWellnessEnrollees: 10,  loanRate: '1–1.5%', wellnessRate: '$20–$24 PEPM' },
  { tier: 'senior',             label: 'Senior Consultant',   minFundedVolume: 5_000_000,  minWellnessEnrollees: 50,  loanRate: '1–1.5%', wellnessRate: '$20–$24 PEPM' },
  { tier: 'managing_director',  label: 'Managing Director',   minFundedVolume: 15_000_000, minWellnessEnrollees: 200, loanRate: '1–1.5%', wellnessRate: '$20–$24 PEPM' },
]

export function getNextTier(currentTier: ConsultantTier): TierRequirements | null {
  const tiers: ConsultantTier[] = ['associate', 'active', 'senior', 'managing_director']
  const currentIndex = tiers.indexOf(currentTier)
  if (currentIndex === -1 || currentIndex >= tiers.length - 1) return null
  return TIER_REQUIREMENTS[currentIndex + 1]
}

export function getTierProgress(
  currentTier: ConsultantTier,
  fundedVolume: number,
  wellnessEnrollees: number
): { percentage: number; nextTier: TierRequirements | null } {
  const next = getNextTier(currentTier)
  if (!next) return { percentage: 100, nextTier: null }

  const volumeProgress = Math.min(fundedVolume / next.minFundedVolume, 1)
  const enrolleeProgress = Math.min(wellnessEnrollees / next.minWellnessEnrollees, 1)
  const percentage = Math.round(((volumeProgress + enrolleeProgress) / 2) * 100)

  return { percentage, nextTier: next }
}

// ── Income Calculator (all streams combined) ────────────────

export interface IncomeCalculatorInput {
  activeLCsByLevel: number[] // [l1, l2, l3, l4, l5, l6]
  ehmpPersonalEmployers: number
  ehmpAvgEmployees: number
  ehmpL1Employers: number
  ehmpL2Employers: number
  ehmpL3Employers: number
  loansPersonalPerMonth: number
  avgLoanSize: number
  loansTeamPerMonth: number
  bfDealsPersonalPerMonth: number
  avgDealSize: number
  bfDealsTeamPerMonth: number
}

export interface IncomeCalculatorResult {
  membershipOverrides: number
  ehmpPersonal: number
  ehmpOverrides: number
  realEstatePersonal: number
  realEstateOverrides: number
  businessFundingPersonal: number
  businessFundingOverrides: number
  totalMonthly: number
  totalAnnual: number
  qualifiedRank: ConsultantRank
}

export function calculateTotalIncome(input: IncomeCalculatorInput): IncomeCalculatorResult {
  // 1. Membership overrides
  const membership = calculateMembershipOverrides(input.activeLCsByLevel)

  // 2. EHMP
  const ehmp = calculateEHMPIncome({
    personalEmployers: input.ehmpPersonalEmployers,
    avgEmployeesPerEmployer: input.ehmpAvgEmployees,
    l1Employers: input.ehmpL1Employers,
    l2Employers: input.ehmpL2Employers,
    l3Employers: input.ehmpL3Employers,
  })

  // 3. Real estate
  const re = calculateRealEstateCommission({
    loanAmount: input.avgLoanSize,
    agentRate: 0.015,
    loansPersonal: input.loansPersonalPerMonth,
    loansTeam: input.loansTeamPerMonth,
  })

  // 4. Business funding
  const bf = calculateBusinessFundingCommission({
    dealAmount: input.avgDealSize,
    dealsPersonal: input.bfDealsPersonalPerMonth,
    dealsTeam: input.bfDealsTeamPerMonth,
  })

  // Rank qualification
  const personalRecruits = input.activeLCsByLevel[0] || 0
  const totalTeamActive = input.activeLCsByLevel.reduce((a, b) => a + b, 0)
  const qualifiedRank = qualifiesForRank(personalRecruits, totalTeamActive)

  const totalMonthly =
    membership.totalMonthly +
    ehmp.totalMonthly +
    re.totalMonthly +
    bf.totalMonthly

  return {
    membershipOverrides: membership.totalMonthly,
    ehmpPersonal: ehmp.personalMonthly,
    ehmpOverrides: ehmp.l1Override + ehmp.l2Override + ehmp.l3Override,
    realEstatePersonal: re.agentCommission,
    realEstateOverrides: re.teamOverrideEstimate,
    businessFundingPersonal: bf.agentCommission,
    businessFundingOverrides: bf.teamOverrideEstimate,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
    qualifiedRank,
  }
}

// ── Formatting Helpers ──────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ── Payout Period Helpers ───────────────────────────────────

export function getCurrentPayoutPeriod(): { start: Date; end: Date } {
  const now = new Date()
  const day = now.getDate()
  const year = now.getFullYear()
  const month = now.getMonth()

  if (day < 15) {
    return { start: new Date(year, month, 1), end: new Date(year, month, 15) }
  } else {
    return { start: new Date(year, month, 15), end: new Date(year, month + 1, 1) }
  }
}

export function formatPayoutPeriod(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  return `${fmt.format(start)} – ${fmt.format(end)}`
}
