import type { ConsultantTier, CommissionType } from './supabase/types'

// ============================================================
// Sequoia Commission Engine
// ============================================================
// Calculates commissions based on consultant tier and deal type.
// Loan referral commissions are one-time on funded amount.
// Wellness residuals are monthly based on active enrollments.
// ============================================================

// ── Commission Rate Tables ──────────────────────────────────

const LOAN_COMMISSION_RATES: Record<ConsultantTier, number> = {
  associate: 0.005,         // 0.50%
  active: 0.0075,           // 0.75%
  senior: 0.01,             // 1.00%
  managing_director: 0.0125, // 1.25%
}

const WELLNESS_PAYOUT_RATES: Record<ConsultantTier, number> = {
  associate: 0.60,          // 60% of monthly rate
  active: 0.70,             // 70%
  senior: 0.80,             // 80%
  managing_director: 0.90,  // 90%
}

// ── Rate Getters ────────────────────────────────────────────

export function getLoanCommissionRate(tier: ConsultantTier): number {
  return LOAN_COMMISSION_RATES[tier] ?? LOAN_COMMISSION_RATES.associate
}

export function getWellnessPayoutRate(tier: ConsultantTier): number {
  return WELLNESS_PAYOUT_RATES[tier] ?? WELLNESS_PAYOUT_RATES.associate
}

// ── Commission Calculators ──────────────────────────────────

export interface LoanCommissionInput {
  fundedAmount: number
  consultantTier: ConsultantTier
  clientName: string
  fundingType: string
}

export interface LoanCommissionResult {
  amount: number
  rate: number
  ratePercentage: string
  commissionType: CommissionType
  sourceLabel: string
}

export function calculateLoanCommission(input: LoanCommissionInput): LoanCommissionResult {
  const rate = getLoanCommissionRate(input.consultantTier)
  const amount = Math.round(input.fundedAmount * rate * 100) / 100

  return {
    amount,
    rate,
    ratePercentage: `${(rate * 100).toFixed(2)}%`,
    commissionType: 'loan_referral',
    sourceLabel: `${input.clientName} — ${input.fundingType}`,
  }
}

export interface WellnessCommissionInput {
  employeeCount: number
  monthlyRatePerEmployee: number
  consultantTier: ConsultantTier
  companyName: string
}

export interface WellnessCommissionResult {
  amount: number
  grossAmount: number
  payoutRate: number
  payoutPercentage: string
  commissionType: CommissionType
  sourceLabel: string
}

export function calculateWellnessCommission(input: WellnessCommissionInput): WellnessCommissionResult {
  const payoutRate = getWellnessPayoutRate(input.consultantTier)
  const grossAmount = input.employeeCount * input.monthlyRatePerEmployee
  const amount = Math.round(grossAmount * payoutRate * 100) / 100

  return {
    amount,
    grossAmount,
    payoutRate,
    payoutPercentage: `${(payoutRate * 100).toFixed(0)}%`,
    commissionType: 'wellness_residual',
    sourceLabel: `${input.companyName} (${input.employeeCount} employees)`,
  }
}

// ── EHMP Calculator (for the portal widget) ─────────────────

export interface EHMPCalculatorInput {
  employeeCount: number
  monthlyRate: number  // $12-$18 per employee
  consultantTier: ConsultantTier
}

export interface EHMPCalculatorResult {
  monthlyGross: number
  monthlyNet: number
  annualNet: number
  payoutRate: number
  rateLabel: string
}

export function calculateEHMPProjection(input: EHMPCalculatorInput): EHMPCalculatorResult {
  const payoutRate = getWellnessPayoutRate(input.consultantTier)
  const monthlyGross = input.employeeCount * input.monthlyRate
  const monthlyNet = Math.round(monthlyGross * payoutRate * 100) / 100
  const annualNet = Math.round(monthlyNet * 12 * 100) / 100

  return {
    monthlyGross,
    monthlyNet,
    annualNet,
    payoutRate,
    rateLabel: `${(payoutRate * 100).toFixed(0)}% (${formatTierName(input.consultantTier)})`,
  }
}

// ── Tier Progression ────────────────────────────────────────

export interface TierRequirements {
  tier: ConsultantTier
  label: string
  minFundedVolume: number
  minWellnessEnrollees: number
  loanRate: string
  wellnessRate: string
}

export const TIER_REQUIREMENTS: TierRequirements[] = [
  {
    tier: 'associate',
    label: 'Associate',
    minFundedVolume: 0,
    minWellnessEnrollees: 0,
    loanRate: '0.50%',
    wellnessRate: '60%',
  },
  {
    tier: 'active',
    label: 'Active Consultant',
    minFundedVolume: 500_000,
    minWellnessEnrollees: 10,
    loanRate: '0.75%',
    wellnessRate: '70%',
  },
  {
    tier: 'senior',
    label: 'Senior Consultant',
    minFundedVolume: 5_000_000,
    minWellnessEnrollees: 50,
    loanRate: '1.00%',
    wellnessRate: '80%',
  },
  {
    tier: 'managing_director',
    label: 'Managing Director',
    minFundedVolume: 15_000_000,
    minWellnessEnrollees: 200,
    loanRate: '1.25%',
    wellnessRate: '90%',
  },
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

function formatTierName(tier: ConsultantTier): string {
  return tier
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ── Payout Period Helpers ───────────────────────────────────

export function getCurrentPayoutPeriod(): { start: Date; end: Date } {
  const now = new Date()
  const day = now.getDate()
  const year = now.getFullYear()
  const month = now.getMonth()

  if (day < 15) {
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month, 15),
    }
  } else {
    return {
      start: new Date(year, month, 15),
      end: new Date(year, month + 1, 1),
    }
  }
}

export function formatPayoutPeriod(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  return `${fmt.format(start)} – ${fmt.format(end)}`
}
