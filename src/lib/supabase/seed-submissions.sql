-- ============================================================
-- Seed Data: Contact Submissions
-- ============================================================
-- Generates 25 realistic contact form submissions across all types.
-- Run after base seed.
-- ============================================================

INSERT INTO public.contact_submissions (full_name, email, phone, role, message, reviewed, created_at)
VALUES
  -- Applicants wanting to become consultants
  ('Michael Patterson', 'mpatterson@gmail.com', '(301) 555-0101', 'applicant',
   'I''m interested in becoming a Licensed Consultant. I have 10 years of experience in real estate finance and a strong network of commercial property owners. Would love to discuss the opportunity.',
   FALSE, NOW() - INTERVAL '2 hours'),

  ('Sandra Vasquez', 'svasquez@outlook.com', '(240) 555-0102', 'applicant',
   'My colleague Marcus Rivera referred me. I''ve been in the lending industry for 5 years and want to explore the Sequoia opportunity. Can someone reach out to me?',
   FALSE, NOW() - INTERVAL '6 hours'),

  ('Derek Washington', 'dwashington@yahoo.com', '(703) 555-0103', 'applicant',
   'Looking to transition from traditional banking to independent consulting. I have a strong pipeline of small business clients who need funding. What are the next steps?',
   FALSE, NOW() - INTERVAL '1 day'),

  ('Jennifer Liu', 'jliu@techstart.io', '(202) 555-0104', 'applicant',
   'I attended your webinar on commercial lending last week and I''m very impressed with the compensation plan. I''d like to apply as a consultant.',
   TRUE, NOW() - INTERVAL '2 days'),

  ('Carlos Mendez', 'cmendez@gmail.com', '(443) 555-0105', 'applicant',
   'I currently run a small insurance agency and think the EHMP wellness program could be a great add-on for my existing client base. Can we schedule a call?',
   TRUE, NOW() - INTERVAL '3 days'),

  ('Rachel Kim', 'rkim@capitaladvisors.com', '(571) 555-0106', 'applicant',
   'I have 15 years in financial advisory and want to diversify my revenue streams. The 7-stream compensation model is very compelling. Please send me enrollment information.',
   FALSE, NOW() - INTERVAL '4 days'),

  -- Enrollment inquiries
  ('Dr. James Mitchell', 'jmitchell@mitchelldental.com', '(301) 555-0201', 'enrollment',
   'We''re a dental practice with 85 employees and interested in the EHMP wellness program. What are the enrollment requirements and timeline?',
   FALSE, NOW() - INTERVAL '3 hours'),

  ('Lisa Chen', 'lchen@pacificlogistics.com', '(240) 555-0202', 'enrollment',
   'Our company has 250 employees. We need a wellness program that integrates with our existing benefits. Can you send us a comparison with our current provider?',
   FALSE, NOW() - INTERVAL '1 day'),

  ('Robert Torres', 'rtorres@sunrisemanufacturing.com', '(410) 555-0203', 'enrollment',
   'We''re a manufacturing company with 180 employees looking to improve our employee retention through better wellness benefits. What does EHMP cover?',
   TRUE, NOW() - INTERVAL '5 days'),

  ('Amanda Foster', 'afoster@brightpathhr.com', '(703) 555-0204', 'enrollment',
   'I''m an HR director at a tech company with 120 employees. We''re interested in switching our wellness program. What''s the onboarding process?',
   TRUE, NOW() - INTERVAL '7 days'),

  -- General inquiries
  ('David Park', 'dpark@parkproperties.com', '(301) 555-0301', 'general',
   'I own several commercial properties and need financing for renovations. What commercial loan products do you offer and what are the current rates?',
   FALSE, NOW() - INTERVAL '5 hours'),

  ('Maria Santos', 'msantos@gmail.com', '(240) 555-0302', 'general',
   'I''m looking for a fix and flip loan for a property in Silver Spring, MD. The purchase price is $350K and rehab budget is $75K. Do you work in this area?',
   FALSE, NOW() - INTERVAL '12 hours'),

  ('Thomas Wright', 'twright@wrightconstruction.com', '(443) 555-0303', 'general',
   'We need construction financing for a 24-unit multifamily project in Baltimore County. Estimated project cost is $4.2M. What''s your process?',
   TRUE, NOW() - INTERVAL '3 days'),

  ('Nicole Adams', 'nadams@greenroofco.com', '(571) 555-0304', 'general',
   'We''re interested in commercial solar installation financing for our warehouse facilities. Total project estimate is $1.8M across 3 locations.',
   FALSE, NOW() - INTERVAL '2 days'),

  ('Kevin O''Brien', 'kobrien@obrienauto.com', '(202) 555-0305', 'general',
   'I need working capital for my auto dealership. Looking for $500K to expand inventory. What are your terms and approval timeline?',
   TRUE, NOW() - INTERVAL '6 days'),

  ('Stephanie Lee', 'slee@leecatering.com', '(301) 555-0306', 'general',
   'Our catering business needs equipment financing for a new commercial kitchen. Budget is around $200K. What documents do you need?',
   FALSE, NOW() - INTERVAL '1 day'),

  -- Partner inquiries
  ('Mark Thompson', 'mthompson@capitalonelending.com', '(202) 555-0401', 'partner',
   'I run a mortgage brokerage and I''m interested in a referral partnership with Sequoia for commercial deals that don''t fit conventional lending. Can we discuss?',
   FALSE, NOW() - INTERVAL '4 hours'),

  ('Jessica Rodriguez', 'jrodriguez@greenbuilders.org', '(240) 555-0402', 'partner',
   'We''re a green building association and would love to partner with Sequoia on clean energy financing for our members. Over 200 contractors in our network.',
   FALSE, NOW() - INTERVAL '1 day'),

  ('Brian O''Connor', 'boconnor@restorationpros.com', '(443) 555-0403', 'partner',
   'I have a property restoration company and want to become a preferred vendor for Sequoia''s restoration program. We handle fire, water, and storm damage across the DMV.',
   TRUE, NOW() - INTERVAL '4 days'),

  ('Angela Murray', 'amurray@wellnessworks.com', '(571) 555-0404', 'partner',
   'We provide corporate wellness consulting and would like to explore co-marketing the EHMP program to our client base of 50+ mid-size companies.',
   TRUE, NOW() - INTERVAL '8 days'),

  -- More recent applicants (to show activity)
  ('James Cooper', 'jcooper@outlook.com', '(301) 555-0501', 'applicant',
   'Experienced commercial real estate broker looking to add lending services. I have relationships with over 100 property investors in the DC metro area.',
   FALSE, NOW() - INTERVAL '30 minutes'),

  ('Priscilla Nguyen', 'pnguyen@gmail.com', '(240) 555-0502', 'applicant',
   'I attended the Thursday training call and I''m ready to enroll. My sponsor is Priya Nair. Please send me the onboarding materials.',
   FALSE, NOW() - INTERVAL '45 minutes'),

  ('Anthony Davis', 'adavis@davisfinancial.com', '(703) 555-0503', 'applicant',
   'Financial planner with a book of 200+ clients. Many need business funding and I currently have nowhere to send them. Sequoia looks like a perfect fit.',
   FALSE, NOW() - INTERVAL '4 hours'),

  ('Rebecca Hart', 'rhart@hartinsurance.com', '(202) 555-0504', 'applicant',
   'Insurance agent interested in cross-selling the EHMP wellness program. I serve 75 small businesses. When is the next onboarding session?',
   FALSE, NOW() - INTERVAL '8 hours'),

  ('Omar Hassan', 'ohassan@gmail.com', '(443) 555-0505', 'applicant',
   'I met Allen Wu at the real estate networking event last week. Very interested in the Sequoia platform. I have a strong background in SBA lending.',
   FALSE, NOW() - INTERVAL '16 hours')

ON CONFLICT DO NOTHING;
