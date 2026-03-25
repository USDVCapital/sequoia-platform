-- ============================================================
-- Migration 001: Genealogy Tree + Commission Waterfall
-- ============================================================
-- Adds sponsor_id (genealogy), slug (consultant URLs), rank system,
-- extends leads for dynamic form, extends commissions for waterfall.
-- Run in Supabase SQL Editor after the base schema.
-- ============================================================

-- ── Consultants: Add genealogy + slug + rank ────────────────

ALTER TABLE public.consultants
  ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES public.consultants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS rank TEXT NOT NULL DEFAULT 'lc_1'
    CHECK (rank IN ('lc_1','lc_2','lc_3','senior_lc','managing_director','executive_director'));

CREATE INDEX IF NOT EXISTS idx_consultants_sponsor_id ON public.consultants(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_consultants_slug ON public.consultants(slug);
CREATE INDEX IF NOT EXISTS idx_consultants_rank ON public.consultants(rank);

-- ── Leads: Extend for dynamic application form ──────────────

-- Allow public submissions (no consultant required)
ALTER TABLE public.leads ALTER COLUMN consultant_id DROP NOT NULL;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS product_category TEXT,
  ADD COLUMN IF NOT EXISTS product_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS referral_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_product_category ON public.leads(product_category);
CREATE INDEX IF NOT EXISTS idx_leads_referral_slug ON public.leads(referral_slug);

-- RLS: Allow anonymous inserts for public application form
CREATE POLICY "Public can submit applications"
  ON public.leads FOR INSERT
  WITH CHECK (TRUE);

-- ── Commissions: Extend for waterfall tracking ──────────────

ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS waterfall_level INTEGER,
  ADD COLUMN IF NOT EXISTS override_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS gross_commission NUMERIC,
  ADD COLUMN IF NOT EXISTS sequoia_overhead NUMERIC,
  ADD COLUMN IF NOT EXISTS bonus_pool_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','reviewed','approved','paid'));

CREATE INDEX IF NOT EXISTS idx_commissions_deal_id ON public.commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_waterfall_level ON public.commissions(waterfall_level);
CREATE INDEX IF NOT EXISTS idx_commissions_approval_status ON public.commissions(approval_status);

-- Update commission_type CHECK to include all types
-- (DROP and re-add since ALTER CHECK is not supported)
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_commission_type_check;
ALTER TABLE public.commissions ADD CONSTRAINT commissions_commission_type_check
  CHECK (commission_type IN (
    'loan_referral', 'loan_personal',
    'wellness_commission', 'wellness_residual',
    'property_restoration', 'revenue_share',
    'membership_override', 'business_funding',
    'clean_energy', 'rank_bonus', 'business_services',
    'sequoia_overhead', 'bonus_pool'
  ));

-- Update source_type CHECK
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_source_type_check;
ALTER TABLE public.commissions ADD CONSTRAINT commissions_source_type_check
  CHECK (source_type IN ('lead', 'wellness', 'property_restoration', 'clean_energy', 'business_services', 'membership'));

-- ============================================================
-- RECURSIVE CTE FUNCTIONS FOR GENEALOGY
-- ============================================================

-- Walk UP the sponsor chain (find upline from a given consultant)
CREATE OR REPLACE FUNCTION public.get_upline_chain(
  p_consultant_id UUID,
  p_max_levels INTEGER DEFAULT 6
)
RETURNS TABLE(
  level INTEGER,
  consultant_id UUID,
  full_name TEXT,
  rank TEXT,
  tier TEXT,
  sponsor_id UUID,
  is_active BOOLEAN,
  slug TEXT
)
LANGUAGE sql STABLE AS $$
  WITH RECURSIVE upline AS (
    SELECT
      1 AS lvl,
      c.id,
      c.full_name,
      c.rank,
      c.tier,
      c.sponsor_id,
      c.is_active,
      c.slug
    FROM public.consultants c
    WHERE c.id = (SELECT s.sponsor_id FROM public.consultants s WHERE s.id = p_consultant_id)

    UNION ALL

    SELECT
      u.lvl + 1,
      c.id,
      c.full_name,
      c.rank,
      c.tier,
      c.sponsor_id,
      c.is_active,
      c.slug
    FROM upline u
    JOIN public.consultants c ON c.id = u.sponsor_id
    WHERE u.lvl < p_max_levels
  )
  SELECT lvl, id, full_name, rank, tier, sponsor_id, is_active, slug
  FROM upline
  ORDER BY lvl;
$$;

-- Walk DOWN the sponsor chain (find full downline tree)
CREATE OR REPLACE FUNCTION public.get_downline_tree(
  p_consultant_id UUID,
  p_max_levels INTEGER DEFAULT 6
)
RETURNS TABLE(
  level INTEGER,
  consultant_id UUID,
  full_name TEXT,
  rank TEXT,
  tier TEXT,
  sponsor_id UUID,
  is_active BOOLEAN,
  slug TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE AS $$
  WITH RECURSIVE downline AS (
    SELECT
      1 AS lvl,
      c.id,
      c.full_name,
      c.rank,
      c.tier,
      c.sponsor_id,
      c.is_active,
      c.slug,
      c.email,
      c.phone,
      c.created_at
    FROM public.consultants c
    WHERE c.sponsor_id = p_consultant_id

    UNION ALL

    SELECT
      d.lvl + 1,
      c.id,
      c.full_name,
      c.rank,
      c.tier,
      c.sponsor_id,
      c.is_active,
      c.slug,
      c.email,
      c.phone,
      c.created_at
    FROM downline d
    JOIN public.consultants c ON c.sponsor_id = d.id
    WHERE d.lvl < p_max_levels
  )
  SELECT * FROM downline ORDER BY lvl, full_name;
$$;

-- Get team stats for a consultant (counts by level)
CREATE OR REPLACE FUNCTION public.get_team_stats(p_consultant_id UUID)
RETURNS TABLE(
  total_team INTEGER,
  active_team INTEGER,
  team_by_level JSONB
)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_total INTEGER;
  v_active INTEGER;
  v_by_level JSONB;
BEGIN
  WITH tree AS (
    SELECT * FROM public.get_downline_tree(p_consultant_id, 6)
  )
  SELECT
    COUNT(*)::INTEGER,
    COUNT(*) FILTER (WHERE is_active)::INTEGER,
    jsonb_agg(
      jsonb_build_object('level', level, 'total', cnt, 'active', active_cnt)
      ORDER BY level
    )
  INTO v_total, v_active, v_by_level
  FROM (
    SELECT level, COUNT(*)::INTEGER AS cnt, COUNT(*) FILTER (WHERE is_active)::INTEGER AS active_cnt
    FROM tree
    GROUP BY level
  ) sub;

  RETURN QUERY SELECT COALESCE(v_total, 0), COALESCE(v_active, 0), COALESCE(v_by_level, '[]'::jsonb);
END;
$$;

-- ============================================================
-- COMMISSION WATERFALL FUNCTION
-- ============================================================
-- Given a deal, calculates the full payout cascade.
-- Called from admin UI to preview waterfall before approval.

CREATE OR REPLACE FUNCTION public.calculate_deal_waterfall(
  p_deal_id UUID,
  p_gross_commission NUMERIC
)
RETURNS TABLE(
  waterfall_level INTEGER,
  consultant_id UUID,
  consultant_name TEXT,
  consultant_rank TEXT,
  role TEXT,
  rate NUMERIC,
  amount NUMERIC,
  is_recaptured BOOLEAN
)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_agent_id UUID;
  v_agent_name TEXT;
  v_agent_rank TEXT;
  v_is_certified BOOLEAN;
  v_agent_rate NUMERIC;
  v_sequoia_amount NUMERIC;
  v_agent_amount NUMERIC;
  v_bonus_pool NUMERIC;
  v_override_rates NUMERIC[] := ARRAY[0.10, 0.05, 0.03, 0.015, 0.015, 0.01];
  v_upline RECORD;
  v_level INTEGER;
BEGIN
  -- Get agent info
  SELECT l.consultant_id INTO v_agent_id FROM public.leads l WHERE l.id = p_deal_id;
  SELECT c.full_name, c.rank, c.onboarding_completed
    INTO v_agent_name, v_agent_rank, v_is_certified
    FROM public.consultants c WHERE c.id = v_agent_id;

  -- Calculate splits
  v_agent_rate := CASE WHEN v_is_certified THEN 0.46 ELSE 0.23 END;
  v_sequoia_amount := ROUND(p_gross_commission * 0.30, 2);
  v_agent_amount := ROUND(p_gross_commission * v_agent_rate, 2);
  v_bonus_pool := ROUND(p_gross_commission * 0.02, 2);

  -- Return Sequoia overhead row
  waterfall_level := -1;
  consultant_id := NULL;
  consultant_name := 'Sequoia Enterprise Solutions';
  consultant_rank := NULL;
  role := 'sequoia_overhead';
  rate := 0.30;
  amount := v_sequoia_amount;
  is_recaptured := FALSE;
  RETURN NEXT;

  -- Return agent row
  waterfall_level := 0;
  consultant_id := v_agent_id;
  consultant_name := v_agent_name;
  consultant_rank := v_agent_rank;
  role := CASE WHEN v_is_certified THEN 'agent_personal' ELSE 'agent_referral' END;
  rate := v_agent_rate;
  amount := v_agent_amount;
  is_recaptured := FALSE;
  RETURN NEXT;

  -- Walk upline for override levels 1-6
  v_level := 0;
  FOR v_upline IN
    SELECT u.* FROM public.get_upline_chain(v_agent_id, 6) u
  LOOP
    v_level := v_level + 1;
    waterfall_level := v_level;
    consultant_id := v_upline.consultant_id;
    consultant_name := v_upline.full_name;
    consultant_rank := v_upline.rank;
    role := 'override_level_' || v_level;
    rate := v_override_rates[v_level];
    amount := ROUND(p_gross_commission * v_override_rates[v_level], 2);
    is_recaptured := FALSE;
    RETURN NEXT;
  END LOOP;

  -- Recaptured amounts for empty levels
  FOR i IN (v_level + 1)..6 LOOP
    waterfall_level := i;
    consultant_id := NULL;
    consultant_name := 'Sequoia (Recaptured)';
    consultant_rank := NULL;
    role := 'recaptured_level_' || i;
    rate := v_override_rates[i];
    amount := ROUND(p_gross_commission * v_override_rates[i], 2);
    is_recaptured := TRUE;
    RETURN NEXT;
  END LOOP;

  -- Bonus pool row
  waterfall_level := 99;
  consultant_id := NULL;
  consultant_name := 'Bonus Pool';
  consultant_rank := NULL;
  role := 'bonus_pool';
  rate := 0.02;
  amount := v_bonus_pool;
  is_recaptured := FALSE;
  RETURN NEXT;
END;
$$;
