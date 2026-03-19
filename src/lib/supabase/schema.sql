-- ============================================================
-- Sequoia Enterprise Solutions — Supabase Database Schema
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() if not already available
-- (Available by default in Supabase via the uuid-ossp/pg extensions)

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.consultants (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                   TEXT NOT NULL UNIQUE,
  full_name               TEXT NOT NULL,
  phone                   TEXT,
  consultant_id           TEXT NOT NULL UNIQUE,
  tier                    TEXT NOT NULL CHECK (tier IN ('associate', 'active', 'senior', 'managing_director')),
  professional_background TEXT,
  bio                     TEXT,
  avatar_url              TEXT,
  referral_code           TEXT UNIQUE,
  referred_by             TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id    UUID NOT NULL REFERENCES public.consultants (id) ON DELETE CASCADE,
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
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wellness_enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id   UUID NOT NULL REFERENCES public.consultants (id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.community_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      UUID NOT NULL REFERENCES public.consultants (id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN ('win', 'question', 'tip', 'announcement')),
  likes_count    INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  is_pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  role       TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_leads_consultant_id       ON public.leads (consultant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status              ON public.leads (status);

CREATE INDEX IF NOT EXISTS idx_wellness_consultant_id    ON public.wellness_enrollments (consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_status           ON public.wellness_enrollments (status);

CREATE INDEX IF NOT EXISTS idx_community_author_id       ON public.community_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_community_category        ON public.community_posts (category);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamp)
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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.consultants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;

-- ---- consultants ----
-- A consultant can read and update their own row.
-- Supabase Auth uid() must match the consultant's id.

CREATE POLICY "Consultants can view own profile"
  ON public.consultants FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Consultants can update own profile"
  ON public.consultants FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---- leads ----
-- A consultant can read/insert/update their own leads.

CREATE POLICY "Consultants can view own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = consultant_id);

CREATE POLICY "Consultants can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Consultants can update own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- ---- wellness_enrollments ----
-- A consultant can read/insert/update their own wellness enrollments.

CREATE POLICY "Consultants can view own wellness enrollments"
  ON public.wellness_enrollments FOR SELECT
  USING (auth.uid() = consultant_id);

CREATE POLICY "Consultants can insert own wellness enrollments"
  ON public.wellness_enrollments FOR INSERT
  WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Consultants can update own wellness enrollments"
  ON public.wellness_enrollments FOR UPDATE
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- ---- community_posts ----
-- All authenticated consultants can read posts.
-- Authors can insert and update their own posts.

CREATE POLICY "Authenticated users can view community posts"
  ON public.community_posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Consultants can insert own community posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Consultants can update own community posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- ---- contact_submissions ----
-- Public insert (unauthenticated visitors can submit the contact form).
-- Only service-role / admin can read submissions.

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (TRUE);
