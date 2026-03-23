import { describe, it, expect } from 'vitest'
import {
  calculateLoanCommission,
  calculateWellnessCommission,
  calculateEHMPProjection,
  getLoanCommissionRate,
  getWellnessPayoutRate,
  getNextTier,
  getTierProgress,
  formatCurrency,
  getCurrentPayoutPeriod,
  TIER_REQUIREMENTS,
} from '../commission-engine'

describe('Commission Engine', () => {
  describe('getLoanCommissionRate', () => {
    it('returns correct rate for each tier', () => {
      expect(getLoanCommissionRate('associate')).toBe(0.005)
      expect(getLoanCommissionRate('active')).toBe(0.0075)
      expect(getLoanCommissionRate('senior')).toBe(0.01)
      expect(getLoanCommissionRate('managing_director')).toBe(0.0125)
    })
  })

  describe('getWellnessPayoutRate', () => {
    it('returns correct rate for each tier', () => {
      expect(getWellnessPayoutRate('associate')).toBe(0.60)
      expect(getWellnessPayoutRate('active')).toBe(0.70)
      expect(getWellnessPayoutRate('senior')).toBe(0.80)
      expect(getWellnessPayoutRate('managing_director')).toBe(0.90)
    })
  })

  describe('calculateLoanCommission', () => {
    it('calculates commission for associate tier', () => {
      const result = calculateLoanCommission({
        fundedAmount: 425000,
        consultantTier: 'associate',
        clientName: 'Test Client',
        fundingType: 'Fix & Flip',
      })
      expect(result.amount).toBe(2125)
      expect(result.rate).toBe(0.005)
      expect(result.commissionType).toBe('loan_referral')
      expect(result.sourceLabel).toBe('Test Client — Fix & Flip')
    })

    it('calculates commission for active tier', () => {
      const result = calculateLoanCommission({
        fundedAmount: 425000,
        consultantTier: 'active',
        clientName: 'Sunrise Capital',
        fundingType: 'Fix & Flip',
      })
      expect(result.amount).toBe(3187.5)
      expect(result.ratePercentage).toBe('0.75%')
    })

    it('calculates commission for managing director', () => {
      const result = calculateLoanCommission({
        fundedAmount: 1000000,
        consultantTier: 'managing_director',
        clientName: 'Big Deal LLC',
        fundingType: 'Commercial RE',
      })
      expect(result.amount).toBe(12500)
      expect(result.ratePercentage).toBe('1.25%')
    })

    it('handles zero funded amount', () => {
      const result = calculateLoanCommission({
        fundedAmount: 0,
        consultantTier: 'active',
        clientName: 'No Money Corp',
        fundingType: 'SBA',
      })
      expect(result.amount).toBe(0)
    })
  })

  describe('calculateWellnessCommission', () => {
    it('calculates wellness residual for active tier', () => {
      const result = calculateWellnessCommission({
        employeeCount: 47,
        monthlyRatePerEmployee: 18,
        consultantTier: 'active',
        companyName: 'Green Valley Dental',
      })
      // 47 * 18 = 846 gross, 846 * 0.70 = 592.20
      expect(result.grossAmount).toBe(846)
      expect(result.amount).toBe(592.2)
      expect(result.payoutPercentage).toBe('70%')
      expect(result.sourceLabel).toBe('Green Valley Dental (47 employees)')
    })

    it('calculates wellness residual for managing director', () => {
      const result = calculateWellnessCommission({
        employeeCount: 100,
        monthlyRatePerEmployee: 15,
        consultantTier: 'managing_director',
        companyName: 'Big Corp',
      })
      // 100 * 15 = 1500 gross, 1500 * 0.90 = 1350
      expect(result.grossAmount).toBe(1500)
      expect(result.amount).toBe(1350)
    })
  })

  describe('calculateEHMPProjection', () => {
    it('projects monthly and annual income', () => {
      const result = calculateEHMPProjection({
        employeeCount: 50,
        monthlyRate: 15,
        consultantTier: 'active',
      })
      // 50 * 15 = 750 gross, 750 * 0.70 = 525/month, 6300/year
      expect(result.monthlyGross).toBe(750)
      expect(result.monthlyNet).toBe(525)
      expect(result.annualNet).toBe(6300)
    })

    it('handles minimum rate ($12)', () => {
      const result = calculateEHMPProjection({
        employeeCount: 10,
        monthlyRate: 12,
        consultantTier: 'associate',
      })
      // 10 * 12 = 120, 120 * 0.60 = 72/month
      expect(result.monthlyNet).toBe(72)
      expect(result.annualNet).toBe(864)
    })

    it('handles maximum rate ($18)', () => {
      const result = calculateEHMPProjection({
        employeeCount: 500,
        monthlyRate: 18,
        consultantTier: 'managing_director',
      })
      // 500 * 18 = 9000, 9000 * 0.90 = 8100/month
      expect(result.monthlyNet).toBe(8100)
      expect(result.annualNet).toBe(97200)
    })
  })

  describe('Tier Progression', () => {
    it('returns correct next tier', () => {
      expect(getNextTier('associate')?.tier).toBe('active')
      expect(getNextTier('active')?.tier).toBe('senior')
      expect(getNextTier('senior')?.tier).toBe('managing_director')
      expect(getNextTier('managing_director')).toBeNull()
    })

    it('calculates tier progress correctly', () => {
      // Associate halfway to Active ($250K of $500K, 5 of 10 enrollees)
      const progress = getTierProgress('associate', 250000, 5)
      expect(progress.percentage).toBe(50)
      expect(progress.nextTier?.tier).toBe('active')
    })

    it('returns 100% for max tier', () => {
      const progress = getTierProgress('managing_director', 50000000, 1000)
      expect(progress.percentage).toBe(100)
      expect(progress.nextTier).toBeNull()
    })

    it('caps progress at 100% even when exceeding requirements', () => {
      const progress = getTierProgress('associate', 1000000, 100)
      expect(progress.percentage).toBe(100)
    })

    it('has correct tier requirements', () => {
      expect(TIER_REQUIREMENTS).toHaveLength(4)
      expect(TIER_REQUIREMENTS[0].tier).toBe('associate')
      expect(TIER_REQUIREMENTS[3].tier).toBe('managing_director')
      expect(TIER_REQUIREMENTS[3].minFundedVolume).toBe(15_000_000)
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
