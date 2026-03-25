import type { WaterfallPayout } from './supabase/types'

// ============================================================
// Sequoia Commission Waterfall Engine
// ============================================================
// Calculates the full payout cascade for a funded deal.
// Product-specific rates per SPM Comp Plan 7.5.
// ============================================================

// ── Product Configuration ─────────────────────────────────────

export interface ProductConfig {
  overheadRate: number
  referralAgentRate: number
  personalAgentRate: number
  overrideRates: number[]       // L1-L6
  bonusPoolRate: number
  defaultCommissionRate: number  // multiplied by funded_amount for default gross commission
  agentLabels: [string, string] // [referral label, personal label]
  sameRate: boolean             // true = no referral/personal distinction
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  // Real Estate Lending — 30% overhead + 23%/46% agent + 22% overrides + 2% bonus = 100%
  real_estate_lending: {
    overheadRate: 0.30,
    referralAgentRate: 0.23,
    personalAgentRate: 0.46,
    overrideRates: [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
    bonusPoolRate: 0.02,
    defaultCommissionRate: 0.02, // 2 points typical
    agentLabels: ['Referral (23%)', 'Personal (46%)'],
    sameRate: false,
  },
  // Business Funding — Agent gets 5-8% of funded amount; overrides are % of agent commission
  business_funding: {
    overheadRate: 0.30,
    referralAgentRate: 0.23,
    personalAgentRate: 0.46,
    overrideRates: [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
    bonusPoolRate: 0.02,
    defaultCommissionRate: 0.06, // ~6% of funded amount
    agentLabels: ['Referral (23%)', 'Personal (46%)'],
    sameRate: false,
  },
  // Property Restoration — Agent gets 8% of project value; overrides are % of project value
  property_restoration: {
    overheadRate: 0,
    referralAgentRate: 0.08,
    personalAgentRate: 0.08,
    overrideRates: [0.01, 0.0075, 0.005, 0.005, 0.0025, 0.0025],
    bonusPoolRate: 0,
    defaultCommissionRate: 1.0, // gross commission = project value
    agentLabels: ['Agent (8%)', 'Agent (8%)'],
    sameRate: true,
  },
  // Clean Energy — Agent gets flat fee; overrides are % of agent commission
  clean_energy: {
    overheadRate: 0.30,
    referralAgentRate: 0.23,
    personalAgentRate: 0.46,
    overrideRates: [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
    bonusPoolRate: 0.02,
    defaultCommissionRate: 0.05,
    agentLabels: ['Referral (23%)', 'Personal (46%)'],
    sameRate: false,
  },
  // Wellness / EHMP — PEPM-based; overrides are flat per-employee ($1/$1/$0.50 for 3 levels)
  wellness: {
    overheadRate: 0,
    referralAgentRate: 0.80,  // Agent gets majority of PEPM
    personalAgentRate: 0.80,
    overrideRates: [0.04, 0.04, 0.02, 0, 0, 0], // ~$1/$1/$0.50 on $25 avg PEPM base
    bonusPoolRate: 0,
    defaultCommissionRate: 1.0,
    agentLabels: ['PEPM', 'PEPM'],
    sameRate: true,
  },
}

export function getProductConfig(productCategory: string): ProductConfig {
  return PRODUCT_CONFIGS[productCategory] ?? PRODUCT_CONFIGS.real_estate_lending
}

// Legacy exports for backwards compatibility
export const SEQUOIA_OVERHEAD_RATE = 0.30
export const REFERRAL_AGENT_RATE = 0.23
export const PERSONAL_AGENT_RATE = 0.46
export const BONUS_POOL_RATE = 0.02
export const LOAN_OVERRIDE_RATES = [0.10, 0.05, 0.03, 0.015, 0.015, 0.01]
export const OVERRIDE_RATES_BY_PRODUCT: Record<string, number[]> = {
  real_estate_lending: [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  business_funding:    [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  clean_energy:        [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  property_restoration: [0.01, 0.0075, 0.005, 0.005, 0.0025, 0.0025],
}

// ── Upline Node (from Supabase RPC or mock) ─────────────────

export interface UplineEntry {
  level: number
  consultantId: string
  fullName: string
  rank: string
  isActive: boolean
}

// ── Waterfall Input ─────────────────────────────────────────

export interface WaterfallInput {
  dealId: string
  grossCommission: number
  productCategory: string
  agentId: string
  agentName: string
  agentRank: string
  isCertified: boolean  // true = personal rate, false = referral rate
  upline: UplineEntry[] // ordered L1 (immediate sponsor) → L6
}

// ── Calculate Waterfall ─────────────────────────────────────

export function calculateWaterfall(input: WaterfallInput): WaterfallPayout[] {
  const payouts: WaterfallPayout[] = []
  const gc = input.grossCommission
  const config = getProductConfig(input.productCategory)

  // 1. Sequoia overhead
  if (config.overheadRate > 0) {
    const overheadAmount = roundCents(gc * config.overheadRate)
    payouts.push({
      waterfallLevel: -1,
      consultantId: null,
      consultantName: 'Sequoia Enterprise Solutions',
      consultantRank: null,
      role: 'sequoia_overhead',
      rate: config.overheadRate,
      amount: overheadAmount,
      isRecaptured: false,
    })
  }

  // 2. Agent commission (product-specific rates)
  const agentRate = input.isCertified ? config.personalAgentRate : config.referralAgentRate
  const agentAmount = roundCents(gc * agentRate)
  payouts.push({
    waterfallLevel: 0,
    consultantId: input.agentId,
    consultantName: input.agentName,
    consultantRank: input.agentRank,
    role: input.isCertified ? 'agent_personal' : 'agent_referral',
    rate: agentRate,
    amount: agentAmount,
    isRecaptured: false,
  })

  // 3. Override levels (1-6)
  for (let i = 0; i < 6; i++) {
    const level = i + 1
    const rate = config.overrideRates[i] ?? 0
    if (rate === 0) continue // skip empty levels (e.g., wellness only has 3 levels)

    const amount = roundCents(gc * rate)
    const uplineNode = input.upline.find(u => u.level === level)

    if (uplineNode) {
      payouts.push({
        waterfallLevel: level,
        consultantId: uplineNode.consultantId,
        consultantName: uplineNode.fullName,
        consultantRank: uplineNode.rank,
        role: `override_level_${level}`,
        rate,
        amount,
        isRecaptured: false,
      })
    } else {
      // Empty level — recaptured by Sequoia
      payouts.push({
        waterfallLevel: level,
        consultantId: null,
        consultantName: 'Sequoia (Recaptured)',
        consultantRank: null,
        role: `recaptured_level_${level}`,
        rate,
        amount,
        isRecaptured: true,
      })
    }
  }

  // 4. Bonus pool
  if (config.bonusPoolRate > 0) {
    const bonusPoolAmount = roundCents(gc * config.bonusPoolRate)
    payouts.push({
      waterfallLevel: 99,
      consultantId: null,
      consultantName: 'Bonus Pool',
      consultantRank: null,
      role: 'bonus_pool',
      rate: config.bonusPoolRate,
      amount: bonusPoolAmount,
      isRecaptured: false,
    })
  }

  return payouts
}

// ── Summary helpers ─────────────────────────────────────────

export function getWaterfallSummary(payouts: WaterfallPayout[]) {
  const sequoiaOverhead = payouts.find(p => p.role === 'sequoia_overhead')?.amount ?? 0
  const agentPayout = payouts.find(p => p.role.startsWith('agent_'))?.amount ?? 0
  const overrideTotal = payouts
    .filter(p => p.role.startsWith('override_level_'))
    .reduce((sum, p) => sum + p.amount, 0)
  const recapturedTotal = payouts
    .filter(p => p.isRecaptured)
    .reduce((sum, p) => sum + p.amount, 0)
  const bonusPool = payouts.find(p => p.role === 'bonus_pool')?.amount ?? 0

  return {
    grossCommission: sequoiaOverhead + agentPayout + overrideTotal + recapturedTotal + bonusPool,
    sequoiaOverhead,
    agentPayout,
    overrideTotal,
    recapturedTotal,
    bonusPool,
    totalSequoia: sequoiaOverhead + recapturedTotal, // total going to Sequoia
  }
}

// ── Utility ─────────────────────────────────────────────────

function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100
}
