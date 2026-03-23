# Development Log

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
