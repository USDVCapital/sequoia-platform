import { describe, it, expect } from 'vitest'
import {
  calculateWaterfall,
  getWaterfallSummary,
  SEQUOIA_OVERHEAD_RATE,
  REFERRAL_AGENT_RATE,
  PERSONAL_AGENT_RATE,
  BONUS_POOL_RATE,
  LOAN_OVERRIDE_RATES,
} from '../waterfall-engine'
import type { WaterfallPayout } from '../supabase/types'

// Helper: build a full 6-level upline
function buildFullUpline() {
  return [
    { level: 1, consultantId: 'sponsor-1', fullName: 'Level 1 Sponsor', rank: 'lc_3', isActive: true },
    { level: 2, consultantId: 'sponsor-2', fullName: 'Level 2 Sponsor', rank: 'senior_lc', isActive: true },
    { level: 3, consultantId: 'sponsor-3', fullName: 'Level 3 Sponsor', rank: 'managing_director', isActive: true },
    { level: 4, consultantId: 'sponsor-4', fullName: 'Level 4 Sponsor', rank: 'lc_2', isActive: true },
    { level: 5, consultantId: 'sponsor-5', fullName: 'Level 5 Sponsor', rank: 'lc_1', isActive: true },
    { level: 6, consultantId: 'sponsor-6', fullName: 'Level 6 Sponsor', rank: 'lc_1', isActive: true },
  ]
}

describe('Waterfall Engine', () => {
  describe('Constants', () => {
    it('rates sum to 100%', () => {
      const overrideTotal = LOAN_OVERRIDE_RATES.reduce((s, r) => s + r, 0)
      const total = SEQUOIA_OVERHEAD_RATE + PERSONAL_AGENT_RATE + overrideTotal + BONUS_POOL_RATE
      expect(total).toBeCloseTo(1.0, 10)
    })

    it('referral rate + overhead + overrides + bonus = 75% (leaving 25% unallocated when referral)', () => {
      const overrideTotal = LOAN_OVERRIDE_RATES.reduce((s, r) => s + r, 0)
      const total = SEQUOIA_OVERHEAD_RATE + REFERRAL_AGENT_RATE + overrideTotal + BONUS_POOL_RATE
      // 30 + 23 + 22 + 2 = 77%, not 100 — the remaining 23% is the difference between referral and personal
      expect(total).toBeCloseTo(0.77, 10)
    })
  })

  describe('Full upline (certified agent, $10,000 commission)', () => {
    const payouts = calculateWaterfall({
      dealId: 'deal-1',
      grossCommission: 10000,
      productCategory: 'real_estate_lending',
      agentId: 'agent-1',
      agentName: 'Brian Smith',
      agentRank: 'lc_2',
      isCertified: true,
      upline: buildFullUpline(),
    })

    it('returns 9 payout rows (Sequoia + agent + 6 overrides + bonus pool)', () => {
      expect(payouts).toHaveLength(9)
    })

    it('Sequoia gets 30% = $3,000', () => {
      const seq = payouts.find(p => p.role === 'sequoia_overhead')!
      expect(seq.amount).toBe(3000)
      expect(seq.rate).toBe(0.30)
    })

    it('Certified agent gets 46% = $4,600', () => {
      const agent = payouts.find(p => p.role === 'agent_personal')!
      expect(agent.amount).toBe(4600)
      expect(agent.consultantId).toBe('agent-1')
    })

    it('L1 override gets 10% = $1,000', () => {
      const l1 = payouts.find(p => p.waterfallLevel === 1)!
      expect(l1.amount).toBe(1000)
      expect(l1.consultantName).toBe('Level 1 Sponsor')
      expect(l1.isRecaptured).toBe(false)
    })

    it('L2 override gets 5% = $500', () => {
      const l2 = payouts.find(p => p.waterfallLevel === 2)!
      expect(l2.amount).toBe(500)
    })

    it('L3 override gets 3% = $300', () => {
      const l3 = payouts.find(p => p.waterfallLevel === 3)!
      expect(l3.amount).toBe(300)
    })

    it('L4 override gets 1.5% = $150', () => {
      const l4 = payouts.find(p => p.waterfallLevel === 4)!
      expect(l4.amount).toBe(150)
    })

    it('L5 override gets 1.5% = $150', () => {
      const l5 = payouts.find(p => p.waterfallLevel === 5)!
      expect(l5.amount).toBe(150)
    })

    it('L6 override gets 1% = $100', () => {
      const l6 = payouts.find(p => p.waterfallLevel === 6)!
      expect(l6.amount).toBe(100)
    })

    it('Bonus pool gets 2% = $200', () => {
      const bp = payouts.find(p => p.role === 'bonus_pool')!
      expect(bp.amount).toBe(200)
    })

    it('All amounts sum to $10,000 (100%)', () => {
      const total = payouts.reduce((sum, p) => sum + p.amount, 0)
      expect(total).toBe(10000)
    })

    it('No recaptured amounts when all levels filled', () => {
      const recaptured = payouts.filter(p => p.isRecaptured)
      expect(recaptured).toHaveLength(0)
    })
  })

  describe('Referral agent (uncertified, $20,000 commission)', () => {
    const payouts = calculateWaterfall({
      dealId: 'deal-2',
      grossCommission: 20000,
      productCategory: 'real_estate_lending',
      agentId: 'agent-2',
      agentName: 'New Agent',
      agentRank: 'lc_1',
      isCertified: false,
      upline: buildFullUpline(),
    })

    it('Agent gets 23% = $4,600', () => {
      const agent = payouts.find(p => p.role === 'agent_referral')!
      expect(agent.amount).toBe(4600)
    })

    it('Sequoia gets 30% = $6,000', () => {
      const seq = payouts.find(p => p.role === 'sequoia_overhead')!
      expect(seq.amount).toBe(6000)
    })

    it('All amounts sum to $15,400 (77% — 23% unallocated difference)', () => {
      // With referral: 30 + 23 + 22 + 2 = 77% allocated
      const total = payouts.reduce((sum, p) => sum + p.amount, 0)
      expect(total).toBe(15400) // 77% of $20,000
    })
  })

  describe('Partial upline (only 3 levels filled)', () => {
    const payouts = calculateWaterfall({
      dealId: 'deal-3',
      grossCommission: 10000,
      productCategory: 'real_estate_lending',
      agentId: 'agent-1',
      agentName: 'Brian Smith',
      agentRank: 'lc_2',
      isCertified: true,
      upline: [
        { level: 1, consultantId: 's1', fullName: 'Sponsor 1', rank: 'lc_3', isActive: true },
        { level: 2, consultantId: 's2', fullName: 'Sponsor 2', rank: 'senior_lc', isActive: true },
        { level: 3, consultantId: 's3', fullName: 'Sponsor 3', rank: 'managing_director', isActive: true },
      ],
    })

    it('Levels 4-6 are recaptured by Sequoia', () => {
      const recaptured = payouts.filter(p => p.isRecaptured)
      expect(recaptured).toHaveLength(3)
      expect(recaptured.map(r => r.waterfallLevel)).toEqual([4, 5, 6])
    })

    it('Recaptured L4 = $150, L5 = $150, L6 = $100', () => {
      const recaptured = payouts.filter(p => p.isRecaptured)
      expect(recaptured[0].amount).toBe(150)
      expect(recaptured[1].amount).toBe(150)
      expect(recaptured[2].amount).toBe(100)
    })

    it('Summary shows total recaptured = $400', () => {
      const summary = getWaterfallSummary(payouts)
      expect(summary.recapturedTotal).toBe(400)
      expect(summary.totalSequoia).toBe(3400) // $3000 overhead + $400 recaptured
    })
  })

  describe('No upline (solo agent)', () => {
    const payouts = calculateWaterfall({
      dealId: 'deal-4',
      grossCommission: 10000,
      productCategory: 'real_estate_lending',
      agentId: 'agent-solo',
      agentName: 'Solo Agent',
      agentRank: 'lc_1',
      isCertified: true,
      upline: [],
    })

    it('All 6 levels are recaptured', () => {
      const recaptured = payouts.filter(p => p.isRecaptured)
      expect(recaptured).toHaveLength(6)
    })

    it('Total recaptured = 22% = $2,200', () => {
      const summary = getWaterfallSummary(payouts)
      expect(summary.recapturedTotal).toBe(2200)
      expect(summary.totalSequoia).toBe(5200) // $3000 + $2200
    })
  })

  describe('Property Restoration (different rates per comp plan)', () => {
    const payouts = calculateWaterfall({
      dealId: 'deal-5',
      grossCommission: 50000, // project value
      productCategory: 'property_restoration',
      agentId: 'agent-pr',
      agentName: 'PR Agent',
      agentRank: 'lc_2',
      isCertified: true,
      upline: buildFullUpline(),
    })

    it('has no overhead row (property restoration has 0% overhead)', () => {
      const overhead = payouts.find(p => p.role === 'sequoia_overhead')
      expect(overhead).toBeUndefined()
    })

    it('Agent gets 8% of project value = $4,000', () => {
      const agent = payouts.find(p => p.role.startsWith('agent_'))!
      expect(agent.amount).toBe(4000)
      expect(agent.rate).toBe(0.08)
    })

    it('L1 override is 1% = $500', () => {
      const l1 = payouts.find(p => p.waterfallLevel === 1)!
      expect(l1.amount).toBe(500)
      expect(l1.rate).toBe(0.01)
    })

    it('L2 override is 0.75% = $375', () => {
      const l2 = payouts.find(p => p.waterfallLevel === 2)!
      expect(l2.amount).toBe(375)
    })

    it('has no bonus pool row', () => {
      const bp = payouts.find(p => p.role === 'bonus_pool')
      expect(bp).toBeUndefined()
    })
  })

  describe('Summary helper', () => {
    it('calculates correct breakdown', () => {
      const payouts = calculateWaterfall({
        dealId: 'deal-6',
        grossCommission: 10000,
        productCategory: 'real_estate_lending',
        agentId: 'a1',
        agentName: 'Agent',
        agentRank: 'lc_2',
        isCertified: true,
        upline: buildFullUpline(),
      })

      const summary = getWaterfallSummary(payouts)
      expect(summary.sequoiaOverhead).toBe(3000)
      expect(summary.agentPayout).toBe(4600)
      expect(summary.overrideTotal).toBe(2200)
      expect(summary.bonusPool).toBe(200)
      expect(summary.recapturedTotal).toBe(0)
      expect(summary.totalSequoia).toBe(3000)
    })
  })
})
