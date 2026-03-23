# Development Log

---

## 2026-03-23 (Session 2) — Database Infrastructure, Admin Panel, Onboarding, Commission Engine, Analytics, Testing
Built by: Todd Billings + Claude Code

### Tier 1: Database Foundation + Real Auth
- Expanded Supabase schema from 5 tables to 17 tables with full RLS policies, indexes, and triggers
- New tables: commissions, payout_periods, training_videos, training_progress, leaderboard_stats, notifications, materials, community_comments, community_likes, consultant_goals, onboarding_checklist, consultant_badges
- Added commission calculation Postgres functions: `calculate_loan_commission()` (trigger on deal funded), `generate_monthly_wellness_commissions()` (monthly batch)
- Created 4 analytics views: v_monthly_funded_volume, v_consultant_growth, v_enrollment_trend, v_conversion_funnel
- Built comprehensive seed data matching all mock data (11 consultants, 6 deals, 26 videos, 8 community posts, 18 materials, etc.)
- Replaced demo localStorage auth with real Supabase Auth (signInWithPassword, email confirmation callback, middleware route protection)
- Built complete data access layer: queries.ts (30+ server-side query functions) and mutations.ts (20+ server actions)
- Added storage buckets for avatars (public) and compliance-docs (private)

### Tier 2: Admin Panel (9 routes)
- Created `/admin` with dedicated layout, sidebar, and auth guard (role === 'admin')
- Admin Dashboard: stats overview with recent deals/submissions feeds
- Consultants: searchable/filterable directory with detail view, tier editing, activate/deactivate
- Deals: all deals across consultants with inline Approve/Fund/Decline actions
- Enrollments: EHMP enrollment tracking with monthly revenue summary
- Commissions: pending/paid summary with checkbox selection and bulk approve
- Submissions: contact form/application/partner inquiry review with expandable messages
- Content: training video + materials management with add video form
- Analytics: 5 Recharts visualizations (funded volume bars, consultant growth line, EHMP enrollment area, conversion funnel, commissions vs volume) with CSV export

### Tier 2: Commission Engine
- TypeScript commission engine with tiered rates: loans (0.5%–1.25% by tier), EHMP wellness (60%–90% by tier)
- Tier progression tracking with requirements (funded volume + wellness enrollees thresholds)
- EHMP projection calculator for the portal widget
- Payout period helpers (bi-monthly: 1st and 15th)
- 18 unit tests covering all tier/type combinations (all passing)

### Tier 2: Onboarding Wizard (7 steps)
- Separate `/onboarding` route with minimal dark layout and progress bar
- Step 1: Welcome — greeting with name/phone confirmation, Sequoia logo
- Step 2: Profile Photo — drag-and-drop upload to Supabase Storage avatars bucket
- Step 3: Professional Background — two textareas with character counters
- Step 4: Compliance — terms checkbox + document upload to compliance-docs bucket
- Step 5: First Training — embedded YouTube player with timer-based progress tracking
- Step 6: Set Goals — slider inputs for monthly income, EHMP enrollees, deals to close
- Step 7: Completion — celebration with CSS confetti, setup summary, portal redirect
- Portal layout redirects to /onboarding when onboarding_completed === false

### Tier 3: Real-time + Testing
- Real-time hooks: useRealtimePosts and useRealtimeNotifications via Supabase Realtime channels
- Playwright E2E test config + 3 spec files (auth flows, apply page, public pages)
- Vitest config + commission engine unit tests (18/18 passing)
- New npm scripts: test, test:watch, test:e2e, test:e2e:ui

### Bug Fixes & Auth Issues (major debugging session)
- Supabase JS client `.from().select()` was hanging in browser — replaced with direct `fetch()` using access token in AuthContext
- Logout was not clearing session — created server-side `/auth/logout` route and changed to synchronous `window.location.replace()`
- Portal layout redirect loop when consultant record couldn't be fetched — added null check for consultant before redirecting to onboarding
- Login page spinner never stopped — added try/catch and 10s timeout with error display
- Profile page showed hardcoded mock data — updated to pull from AuthContext
- Dashboard greeting showed hardcoded "Todd" — updated to use logged-in user's name
- Onboarding stuck on "Saving..." — added client-side fallback for completeOnboarding mutation
- Storage upload "Bucket not found" — created buckets + graceful error handling when missing
- Email confirmation required for Supabase Auth — confirmed via SQL

### New Files
- `src/lib/supabase/schema.sql` — Complete 17-table schema (rewritten)
- `src/lib/supabase/seed.sql` — Comprehensive seed data
- `src/lib/supabase/queries.ts` — 30+ server-side query functions
- `src/lib/supabase/mutations.ts` — 20+ server actions
- `src/lib/commission-engine.ts` — Commission calculation + tier progression
- `src/lib/__tests__/commission-engine.test.ts` — 18 unit tests
- `src/app/admin/layout.tsx` — Admin panel layout with sidebar
- `src/app/admin/page.tsx` — Admin dashboard
- `src/app/admin/consultants/page.tsx` + `[id]/page.tsx` — Consultant management
- `src/app/admin/deals/page.tsx` — Deal management
- `src/app/admin/enrollments/page.tsx` — EHMP enrollment tracking
- `src/app/admin/commissions/page.tsx` — Commission management
- `src/app/admin/submissions/page.tsx` — Form submission review
- `src/app/admin/content/page.tsx` — Content management
- `src/app/admin/analytics/page.tsx` — Analytics dashboard with Recharts
- `src/app/onboarding/layout.tsx` + `page.tsx` — Onboarding wizard
- `src/components/onboarding/Step*.tsx` — 7 step components
- `src/components/admin/DataTable.tsx` + `StatsCard.tsx` — Shared admin components
- `src/app/auth/callback/route.ts` — Email confirmation callback
- `src/app/auth/logout/route.ts` — Server-side logout
- `src/hooks/useRealtimePosts.ts` + `useRealtimeNotifications.ts` — Real-time hooks
- `playwright.config.ts` + `vitest.config.ts` — Test configs
- `e2e/auth.spec.ts` + `apply.spec.ts` + `public-pages.spec.ts` — E2E tests

### Decisions Made
- **Direct fetch() for consultant lookup**: The @supabase/ssr browser client's `.from().select()` hangs when called from `onAuthStateChange` callbacks — a deadlock. Replaced with direct `fetch()` using the access token.
- **Server-side logout route**: Client-side `supabase.auth.signOut()` doesn't reliably clear SSR cookies. Server-side route at `/auth/logout` handles it.
- **Demo data for analytics**: Supabase views return small seed data — analytics uses hardcoded demo data reflecting real business scale ($93M volume, 2,702 consultants) until production data is available.
- **2% blended commission rate**: Used for analytics display — represents average across all tiers and product types.
- **Onboarding redirect only with consultant record**: Portal layout checks `user.consultant !== null` before redirecting to onboarding, preventing infinite redirect loop when RLS blocks the consultant fetch.
- **Recharts over Chart.js**: React-native, tree-shakeable, no adapter layer needed.
- **Separate /admin layout**: Distinct from portal to avoid role-based complexity in a shared layout.

---

## 2026-03-22 (Session 1) — Full Platform Build: 0 to Production
Built by: Todd Billings + Claude Code

### Project Initialization
- Created Next.js 16 (App Router) project with TypeScript and Tailwind v4
- Set up GitHub repo at USDVCapital/sequoia-platform
- Deployed to Vercel (sequoia-platform.vercel.app)
- Established dev → main PR workflow with Vercel preview deployments

### Design System — Apple/Tesla Black/White/Gold Aesthetic
- Custom color palette: neutral grays (#0A0A0A–#FAFAFA), gold accent (#C8A84E scale)
- Replaced default Tailwind colors with Sequoia brand tokens in globals.css
- Built reusable UI components: Button (6 variants with inline color guarantees), Card, Badge, StatCard, SectionHeading
- Added real Sequoia logos (gold + black versions) to public/
- Resolved persistent CSS cascade issue: Tailwind v4 @layer utilities loses to unlayered CSS — fixed by removing explicit color from base heading styles

### Public Site — 16 Pages
- Homepage: hero video background, dual-funnel CTAs, Wednesday training countdown, animated stats (CountUp with IntersectionObserver), 4 verticals, wellness spotlight with earnings calculator, $3,500/mo consultant CTA, "Avoiding Failure" section, lead magnet email captures, real testimonials (Emily R, Joseph Cordeira, Fortune Homes), partner logos
- Solutions hub with 22-product accordion (4 tabs: Real Estate, Business Funding, Business Services, Clean Energy)
- Solutions sub-pages: /solutions/real-estate (7 products), /solutions/business-funding (8 products), /solutions/clean-energy (2 products), /solutions/wellness (EHMP with interactive slider)
- Apply: 2-step intake form with zod validation, trust signals sidebar, full success state
- Opportunity: Hormozi value-stack, 3 income streams, $29.99 card, 8-question FAQ accordion
- Enroll: validated form with terms checkbox, success state
- About: Allen Wu headshot, Vimeo company overview video, real partner logos, BBB accreditation
- Contact: validated form with success state, booking modal
- Partner: 3 partnership tiers, validated form with role/client count/model fields
- Reactivation: 30-Day Challenge for inactive consultants, money-back guarantee
- Resources: 12 real YouTube videos from @seqsolution, category filters, downloads section
- Terms of Service and Privacy Policy pages
- Login: split-screen, AuthContext integration, demo mode
- Branded 404 page

### Consultant Portal — 10 Pages (Protected)
- Dashboard: welcome banner, 4 quick stats, interactive onboarding checklist (localStorage), Deal of the Week (Joseph Cordeira $652K), My 2026 Goals widget (editable), EHMP Quick Calculator, daily action prompts, activity feed
- Pipeline: 6 demo deals with expandable details, color-coded status pills, summary metrics
- Earnings: 4 summary cards + 6-row earnings table (Paid/Pending)
- Training: 26 real YouTube videos, Continue Watching with progress bars, Recommended, New This Week
- Leaderboard: top 10 by funded volume + wellness enrollees
- Community: post composer with categories, filter tabs, like toggle, reply counts
- Materials: 18 flyers (9 real PDFs + 9 coming soon across EHMP, Business Funding, Clean Energy)
- CEA AI: keyword-matched responses for 13 topics, localStorage chat history
- Notifications: 5 typed notifications with color-coded icons
- Profile: editable fields, 7 badge types, referral links with copy-to-clipboard

### State Management — 4 React Contexts
- AuthContext: demo login/logout, localStorage persistence, auto-redirect
- NotificationContext: 4 default notifications, unread count, bell badge
- ProgressContext: video progress, checklist, streak, liked posts
- BookingContext: Calendly modal open/close

### Booking Modal
- Calendly embed (calendly.com/seqsolution/30min) in modal
- Wired on 7 pages: Solutions, Real Estate, Business Funding, Clean Energy, About, Partner, Contact

### Supabase Integration
- Project: vuphkhrrhgolwlkssazq.supabase.co
- contact_submissions table with RLS (public insert, service_role read)
- actions.ts with 4 async functions: submitApplication, submitContact, submitEnrollment, submitPartnerInquiry
- Graceful localStorage fallback when Supabase not configured
- All 4 forms wired and verified (HTTP 201 on test insert)
- Env vars added to Vercel (Production + Preview + Development)

### Email Templates (8, not yet connected to sending service)
- Welcome email for new consultants
- 4-week reactivation campaign sequence
- Weekly training reminder
- Deal funded celebration notification
- Shared email layout wrapper

### SEO & Performance
- sitemap.xml auto-generated with all public routes
- Unique document.title on every page
- Open Graph tags on root layout
- Lazy loading on below-fold images
- Hero video: preload="metadata" + poster fallback
- Wednesday training announcement bar (sticky, dismissible for 24h)

### Mobile Responsiveness
- 15 files audited and fixed for 375px viewport
- Earnings table has mobile card view
- Pipeline deal details stack on narrow screens
- Lead magnet forms stack vertically
- Stat cards/pills reduced padding for small screens

### Animation System
- Framer Motion: FadeIn, StaggerContainer, StaggerItem, CountUp
- ScrollToTop button (appears after 400px scroll)
- ScrollRestoration (pages start at top on navigation)

### Form Validation
- react-hook-form + zod on Apply, Contact, Enroll, Partner
- Error messages on blur with red borders
- Full success states (not toasts) on all 4 forms

### New Files Created
- 3 context providers (src/contexts/)
- 8 email templates (src/lib/emails/)
- Supabase: client, server, middleware, types, schema, actions
- 26 page files (src/app/**/page.tsx)
- Motion components: FadeIn, StaggerContainer, StaggerItem, CountUp, ScrollToTop, ScrollRestoration
- UI components: Button, Card, Badge, StatCard, SectionHeading, TrainingCountdown, TrainingAnnouncementBar, BookingModal, HeroVideo
- Layout: Navbar, Footer, LayoutShell, ClientProviders
- Legal: Terms, Privacy
- Sitemap generator
- /handoff skill command

### Decisions Made
- **Black/white/gold over forest green**: User requested Apple/Tesla aesthetic; forest green from original spec was not used
- **Inline styles for button text color**: Tailwind v4's @layer utilities loses cascade battles with unlayered CSS; inline styles guarantee visibility
- **Demo mode over real auth**: Supabase Auth scaffolded but not wired; demo login accepts any credentials for client presentation
- **LayoutShell pattern**: Navbar/Footer hidden on /portal/* routes since portal has its own sidebar — prevents duplicate navigation
- **localStorage for all portal state**: Checklist, goals, video progress, chat history, likes all persist in localStorage until real auth is connected
- **Calendly over Roam**: Switched booking embed from Roam to Calendly (calendly.com/seqsolution/30min) per user's preference
- **Contact_submissions as single table**: All 4 form types go to one table with a `role` field and `metadata` JSONB for type-specific data — simpler than 4 separate tables for the demo phase
