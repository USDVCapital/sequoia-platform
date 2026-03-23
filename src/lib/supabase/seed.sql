-- ============================================================
-- Sequoia Enterprise Solutions — Seed Data
-- ============================================================
-- Run AFTER schema.sql. Uses fixed UUIDs for referential integrity.
-- ============================================================

-- ── Consultants (10 from leaderboard + Allen Wu as admin) ───

INSERT INTO public.consultants (id, email, full_name, phone, consultant_id, tier, role, bio, avatar_color, referral_code, is_active, onboarding_completed, onboarding_completed_at, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'allen.wu@seqsolution.com', 'Allen Wu', '(301) 555-0100', 'SEQ-2025-0001', 'managing_director', 'admin', 'CEO & Founder of Sequoia Enterprise Solutions. Over 20 years of experience in commercial lending and business consulting.', 'from-gold-600 to-gold-800', 'ALLENWU', TRUE, TRUE, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'marcus.rivera@seqsolution.com', 'Marcus Rivera', '(555) 555-0102', 'SEQ-2025-1001', 'managing_director', 'consultant', 'Top producer specializing in commercial real estate and fix-and-flip financing.', 'from-gold-600 to-gold-800', 'MARCUS', TRUE, TRUE, '2025-02-01T00:00:00Z', '2025-02-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'priya.nair@seqsolution.com', 'Priya Nair', '(555) 555-0103', 'SEQ-2025-1002', 'managing_director', 'consultant', 'Expert in SBA lending and business funding solutions.', 'from-purple-600 to-purple-900', 'PRIYA', TRUE, TRUE, '2025-03-01T00:00:00Z', '2025-03-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'james.caldwell@seqsolution.com', 'James Caldwell', '(555) 555-0104', 'SEQ-2025-1003', 'senior', 'consultant', 'Senior consultant with deep expertise in DSCR and bridge lending.', 'from-emerald-600 to-emerald-800', 'JAMES', TRUE, TRUE, '2025-04-01T00:00:00Z', '2025-04-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'sarah.chen@seqsolution.com', 'Sarah Chen', '(555) 555-0105', 'SEQ-2025-1004', 'senior', 'consultant', 'Commercial real estate specialist focused on mixed-use and multifamily properties.', 'from-sequoia-700 to-sequoia-900', 'SARAH', TRUE, TRUE, '2025-05-01T00:00:00Z', '2025-05-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'todd.billings@example.com', 'Todd Billings', '(555) 214-8830', 'SEQ-2025-7842', 'active', 'consultant', 'Commercial lending consultant with a background in financial services. Passionate about helping small business owners and real estate investors access the capital they need to grow.', 'from-blue-600 to-blue-800', '222902', TRUE, TRUE, '2025-11-01T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000007', 'denise.okafor@seqsolution.com', 'Denise Okafor', '(555) 555-0107', 'SEQ-2025-1006', 'active', 'consultant', 'Active consultant focused on wellness program enrollments and business funding.', 'from-teal-600 to-teal-800', 'DENISE', TRUE, TRUE, '2025-06-01T00:00:00Z', '2025-06-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000008', 'kevin.torres@seqsolution.com', 'Kevin Torres', '(555) 555-0108', 'SEQ-2025-1007', 'active', 'consultant', 'Growing his pipeline through real estate investor referrals.', 'from-indigo-600 to-indigo-800', 'KEVIN', TRUE, TRUE, '2025-07-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000009', 'amara.williams@seqsolution.com', 'Amara Williams', '(555) 555-0109', 'SEQ-2025-1008', 'associate', 'consultant', 'New associate building her first pipeline with working capital deals.', 'from-rose-600 to-rose-800', 'AMARA', TRUE, TRUE, '2025-09-01T00:00:00Z', '2025-09-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000010', 'ryan.park@seqsolution.com', 'Ryan Park', '(555) 555-0110', 'SEQ-2025-1009', 'associate', 'consultant', 'Looking for referral strategies to build his book of business.', 'from-orange-600 to-orange-800', 'RYAN', TRUE, FALSE, NULL, '2025-10-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000011', 'lisa.fontaine@seqsolution.com', 'Lisa Fontaine', '(555) 555-0111', 'SEQ-2025-1010', 'associate', 'consultant', 'Getting started with clean energy and wellness programs.', 'from-pink-600 to-pink-800', 'LISA', TRUE, FALSE, NULL, '2025-11-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Leads / Deals (6 from pipeline, assigned to Todd) ───────

INSERT INTO public.leads (id, consultant_id, client_name, client_email, client_phone, business_name, funding_type, estimated_amount, status, funded_amount, advisor, next_step, estimated_close, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'Green Valley Dental Group', 'info@greenvalleydental.com', '(555) 100-0001', 'Green Valley Dental Group', 'EHMP Wellness', '47 employees', 'funded', NULL, 'Marcus Rivera', 'Quarterly wellness review scheduled', 'Ongoing', '2026-03-01T00:00:00Z'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'Sunrise Capital LLC', 'contact@sunrisecap.com', '(555) 100-0002', 'Sunrise Capital LLC', 'Fix & Flip', '$425,000', 'funded', 425000, 'Jessica Chen', 'Rehab draw #2 pending inspection', 'Funded Feb 15, 2026', '2026-02-15T00:00:00Z'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'Metro Logistics Inc', 'ops@metrologistics.com', '(555) 100-0003', 'Metro Logistics Inc', 'Working Capital', '$185,000', 'approved', NULL, 'David Park', 'Final docs to be signed by borrower', 'Mar 25, 2026', '2026-02-28T00:00:00Z'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'Pacific Rim Realty', 'deals@pacificrim.com', '(555) 100-0004', 'Pacific Rim Realty', 'Commercial RE', '$1,200,000', 'in_review', NULL, 'Sarah Thompson', 'Appraisal ordered — awaiting report', 'Apr 10, 2026', '2026-03-10T00:00:00Z'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'Oakwood Properties', 'info@oakwoodprops.com', '(555) 100-0005', 'Oakwood Properties', 'DSCR Rental', '$650,000', 'in_review', NULL, 'Marcus Rivera', 'Rent roll verification in progress', 'Apr 15, 2026', '2026-03-12T00:00:00Z'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'TechStart Solutions', 'founders@techstart.io', '(555) 100-0006', 'TechStart Solutions', 'SBA 7(a)', '$350,000', 'application', NULL, 'Jessica Chen', 'Collecting business tax returns (2023-2025)', 'May 1, 2026', '2026-03-18T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Wellness Enrollments ────────────────────────────────────

INSERT INTO public.wellness_enrollments (id, consultant_id, company_name, contact_name, contact_email, employee_count, monthly_rate, status, created_at) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'Green Valley Dental Group', 'Dr. Maria Santos', 'maria@greenvalleydental.com', 47, 18.00, 'active', '2026-01-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Commissions (matching earnings page) ────────────────────

INSERT INTO public.commissions (id, consultant_id, source_type, source_id, source_label, commission_type, amount, status, period_start, period_end, paid_at, created_at) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'wellness', '20000000-0000-0000-0000-000000000001', 'Green Valley Dental — EHMP', 'wellness_commission', 846, 'pending', '2026-03-01', '2026-03-15', NULL, '2026-03-15T00:00:00Z'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'lead', '10000000-0000-0000-0000-000000000003', 'Metro Logistics — Working Capital', 'loan_referral', 1850, 'paid', '2026-02-15', '2026-03-01', '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'lead', '10000000-0000-0000-0000-000000000002', 'Sunrise Capital — Fix & Flip', 'loan_referral', 1890, 'paid', '2026-02-01', '2026-02-15', '2026-02-15T00:00:00Z', '2026-02-15T00:00:00Z'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'wellness', '20000000-0000-0000-0000-000000000001', 'EHMP Monthly Residuals (47 employees)', 'wellness_residual', 846, 'paid', '2026-01-15', '2026-02-01', '2026-02-01T00:00:00Z', '2026-02-01T00:00:00Z'),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'lead', NULL, 'Harbor View — Multifamily', 'loan_referral', 2100, 'paid', '2026-01-01', '2026-01-15', '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'),
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'wellness', '20000000-0000-0000-0000-000000000001', 'EHMP Monthly Residuals (42 employees)', 'wellness_residual', 756, 'paid', '2025-12-15', '2026-01-01', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Training Videos (30 videos) ─────────────────────────────

INSERT INTO public.training_videos (id, youtube_id, title, category, duration, is_new, is_recommended, sort_order) VALUES
  ('40000000-0000-0000-0000-000000000001', 'RuWpu3IvhOk', 'Case Studies: Recently Closed Deals', 'Agent Training', '45:00', TRUE, FALSE, 1),
  ('40000000-0000-0000-0000-000000000002', 'TKGUzP5GrBI', 'Expediting Property Insurance Claims', 'Agent Training', '38:20', TRUE, FALSE, 2),
  ('40000000-0000-0000-0000-000000000003', 'vuxR-DSjLlI', 'SBA Eligibility: How to Avoid Common Pitfalls', 'Agent Training', '42:15', TRUE, FALSE, 3),
  ('40000000-0000-0000-0000-000000000004', 'QTZFGrV1zW0', 'Wellness Program (EHMP) Case Studies', 'Wellness/EHMP', '18:40', FALSE, TRUE, 4),
  ('40000000-0000-0000-0000-000000000005', 'QqbhPDwSUe4', 'Wellness Program Process Explained', 'Wellness/EHMP', '25:00', FALSE, TRUE, 5),
  ('40000000-0000-0000-0000-000000000006', 'mYKGH21_9ew', 'EHMP Deep Dive: A Closer Look', 'Wellness/EHMP', '20:30', FALSE, TRUE, 6),
  ('40000000-0000-0000-0000-000000000007', 'Srq_Xf2K3_w', 'How Employers Save More with EHMP', 'Wellness/EHMP', '22:45', FALSE, TRUE, 7),
  ('40000000-0000-0000-0000-000000000008', 'YwBu61B50JY', 'DSCR Loans Made Simple', 'Commercial Lending', '28:15', FALSE, FALSE, 8),
  ('40000000-0000-0000-0000-000000000009', 'M7THwiRrItA', 'Innovating Insurance Claims for Property Owners', 'Agent Training', '35:40', FALSE, FALSE, 9),
  ('40000000-0000-0000-0000-000000000010', '93SSkY3KunA', 'SBA Loans Explained: How SBA Lending Works', 'Commercial Lending', '32:10', FALSE, FALSE, 10),
  ('40000000-0000-0000-0000-000000000011', 'tekFBzCrmB4', 'The Year of the Hero | 2026 Strategy', 'Agent Training', '52:30', FALSE, FALSE, 11),
  ('40000000-0000-0000-0000-000000000012', 'Rv8JeFqpOlI', '2025 Year in Review & 2026 Vision', 'Agent Training', '58:30', FALSE, FALSE, 12),
  ('40000000-0000-0000-0000-000000000013', 'xtDxU9gHfrI', 'Non-Traditional Funding for Real Estate Investors', 'Commercial Lending', '34:15', FALSE, FALSE, 13),
  ('40000000-0000-0000-0000-000000000014', 'qs2bHkLCjms', 'Funding Solutions for Land Development', 'Commercial Lending', '29:00', FALSE, FALSE, 14),
  ('40000000-0000-0000-0000-000000000015', 'QJYI8H_0oSQ', 'How Emily Closed $500K+ in Commercial Loans', 'Success Stories', '12:45', FALSE, FALSE, 15),
  ('40000000-0000-0000-0000-000000000016', '15MuBpRAGiI', '1-Minute Guide: How to Access SEA', 'Wellness/EHMP', '1:30', FALSE, FALSE, 16),
  ('40000000-0000-0000-0000-000000000017', 'FULGTSH5knA', '100% Fix and Flip Loan', 'Commercial Lending', '19:45', FALSE, FALSE, 17),
  ('40000000-0000-0000-0000-000000000018', 'UU0iWIKVJdE', 'Gap Funding Explained', 'Commercial Lending', '23:10', FALSE, FALSE, 18),
  ('40000000-0000-0000-0000-000000000019', 'K7vX7QIQfvE', 'How to Enroll Clients in EHMP', 'Wellness/EHMP', '17:20', FALSE, FALSE, 19),
  ('40000000-0000-0000-0000-000000000020', '91mLzmXHX0E', 'Case Study: The Wellness Program', 'Wellness/EHMP', '14:55', FALSE, FALSE, 20),
  ('40000000-0000-0000-0000-000000000021', 'hhMmDcxK45E', '$652,000 Deal — Joseph Cordeira', 'Success Stories', '8:20', FALSE, FALSE, 21),
  ('40000000-0000-0000-0000-000000000022', 'OnR0ChPOwnc', 'EHMP: The Wellness Program Overview', 'Wellness/EHMP', '22:15', FALSE, FALSE, 22),
  ('40000000-0000-0000-0000-000000000023', 'EbdF1guVcWQ', 'How to Use TitanFile for File Collection', 'Agent Training', '11:40', FALSE, FALSE, 23),
  ('40000000-0000-0000-0000-000000000024', 'QTtiOX-lDy8', 'Top 10 Reasons Commercial Loans Fail', 'Commercial Lending', '24:30', FALSE, FALSE, 24),
  ('40000000-0000-0000-0000-000000000025', 're_L5_njqWM', 'Sequoia Loan Process Made Simple', 'Commercial Lending', '16:50', FALSE, FALSE, 25),
  ('40000000-0000-0000-0000-000000000026', 'YIc43aEYlZU', 'Live Interview with Sequoia Agents', 'Success Stories', '35:10', FALSE, FALSE, 26)
ON CONFLICT (youtube_id) DO NOTHING;

-- ── Training Progress (Todd's in-progress videos) ───────────

INSERT INTO public.training_progress (consultant_id, video_id, progress) VALUES
  ('00000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', 40),
  ('00000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000002', 75),
  ('00000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000003', 20)
ON CONFLICT (consultant_id, video_id) DO NOTHING;

-- ── Leaderboard Stats ───────────────────────────────────────

-- Monthly stats
INSERT INTO public.leaderboard_stats (consultant_id, period, funded_volume, wellness_enrollees, rank) VALUES
  ('00000000-0000-0000-0000-000000000002', 'monthly', 4820000, 48, 1),
  ('00000000-0000-0000-0000-000000000003', 'monthly', 3950000, 41, 2),
  ('00000000-0000-0000-0000-000000000004', 'monthly', 2780000, 37, 3),
  ('00000000-0000-0000-0000-000000000005', 'monthly', 2210000, 30, 4),
  ('00000000-0000-0000-0000-000000000006', 'monthly', 1650000, 22, 5),
  ('00000000-0000-0000-0000-000000000007', 'monthly', 1420000, 19, 6),
  ('00000000-0000-0000-0000-000000000008', 'monthly', 1080000, 17, 7),
  ('00000000-0000-0000-0000-000000000009', 'monthly', 720000, 13, 8),
  ('00000000-0000-0000-0000-000000000010', 'monthly', 490000, 9, 9),
  ('00000000-0000-0000-0000-000000000011', 'monthly', 310000, 6, 10)
ON CONFLICT (consultant_id, period) DO NOTHING;

-- All-time stats
INSERT INTO public.leaderboard_stats (consultant_id, period, funded_volume, wellness_enrollees, rank) VALUES
  ('00000000-0000-0000-0000-000000000002', 'all_time', 22400000, 312, 1),
  ('00000000-0000-0000-0000-000000000003', 'all_time', 19100000, 284, 2),
  ('00000000-0000-0000-0000-000000000004', 'all_time', 11600000, 198, 3),
  ('00000000-0000-0000-0000-000000000005', 'all_time', 9800000, 175, 4),
  ('00000000-0000-0000-0000-000000000006', 'all_time', 4250000, 88, 5),
  ('00000000-0000-0000-0000-000000000007', 'all_time', 3910000, 74, 6),
  ('00000000-0000-0000-0000-000000000008', 'all_time', 2700000, 61, 7),
  ('00000000-0000-0000-0000-000000000009', 'all_time', 1200000, 42, 8),
  ('00000000-0000-0000-0000-000000000010', 'all_time', 920000, 31, 9),
  ('00000000-0000-0000-0000-000000000011', 'all_time', 580000, 18, 10)
ON CONFLICT (consultant_id, period) DO NOTHING;

-- ── Community Posts (8 seed posts) ──────────────────────────

INSERT INTO public.community_posts (id, author_id, content, category, likes_count, comments_count, is_pinned, created_at) VALUES
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Just hit $22M in all-time funded volume. I remember when $1M felt impossible. If you''re in your first 90 days — just keep going. The compounding effect is real. Happy to jump on a call with anyone who wants to talk strategy.', 'win', 47, 14, TRUE, NOW() - INTERVAL '2 hours'),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Just closed my first commercial deal! $425K for a mixed-use property in Atlanta. Huge shoutout to the Wednesday training for the confidence boost — the objection handling module was a game-changer.', 'win', 34, 9, FALSE, NOW() - INTERVAL '4 hours'),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'Quick question for the group — has anyone had success pairing the wellness program pitch with commercial lending clients? Curious if there''s a talk track for doing both in the same conversation.', 'question', 12, 7, FALSE, NOW() - INTERVAL '6 hours'),
  ('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'TIP: Stop leading with rates. Clients don''t care about rates until they trust you. Lead with problems you solve — "We help business owners access capital they couldn''t get at a bank" lands 10x better. Tried this on 3 calls this week. 2 turned into deals.', 'tip', 63, 18, FALSE, NOW() - INTERVAL '1 day'),
  ('50000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'Enrolled my first 5-employee company into the wellness program today. It was a dental office — they''d been looking for a benefits solution for 2 years. Sometimes the easiest clients are right in your network.', 'win', 28, 5, FALSE, NOW() - INTERVAL '1 day'),
  ('50000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'Reminder: the new DSCR product update is live. We can now go up to 80% LTV on 1-4 unit properties with a 1.1 DSCR minimum. Big deal for investors who were getting turned down before. Check the portal for the updated one-pager.', 'announcement', 41, 11, FALSE, NOW() - INTERVAL '2 days'),
  ('50000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000010', 'Does anyone have a good script for cold outreach to CPAs? I feel like that''s a goldmine referral source but I have no idea how to approach them. Any help appreciated!', 'question', 9, 16, FALSE, NOW() - INTERVAL '3 days'),
  ('50000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000009', 'Finally got my first deal approved after 3 weeks of back and forth — $185K working capital for a trucking company. The underwriting team was incredibly helpful when I called in. Do NOT be afraid to pick up the phone!', 'win', 52, 12, FALSE, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ── Notifications (5 for Todd) ──────────────────────────────

INSERT INTO public.notifications (id, consultant_id, type, title, message, link, read, created_at) VALUES
  ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'deal_update', 'Deal Update', 'Your pipeline deal "Pacific Rim Realty" moved to In Review', '/portal/pipeline', FALSE, NOW() - INTERVAL '2 hours'),
  ('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'new_content', 'New Content', 'New training video: "SBA Loans: Eligibility & the Application"', '/portal/training', FALSE, NOW() - INTERVAL '1 day'),
  ('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'community', 'Community', 'Joseph C. liked your community post', '/portal/community', FALSE, NOW() - INTERVAL '2 days'),
  ('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'training', 'Training', 'Wednesday training replay is now available', '/portal/training', FALSE, NOW() - INTERVAL '3 days'),
  ('60000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'system', 'System', 'Welcome to Sequoia! Your account is active.', '/portal', TRUE, '2025-11-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Materials / Flyers (20 total) ───────────────────────────

INSERT INTO public.materials (title, filename, category, description, is_coming_soon, sort_order) VALUES
  ('New Construction Loans', '01_NEW_CONSTRUCTION_LOANS.pdf', 'Real Estate', 'Ground-up construction financing with draw schedules and flexible terms for residential and commercial projects.', FALSE, 1),
  ('Multi-Family Loan Program', '02_MULTI-FAMILY_LOAN_PROGRAM.pdf', 'Real Estate', 'Financing for 5+ unit apartment buildings including bridge, stabilized, and value-add multifamily properties.', FALSE, 2),
  ('Bridge Loan Program', '03_BRIDGE_LOAN_PROGRAM.pdf', 'Real Estate', 'Short-term bridge financing for time-sensitive acquisitions, repositioning, and value-add opportunities.', FALSE, 3),
  ('Fix & Flip — 3 Options', '04_FIX_and_FLIP_LOAN_3 OPTIONS_20250702.pdf', 'Real Estate', 'Comprehensive comparison of three fix-and-flip loan structures — choose the best fit for your investor clients.', FALSE, 4),
  ('Fix & Flip Loan Program', '04_FIX_and_FLIP_LOAN_PROGRAM.pdf', 'Real Estate', 'Standard fix-and-flip financing: up to 90% of purchase, 100% of rehab, based on 70% ARV. 5-10 day funding.', FALSE, 5),
  ('1-4 Unit Investment Properties', '07_1-4_UNIT_INVESTMENT_PROPERTIES.pdf', 'Real Estate', 'DSCR and investor loans for 1-4 unit rental properties. No income verification. 30-year fixed available.', FALSE, 6),
  ('Commercial Properties', '10_COMMERCIAL_PROPERTIES.pdf', 'Real Estate', 'Office, retail, industrial, and mixed-use commercial property financing from $500K to $50M.', FALSE, 7),
  ('Land Loan', '13_LAND_LOAN.pdf', 'Real Estate', 'Raw land, entitled land, and land with approved plans. Up to 65% LTV with 12-36 month terms.', FALSE, 8),
  ('Mixed-Use Properties', '14_MIXED-USED_PROPERTIES_LOAN.pdf', 'Real Estate', 'Financing for properties combining residential and commercial uses — retail ground floor with apartments above, etc.', FALSE, 9),
  ('EHMP Program Overview', NULL, 'EHMP / Wellness', 'The zero-cost wellness benefit for employers', TRUE, 10),
  ('EHMP Employer ROI One-Pager', NULL, 'EHMP / Wellness', 'How your company saves $500-$800 per employee per year', TRUE, 11),
  ('EHMP Consultant Pitch Guide', NULL, 'EHMP / Wellness', 'How to introduce the EHMP in 60 seconds', TRUE, 12),
  ('EHMP Welcome Call Script', NULL, 'EHMP / Wellness', 'What to say on your first employer call', TRUE, 13),
  ('Business Funding Overview', NULL, 'Business Funding', '8 programs for every stage of business growth', TRUE, 14),
  ('SBA Loan Guide', NULL, 'Business Funding', 'Is your client SBA-eligible? Here''s how to find out', TRUE, 15),
  ('Working Capital One-Pager', NULL, 'Business Funding', 'Fast funding for cash flow gaps', TRUE, 16),
  ('Commercial Solar Overview', NULL, 'Clean Energy', 'How to save 50-75% on electricity costs', TRUE, 17),
  ('EV Charging Station Guide', NULL, 'Clean Energy', 'Federal incentives + revenue generation', TRUE, 18);

-- ── Consultant Goals (Todd, 2026) ───────────────────────────

INSERT INTO public.consultant_goals (consultant_id, year, monthly_income_goal, ehmp_enrollees_goal, deals_to_close_goal) VALUES
  ('00000000-0000-0000-0000-000000000006', 2026, 5000, 100, 12)
ON CONFLICT (consultant_id, year) DO NOTHING;

-- ── Onboarding Checklist (Todd — all completed) ─────────────

INSERT INTO public.onboarding_checklist (consultant_id, step_id, label, description, completed, completed_at) VALUES
  ('00000000-0000-0000-0000-000000000006', 'complete-profile', 'Complete your profile', 'Add headshot, bio, phone', TRUE, '2025-11-02T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'watch-first30', 'Watch "Your First 30 Days" training video', 'Get up to speed quickly', TRUE, '2025-11-03T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'join-wednesday', 'Join the Wednesday live training', 'Live every Wed 8 PM ET', TRUE, '2025-11-05T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'submit-first-deal', 'Submit your first deal or EHMP lead', 'Start building your pipeline', TRUE, '2025-11-10T00:00:00Z')
ON CONFLICT (consultant_id, step_id) DO NOTHING;

-- ── Consultant Badges (Todd's earned badges) ────────────────

INSERT INTO public.consultant_badges (consultant_id, badge_type, label, description, earned_at) VALUES
  ('00000000-0000-0000-0000-000000000006', 'first-deal', 'First Deal', 'Funded your first commercial deal', '2026-01-15T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'training-completist', 'Training Completist', 'Completed 5+ training videos', '2025-12-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'wellness-pioneer', 'Wellness Pioneer', 'Enrolled your first employer in EHMP', '2026-02-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'rising-star', 'Rising Star', 'Hit $1M in funded volume', '2026-03-01T00:00:00Z')
ON CONFLICT (consultant_id, badge_type) DO NOTHING;

-- ── Payout Periods (recent periods) ─────────────────────────

INSERT INTO public.payout_periods (period_start, period_end, status, total_amount, paid_at) VALUES
  ('2025-12-15', '2026-01-01', 'paid', 756, '2026-01-01T00:00:00Z'),
  ('2026-01-01', '2026-01-15', 'paid', 2100, '2026-01-15T00:00:00Z'),
  ('2026-01-15', '2026-02-01', 'paid', 846, '2026-02-01T00:00:00Z'),
  ('2026-02-01', '2026-02-15', 'paid', 1890, '2026-02-15T00:00:00Z'),
  ('2026-02-15', '2026-03-01', 'paid', 1850, '2026-03-01T00:00:00Z'),
  ('2026-03-01', '2026-03-15', 'open', 846, NULL);
