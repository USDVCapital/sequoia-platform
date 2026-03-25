-- ============================================================
-- Bulk Agent Seed: 219 Active + ~2,500 Inactive Consultants
-- ============================================================
-- Run in Supabase SQL Editor AFTER schema + migrations.
-- Reflects Allen Wu's real org: 219 active, ~2,500 inactive.
-- All agents are under Allen Wu's org (sponsor chain).
-- ============================================================

-- ── Helper: Generate realistic agents ──────────────────────

DO $$
DECLARE
  v_allen_id UUID := '00000000-0000-0000-0000-000000000001';
  -- Mid-level leaders who will sponsor others
  v_leader_ids UUID[];
  v_first_names TEXT[] := ARRAY[
    'James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda',
    'David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica',
    'Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy',
    'Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley',
    'Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle',
    'Kenneth','Carol','Kevin','Amanda','Brian','Dorothy','George','Melissa',
    'Timothy','Deborah','Ronald','Stephanie','Edward','Rebecca','Jason','Sharon',
    'Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy',
    'Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda',
    'Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen',
    'Benjamin','Samantha','Samuel','Katherine','Raymond','Christine','Gregory','Debra',
    'Frank','Rachel','Alexander','Carolyn','Patrick','Janet','Jack','Catherine',
    'Dennis','Maria','Jerry','Heather','Tyler','Diane','Aaron','Ruth',
    'Jose','Julie','Adam','Olivia','Nathan','Joyce','Henry','Virginia',
    'Peter','Victoria','Zachary','Kelly','Douglas','Lauren','Harold','Christina',
    'Carl','Joan','Arthur','Evelyn','Gerald','Judith','Roger','Megan',
    'Keith','Andrea','Jeremy','Cheryl','Terry','Hannah','Sean','Jacqueline',
    'Albert','Martha','Austin','Gloria','Jesse','Teresa','Willie','Ann',
    'Christian','Sara','Bruce','Madison','Jordan','Frances','Ralph','Kathryn',
    'Roy','Janice','Eugene','Jean','Wayne','Abigail','Elijah','Alice',
    'Randy','Judy','Philip','Sophia','Harry','Grace','Vincent','Denise',
    'Bobby','Amber','Dylan','Doris','Billy','Marilyn','Howard','Danielle',
    'Logan','Beverly','Russell','Isabella','Gabriel','Theresa','Liam','Diana',
    'Mason','Natalie','Aiden','Brittany','Ethan','Charlotte','Luke','Marie',
    'Connor','Kayla','Isaiah','Alexis','Adrian','Lori','Caleb','Alyssa',
    'Nolan','Trinity','Evan','Tiffany','Colton','Brooke','Parker','Jasmine',
    'Carson','Morgan','Declan','Destiny','Quinn','Taylor','Asher','Skylar'
  ];
  v_last_names TEXT[] := ARRAY[
    'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
    'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson',
    'Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson',
    'White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker',
    'Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill',
    'Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell',
    'Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz',
    'Parker','Cruz','Edwards','Collins','Reyes','Stewart','Morris','Morales',
    'Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson',
    'Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward',
    'Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray',
    'Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel',
    'Myers','Long','Ross','Foster','Jimenez','Powell','Jenkins','Perry',
    'Russell','Sullivan','Bell','Coleman','Butler','Henderson','Barnes','Gonzales',
    'Fisher','Vasquez','Simmons','Graham','Murray','Ford','Castro','Chen',
    'Marshall','Owens','Harrison','Fernandez','McDonald','Woods','Washington',
    'Kennedy','Wells','Vargas','Henry','Freeman','Webb','Tucker','Burns',
    'Crawford','Olson','Simpson','Hunt','Palmer','Berry','Grant','Medina',
    'Alexander','Rose','Dean','Herrera','Wagner','Stone','Freeman','Fox',
    'Dunn','Kelley','Lawrence','Fields','Spencer','Stephens','Harvey','Bishop',
    'Daniels','Reynolds','Payne','Holland','Carr','Santiago','Knight','Mccoy'
  ];
  v_tiers TEXT[] := ARRAY['associate','active','senior','managing_director'];
  v_colors TEXT[] := ARRAY[
    'from-blue-600 to-blue-800','from-emerald-600 to-emerald-800',
    'from-purple-600 to-purple-900','from-rose-600 to-rose-800',
    'from-orange-600 to-orange-800','from-teal-600 to-teal-800',
    'from-indigo-600 to-indigo-800','from-pink-600 to-pink-800',
    'from-gold-600 to-gold-800','from-sequoia-700 to-sequoia-900'
  ];
  v_id UUID;
  v_fname TEXT;
  v_lname TEXT;
  v_email TEXT;
  v_tier TEXT;
  v_is_active BOOLEAN;
  v_onboarding_done BOOLEAN;
  v_created DATE;
  v_sponsor UUID;
  i INT;
  v_total INT := 2719; -- 219 active + 2500 inactive
  v_active_count INT := 219;
BEGIN
  -- First, create ~30 leaders (Managing Directors / Seniors) under Allen
  -- They will sponsor the rest of the agents
  v_leader_ids := ARRAY[]::UUID[];

  FOR i IN 1..30 LOOP
    v_id := gen_random_uuid();
    v_fname := v_first_names[1 + (i % array_length(v_first_names, 1))];
    v_lname := v_last_names[1 + ((i * 7) % array_length(v_last_names, 1))];
    v_email := lower(v_fname) || '.' || lower(v_lname) || i || '@seqagent.com';

    IF i <= 8 THEN
      v_tier := 'managing_director';
    ELSIF i <= 20 THEN
      v_tier := 'senior';
    ELSE
      v_tier := 'active';
    END IF;

    v_created := '2024-01-01'::date + (i * 5);

    INSERT INTO public.consultants (
      id, email, full_name, phone, consultant_id, tier, role,
      bio, avatar_color, referral_code, sponsor_id,
      is_active, onboarding_completed, onboarding_completed_at, created_at
    ) VALUES (
      v_id, v_email, v_fname || ' ' || v_lname,
      '(555) ' || lpad((100 + i)::text, 3, '0') || '-' || lpad((1000 + i * 3)::text, 4, '0'),
      'SEQ-2024-' || lpad(i::text, 4, '0'),
      v_tier, 'consultant',
      'Experienced consultant in the Sequoia network.',
      v_colors[1 + (i % array_length(v_colors, 1))],
      upper(left(v_fname, 3) || left(v_lname, 3)) || i,
      v_allen_id,
      TRUE, TRUE, v_created::timestamptz, v_created::timestamptz
    ) ON CONFLICT (email) DO NOTHING;

    v_leader_ids := array_append(v_leader_ids, v_id);
  END LOOP;

  -- Now create the remaining ~2689 agents
  FOR i IN 1..v_total LOOP
    v_id := gen_random_uuid();
    v_fname := v_first_names[1 + (i % array_length(v_first_names, 1))];
    v_lname := v_last_names[1 + ((i * 13 + 7) % array_length(v_last_names, 1))];
    v_email := lower(v_fname) || '.' || lower(v_lname) || '.' || i || '@seqagent.com';

    -- First 219 are active, rest inactive
    v_is_active := (i <= v_active_count);

    -- Distribute tiers: active agents get better tiers
    IF i <= 20 THEN
      v_tier := 'senior';
    ELSIF i <= 80 THEN
      v_tier := 'active';
    ELSE
      v_tier := 'associate';
    END IF;

    -- Active agents joined more recently, inactive ones joined earlier
    IF v_is_active THEN
      -- Active: joined in last 6 months
      v_created := CURRENT_DATE - (random() * 180)::int;
      v_onboarding_done := TRUE;
    ELSE
      -- Inactive: joined 6-24 months ago
      v_created := CURRENT_DATE - (180 + (random() * 540)::int);
      -- ~60% completed onboarding before going inactive
      v_onboarding_done := (random() < 0.6);
    END IF;

    -- Assign sponsor: randomly pick a leader, or Allen directly
    IF random() < 0.15 THEN
      v_sponsor := v_allen_id;
    ELSE
      v_sponsor := v_leader_ids[1 + (i % array_length(v_leader_ids, 1))];
    END IF;

    INSERT INTO public.consultants (
      id, email, full_name, phone, consultant_id, tier, role,
      bio, avatar_color, referral_code, sponsor_id,
      is_active, onboarding_completed, onboarding_completed_at, created_at
    ) VALUES (
      v_id, v_email, v_fname || ' ' || v_lname,
      '(555) ' || lpad((200 + (i % 800))::text, 3, '0') || '-' || lpad((2000 + i)::text, 4, '0'),
      'SEQ-B-' || lpad(i::text, 5, '0'),
      v_tier, 'consultant',
      CASE WHEN v_is_active
        THEN 'Active Sequoia consultant building their pipeline.'
        ELSE 'Previously active consultant — opportunity for reactivation.'
      END,
      v_colors[1 + (i % array_length(v_colors, 1))],
      upper(left(v_fname, 2) || left(v_lname, 2)) || i,
      v_sponsor,
      v_is_active,
      v_onboarding_done,
      CASE WHEN v_onboarding_done THEN (v_created + 7)::timestamptz ELSE NULL END,
      v_created::timestamptz
    ) ON CONFLICT (email) DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Seeded 30 leaders + % agents (% active, % inactive)',
    v_total, v_active_count, v_total - v_active_count;
END $$;

-- ============================================================
-- Part 2: Deals + Commissions for Allen ($1M) and Todd ($800K)
-- Plus deals spread across other active agents
-- ============================================================

DO $$
DECLARE
  v_allen_id UUID := '00000000-0000-0000-0000-000000000001';
  v_todd_id  UUID := '00000000-0000-0000-0000-000000000006';
  v_deal_id UUID;
  v_deal_date TIMESTAMPTZ;
  v_amount NUMERIC;
  v_comm NUMERIC;
  v_product TEXT;
  v_products TEXT[] := ARRAY['real_estate_lending','business_funding','property_restoration','clean_energy'];
  v_funding_types TEXT[] := ARRAY['Fix & Flip','Bridge Loan','DSCR Rental','Commercial RE','SBA 7(a)','Working Capital','MCA','Equipment Finance','Solar Install','EV Charger'];
  v_biz_names TEXT[] := ARRAY[
    'Pacific Capital Group','Sunrise Properties LLC','Metro Commercial Holdings','Evergreen Ventures',
    'Coastal Development Corp','Summit Real Estate Partners','Atlas Funding Group','Pinnacle Investments',
    'Harbor View Properties','Golden State Capital','Nexus Business Solutions','Titan Realty Group',
    'Silverline Commercial','Westfield Holdings','Beacon Capital Partners','Ironwood Properties',
    'Liberty Business Funding','Clearview Commercial','Vanguard Realty','Horizon Capital LLC',
    'Bridgewater Investments','Redwood Property Group','Sterling Commercial','Eastside Capital',
    'Northern Trust Realty','Trident Capital Corp','Sapphire Holdings','Diamond Peak Ventures',
    'Oak Creek Properties','Granite Ridge Capital','Majestic Realty Corp','Phoenix Capital Partners',
    'Blue Ridge Investments','Canyon Creek Capital','Emerald City Properties','Heritage Business Group',
    'Keystone Commercial','Lakewood Capital','Meridian Holdings','Newport Realty Partners'
  ];
  v_comm_types TEXT[] := ARRAY['loan_personal','loan_referral'];
  i INT;
  v_agent_id UUID;
  v_agents UUID[];
BEGIN

  -- ═══════════════════════════════════════════════════════════
  -- Allen Wu: ~$1M in commissions across ~40 deals
  -- ═══════════════════════════════════════════════════════════
  FOR i IN 1..40 LOOP
    v_deal_id := gen_random_uuid();
    -- Spread deals across last 12 months
    v_deal_date := CURRENT_DATE - ((random() * 365)::int || ' days')::interval;
    -- Deal sizes: $200K - $5M (commercial lending)
    v_amount := (200000 + (random() * 4800000)::int);
    -- Commission: 2% of funded amount
    v_comm := ROUND(v_amount * 0.02, 2);
    v_product := v_products[1 + (i % array_length(v_products, 1))];

    INSERT INTO public.leads (
      id, consultant_id, client_name, client_email, client_phone,
      business_name, funding_type, estimated_amount, status, funded_amount,
      product_category, created_at
    ) VALUES (
      v_deal_id, v_allen_id,
      'Client ' || i || ' (Allen)',
      'client.allen.' || i || '@example.com',
      '(555) 300-' || lpad(i::text, 4, '0'),
      v_biz_names[1 + (i % array_length(v_biz_names, 1))],
      v_funding_types[1 + (i % array_length(v_funding_types, 1))],
      '$' || TRIM(to_char(v_amount, '999,999,999')),
      'funded', v_amount,
      v_product, v_deal_date
    );

    -- Agent commission (personal deals for Allen)
    INSERT INTO public.commissions (
      consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id,
      waterfall_level, gross_commission,
      period_start, period_end, paid_at, created_at
    ) VALUES (
      v_allen_id, 'lead', v_deal_id,
      v_biz_names[1 + (i % array_length(v_biz_names, 1))] || ' — ' || v_funding_types[1 + (i % array_length(v_funding_types, 1))],
      'loan_personal', v_comm, 'paid', v_deal_id,
      0, v_comm,
      (v_deal_date::date), (v_deal_date::date + 15),
      v_deal_date + INTERVAL '7 days', v_deal_date
    );
  END LOOP;

  -- ═══════════════════════════════════════════════════════════
  -- Todd Billings: ~$800K in commissions across ~35 deals
  -- ═══════════════════════════════════════════════════════════
  FOR i IN 1..35 LOOP
    v_deal_id := gen_random_uuid();
    v_deal_date := CURRENT_DATE - ((random() * 365)::int || ' days')::interval;
    v_amount := (150000 + (random() * 4000000)::int);
    v_comm := ROUND(v_amount * 0.02, 2);
    v_product := v_products[1 + (i % array_length(v_products, 1))];

    INSERT INTO public.leads (
      id, consultant_id, client_name, client_email, client_phone,
      business_name, funding_type, estimated_amount, status, funded_amount,
      product_category, created_at
    ) VALUES (
      v_deal_id, v_todd_id,
      'Client ' || i || ' (Todd)',
      'client.todd.' || i || '@example.com',
      '(555) 400-' || lpad(i::text, 4, '0'),
      v_biz_names[1 + ((i + 15) % array_length(v_biz_names, 1))],
      v_funding_types[1 + ((i + 3) % array_length(v_funding_types, 1))],
      '$' || TRIM(to_char(v_amount, '999,999,999')),
      'funded', v_amount,
      v_product, v_deal_date
    );

    INSERT INTO public.commissions (
      consultant_id, source_type, source_id, source_label,
      commission_type, amount, status, deal_id,
      waterfall_level, gross_commission,
      period_start, period_end, paid_at, created_at
    ) VALUES (
      v_todd_id, 'lead', v_deal_id,
      v_biz_names[1 + ((i + 15) % array_length(v_biz_names, 1))] || ' — ' || v_funding_types[1 + ((i + 3) % array_length(v_funding_types, 1))],
      'loan_personal', v_comm, 'paid', v_deal_id,
      0, v_comm,
      (v_deal_date::date), (v_deal_date::date + 15),
      v_deal_date + INTERVAL '7 days', v_deal_date
    );
  END LOOP;

  -- ═══════════════════════════════════════════════════════════
  -- Other active agents: spread ~200 deals across the org
  -- Each gets 1-5 deals with smaller commission amounts
  -- ═══════════════════════════════════════════════════════════
  SELECT array_agg(id) INTO v_agents
  FROM public.consultants
  WHERE is_active = TRUE
    AND id NOT IN (v_allen_id, v_todd_id)
  LIMIT 150;

  IF v_agents IS NOT NULL THEN
    FOR i IN 1..200 LOOP
      v_agent_id := v_agents[1 + (i % array_length(v_agents, 1))];
      v_deal_id := gen_random_uuid();
      v_deal_date := CURRENT_DATE - ((random() * 300)::int || ' days')::interval;
      v_amount := (50000 + (random() * 2000000)::int);
      v_comm := ROUND(v_amount * 0.02, 2);
      v_product := v_products[1 + (i % array_length(v_products, 1))];

      INSERT INTO public.leads (
        id, consultant_id, client_name, client_email, client_phone,
        business_name, funding_type, estimated_amount, status, funded_amount,
        product_category, created_at
      ) VALUES (
        v_deal_id, v_agent_id,
        'Client ' || i,
        'client.agent.' || i || '@example.com',
        '(555) 500-' || lpad(i::text, 4, '0'),
        v_biz_names[1 + (i % array_length(v_biz_names, 1))],
        v_funding_types[1 + (i % array_length(v_funding_types, 1))],
        '$' || TRIM(to_char(v_amount, '999,999,999')),
        'funded', v_amount,
        v_product, v_deal_date
      );

      -- Agent commission
      INSERT INTO public.commissions (
        consultant_id, source_type, source_id, source_label,
        commission_type, amount, status, deal_id,
        waterfall_level, gross_commission,
        period_start, period_end, paid_at, created_at
      ) VALUES (
        v_agent_id, 'lead', v_deal_id,
        v_biz_names[1 + (i % array_length(v_biz_names, 1))] || ' — ' || v_funding_types[1 + (i % array_length(v_funding_types, 1))],
        v_comm_types[1 + (i % 2)], v_comm,
        CASE WHEN random() < 0.85 THEN 'paid' ELSE 'pending' END,
        v_deal_id, 0, v_comm,
        (v_deal_date::date), (v_deal_date::date + 15),
        CASE WHEN random() < 0.85 THEN v_deal_date + INTERVAL '7 days' ELSE NULL END,
        v_deal_date
      );

      -- Also create override commissions for Allen (L1) on every deal
      INSERT INTO public.commissions (
        consultant_id, source_type, source_id, source_label,
        commission_type, amount, status, deal_id,
        waterfall_level, gross_commission,
        period_start, period_end, paid_at, created_at
      ) VALUES (
        v_allen_id, 'lead', v_deal_id,
        v_biz_names[1 + (i % array_length(v_biz_names, 1))] || ' — Override',
        'revenue_share', ROUND(v_comm * 0.10, 2),
        CASE WHEN random() < 0.85 THEN 'paid' ELSE 'pending' END,
        v_deal_id, 1, v_comm,
        (v_deal_date::date), (v_deal_date::date + 15),
        CASE WHEN random() < 0.85 THEN v_deal_date + INTERVAL '7 days' ELSE NULL END,
        v_deal_date
      );
    END LOOP;
  END IF;

  RAISE NOTICE 'Seeded deals & commissions: Allen ~$1M, Todd ~$800K, + 200 org deals';
END $$;
