import type { WaterfallPayout } from './supabase/types'

// ============================================================
// Sequoia Commission Waterfall Engine
// ============================================================
// Calculates the full payout cascade for a funded deal.
//
// Loan Waterfall (100% of gross commission):
//   30%  → Sequoia overhead
//   23%  → Agent (referral, uncertified)
//     OR
//   46%  → Agent (personal, certified after 3 deals)
//   22%  → Override levels 1-6 (10/5/3/1.5/1.5/1%)
//    2%  → Bonus pool
//   ────
//  100%
//
// If an override level is empty (no sponsor at that level),
// that level's % goes back to Sequoia as "recaptured."
// ============================================================

// ── Constants ───────────────────────────────────────────────

export const SEQUOIA_OVERHEAD_RATE = 0.30
export const REFERRAL_AGENT_RATE = 0.23
export const PERSONAL_AGENT_RATE = 0.46
export const BONUS_POOL_RATE = 0.02

export const LOAN_OVERRIDE_RATES = [0.10, 0.05, 0.03, 0.015, 0.015, 0.01] // L1-L6, total 22%

// Override rates by product type (loans and business funding use the same 6-level structure)
export const OVERRIDE_RATES_BY_PRODUCT: Record<string, number[]> = {
  real_estate_lending: [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  business_funding:    [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  clean_energy:        [0.10, 0.05, 0.03, 0.015, 0.015, 0.01],
  property_restoration: [0.01, 0.0075, 0.005, 0.005, 0.0025, 0.0025],
  // EHMP uses flat PEPM override ($1/$1/$0.50) — handled separately
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
  isCertified: boolean  // true = 46%, false = 23%
  upline: UplineEntry[] // ordered L1 (immediate sponsor) → L6
}

// ── Calculate Waterfall ─────────────────────────────────────

export function calculateWaterfall(input: WaterfallInput): WaterfallPayout[] {
  const payouts: WaterfallPayout[] = []
  const gc = input.grossCommission

  // 1. Sequoia overhead (30%)
  const overheadAmount = roundCents(gc * SEQUOIA_OVERHEAD_RATE)
  payouts.push({
    waterfallLevel: -1,
    consultantId: null,
    consultantName: 'Sequoia Enterprise Solutions',
    consultantRank: null,
    role: 'sequoia_overhead',
    rate: SEQUOIA_OVERHEAD_RATE,
    amount: overheadAmount,
    isRecaptured: false,
  })

  // 2. Agent commission (23% or 46%)
  const agentRate = input.isCertified ? PERSONAL_AGENT_RATE : REFERRAL_AGENT_RATE
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
  const overrideRates = OVERRIDE_RATES_BY_PRODUCT[input.productCategory] ?? LOAN_OVERRIDE_RATES
  let recapturedTotal = 0

  for (let i = 0; i < 6; i++) {
    const level = i + 1
    const rate = overrideRates[i] ?? 0
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
      recapturedTotal += amount
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

  // 4. Bonus pool (2%)
  const bonusPoolAmount = roundCents(gc * BONUS_POOL_RATE)
  payouts.push({
    waterfallLevel: 99,
    consultantId: null,
    consultantName: 'Bonus Pool',
    consultantRank: null,
    role: 'bonus_pool',
    rate: BONUS_POOL_RATE,
    amount: bonusPoolAmount,
    isRecaptured: false,
  })

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
  const grossCommission = payouts.reduce((sum, p) => sum + p.amount, 0) - recapturedTotal + recapturedTotal // all amounts

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
