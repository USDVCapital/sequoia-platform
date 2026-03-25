-- ============================================================
-- Seed Data: Mega Deals — $145M funded volume, $1.2M+ net revenue
-- ============================================================
-- Run AFTER base seed (seed.sql) and genealogy seed (seed-genealogy.sql).
-- Generates ~90 funded deals + commissions across all product types.
-- Idempotent: uses ON CONFLICT DO NOTHING where possible.
-- ============================================================

DO $$
DECLARE
  v_root_id UUID;
  v_l1_ids UUID[];
  v_l2_ids UUID[];
  v_l3_ids UUID[];
  v_deal_id UUID;
  v_consultant UUID;
  v_gross NUMERIC;
  v_funded NUMERIC;
  v_date TIMESTAMPTZ;
  v_status TEXT;
  v_approval TEXT;
  v_i INTEGER;
  -- Totals for summary
  v_total_funded NUMERIC := 0;
  v_total_gross NUMERIC := 0;
  v_total_overhead NUMERIC := 0;
  v_total_agent NUMERIC := 0;
  -- Arrays for deal generation
  v_re_names TEXT[];
  v_re_types TEXT[];
  v_re_amounts NUMERIC[];
  v_bf_names TEXT[];
  v_bf_types TEXT[];
  v_bf_amounts NUMERIC[];
  v_pr_names TEXT[];
  v_pr_types TEXT[];
  v_pr_amounts NUMERIC[];
  v_ce_names TEXT[];
  v_ce_types TEXT[];
  v_ce_amounts NUMERIC[];
  v_all_consultants UUID[];
BEGIN
  -- ── Look up root ────────────────────────────────────────────
  SELECT id INTO v_root_id FROM public.consultants WHERE email = 'allen.wu@seqsolution.com';
  IF v_root_id IS NULL THEN
    RAISE EXCEPTION 'Root consultant not found. Run base seed first.';
  END IF;

  -- ── Collect consultant IDs by level ─────────────────────────
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l1_ids
    FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-010%';
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l2_ids
    FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-02%';
  SELECT array_agg(id ORDER BY consultant_id) INTO v_l3_ids
    FROM public.consultants WHERE consultant_id LIKE 'SEQ-2025-03%';

  IF v_l1_ids IS NULL OR v_l2_ids IS NULL OR v_l3_ids IS NULL THEN
    RAISE EXCEPTION 'Genealogy consultants not found. Run seed-genealogy.sql first.';
  END IF;

  -- Build a rotating pool of consultants (L1 + L2 + L3)
  v_all_consultants := v_l1_ids || v_l2_ids || v_l3_ids;

  -- ============================================================
  -- REAL ESTATE LENDING (~$120M, 30 deals, commission = 2%)
  -- ============================================================
  v_re_names := ARRAY[
    'Riverside Development LLC', 'Capital Heights Partners', 'Metro Commercial Group',
    'Pinnacle Property Investors', 'Bayshore Holdings LLC', 'Summit Ridge Capital',
    'Greenfield Estates Corp', 'Harborview Acquisitions', 'Ironwood Real Estate',
    'Lakeside Ventures Group', 'Northstar Realty Partners', 'Cornerstone Builders LLC',
    'Pacific Gateway Investments', 'Crestwood Development Co', 'Atlas Property Holdings',
    'Eagle Rock Enterprises', 'Midtown Capital Partners', 'Silverline Investments',
    'Vanguard Real Estate LLC', 'Heritage Property Group', 'Trident Capital Advisors',
    'Westfield Commercial Inc', 'Broadstone Acquisitions', 'Keystone Bridge Partners',
    'Olympus Land Holdings', 'Redwood Construction LLC', 'Beacon Hill Properties',
    'Continental RE Partners', 'Diamond Creek Holdings', 'Falcon Ridge Development'
  ];
  v_re_types := ARRAY[
    'Fix & Flip', 'Fix & Flip', 'Commercial RE', 'Bridge Loan', 'Construction',
    'DSCR Rental', 'Fix & Flip', 'Bridge Loan', 'Commercial RE', 'SBA 7(a)',
    'Fix & Flip', 'Construction', 'Commercial RE', 'Bridge Loan', 'DSCR Rental',
    'Fix & Flip', 'Commercial RE', 'SBA 7(a)', 'Construction', 'Bridge Loan',
    'Fix & Flip', 'Commercial RE', 'DSCR Rental', 'Bridge Loan', 'Construction',
    'Construction', 'Fix & Flip', 'Commercial RE', 'DSCR Rental', 'Fix & Flip'
  ];
  v_re_amounts := ARRAY[
    625000, 780000, 5200000, 3800000, 7500000,
    550000, 450000, 4400000, 7100000, 750000,
    375000, 8200000, 5800000, 3500000, 480000,
    720000, 8500000, 920000, 9800000, 5100000,
    410000, 9200000, 590000, 5200000, 9500000,
    8200000, 540000, 7800000, 660000, 490000
  ];

  FOR v_i IN 1..30 LOOP
    v_funded := v_re_amounts[v_i];
    v_gross := ROUND(v_funded * 0.02, 2);
    v_consultant := v_all_consultants[((v_i - 1) % array_length(v_all_consultants, 1)) + 1];
    v_date := NOW() - ((180 - (v_i * 5)) || ' days')::INTERVAL;
    v_approval := CASE WHEN v_i <= 21 THEN 'paid' WHEN v_i <= 27 THEN 'approved' ELSE 'pending' END;

    INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name,
      funding_type, estimated_amount, status, funded_amount, product_category, product_id, description, created_at, updated_at)
    VALUES (v_consultant, v_re_names[v_i], lower(replace(v_re_names[v_i], ' ', '')) || '@example.com',
      '(555) 400-' || lpad(v_i::text, 4, '0'), v_re_names[v_i],
      v_re_types[v_i], '$' || to_char(v_funded, 'FM999,999,999'), 'funded', v_funded,
      'real_estate_lending', 're-' || lower(replace(split_part(v_re_types[v_i], ' ', 1), '&', '')),
      v_re_types[v_i] || ' — ' || v_re_names[v_i], v_date, v_date)
    RETURNING id INTO v_deal_id;

    -- Overhead commission (30%)
    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, sequoia_overhead, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_re_names[v_i] || ' — Overhead',
      'sequoia_overhead', ROUND(v_gross * 0.30, 2), 'paid', v_deal_id, -1, 0.30,
      v_gross, ROUND(v_gross * 0.30, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    -- Agent commission (23% referral)
    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, approval_status, period_start, period_end, created_at)
    VALUES (v_consultant, 'lead', v_deal_id, v_re_names[v_i] || ' — Agent',
      'loan_referral', ROUND(v_gross * 0.23, 2), CASE WHEN v_approval = 'paid' THEN 'paid' ELSE 'pending' END,
      v_deal_id, 0, 0.23, v_gross, v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    -- Bonus pool (2%)
    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, bonus_pool_amount, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_re_names[v_i] || ' — Bonus Pool',
      'bonus_pool', ROUND(v_gross * 0.02, 2), 'paid', v_deal_id, 99, 0.02,
      v_gross, ROUND(v_gross * 0.02, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    v_total_funded := v_total_funded + v_funded;
    v_total_gross := v_total_gross + v_gross;
    v_total_overhead := v_total_overhead + ROUND(v_gross * 0.30, 2) + ROUND(v_gross * 0.02, 2);
    v_total_agent := v_total_agent + ROUND(v_gross * 0.23, 2);
  END LOOP;

  -- ============================================================
  -- BUSINESS FUNDING (~$15M, 20 deals, commission = 6%)
  -- ============================================================
  v_bf_names := ARRAY[
    'QuickServe Restaurant Group', 'Apex Trucking Solutions', 'Bright Minds Tutoring',
    'Metro Auto Repair Inc', 'Fresh Harvest Foods LLC', 'TechForge Solutions',
    'Coastal Plumbing Services', 'Premier Staffing Group', 'Urban Fitness Studios',
    'Clearwater Medical Supply', 'Diamond Logistics Corp', 'Frontier Equipment Co',
    'GreenLeaf Landscaping', 'Horizon Healthcare LLC', 'InnovateTech Partners',
    'JetStream Delivery Inc', 'KingPin Bowling Centers', 'LuxeClean Services',
    'Maverick Construction Co', 'NextGen Marketing LLC'
  ];
  v_bf_types := ARRAY[
    'Working Capital', 'Equipment Loan', 'MCA', 'Term Loan', 'Working Capital',
    'Equipment Loan', 'Working Capital', 'MCA', 'Term Loan', 'Equipment Loan',
    'Working Capital', 'Equipment Loan', 'MCA', 'Working Capital', 'Term Loan',
    'Working Capital', 'MCA', 'Equipment Loan', 'Term Loan', 'Working Capital'
  ];
  v_bf_amounts := ARRAY[
    580000, 1250000, 175000, 750000, 485000,
    1420000, 275000, 195000, 800000, 1080000,
    620000, 1500000, 300000, 550000, 875000,
    425000, 250000, 1350000, 800000, 720000
  ];

  FOR v_i IN 1..20 LOOP
    v_funded := v_bf_amounts[v_i];
    v_gross := ROUND(v_funded * 0.06, 2);
    v_consultant := v_all_consultants[((v_i + 4) % array_length(v_all_consultants, 1)) + 1];
    v_date := NOW() - ((170 - (v_i * 7)) || ' days')::INTERVAL;
    v_approval := CASE WHEN v_i <= 14 THEN 'paid' WHEN v_i <= 18 THEN 'approved' ELSE 'pending' END;

    INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name,
      funding_type, estimated_amount, status, funded_amount, product_category, product_id, description, created_at, updated_at)
    VALUES (v_consultant, v_bf_names[v_i], lower(replace(v_bf_names[v_i], ' ', '')) || '@example.com',
      '(555) 500-' || lpad(v_i::text, 4, '0'), v_bf_names[v_i],
      v_bf_types[v_i], '$' || to_char(v_funded, 'FM999,999,999'), 'funded', v_funded,
      'business_funding', 'bf-' || lower(replace(split_part(v_bf_types[v_i], ' ', 1), '&', '')),
      v_bf_types[v_i] || ' — ' || v_bf_names[v_i], v_date, v_date)
    RETURNING id INTO v_deal_id;

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, sequoia_overhead, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_bf_names[v_i] || ' — Overhead',
      'sequoia_overhead', ROUND(v_gross * 0.30, 2), 'paid', v_deal_id, -1, 0.30,
      v_gross, ROUND(v_gross * 0.30, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, approval_status, period_start, period_end, created_at)
    VALUES (v_consultant, 'lead', v_deal_id, v_bf_names[v_i] || ' — Agent',
      'business_funding', ROUND(v_gross * 0.23, 2), CASE WHEN v_approval = 'paid' THEN 'paid' ELSE 'pending' END,
      v_deal_id, 0, 0.23, v_gross, v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, bonus_pool_amount, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_bf_names[v_i] || ' — Bonus Pool',
      'bonus_pool', ROUND(v_gross * 0.02, 2), 'paid', v_deal_id, 99, 0.02,
      v_gross, ROUND(v_gross * 0.02, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    v_total_funded := v_total_funded + v_funded;
    v_total_gross := v_total_gross + v_gross;
    v_total_overhead := v_total_overhead + ROUND(v_gross * 0.30, 2) + ROUND(v_gross * 0.02, 2);
    v_total_agent := v_total_agent + ROUND(v_gross * 0.23, 2);
  END LOOP;

  -- ============================================================
  -- PROPERTY RESTORATION (~$5M, 15 deals, commission = 100% of project value, 8% agent)
  -- ============================================================
  v_pr_names := ARRAY[
    'Seaside Apartments LLC', 'Oakridge Office Park', 'Maple Grove Condos',
    'Valley View Mall Corp', 'Sunset Plaza Owners Assn', 'Riverdale Warehouses',
    'Pinecrest HOA', 'Lakeview Towers Inc', 'Heritage Square Partners',
    'Crossroads Business Park', 'Elmwood Residence Hall', 'Brighton Beach Rentals',
    'Cascade Falls Resort', 'Downtown Lofts LLC', 'Grandview Terrace Mgmt'
  ];
  v_pr_types := ARRAY[
    'Water Damage', 'Fire Restoration', 'Mold Remediation', 'Storm Damage', 'Water Damage',
    'Fire Restoration', 'Mold Remediation', 'Storm Damage', 'Water Damage', 'Fire Restoration',
    'Storm Damage', 'Mold Remediation', 'Water Damage', 'Fire Restoration', 'Storm Damage'
  ];
  v_pr_amounts := ARRAY[
    285000, 475000, 120000, 380000, 195000,
    500000, 85000, 420000, 310000, 450000,
    350000, 145000, 260000, 490000, 235000
  ];

  FOR v_i IN 1..15 LOOP
    v_funded := v_pr_amounts[v_i];
    v_gross := v_funded;  -- PR: gross commission = project value
    v_consultant := v_all_consultants[((v_i + 9) % array_length(v_all_consultants, 1)) + 1];
    v_date := NOW() - ((160 - (v_i * 8)) || ' days')::INTERVAL;
    v_approval := CASE WHEN v_i <= 10 THEN 'paid' WHEN v_i <= 13 THEN 'approved' ELSE 'pending' END;

    INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name,
      funding_type, estimated_amount, status, funded_amount, product_category, product_id, description, created_at, updated_at)
    VALUES (v_consultant, v_pr_names[v_i], lower(replace(v_pr_names[v_i], ' ', '')) || '@example.com',
      '(555) 600-' || lpad(v_i::text, 4, '0'), v_pr_names[v_i],
      v_pr_types[v_i], '$' || to_char(v_funded, 'FM999,999,999'), 'funded', v_funded,
      'property_restoration', 'bs-property-restoration',
      v_pr_types[v_i] || ' — ' || v_pr_names[v_i], v_date, v_date)
    RETURNING id INTO v_deal_id;

    -- PR agent commission (8%, no overhead/bonus)
    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, approval_status, period_start, period_end, created_at)
    VALUES (v_consultant, 'property_restoration', v_deal_id, v_pr_names[v_i] || ' — Agent 8%',
      'property_restoration', ROUND(v_gross * 0.08, 2), CASE WHEN v_approval = 'paid' THEN 'paid' ELSE 'pending' END,
      v_deal_id, 0, 0.08, v_gross, v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    -- PR override L1 (1%)
    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'property_restoration', v_deal_id, v_pr_names[v_i] || ' — Override L1',
      'revenue_share', ROUND(v_gross * 0.01, 2), 'paid', v_deal_id, 1, 0.01,
      v_gross, v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    v_total_funded := v_total_funded + v_funded;
    v_total_gross := v_total_gross + v_gross;
    v_total_overhead := v_total_overhead + ROUND(v_gross * 0.01, 2);
    v_total_agent := v_total_agent + ROUND(v_gross * 0.08, 2);
  END LOOP;

  -- ============================================================
  -- CLEAN ENERGY (~$3M, 10 deals, commission = 5%)
  -- ============================================================
  v_ce_names := ARRAY[
    'SunPeak Solar Group', 'GreenVolt Energy LLC', 'EcoCharge Solutions',
    'SolarEdge Commercial', 'BrightFuture Installations', 'PowerGrid Clean Energy',
    'Apex Solar Partners', 'NovaStar Energy Inc', 'TerraWatt Solutions',
    'ElectraGreen Holdings'
  ];
  v_ce_types := ARRAY[
    'Commercial Solar', 'Battery Storage', 'EV Chargers', 'Commercial Solar', 'Commercial Solar',
    'Battery Storage', 'Commercial Solar', 'EV Chargers', 'Commercial Solar', 'Battery Storage'
  ];
  v_ce_amounts := ARRAY[
    420000, 180000, 95000, 380000, 450000,
    210000, 350000, 120000, 500000, 295000
  ];

  FOR v_i IN 1..10 LOOP
    v_funded := v_ce_amounts[v_i];
    v_gross := ROUND(v_funded * 0.05, 2);
    v_consultant := v_all_consultants[((v_i + 14) % array_length(v_all_consultants, 1)) + 1];
    v_date := NOW() - ((150 - (v_i * 10)) || ' days')::INTERVAL;
    v_approval := CASE WHEN v_i <= 7 THEN 'paid' WHEN v_i <= 9 THEN 'approved' ELSE 'pending' END;

    INSERT INTO public.leads (consultant_id, client_name, client_email, client_phone, business_name,
      funding_type, estimated_amount, status, funded_amount, product_category, product_id, description, created_at, updated_at)
    VALUES (v_consultant, v_ce_names[v_i], lower(replace(v_ce_names[v_i], ' ', '')) || '@example.com',
      '(555) 700-' || lpad(v_i::text, 4, '0'), v_ce_names[v_i],
      v_ce_types[v_i], '$' || to_char(v_funded, 'FM999,999,999'), 'funded', v_funded,
      'clean_energy', 'ce-' || lower(replace(split_part(v_ce_types[v_i], ' ', 1), '&', '')),
      v_ce_types[v_i] || ' — ' || v_ce_names[v_i], v_date, v_date)
    RETURNING id INTO v_deal_id;

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, sequoia_overhead, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_ce_names[v_i] || ' — Overhead',
      'sequoia_overhead', ROUND(v_gross * 0.30, 2), 'paid', v_deal_id, -1, 0.30,
      v_gross, ROUND(v_gross * 0.30, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, approval_status, period_start, period_end, created_at)
    VALUES (v_consultant, 'lead', v_deal_id, v_ce_names[v_i] || ' — Agent',
      'clean_energy', ROUND(v_gross * 0.23, 2), CASE WHEN v_approval = 'paid' THEN 'paid' ELSE 'pending' END,
      v_deal_id, 0, 0.23, v_gross, v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id, waterfall_level, override_rate,
      gross_commission, bonus_pool_amount, approval_status, period_start, period_end, created_at)
    VALUES (v_root_id, 'lead', v_deal_id, v_ce_names[v_i] || ' — Bonus Pool',
      'bonus_pool', ROUND(v_gross * 0.02, 2), 'paid', v_deal_id, 99, 0.02,
      v_gross, ROUND(v_gross * 0.02, 2), v_approval, v_date::date, (v_date + INTERVAL '15 days')::date, v_date);

    v_total_funded := v_total_funded + v_funded;
    v_total_gross := v_total_gross + v_gross;
    v_total_overhead := v_total_overhead + ROUND(v_gross * 0.30, 2) + ROUND(v_gross * 0.02, 2);
    v_total_agent := v_total_agent + ROUND(v_gross * 0.23, 2);
  END LOOP;

  -- ============================================================
  -- WELLNESS / EHMP (~10 enrollments)
  -- ============================================================
  DECLARE
    v_we_companies TEXT[] := ARRAY[
      'Cascade Medical Group', 'Pinnacle Law Firm', 'Riverstone Accounting',
      'Summit Dental Associates', 'Pacific Tech Solutions', 'Harbor Engineering Inc',
      'Crestview Insurance Agency', 'Meridian Financial Group', 'Brookfield Marketing Co',
      'Westlake Veterinary Clinic'
    ];
    v_we_contacts TEXT[] := ARRAY[
      'Dr. Karen Walsh', 'Robert Chen Esq.', 'Patricia Moore CPA',
      'Dr. James Rivera', 'Anil Gupta', 'Sandra Kim PE',
      'Tom Bradley', 'Diana Foster CFP', 'Mark Sullivan',
      'Dr. Lisa Pham DVM'
    ];
    v_we_employees INTEGER[] := ARRAY[85, 42, 35, 120, 250, 65, 28, 180, 45, 500];
    v_enrollment_id UUID;
    v_monthly NUMERIC;
    v_emp INTEGER;
  BEGIN
    FOR v_i IN 1..10 LOOP
      v_consultant := v_all_consultants[((v_i + 19) % array_length(v_all_consultants, 1)) + 1];
      v_date := NOW() - ((140 - (v_i * 12)) || ' days')::INTERVAL;
      v_emp := v_we_employees[v_i];
      v_monthly := 18.00;

      INSERT INTO public.wellness_enrollments (consultant_id, company_name, contact_name,
        contact_email, employee_count, monthly_rate, status, created_at, updated_at)
      VALUES (v_consultant, v_we_companies[v_i], v_we_contacts[v_i],
        lower(replace(v_we_contacts[v_i], ' ', '.')) || '@example.com',
        v_emp, v_monthly, 'active', v_date, v_date)
      ON CONFLICT DO NOTHING
      RETURNING id INTO v_enrollment_id;

      -- Wellness commission: 80% of PEPM goes to agent
      IF v_enrollment_id IS NOT NULL THEN
        v_gross := v_emp * v_monthly;  -- Monthly PEPM total
        INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
          commission_type, amount, status, deal_id, waterfall_level, override_rate,
          gross_commission, approval_status, period_start, period_end, created_at)
        VALUES (v_consultant, 'wellness', v_enrollment_id, v_we_companies[v_i] || ' — EHMP',
          'wellness_commission', ROUND(v_gross * 0.80, 2), 'paid',
          NULL, 0, 0.80, v_gross, 'paid', v_date::date, (v_date + INTERVAL '30 days')::date, v_date);

        -- Override L1 (4%)
        INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
          commission_type, amount, status, deal_id, waterfall_level, override_rate,
          gross_commission, approval_status, period_start, period_end, created_at)
        VALUES (v_root_id, 'wellness', v_enrollment_id, v_we_companies[v_i] || ' — Override',
          'membership_override', ROUND(v_gross * 0.04, 2), 'paid',
          NULL, 1, 0.04, v_gross, 'paid', v_date::date, (v_date + INTERVAL '30 days')::date, v_date);

        v_total_gross := v_total_gross + v_gross;
        v_total_overhead := v_total_overhead + ROUND(v_gross * 0.04, 2);
        v_total_agent := v_total_agent + ROUND(v_gross * 0.80, 2);
      END IF;
    END LOOP;
  END;

  -- ============================================================
  -- OVERRIDE COMMISSIONS for L1 uplines on RE/BF/CE deals
  -- Add ~$180K in override commissions (10% of gross to L1 sponsors)
  -- ============================================================
  DECLARE
    v_override_rec RECORD;
    v_sponsor UUID;
  BEGIN
    FOR v_override_rec IN
      SELECT c.deal_id, c.gross_commission, c.created_at, c.approval_status, c.source_label,
             l.consultant_id AS agent_id
      FROM public.commissions c
      JOIN public.leads l ON l.id = c.deal_id
      WHERE c.waterfall_level = 0
        AND c.commission_type IN ('loan_referral', 'business_funding', 'clean_energy')
        AND c.gross_commission > 0
      LIMIT 60
    LOOP
      SELECT sponsor_id INTO v_sponsor FROM public.consultants WHERE id = v_override_rec.agent_id;
      IF v_sponsor IS NOT NULL THEN
        INSERT INTO public.commissions (consultant_id, source_type, source_id, source_label,
          commission_type, amount, status, deal_id, waterfall_level, override_rate,
          gross_commission, approval_status, period_start, period_end, created_at)
        VALUES (v_sponsor, 'lead', v_override_rec.deal_id,
          replace(v_override_rec.source_label, 'Agent', 'Override L1'),
          'revenue_share', ROUND(v_override_rec.gross_commission * 0.10, 2),
          CASE WHEN v_override_rec.approval_status = 'paid' THEN 'paid' ELSE 'pending' END,
          v_override_rec.deal_id, 1, 0.10, v_override_rec.gross_commission,
          v_override_rec.approval_status,
          v_override_rec.created_at::date, (v_override_rec.created_at + INTERVAL '15 days')::date,
          v_override_rec.created_at);

        v_total_overhead := v_total_overhead; -- overrides go to consultants, not Sequoia
        v_total_agent := v_total_agent + ROUND(v_override_rec.gross_commission * 0.10, 2);
      END IF;
    END LOOP;
  END;

  -- ============================================================
  -- SUMMARY
  -- ============================================================
  RAISE NOTICE '══════════════════════════════════════════════════════';
  RAISE NOTICE 'MEGA DEALS SEED COMPLETE';
  RAISE NOTICE '══════════════════════════════════════════════════════';
  RAISE NOTICE 'Total Funded Volume:        $%', to_char(v_total_funded, 'FM999,999,999,999');
  RAISE NOTICE 'Total Gross Commissions:    $%', to_char(v_total_gross, 'FM999,999,999');
  RAISE NOTICE 'Sequoia Net Revenue (est):  $%', to_char(v_total_overhead, 'FM999,999,999');
  RAISE NOTICE 'Total Agent Commissions:    $%', to_char(v_total_agent, 'FM999,999,999');
  RAISE NOTICE '══════════════════════════════════════════════════════';
  RAISE NOTICE 'Deals: 30 RE + 20 BF + 15 PR + 10 CE + 10 Wellness = 85 total';
  RAISE NOTICE '══════════════════════════════════════════════════════';

END;
$$;
