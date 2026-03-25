-- Update EHMP/Wellness product config to match 2026 EHMP Big Leap compensation
-- Agent: $20 PEPM (5-199), $22 PEPM (200-499), $24 PEPM (500+)
-- Overrides: L1 $1/employee, L2 $1/employee, L3 $0.50/employee
-- These are flat dollar amounts, not percentages.
-- We store them as rates relative to a $25 PEPM base for the waterfall engine.

UPDATE public.product_configs
SET
  name = 'Wellness / EHMP',
  description = 'Employee Health Management Program — $20-$24 PEPM. Overrides: L1 $1, L2 $1, L3 $0.50 per employee.',
  agent_rate_referral = 0.80,  -- $20 of $25 base = 80%
  agent_rate_personal = 0.80,
  same_rate = TRUE,
  overhead_rate = 0,
  bonus_pool_rate = 0,
  override_l1 = 0.04,    -- $1 of $25 base = 4%
  override_l2 = 0.04,    -- $1 of $25 base = 4%
  override_l3 = 0.02,    -- $0.50 of $25 base = 2%
  override_l4 = 0,
  override_l5 = 0,
  override_l6 = 0,
  default_commission_rate = 1.0,
  agent_label_referral = '$20 PEPM',
  agent_label_personal = '$20 PEPM'
WHERE category_key = 'wellness';
