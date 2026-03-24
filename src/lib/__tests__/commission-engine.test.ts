import { describe, it, expect } from 'vitest'
import {
  MEMBERSHIP_FEE,
  MEMBERSHIP_OVERRIDES,
  calculateMembershipOverrides,
  getEHMPRate,
  calculateEHMPIncome,
  REAL_ESTATE_OVERRIDES,
  BUSINESS_FUNDING_OVERRIDES,
  PROPERTY_RESTORATION_AGENT_RATE,
  PROPERTY_RESTORATION_OVERRIDES,
  RANK_REQUIREMENTS,
  getRankLabel,
  getNextRank,
  getRankProgress,
  qualifiesForRank,
  calculateTotalIncome,
  formatCurrency,
  getCurrentPayoutPeriod,
  TIER_REQUIREMENTS,
  getNextTier,
  getTierProgress,
} from '../commission-engine'

describe('Commission Engine — SPM Comp Plan 7.5 (Complete)', () => {

  describe('Membership Fee Override', () => {
    it('has correct $29.99 membership fee', () => {
      expect(MEMBERSHIP_FEE).toBe(29.99)
    })

    it('has correct 6-level override rates', () => {
      expect(MEMBERSHIP_OVERRIDES[0].rate).toBe(0.20) // L1: 20%
      expect(MEMBERSHIP_OVERRIDES[1].rate).toBe(0.10) // L2: 10%
      expect(MEMBERSHIP_OVERRIDES[2].rate).toBe(0.05) // L3: 5%
      expect(MEMBERSHIP_OVERRIDES[3].rate).toBe(0.05) // L4: 5%
      expect(MEMBERSHIP_OVERRIDES[4].rate).toBe(0.05) // L5: 5%
      expect(MEMBERSHIP_OVERRIDES[5].rate).toBe(0.05) // L6: 5%
    })

    it('calculates L1 override at $5.99 per active LC', () => {
      expect(MEMBERSHIP_OVERRIDES[0].amount).toBeCloseTo(5.99, 1)
    })

    it('calculates total membership overrides correctly', () => {
      const result = calculateMembershipOverrides([3, 8, 15, 20, 10, 5])
      // L1: 3 * $5.99 = $17.97
      // L2: 8 * $2.99 = $23.92
      // L3: 15 * $1.50 = $22.50 (approx)
      // etc.
      expect(result.byLevel).toHaveLength(6)
      expect(result.totalMonthly).toBeGreaterThan(0)
      expect(result.byLevel[0].monthlyAmount).toBeCloseTo(17.97, 1)
    })
  })

  describe('EHMP / Wellness', () => {
    it('returns $20 PEPM for 5-199 employees', () => {
      expect(getEHMPRate(5)).toBe(20)
      expect(getEHMPRate(100)).toBe(20)
      expect(getEHMPRate(199)).toBe(20)
    })

    it('returns $22 PEPM for 200-499 employees', () => {
      expect(getEHMPRate(200)).toBe(22)
      expect(getEHMPRate(499)).toBe(22)
    })

    it('returns $24 PEPM for 500+ employees', () => {
      expect(getEHMPRate(500)).toBe(24)
      expect(getEHMPRate(1000)).toBe(24)
    })

    it('calculates EHMP income with team overrides', () => {
      const result = calculateEHMPIncome({
        personalEmployers: 2,
        avgEmployeesPerEmployer: 50,
        l1Employers: 5,
        l2Employers: 10,
        l3Employers: 8,
      })
      // Personal: 2 * 50 = 100 employees * $20 = $2,000/month
      expect(result.personalMonthly).toBe(2000)
      // L1 override: 5 * 50 * $1.00 = $250
      expect(result.l1Override).toBe(250)
      // L2 override: 10 * 50 * $1.00 = $500
      expect(result.l2Override).toBe(500)
      // L3 override: 8 * 50 * $0.50 = $200
      expect(result.l3Override).toBe(200)
      expect(result.totalMonthly).toBe(2950)
    })
  })

  describe('Real Estate Loan Overrides', () => {
    it('has correct 6-level override rates (10/5/3/1.5/1.5/1%)', () => {
      expect(REAL_ESTATE_OVERRIDES[0].rate).toBe(0.10)
      expect(REAL_ESTATE_OVERRIDES[1].rate).toBe(0.05)
      expect(REAL_ESTATE_OVERRIDES[2].rate).toBe(0.03)
      expect(REAL_ESTATE_OVERRIDES[3].rate).toBe(0.015)
      expect(REAL_ESTATE_OVERRIDES[4].rate).toBe(0.015)
      expect(REAL_ESTATE_OVERRIDES[5].rate).toBe(0.01)
    })
  })

  describe('Business Funding Overrides', () => {
    it('has correct 6-level override rates (10/5/3/1.5/1.5/1%)', () => {
      expect(BUSINESS_FUNDING_OVERRIDES).toHaveLength(6)
      expect(BUSINESS_FUNDING_OVERRIDES[0].rate).toBe(0.10)
      expect(BUSINESS_FUNDING_OVERRIDES[5].rate).toBe(0.01)
    })
  })

  describe('Property Restoration', () => {
    it('has correct 8% agent rate', () => {
      expect(PROPERTY_RESTORATION_AGENT_RATE).toBe(0.08)
    })

    it('has correct 6-level override rates', () => {
      expect(PROPERTY_RESTORATION_OVERRIDES[0].rate).toBe(0.01)
      expect(PROPERTY_RESTORATION_OVERRIDES[1].rate).toBe(0.0075)
      expect(PROPERTY_RESTORATION_OVERRIDES[2].rate).toBe(0.005)
      expect(PROPERTY_RESTORATION_OVERRIDES[3].rate).toBe(0.005)
      expect(PROPERTY_RESTORATION_OVERRIDES[4].rate).toBe(0.0025)
      expect(PROPERTY_RESTORATION_OVERRIDES[5].rate).toBe(0.0025)
    })
  })

  describe('Rank System', () => {
    it('has 6 ranks from LC 1 to Executive Director', () => {
      expect(RANK_REQUIREMENTS).toHaveLength(6)
      expect(RANK_REQUIREMENTS[0].rank).toBe('lc_1')
      expect(RANK_REQUIREMENTS[5].rank).toBe('executive_director')
    })

    it('has correct advancement bonuses', () => {
      expect(RANK_REQUIREMENTS[1].advancementBonus).toBe(25)   // LC 2
      expect(RANK_REQUIREMENTS[2].advancementBonus).toBe(50)   // LC 3
      expect(RANK_REQUIREMENTS[3].advancementBonus).toBe(100)  // Senior LC
      expect(RANK_REQUIREMENTS[4].advancementBonus).toBe(250)  // MD
      expect(RANK_REQUIREMENTS[5].advancementBonus).toBe(500)  // ED
    })

    it('returns correct rank labels', () => {
      expect(getRankLabel('lc_1')).toBe('LC 1')
      expect(getRankLabel('senior_lc')).toBe('Senior LC')
      expect(getRankLabel('executive_director')).toBe('Executive Director')
    })

    it('qualifies for correct rank based on activity', () => {
      expect(qualifiesForRank(0, 0)).toBe('lc_1')
      expect(qualifiesForRank(2, 0)).toBe('lc_2')
      expect(qualifiesForRank(4, 0)).toBe('lc_3')
      expect(qualifiesForRank(6, 50)).toBe('senior_lc')
      expect(qualifiesForRank(10, 200)).toBe('managing_director')
      expect(qualifiesForRank(15, 500)).toBe('executive_director')
    })

    it('returns next rank correctly', () => {
      expect(getNextRank('lc_1')?.rank).toBe('lc_2')
      expect(getNextRank('managing_director')?.rank).toBe('executive_director')
      expect(getNextRank('executive_director')).toBeNull()
    })

    it('calculates rank progress', () => {
      // LC 1 with 1 recruit → 75% to LC 2 (need 2 recruits: 50% + 0 team req: 100%) / 2
      const progress = getRankProgress('lc_1', 1, 0)
      expect(progress.percentage).toBe(75)
      expect(progress.nextRank?.rank).toBe('lc_2')
    })
  })

  describe('Income Calculator (all streams)', () => {
    it('calculates combined income', () => {
      const result = calculateTotalIncome({
        activeLCsByLevel: [3, 8, 15, 20, 10, 5],
        ehmpPersonalEmployers: 2,
        ehmpAvgEmployees: 50,
        ehmpL1Employers: 5,
        ehmpL2Employers: 10,
        ehmpL3Employers: 8,
        loansPersonalPerMonth: 1,
        avgLoanSize: 500000,
        loansTeamPerMonth: 5,
        bfDealsPersonalPerMonth: 1,
        avgDealSize: 100000,
        bfDealsTeamPerMonth: 3,
      })
      expect(result.totalMonthly).toBeGreaterThan(0)
      expect(result.totalAnnual).toBe(result.totalMonthly * 12)
      expect(result.membershipOverrides).toBeGreaterThan(0)
      expect(result.ehmpPersonal).toBe(2000) // 100 employees * $20
      expect(result.qualifiedRank).toBe('lc_2') // 3 personal recruits (L1), need 4 for LC 3
    })
  })

  describe('Legacy Tier Progression', () => {
    it('returns correct next tier', () => {
      expect(getNextTier('associate')?.tier).toBe('active')
      expect(getNextTier('managing_director')).toBeNull()
    })

    it('calculates tier progress correctly', () => {
      const progress = getTierProgress('associate', 250000, 5)
      expect(progress.percentage).toBe(50)
    })

    it('has 4 tiers', () => {
      expect(TIER_REQUIREMENTS).toHaveLength(4)
    })
  })

  describe('Formatting', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(1000000)).toBe('$1,000,000')
      expect(formatCurrency(0)).toBe('$0')
    })
  })

  describe('Payout Periods', () => {
    it('returns a valid payout period', () => {
      const period = getCurrentPayoutPeriod()
      expect(period.start).toBeInstanceOf(Date)
      expect(period.end).toBeInstanceOf(Date)
      expect(period.end.getTime()).toBeGreaterThan(period.start.getTime())
    })
  })
})
