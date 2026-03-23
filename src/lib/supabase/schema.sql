-- ============================================================
-- Sequoia Enterprise Solutions — Supabase Database Schema
-- ============================================================
-- Run this in the Supabase SQL Editor to set up all tables.
-- Requires: pgcrypto (default in Supabase)
-- ============================================================

-- ============================================================
-- ENUMS (used as CHECK constraints for portability)
-- ============================================================

-- Consultant tiers
-- 'associate' | 'active' | 'senior' | 'managing_director'

-- Lead/Deal statuses
-- 'application' | 'in_review' | 'approved' | 'funded' | 'declined'

-- Wellness enrollment statuses
-- 'pending' | 'active' | 'cancelled'

-- Commission statuses
-- 'pending' | 'paid' | 'cancelled'

-- Community post categories
-- 'win' | 'question' | 'tip' | 'announcement'

-- Notification types
-- 'deal_update' | 'new_content' | 'community' | 'training' | 'system'

-- ============================================================
-- TABLES
-- ============================================================

-- ── Consultants ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.consultants (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email                   TEXT NOT NULL UNIQUE,
  full_name               TEXT NOT NULL,
  phone                   TEXT,
  consultant_id           TEXT NOT NULL UNIQUE,
  tier                    TEXT NOT NULL DEFAULT 'associate'
                            CHECK (tier IN ('associate', 'active', 'senior', 'managing_director')),
  role                    TEXT NOT NULL DEFAULT 'consultant'
                            CHECK (role IN ('consultant', 'admin')),
  professional_background TEXT,
  bio                     TEXT,
  avatar_url              TEXT,
  avatar_color            TEXT,
  referral_code           TEXT UNIQUE,
  referred_by             TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  onboarding_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Leads (Deals / Pipeline) ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id    UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  client_name      TEXT NOT NULL,
  client_email     TEXT NOT NULL,
  client_phone     TEXT,
  business_name    TEXT,
  funding_type     TEXT NOT NULL,
  estimated_amount TEXT,
  description      TEXT,
  status           TEXT NOT NULL DEFAULT 'application'
                     CHECK (status IN ('application', 'in_review', 'approved', 'funded', 'declined')),
  funded_amount    NUMERIC,
  advisor          TEXT,
  next_step        TEXT,
  estimated_close  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Wellness Enrollments ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.wellness_enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  contact_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  employee_count  INTEGER NOT NULL,
  monthly_rate    NUMERIC NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'active', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Commissions ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  source_type     TEXT NOT NULL CHECK (source_type IN ('lead', 'wellness')),
  source_id       UUID,
  source_label    TEXT,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('loan_referral', 'wellness_commission', 'wellness_residual')),
  amount          NUMERIC NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'cancelled')),
  period_start    DATE,
  period_end      DATE,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Payout Periods ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payout_periods (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open', 'closed', 'paid')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Training Videos ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.training_videos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id     TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN ('Agent Training', 'Commercial Lending', 'Wellness/EHMP', 'Success Stories')),
  duration       TEXT NOT NULL,
  thumbnail_url  TEXT,
  is_new         BOOLEAN NOT NULL DEFAULT FALSE,
  is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Training Progress ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.training_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  video_id        UUID NOT NULL REFERENCES public.training_videos(id) ON DELETE CASCADE,
  progress        INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consultant_id, video_id)
);

-- ── Leaderboard Stats ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leaderboard_stats (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id     UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  period            TEXT NOT NULL CHECK (period IN ('monthly', 'all_time')),
  funded_volume     NUMERIC NOT NULL DEFAULT 0,
  wellness_enrollees INTEGER NOT NULL DEFAULT 0,
  rank              INTEGER,
  calculated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consultant_id, period)
);

-- ── Notifications ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('deal_update', 'new_content', 'community', 'training', 'system')),
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  link            TEXT,
  read            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Materials / Flyers ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.materials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  filename      TEXT,
  category      TEXT NOT NULL CHECK (category IN ('Real Estate', 'EHMP / Wellness', 'Business Funding', 'Clean Energy')),
  description   TEXT,
  is_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Community Posts ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN ('win', 'question', 'tip', 'announcement')),
  likes_count    INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  is_pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Community Comments ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Community Likes ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_likes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, consultant_id)
);

-- ── Consultant Goals ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.consultant_goals (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id        UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  year                 INTEGER NOT NULL,
  monthly_income_goal  NUMERIC NOT NULL DEFAULT 5000,
  ehmp_enrollees_goal  INTEGER NOT NULL DEFAULT 100,
  deals_to_close_goal  INTEGER NOT NULL DEFAULT 12,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consultant_id, year)
);

-- ── Onboarding Checklist ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.onboarding_checklist (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  step_id         TEXT NOT NULL,
  label           TEXT NOT NULL,
  description     TEXT,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  UNIQUE(consultant_id, step_id)
);

-- ── Consultant Badges ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.consultant_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  badge_type  TEXT NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(consultant_id, badge_type)
);

-- ── Contact Submissions ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  role       TEXT NOT NULL,
  message    TEXT NOT NULL,
  metadata   JSONB,
  reviewed   BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.consultants(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_consultants_auth_user_id   ON public.consultants(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_consultants_role           ON public.consultants(role);
CREATE INDEX IF NOT EXISTS idx_consultants_tier           ON public.consultants(tier);

CREATE INDEX IF NOT EXISTS idx_leads_consultant_id        ON public.leads(consultant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status               ON public.leads(status);

CREATE INDEX IF NOT EXISTS idx_wellness_consultant_id     ON public.wellness_enrollments(consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_status            ON public.wellness_enrollments(status);

CREATE INDEX IF NOT EXISTS idx_commissions_consultant_id  ON public.commissions(consultant_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status         ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_source         ON public.commissions(source_type, source_id);

CREATE INDEX IF NOT EXISTS idx_training_progress_consultant ON public.training_progress(consultant_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_video      ON public.training_progress(video_id);

CREATE INDEX IF NOT EXISTS idx_leaderboard_consultant_id  ON public.leaderboard_stats(consultant_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period         ON public.leaderboard_stats(period);

CREATE INDEX IF NOT EXISTS idx_notifications_consultant   ON public.notifications(consultant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read         ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_community_author_id        ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_category         ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_comments_post    ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post       ON public.community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_consultant ON public.community_likes(consultant_id);

CREATE INDEX IF NOT EXISTS idx_goals_consultant           ON public.consultant_goals(consultant_id);
CREATE INDEX IF NOT EXISTS idx_checklist_consultant        ON public.onboarding_checklist(consultant_id);
CREATE INDEX IF NOT EXISTS idx_badges_consultant          ON public.consultant_badges(consultant_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_role    ON public.contact_submissions(role);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reviewed ON public.contact_submissions(reviewed);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_wellness_updated_at
  BEFORE UPDATE ON public.wellness_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_goals_updated_at
  BEFORE UPDATE ON public.consultant_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_training_progress_updated_at
  BEFORE UPDATE ON public.training_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- COMMISSION CALCULATION FUNCTIONS
-- ============================================================

-- Tier-based commission rates for loan referrals
CREATE OR REPLACE FUNCTION public.get_loan_commission_rate(consultant_tier TEXT)
RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  RETURN CASE consultant_tier
    WHEN 'associate' THEN 0.005
    WHEN 'active' THEN 0.0075
    WHEN 'senior' THEN 0.01
    WHEN 'managing_director' THEN 0.0125
    ELSE 0.005
  END;
END;
$$;

-- Tier-based payout percentage for wellness residuals
CREATE OR REPLACE FUNCTION public.get_wellness_payout_rate(consultant_tier TEXT)
RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  RETURN CASE consultant_tier
    WHEN 'associate' THEN 0.60
    WHEN 'active' THEN 0.70
    WHEN 'senior' THEN 0.80
    WHEN 'managing_director' THEN 0.90
    ELSE 0.60
  END;
END;
$$;

-- Calculate commission when a deal is funded
CREATE OR REPLACE FUNCTION public.calculate_loan_commission()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_tier TEXT;
  v_rate NUMERIC;
  v_amount NUMERIC;
BEGIN
  -- Only trigger when status changes to 'funded'
  IF NEW.status = 'funded' AND (OLD.status IS DISTINCT FROM 'funded') AND NEW.funded_amount IS NOT NULL THEN
    SELECT tier INTO v_tier FROM public.consultants WHERE id = NEW.consultant_id;
    v_rate := public.get_loan_commission_rate(v_tier);
    v_amount := NEW.funded_amount * v_rate;

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label, commission_type, amount, status)
    VALUES (NEW.consultant_id, 'lead', NEW.id, NEW.client_name || ' — ' || NEW.funding_type, 'loan_referral', v_amount, 'pending');
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_lead_funded_commission
  AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.calculate_loan_commission();

-- Generate monthly wellness commissions for all active enrollments
CREATE OR REPLACE FUNCTION public.generate_monthly_wellness_commissions(p_period_start DATE, p_period_end DATE)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
  v_count INTEGER := 0;
  v_enrollment RECORD;
  v_tier TEXT;
  v_rate NUMERIC;
  v_amount NUMERIC;
BEGIN
  FOR v_enrollment IN
    SELECT we.*, c.tier
    FROM public.wellness_enrollments we
    JOIN public.consultants c ON c.id = we.consultant_id
    WHERE we.status = 'active'
  LOOP
    v_rate := public.get_wellness_payout_rate(v_enrollment.tier);
    v_amount := v_enrollment.monthly_rate * v_enrollment.employee_count * v_rate;

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label, commission_type, amount, status, period_start, period_end)
    VALUES (v_enrollment.consultant_id, 'wellness', v_enrollment.id,
            v_enrollment.company_name || ' (' || v_enrollment.employee_count || ' employees)',
            'wellness_residual', v_amount, 'pending', p_period_start, p_period_end);

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- ============================================================
-- ANALYTICS VIEWS
-- ============================================================

CREATE OR REPLACE VIEW public.v_monthly_funded_volume AS
SELECT
  DATE_TRUNC('month', c.created_at) AS month,
  SUM(c.amount) AS total_amount,
  COUNT(*) AS commission_count
FROM public.commissions c
WHERE c.commission_type = 'loan_referral'
GROUP BY DATE_TRUNC('month', c.created_at)
ORDER BY month;

CREATE OR REPLACE VIEW public.v_consultant_growth AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS new_consultants,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS total_consultants
FROM public.consultants
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

CREATE OR REPLACE VIEW public.v_enrollment_trend AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(employee_count) AS new_enrollees,
  COUNT(*) AS new_companies
FROM public.wellness_enrollments
WHERE status = 'active'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

CREATE OR REPLACE VIEW public.v_conversion_funnel AS
SELECT
  status,
  COUNT(*) AS deal_count,
  COALESCE(SUM(funded_amount), 0) AS total_amount
FROM public.leads
GROUP BY status
ORDER BY
  CASE status
    WHEN 'application' THEN 1
    WHEN 'in_review' THEN 2
    WHEN 'approved' THEN 3
    WHEN 'funded' THEN 4
    WHEN 'declined' THEN 5
  END;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.consultants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_periods       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_videos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_stats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_goals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_badges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;

-- ── Helper: Check if current user is admin ──────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.consultants
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- ── Helper: Get consultant ID for current auth user ─────────

CREATE OR REPLACE FUNCTION public.get_consultant_id()
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (
    SELECT id FROM public.consultants
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$;

-- ── consultants ─────────────────────────────────────────────

CREATE POLICY "Consultants can view own profile"
  ON public.consultants FOR SELECT
  USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Consultants can update own profile"
  ON public.consultants FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Admins can manage all consultants"
  ON public.consultants FOR ALL
  USING (public.is_admin());

-- ── leads ───────────────────────────────────────────────────

CREATE POLICY "Consultants can view own leads"
  ON public.leads FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Consultants can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own leads"
  ON public.leads FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Admins can manage all leads"
  ON public.leads FOR ALL
  USING (public.is_admin());

-- ── wellness_enrollments ────────────────────────────────────

CREATE POLICY "Consultants can view own enrollments"
  ON public.wellness_enrollments FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Consultants can insert own enrollments"
  ON public.wellness_enrollments FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own enrollments"
  ON public.wellness_enrollments FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Admins can manage all enrollments"
  ON public.wellness_enrollments FOR ALL
  USING (public.is_admin());

-- ── commissions ─────────────────────────────────────────────

CREATE POLICY "Consultants can view own commissions"
  ON public.commissions FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Admins can manage all commissions"
  ON public.commissions FOR ALL
  USING (public.is_admin());

-- ── payout_periods ──────────────────────────────────────────

CREATE POLICY "Authenticated can view payout periods"
  ON public.payout_periods FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage payout periods"
  ON public.payout_periods FOR ALL
  USING (public.is_admin());

-- ── training_videos ─────────────────────────────────────────

CREATE POLICY "Authenticated can view training videos"
  ON public.training_videos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage training videos"
  ON public.training_videos FOR ALL
  USING (public.is_admin());

-- ── training_progress ───────────────────────────────────────

CREATE POLICY "Consultants can view own progress"
  ON public.training_progress FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Consultants can insert own progress"
  ON public.training_progress FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own progress"
  ON public.training_progress FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

-- ── leaderboard_stats ───────────────────────────────────────

CREATE POLICY "Authenticated can view leaderboard"
  ON public.leaderboard_stats FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage leaderboard"
  ON public.leaderboard_stats FOR ALL
  USING (public.is_admin());

-- ── notifications ───────────────────────────────────────────

CREATE POLICY "Consultants can view own notifications"
  ON public.notifications FOR SELECT
  USING (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own notifications"
  ON public.notifications FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin());

-- ── materials ───────────────────────────────────────────────

CREATE POLICY "Authenticated can view materials"
  ON public.materials FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage materials"
  ON public.materials FOR ALL
  USING (public.is_admin());

-- ── community_posts ─────────────────────────────────────────

CREATE POLICY "Authenticated can view community posts"
  ON public.community_posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Consultants can insert own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (author_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own posts"
  ON public.community_posts FOR UPDATE
  USING (author_id = public.get_consultant_id())
  WITH CHECK (author_id = public.get_consultant_id());

CREATE POLICY "Admins can manage all posts"
  ON public.community_posts FOR ALL
  USING (public.is_admin());

-- ── community_comments ──────────────────────────────────────

CREATE POLICY "Authenticated can view comments"
  ON public.community_comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Consultants can insert own comments"
  ON public.community_comments FOR INSERT
  WITH CHECK (author_id = public.get_consultant_id());

CREATE POLICY "Consultants can delete own comments"
  ON public.community_comments FOR DELETE
  USING (author_id = public.get_consultant_id());

-- ── community_likes ─────────────────────────────────────────

CREATE POLICY "Authenticated can view likes"
  ON public.community_likes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Consultants can insert own likes"
  ON public.community_likes FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can delete own likes"
  ON public.community_likes FOR DELETE
  USING (consultant_id = public.get_consultant_id());

-- ── consultant_goals ────────────────────────────────────────

CREATE POLICY "Consultants can view own goals"
  ON public.consultant_goals FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Consultants can insert own goals"
  ON public.consultant_goals FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own goals"
  ON public.consultant_goals FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

-- ── onboarding_checklist ────────────────────────────────────

CREATE POLICY "Consultants can view own checklist"
  ON public.onboarding_checklist FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Consultants can insert own checklist"
  ON public.onboarding_checklist FOR INSERT
  WITH CHECK (consultant_id = public.get_consultant_id());

CREATE POLICY "Consultants can update own checklist"
  ON public.onboarding_checklist FOR UPDATE
  USING (consultant_id = public.get_consultant_id())
  WITH CHECK (consultant_id = public.get_consultant_id());

-- ── consultant_badges ───────────────────────────────────────

CREATE POLICY "Consultants can view own badges"
  ON public.consultant_badges FOR SELECT
  USING (consultant_id = public.get_consultant_id() OR public.is_admin());

CREATE POLICY "Admins can manage badges"
  ON public.consultant_badges FOR ALL
  USING (public.is_admin());

-- ── contact_submissions ─────────────────────────────────────

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS (run separately in Supabase Dashboard)
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-docs', 'compliance-docs', false);

-- Storage RLS policies would be:
-- avatars: anyone can read, authenticated users can upload to their own folder
-- compliance-docs: only the uploading consultant and admins can read
