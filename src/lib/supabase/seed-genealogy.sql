-- ============================================================
-- Seed Data: 100-Consultant Genealogy Tree + Test Deals
-- ============================================================
-- Run AFTER the base schema and migration 001.
-- Creates a realistic 6-level MLM tree rooted at Allen Wu.
-- Includes test deals for every product type with waterfall commissions.
-- ============================================================

-- ── Helper: Generate consultant IDs ─────────────────────────
-- We use deterministic UUIDs based on sequence for reproducibility.

-- ── L0: Root (Allen Wu — already exists in seed data) ───────
-- Update Allen Wu to be the root with proper genealogy fields
UPDATE public.consultants
SET sponsor_id = NULL, slug = 'allen-wu', rank = 'executive_director'
WHERE email = 'allen.wu@seqsolution.com';

-- ── L1: 5 Direct Reports ───────────────────────────────────

-- Get Allen Wu's ID for sponsor references
DO $$
DECLARE
  v_root_id UUID;
  v_l1_ids UUID[] := ARRAY[]::UUID[];
  v_l2_ids UUID[] := ARRAY[]::UUID[];
  v_l3_ids UUID[] := ARRAY[]::UUID[];
  v_l4_ids UUID[] := ARRAY[]::UUID[];
  v_l5_ids UUID[] := ARRAY[]::UUID[];
  v_deal_id UUID;
BEGIN
  -- Find root
  SELECT id INTO v_root_id FROM public.consultants WHERE email = 'allen.wu@seqsolution.com';
  IF v_root_id IS NULL THEN
    RAISE EXCEPTION 'Root consultant (allen.wu@seqsolution.com) not found. Run base seed first.';
  END IF;

  -- Update existing consultants with genealogy fields
  UPDATE public.consultants SET sponsor_id = v_root_id, slug = 'todd-billings', rank = 'managing_director'
    WHERE email = 'todd@usdvcapital.com';

  -- ── L1: 5 Direct Reports of Allen Wu ────────────────────
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('marcus.rivera@sequoia-demo.com', 'Marcus Rivera', '(555) 201-0001', 'SEQ-2025-0101', 'senior', 'consultant', v_root_id, 'marcus-rivera', 'senior_lc', TRUE, TRUE),
    ('priya.nair@sequoia-demo.com', 'Priya Nair', '(555) 201-0002', 'SEQ-2025-0102', 'active', 'consultant', v_root_id, 'priya-nair', 'lc_3', TRUE, TRUE),
    ('james.chen@sequoia-demo.com', 'James Chen', '(555) 201-0003', 'SEQ-2025-0103', 'active', 'consultant', v_root_id, 'james-chen', 'lc_3', TRUE, TRUE),
    ('sarah.johnson@sequoia-demo.com', 'Sarah Johnson', '(555) 201-0004', 'SEQ-2025-0104', 'associate', 'consultant', v_root_id, 'sarah-johnson', 'lc_2', FALSE, TRUE),
    ('david.kim@sequoia-demo.com', 'David Kim', '(555) 201-0005', 'SEQ-2025-0105', 'active', 'consultant', v_root_id, 'david-kim', 'lc_3', TRUE, TRUE)
  ON CONFLICT (email) DO NOTHING;

  -- Collect L1 IDs
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l1_ids
  FROM public.consultants WHERE sponsor_id = v_root_id AND consultant_id LIKE 'SEQ-2025-010%';

  -- ── L2: ~18 Members (3-4 under each L1) ──────────────────
  -- Under Marcus Rivera (v_l1_ids[1])
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l2-01@sequoia-demo.com', 'Angela Torres', '(555) 202-0001', 'SEQ-2025-0201', 'active', 'consultant', v_l1_ids[1], 'angela-torres', 'lc_2', TRUE, TRUE),
    ('l2-02@sequoia-demo.com', 'Robert Chang', '(555) 202-0002', 'SEQ-2025-0202', 'associate', 'consultant', v_l1_ids[1], 'robert-chang', 'lc_1', FALSE, FALSE),
    ('l2-03@sequoia-demo.com', 'Maria Gonzalez', '(555) 202-0003', 'SEQ-2025-0203', 'active', 'consultant', v_l1_ids[1], 'maria-gonzalez', 'lc_2', TRUE, TRUE),
    ('l2-04@sequoia-demo.com', 'Brian Park', '(555) 202-0004', 'SEQ-2025-0204', 'associate', 'consultant', v_l1_ids[1], 'brian-park', 'lc_1', TRUE, TRUE);

  -- Under Priya Nair (v_l1_ids[2])
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l2-05@sequoia-demo.com', 'Kevin Patel', '(555) 202-0005', 'SEQ-2025-0205', 'active', 'consultant', v_l1_ids[2], 'kevin-patel', 'lc_2', TRUE, TRUE),
    ('l2-06@sequoia-demo.com', 'Lisa Tran', '(555) 202-0006', 'SEQ-2025-0206', 'associate', 'consultant', v_l1_ids[2], 'lisa-tran', 'lc_1', FALSE, FALSE),
    ('l2-07@sequoia-demo.com', 'Michael Brown', '(555) 202-0007', 'SEQ-2025-0207', 'active', 'consultant', v_l1_ids[2], 'michael-brown', 'lc_2', TRUE, TRUE);

  -- Under James Chen (v_l1_ids[3])
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l2-08@sequoia-demo.com', 'Jennifer Wu', '(555) 202-0008', 'SEQ-2025-0208', 'active', 'consultant', v_l1_ids[3], 'jennifer-wu', 'lc_3', TRUE, TRUE),
    ('l2-09@sequoia-demo.com', 'Daniel Lee', '(555) 202-0009', 'SEQ-2025-0209', 'associate', 'consultant', v_l1_ids[3], 'daniel-lee', 'lc_1', FALSE, TRUE),
    ('l2-10@sequoia-demo.com', 'Rachel Huang', '(555) 202-0010', 'SEQ-2025-0210', 'active', 'consultant', v_l1_ids[3], 'rachel-huang', 'lc_2', TRUE, TRUE),
    ('l2-11@sequoia-demo.com', 'Steven Liu', '(555) 202-0011', 'SEQ-2025-0211', 'associate', 'consultant', v_l1_ids[3], 'steven-liu', 'lc_1', TRUE, TRUE);

  -- Under Sarah Johnson (v_l1_ids[4])
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l2-12@sequoia-demo.com', 'Chris Martinez', '(555) 202-0012', 'SEQ-2025-0212', 'associate', 'consultant', v_l1_ids[4], 'chris-martinez', 'lc_1', FALSE, FALSE),
    ('l2-13@sequoia-demo.com', 'Amy Wang', '(555) 202-0013', 'SEQ-2025-0213', 'associate', 'consultant', v_l1_ids[4], 'amy-wang', 'lc_1', TRUE, TRUE);

  -- Under David Kim (v_l1_ids[5])
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l2-14@sequoia-demo.com', 'Jason Nguyen', '(555) 202-0014', 'SEQ-2025-0214', 'active', 'consultant', v_l1_ids[5], 'jason-nguyen', 'lc_2', TRUE, TRUE),
    ('l2-15@sequoia-demo.com', 'Emily Davis', '(555) 202-0015', 'SEQ-2025-0215', 'associate', 'consultant', v_l1_ids[5], 'emily-davis', 'lc_1', FALSE, FALSE),
    ('l2-16@sequoia-demo.com', 'Ryan Thompson', '(555) 202-0016', 'SEQ-2025-0216', 'active', 'consultant', v_l1_ids[5], 'ryan-thompson', 'lc_2', TRUE, TRUE),
    ('l2-17@sequoia-demo.com', 'Michelle Zhang', '(555) 202-0017', 'SEQ-2025-0217', 'associate', 'consultant', v_l1_ids[5], 'michelle-zhang', 'lc_1', TRUE, TRUE);

  -- Collect L2 IDs
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l2_ids
  FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-02%';

  -- ── L3: ~20 Members ──────────────────────────────────────
  -- Spread across L2 sponsors (2-3 each under active L2 members)
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l3-01@sequoia-demo.com', 'Sophia Adams', '(555) 203-0001', 'SEQ-2025-0301', 'associate', 'consultant', v_l2_ids[1], 'sophia-adams', 'lc_1', TRUE, TRUE),
    ('l3-02@sequoia-demo.com', 'Nathan Brooks', '(555) 203-0002', 'SEQ-2025-0302', 'associate', 'consultant', v_l2_ids[1], 'nathan-brooks', 'lc_1', FALSE, FALSE),
    ('l3-03@sequoia-demo.com', 'Olivia Carter', '(555) 203-0003', 'SEQ-2025-0303', 'active', 'consultant', v_l2_ids[3], 'olivia-carter', 'lc_2', TRUE, TRUE),
    ('l3-04@sequoia-demo.com', 'Ethan Diaz', '(555) 203-0004', 'SEQ-2025-0304', 'associate', 'consultant', v_l2_ids[3], 'ethan-diaz', 'lc_1', TRUE, TRUE),
    ('l3-05@sequoia-demo.com', 'Ava Evans', '(555) 203-0005', 'SEQ-2025-0305', 'associate', 'consultant', v_l2_ids[5], 'ava-evans', 'lc_1', FALSE, FALSE),
    ('l3-06@sequoia-demo.com', 'Liam Foster', '(555) 203-0006', 'SEQ-2025-0306', 'active', 'consultant', v_l2_ids[5], 'liam-foster', 'lc_2', TRUE, TRUE),
    ('l3-07@sequoia-demo.com', 'Mia Garcia', '(555) 203-0007', 'SEQ-2025-0307', 'associate', 'consultant', v_l2_ids[7], 'mia-garcia', 'lc_1', TRUE, TRUE),
    ('l3-08@sequoia-demo.com', 'Noah Harris', '(555) 203-0008', 'SEQ-2025-0308', 'associate', 'consultant', v_l2_ids[7], 'noah-harris', 'lc_1', FALSE, FALSE),
    ('l3-09@sequoia-demo.com', 'Isabella Jackson', '(555) 203-0009', 'SEQ-2025-0309', 'active', 'consultant', v_l2_ids[8], 'isabella-jackson', 'lc_2', TRUE, TRUE),
    ('l3-10@sequoia-demo.com', 'William King', '(555) 203-0010', 'SEQ-2025-0310', 'associate', 'consultant', v_l2_ids[8], 'william-king', 'lc_1', FALSE, FALSE),
    ('l3-11@sequoia-demo.com', 'Charlotte Lopez', '(555) 203-0011', 'SEQ-2025-0311', 'associate', 'consultant', v_l2_ids[10], 'charlotte-lopez', 'lc_1', TRUE, TRUE),
    ('l3-12@sequoia-demo.com', 'Benjamin Moore', '(555) 203-0012', 'SEQ-2025-0312', 'active', 'consultant', v_l2_ids[10], 'benjamin-moore', 'lc_2', TRUE, TRUE),
    ('l3-13@sequoia-demo.com', 'Amelia Nelson', '(555) 203-0013', 'SEQ-2025-0313', 'associate', 'consultant', v_l2_ids[11], 'amelia-nelson', 'lc_1', FALSE, FALSE),
    ('l3-14@sequoia-demo.com', 'Lucas Ortiz', '(555) 203-0014', 'SEQ-2025-0314', 'active', 'consultant', v_l2_ids[14], 'lucas-ortiz', 'lc_2', TRUE, TRUE),
    ('l3-15@sequoia-demo.com', 'Harper Patel', '(555) 203-0015', 'SEQ-2025-0315', 'associate', 'consultant', v_l2_ids[14], 'harper-patel', 'lc_1', TRUE, TRUE),
    ('l3-16@sequoia-demo.com', 'Alexander Quinn', '(555) 203-0016', 'SEQ-2025-0316', 'associate', 'consultant', v_l2_ids[16], 'alexander-quinn', 'lc_1', FALSE, FALSE),
    ('l3-17@sequoia-demo.com', 'Evelyn Reyes', '(555) 203-0017', 'SEQ-2025-0317', 'active', 'consultant', v_l2_ids[16], 'evelyn-reyes', 'lc_2', TRUE, TRUE),
    ('l3-18@sequoia-demo.com', 'Henry Scott', '(555) 203-0018', 'SEQ-2025-0318', 'associate', 'consultant', v_l2_ids[17], 'henry-scott', 'lc_1', TRUE, TRUE),
    ('l3-19@sequoia-demo.com', 'Scarlett Taylor', '(555) 203-0019', 'SEQ-2025-0319', 'associate', 'consultant', v_l2_ids[17], 'scarlett-taylor', 'lc_1', FALSE, FALSE),
    ('l3-20@sequoia-demo.com', 'Jack Underwood', '(555) 203-0020', 'SEQ-2025-0320', 'active', 'consultant', v_l2_ids[4], 'jack-underwood', 'lc_2', TRUE, TRUE);

  -- Collect L3 IDs
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l3_ids
  FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-03%';

  -- ── L4: ~15 Members ──────────────────────────────────────
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l4-01@sequoia-demo.com', 'Grace Vargas', '(555) 204-0001', 'SEQ-2025-0401', 'associate', 'consultant', v_l3_ids[1], 'grace-vargas', 'lc_1', TRUE, TRUE),
    ('l4-02@sequoia-demo.com', 'Owen Walker', '(555) 204-0002', 'SEQ-2025-0402', 'associate', 'consultant', v_l3_ids[1], 'owen-walker', 'lc_1', FALSE, FALSE),
    ('l4-03@sequoia-demo.com', 'Chloe Xu', '(555) 204-0003', 'SEQ-2025-0403', 'associate', 'consultant', v_l3_ids[3], 'chloe-xu', 'lc_1', TRUE, TRUE),
    ('l4-04@sequoia-demo.com', 'Sebastian Young', '(555) 204-0004', 'SEQ-2025-0404', 'associate', 'consultant', v_l3_ids[3], 'sebastian-young', 'lc_1', FALSE, FALSE),
    ('l4-05@sequoia-demo.com', 'Aria Zhao', '(555) 204-0005', 'SEQ-2025-0405', 'associate', 'consultant', v_l3_ids[6], 'aria-zhao', 'lc_1', TRUE, TRUE),
    ('l4-06@sequoia-demo.com', 'Luke Bennett', '(555) 204-0006', 'SEQ-2025-0406', 'associate', 'consultant', v_l3_ids[6], 'luke-bennett', 'lc_1', FALSE, FALSE),
    ('l4-07@sequoia-demo.com', 'Penelope Cruz', '(555) 204-0007', 'SEQ-2025-0407', 'associate', 'consultant', v_l3_ids[9], 'penelope-cruz', 'lc_1', TRUE, TRUE),
    ('l4-08@sequoia-demo.com', 'Leo Dixon', '(555) 204-0008', 'SEQ-2025-0408', 'associate', 'consultant', v_l3_ids[9], 'leo-dixon', 'lc_1', FALSE, FALSE),
    ('l4-09@sequoia-demo.com', 'Layla Erikson', '(555) 204-0009', 'SEQ-2025-0409', 'associate', 'consultant', v_l3_ids[12], 'layla-erikson', 'lc_1', TRUE, TRUE),
    ('l4-10@sequoia-demo.com', 'Mateo Flores', '(555) 204-0010', 'SEQ-2025-0410', 'associate', 'consultant', v_l3_ids[14], 'mateo-flores', 'lc_1', FALSE, FALSE),
    ('l4-11@sequoia-demo.com', 'Riley Gutierrez', '(555) 204-0011', 'SEQ-2025-0411', 'associate', 'consultant', v_l3_ids[14], 'riley-gutierrez', 'lc_1', TRUE, TRUE),
    ('l4-12@sequoia-demo.com', 'Zoey Hernandez', '(555) 204-0012', 'SEQ-2025-0412', 'associate', 'consultant', v_l3_ids[17], 'zoey-hernandez', 'lc_1', FALSE, FALSE),
    ('l4-13@sequoia-demo.com', 'Carter Irwin', '(555) 204-0013', 'SEQ-2025-0413', 'associate', 'consultant', v_l3_ids[17], 'carter-irwin', 'lc_1', TRUE, TRUE),
    ('l4-14@sequoia-demo.com', 'Nora Jensen', '(555) 204-0014', 'SEQ-2025-0414', 'associate', 'consultant', v_l3_ids[20], 'nora-jensen', 'lc_1', FALSE, FALSE),
    ('l4-15@sequoia-demo.com', 'Dylan Kwan', '(555) 204-0015', 'SEQ-2025-0415', 'associate', 'consultant', v_l3_ids[20], 'dylan-kwan', 'lc_1', TRUE, TRUE);

  -- Collect L4 IDs
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l4_ids
  FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-04%';

  -- ── L5: 8 Members ────────────────────────────────────────
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l5-01@sequoia-demo.com', 'Stella Lane', '(555) 205-0001', 'SEQ-2025-0501', 'associate', 'consultant', v_l4_ids[1], 'stella-lane', 'lc_1', TRUE, TRUE),
    ('l5-02@sequoia-demo.com', 'Asher Morales', '(555) 205-0002', 'SEQ-2025-0502', 'associate', 'consultant', v_l4_ids[1], 'asher-morales', 'lc_1', FALSE, FALSE),
    ('l5-03@sequoia-demo.com', 'Aurora Nash', '(555) 205-0003', 'SEQ-2025-0503', 'associate', 'consultant', v_l4_ids[3], 'aurora-nash', 'lc_1', TRUE, TRUE),
    ('l5-04@sequoia-demo.com', 'Elijah Owens', '(555) 205-0004', 'SEQ-2025-0504', 'associate', 'consultant', v_l4_ids[5], 'elijah-owens', 'lc_1', FALSE, FALSE),
    ('l5-05@sequoia-demo.com', 'Luna Porter', '(555) 205-0005', 'SEQ-2025-0505', 'associate', 'consultant', v_l4_ids[7], 'luna-porter', 'lc_1', TRUE, TRUE),
    ('l5-06@sequoia-demo.com', 'Grayson Reed', '(555) 205-0006', 'SEQ-2025-0506', 'associate', 'consultant', v_l4_ids[9], 'grayson-reed', 'lc_1', FALSE, FALSE),
    ('l5-07@sequoia-demo.com', 'Hazel Santos', '(555) 205-0007', 'SEQ-2025-0507', 'associate', 'consultant', v_l4_ids[11], 'hazel-santos', 'lc_1', TRUE, TRUE),
    ('l5-08@sequoia-demo.com', 'Ezra Torres', '(555) 205-0008', 'SEQ-2025-0508', 'associate', 'consultant', v_l4_ids[13], 'ezra-torres', 'lc_1', FALSE, FALSE);

  -- Collect L5 IDs
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l5_ids
  FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-05%';

  -- ── L6: 4 Members ────────────────────────────────────────
  INSERT INTO public.consultants (email, full_name, phone, consultant_id, tier, role, sponsor_id, slug, rank, is_active, onboarding_completed)
  VALUES
    ('l6-01@sequoia-demo.com', 'Ivy Upton', '(555) 206-0001', 'SEQ-2025-0601', 'associate', 'consultant', v_l5_ids[1], 'ivy-upton', 'lc_1', TRUE, TRUE),
    ('l6-02@sequoia-demo.com', 'Jasper Vaughn', '(555) 206-0002', 'SEQ-2025-0602', 'associate', 'consultant', v_l5_ids[1], 'jasper-vaughn', 'lc_1', FALSE, FALSE),
    ('l6-03@sequoia-demo.com', 'Willow Xavier', '(555) 206-0003', 'SEQ-2025-0603', 'associate', 'consultant', v_l5_ids[3], 'willow-xavier', 'lc_1', TRUE, TRUE),
    ('l6-04@sequoia-demo.com', 'Felix Yang', '(555) 206-0004', 'SEQ-2025-0604', 'associate', 'consultant', v_l5_ids[5], 'felix-yang', 'lc_1', FALSE, FALSE);

  -- ============================================================
  -- TEST DEALS (one for each major product type)
  -- ============================================================

  -- Deal 1: Fix & Flip (funded) — agent is Angela Torres (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, description)
  VALUES (v_l2_ids[1], 'Sunrise Capital LLC', 'sunrise@example.com', '(555) 300-0001', 'Sunrise Capital LLC', 'Fix & Flip', '$425,000', 'funded', 425000, 'real_estate_lending', 're-fix-flip', 'Fix and flip in Rockville, MD — 3BR ranch')
  RETURNING id INTO v_deal_id;

  -- Deal 2: Commercial RE (in_review) — agent is Kevin Patel (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, product_category, product_id, description)
  VALUES (v_l2_ids[5], 'Pacific Rim Realty', 'pacificrim@example.com', '(555) 300-0002', 'Pacific Rim Realty', 'Commercial RE', '$1,200,000', 'in_review', 'real_estate_lending', 're-commercial', 'Office building purchase in Silver Spring, MD');

  -- Deal 3: Working Capital (funded) — agent is Jennifer Wu (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, description)
  VALUES (v_l2_ids[8], 'Metro Logistics Inc', 'metro@example.com', '(555) 300-0003', 'Metro Logistics Inc', 'Working Capital', '$185,000', 'funded', 185000, 'business_funding', 'bf-working-capital', 'Working capital for fleet expansion');

  -- Deal 4: EHMP Wellness (funded) — agent is Olivia Carter (L3)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, metadata, description)
  VALUES (v_l3_ids[3], 'Green Valley Dental Group', 'gvdental@example.com', '(555) 300-0004', 'Green Valley Dental Group', 'EHMP Wellness', '47 employees', 'funded', 47, 'wellness', 'ww-ehmp', '{"employeeCount": 47}'::jsonb, 'EHMP enrollment for dental group — 47 employees');

  -- Deal 5: Property Restoration (funded) — agent is Lucas Ortiz (L3)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, description)
  VALUES (v_l3_ids[14], 'Oakwood Properties', 'oakwood@example.com', '(555) 300-0005', 'Oakwood Properties', 'Property Restoration', '$50,000', 'funded', 50000, 'property_restoration', 'bs-property-restoration', 'Water damage restoration — apartment complex');

  -- Deal 6: Commercial Solar (application) — agent is Sophia Adams (L3)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, product_category, product_id, description)
  VALUES (v_l3_ids[1], 'BrightStar Solar', 'brightstar@example.com', '(555) 300-0006', 'BrightStar Solar', 'Commercial Solar', '$250,000', 'application', 'clean_energy', 'ce-solar', '500kW rooftop installation');

  -- Deal 7: SBA Loan (approved) — agent is Brian Park (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, product_category, product_id, description)
  VALUES (v_l2_ids[4], 'TechStart Solutions', 'techstart@example.com', '(555) 300-0007', 'TechStart Solutions', 'SBA 7(a)', '$350,000', 'approved', 'real_estate_lending', 're-commercial', 'SBA 7(a) loan for tech startup office');

  -- Deal 8: Equipment Loan (funded) — agent is Jason Nguyen (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, description)
  VALUES (v_l2_ids[14], 'Crane Masters LLC', 'cranemasters@example.com', '(555) 300-0008', 'Crane Masters LLC', 'Equipment Loan', '$547,000', 'funded', 547000, 'business_funding', 'bf-equipment', 'Heavy equipment purchase — 2 cranes');

  -- Deal 9: Construction Loan (in_review) — agent is Ryan Thompson (L2)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, product_category, product_id, description)
  VALUES (v_l2_ids[16], 'Harbor View Builders', 'harborview@example.com', '(555) 300-0009', 'Harbor View Builders', 'Construction', '$2,750,000', 'in_review', 'real_estate_lending', 're-construction', 'Ground-up 12-unit multifamily');

  -- Deal 10: Bridge Loan (funded) — agent is Evelyn Reyes (L3)
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, product_category, product_id, description)
  VALUES (v_l3_ids[17], 'Pinnacle Investments', 'pinnacle@example.com', '(555) 300-0010', 'Pinnacle Investments', 'Bridge Loan', '$1,500,000', 'funded', 1500000, 'real_estate_lending', 're-bridge', 'Bridge loan for office building repositioning');

  -- Deal 11: Public submission (no consultant) via referral link
  INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, product_category, product_id, referral_slug, description)
  VALUES (NULL, 'Jane Doe', 'janedoe@example.com', '(555) 300-0011', 'Doe Properties', 'Multi-Family', '$800,000', 'application', 'real_estate_lending', 're-multi-family', 'marcus-rivera', 'Referred via Marcus Rivera consultant page');

  RAISE NOTICE 'Seed data complete: % L1, % L2, % L3, % L4, % L5, % L6 consultants + 11 test deals',
    array_length(v_l1_ids, 1), array_length(v_l2_ids, 1), array_length(v_l3_ids, 1),
    array_length(v_l4_ids, 1), array_length(v_l5_ids, 1), 4;
END;
$$;
