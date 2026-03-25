-- ============================================================
-- Migration 002: Product Commission Configurations
-- ============================================================
-- Stores per-product waterfall rates (agent %, overhead %,
-- override % at each of 6 levels, bonus pool %).
-- Run AFTER migration 001.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,                     -- Display name (e.g., "Real Estate Lending")
  category_key  TEXT NOT NULL UNIQUE,              -- Matches product_category in leads (e.g., "real_estate_lending")
  description   TEXT DEFAULT '',                   -- Short description for admin UI

  -- Agent rates
  agent_rate_referral  NUMERIC NOT NULL DEFAULT 0.23,  -- Referral/uncertified agent rate
  agent_rate_personal  NUMERIC NOT NULL DEFAULT 0.46,  -- Personal/certified agent rate
  same_rate            BOOLEAN NOT NULL DEFAULT FALSE, -- If true, no referral/personal distinction

  -- Overhead & bonus
  overhead_rate        NUMERIC NOT NULL DEFAULT 0.30,
  bonus_pool_rate      NUMERIC NOT NULL DEFAULT 0.02,

  -- 6-level override rates
  override_l1          NUMERIC NOT NULL DEFAULT 0.10,
  override_l2          NUMERIC NOT NULL DEFAULT 0.05,
  override_l3          NUMERIC NOT NULL DEFAULT 0.03,
  override_l4          NUMERIC NOT NULL DEFAULT 0.015,
  override_l5          NUMERIC NOT NULL DEFAULT 0.015,
  override_l6          NUMERIC NOT NULL DEFAULT 0.01,

  -- Default commission calculation
  default_commission_rate  NUMERIC NOT NULL DEFAULT 0.02,  -- Multiplied by funded_amount for default gross commission
  agent_label_referral     TEXT NOT NULL DEFAULT 'Referral',
  agent_label_personal     TEXT NOT NULL DEFAULT 'Personal',

  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_product_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_configs_updated_at ON public.product_configs;
CREATE TRIGGER trg_product_configs_updated_at
  BEFORE UPDATE ON public.product_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_product_configs_updated_at();

-- Enable RLS
ALTER TABLE public.product_configs ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access on product_configs"
  ON public.product_configs
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- Authenticated users can read
CREATE POLICY "Authenticated users can read product_configs"
  ON public.product_configs
  FOR SELECT
  USING (TRUE);

-- ── Seed data: Match SPM Comp Plan 7.5 ─────────────────────

INSERT INTO public.product_configs
  (name, category_key, description, agent_rate_referral, agent_rate_personal, same_rate, overhead_rate, bonus_pool_rate, override_l1, override_l2, override_l3, override_l4, override_l5, override_l6, default_commission_rate, agent_label_referral, agent_label_personal, sort_order)
VALUES
  ('Real Estate Lending', 'real_estate_lending',
   'Bridge, Fix & Flip, DSCR, Commercial, SBA, Construction, Ground-Up loans',
   0.23, 0.46, FALSE, 0.30, 0.02,
   0.10, 0.05, 0.03, 0.015, 0.015, 0.01,
   0.02, 'Referral (23%)', 'Personal (46%)', 1),

  ('Business Funding', 'business_funding',
   'MCA, term loans, lines of credit, equipment financing',
   0.23, 0.46, FALSE, 0.30, 0.02,
   0.10, 0.05, 0.03, 0.015, 0.015, 0.01,
   0.06, 'Referral (23%)', 'Personal (46%)', 2),

  ('Property Restoration', 'property_restoration',
   'Fire, water, mold, storm, and general restoration projects',
   0.08, 0.08, TRUE, 0, 0,
   0.01, 0.0075, 0.005, 0.005, 0.0025, 0.0025,
   1.0, 'Agent (8%)', 'Agent (8%)', 3),

  ('Clean Energy', 'clean_energy',
   'Solar, battery storage, and EV charger installations',
   0.23, 0.46, FALSE, 0.30, 0.02,
   0.10, 0.05, 0.03, 0.015, 0.015, 0.01,
   0.05, 'Referral (23%)', 'Personal (46%)', 4),

  ('Wellness / EHMP', 'wellness',
   'Employee Health Management Program — per-employee-per-month',
   0.80, 0.80, TRUE, 0, 0,
   0.04, 0.04, 0.02, 0, 0, 0,
   1.0, 'PEPM', 'PEPM', 5)

ON CONFLICT (category_key) DO NOTHING;
