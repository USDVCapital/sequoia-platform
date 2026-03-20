# Sequoia Enterprise Solutions — Final Claude Code Pre-Delivery Prompt
**Prepared:** March 20, 2026 | **Based on:** Live site audit of sequoia-platform.vercel.app (24 routes)

---

## Part 0: Site Audit Summary — What Is Working vs. What Needs Fixing

Before the implementation instructions, this section documents the current state of every page so you have full context.

### What Is Working Well

The rebuilt site is substantially complete and represents a major improvement over the original. The following are genuinely strong:

- The Solutions pages (`/solutions`, `/solutions/real-estate`, `/solutions/business-funding`, `/solutions/clean-energy`) have accurate, detailed product criteria for all 22 products across 4 verticals. This is the most content-complete section of the site.
- The EHMP Wellness page (`/solutions/wellness`) has the interactive income slider, the employer savings narrative, and the consultant commission math — all correctly implemented.
- The Consultant Opportunity page (`/opportunity`) has the Hormozi value stack, 3 income streams, the $29.99 pricing card, and real testimonials from Joseph Cordeira and Emily.
- The Portal Training page (`/portal/training`) has Continue Watching with progress bars, Recommended, New This Week, and Completed sections — the Netflix-style architecture is correct.
- The Community Feed (`/portal/community`) has post composer, category badges, like toggle, and realistic demo posts from named consultants.
- The 30-Day Reactivation Challenge (`/reactivation`) has the 4-week timeline with specific daily actions and the money-back guarantee.
- The Leaderboard (`/portal/leaderboard`) correctly shows Todd Billings at #5 with tier progress and the gap to the next rank.
- The Marketing Materials page (`/portal/materials`) has 9 real estate product flyers with search and category filter.
- The About page has the Vimeo embed, real partner logos, 2025 milestones, and Allen Wu's leadership section.
- The Apply form (`/apply`) has the 2-step concierge intake with trust signals and the "not a loan application" framing.

### Critical Issues Found During Audit

The following issues were identified during the live page-by-page review and must be addressed before client delivery.

---

## Part 1: Critical Bugs and Missing Features (Must Fix Before Delivery)

### 1.1 Pipeline Page — Table Is Empty

**Page:** `/portal/pipeline`

**Issue:** The pipeline table renders with headers (Client, Deal Type, Amount, Status, Submitted) but no rows. The summary metrics show "8 total deals, 2 in review, 2 approved, $245,000 total funded" but the table below is completely empty. This is the most visible bug in the portal — a consultant's first view of their pipeline is a blank table.

**Fix Required:** Populate the pipeline table with 6–8 demo deals that match the summary metrics. The deals should include:
- Green Valley Dental Group | EHMP Wellness | 47 employees | Active | March 1, 2026
- Sunrise Capital LLC | Fix & Flip | $425,000 | Funded | February 15, 2026
- Metro Logistics Inc | Working Capital | $185,000 | Approved | February 28, 2026
- Pacific Rim Realty | Commercial RE | $1,200,000 | In Review | March 10, 2026
- Oakwood Properties | DSCR Rental | $650,000 | In Review | March 12, 2026
- TechStart Solutions | SBA 7(a) | $350,000 | Application | March 18, 2026

Each row should be clickable and expand to show deal details: submitted date, advisor assigned, next step, and estimated close date.

### 1.2 Resources Page — Video Grid Is Missing

**Page:** `/resources`

**Issue:** The public Resources/Training Library page shows only the Wednesday countdown timer and 5 downloadable PDFs. The 190+ video grid that is described in the sitemap is completely absent. A prospective consultant visiting this page to evaluate the training quality sees nothing.

**Fix Required:** Add a preview video grid below the downloads section showing 8–12 sample videos (teaser content, not gated). Use the same card design as `/portal/training`. Include category filter tabs: All, Agent Training, Product Deep Dives, Success Stories, Wellness/EHMP. Show a "190+ videos available to members" CTA at the bottom linking to `/enroll`. The Wednesday countdown timer should be more prominent — move it above the fold as the first element after the hero.

### 1.3 Marketing Materials — Missing EHMP, Business Funding, and Clean Energy Flyers

**Page:** `/portal/materials`

**Issue:** All 9 flyers in the Marketing Materials page are Real Estate products only (New Construction, Multi-Family, Bridge, Fix & Flip x2, 1-4 Unit, Commercial, Land, Mixed-Use). There are zero flyers for EHMP/Wellness, Business Funding, or Clean Energy — the three other product verticals. This directly contradicts the back office audit finding that EHMP marketing materials are the most important untapped asset.

**Fix Required:** Add the following flyer cards to the Marketing Materials page:

**EHMP / Wellness (new category):**
- EHMP Program Overview — "The zero-cost wellness benefit for employers"
- EHMP Employer ROI One-Pager — "How your company saves $500–$800 per employee per year"
- EHMP Consultant Pitch Guide — "How to introduce the EHMP in 60 seconds"
- EHMP Welcome Call Script — "What to say on your first employer call"

**Business Funding (new category):**
- Business Funding Overview — "8 programs for every stage of business growth"
- SBA Loan Guide — "Is your client SBA-eligible? Here's how to find out"
- Working Capital One-Pager — "Fast funding for cash flow gaps"

**Clean Energy (new category):**
- Commercial Solar Overview — "How to save 50–75% on electricity costs"
- EV Charging Station Guide — "Federal incentives + revenue generation"

Each card should follow the same design as the existing Real Estate flyers: category badge, title, description, and Download + Preview buttons.

### 1.4 Dashboard — Onboarding Checklist Is Incomplete

**Page:** `/portal`

**Issue:** The "Getting Started Checklist" shows "2/4 complete" but only renders the completion fraction — the actual checklist items are not visible in the page content. A new consultant cannot see what the 4 steps are or check them off.

**Fix Required:** Render the full checklist as an interactive accordion or card list with checkboxes. The 4 items should be:
1. Complete your profile (add headshot, bio, and phone) — link to `/portal/profile`
2. Watch "Your First 30 Days" training video — link to `/portal/training`
3. Join the Wednesday live training — link to the Zoom URL
4. Submit your first deal or EHMP lead — link to `/portal/pipeline`

Each item should have a checkbox that persists via localStorage, a completion timestamp when checked, and a progress bar that updates as items are completed. When all 4 are complete, show a congratulations banner: "You're ready. Your first deal is within reach."

### 1.5 Dashboard — "Deal of the Week" Section Is Missing

**Page:** `/portal`

**Issue:** The sitemap specifies a "Deal of the Week" widget on the Dashboard, but it is not present in the rendered page. This is one of the highest-engagement features identified in the redesign plan — a rotating spotlight on a real funded deal that motivates consultants.

**Fix Required:** Add a "Deal of the Week" card to the Dashboard below the activity feed. The card should include:
- Deal title: "This Week's Featured Deal"
- Deal type badge (e.g., "Fix & Flip")
- Amount funded: "$652,000"
- Consultant: "Joseph Cordeira"
- One-sentence story: "Joseph found this mixed-use property client through a real estate agent referral — his third deal in 90 days."
- CTA button: "See How He Did It" linking to the Joseph Cordeira success story in `/portal/training`

Rotate the featured deal weekly (use a static array with a week-number index to select the current entry).

### 1.6 Profile Page — Referral Link Is Missing

**Page:** `/portal/profile`

**Issue:** The My Profile page shows stats, badges, and editable fields but does not display the consultant's personal referral link — the single most important marketing tool in the entire platform. The back office audit found that the referral link is buried 3 levels deep in the old system; the new platform must surface it prominently.

**Fix Required:** Add a "My Referral Links" section to the Profile page (and also to the Dashboard as a quick-copy widget). The section should show:
- Personal site URL: `https://[consultantname].seqsolution.com`
- EHMP referral link: `https://seqsolution.com/wellness?ref=[ID]`
- Business funding referral link: `https://seqsolution.com/apply?ref=[ID]`
- QR code generator button for each link (opens a modal with a downloadable QR code image)
- One-click copy button for each link with a "Copied!" toast confirmation

### 1.7 Login Page — No Redirect to Portal After Login

**Page:** `/login`

**Issue:** The login page renders correctly with the split-screen design and the demo mode note. However, based on the page content, there is no visible indication of what happens after login — no "Sign In" button text is visible in the extracted content, and the AuthContext integration needs to be verified to ensure it redirects to `/portal` after successful demo login.

**Fix Required:** Verify that the login form submits correctly in demo mode (any email + any password), sets the AuthContext `isAuthenticated` state to true, stores the user object in localStorage, and redirects to `/portal`. Add a loading state during the "authentication" (500ms delay for realism). If the user is already authenticated and visits `/login`, redirect them directly to `/portal`.

### 1.8 Booking Modal — Zoom Link Is Placeholder

**Page:** `/resources` and throughout the site

**Issue:** The Wednesday training Zoom link on the Resources page points to `https://zoom.us/` — the generic Zoom homepage, not the actual Sequoia training Zoom link. This is a placeholder that will confuse consultants who click it.

**Fix Required:** Replace `https://zoom.us/` with the actual Sequoia Wednesday training Zoom link. If the real link is not yet available, use `https://zoom.us/j/seqsolution` as a clearly labeled placeholder and add a code comment: `// TODO: Replace with actual Sequoia Wednesday training Zoom link`. Also ensure the booking modal (Roam embed) on the 7 pages where it appears is configured with the correct Calendly/Roam URL for Sequoia — not a placeholder.

---

## Part 2: Content and Copy Improvements (High Priority)

### 2.1 Homepage — CountUp Animation Shows "0+" Instead of Real Numbers

**Page:** `/`

**Issue:** The stats section on the homepage shows "0+ Vetted Lending Partners" instead of animating up to "500+". The CountUp animation is either not triggering on scroll or is completing before the user sees it. This makes the homepage look broken and undermines the social proof section.

**Fix Required:** Implement a proper IntersectionObserver-based CountUp that triggers when the stats section enters the viewport. The four stats should animate to:
- 500+ (Vetted Lending Partners) — animate from 0 to 500 over 2 seconds
- $70.4M (Funded in 2025) — animate from 0 to 70.4 over 2.5 seconds with "M" suffix
- 2,500+ (Consultant Network) — animate from 0 to 2500 over 2 seconds
- 190+ (Training Videos) — animate from 0 to 190 over 1.5 seconds

Use `requestAnimationFrame` for smooth animation. Ensure the animation only plays once (not on every scroll).

### 2.2 Homepage — Wednesday Training Countdown Is Not Visible Above the Fold

**Page:** `/`

**Issue:** The Wednesday training countdown is listed in the sitemap as a homepage feature, but it is not visible in the extracted homepage content. This is the single most important engagement driver identified in the original audit — the live training must be prominently featured.

**Fix Required:** Add a sticky announcement bar at the very top of the homepage (above the navbar) with a live countdown to the next Wednesday 8 PM ET training. The bar should be forest green with gold text: "Next Live Training: Wednesday at 8 PM ET — [X days, X hours, X minutes away] — Join on Zoom." Include a dismiss button (X) that hides the bar via localStorage for 24 hours. On Wednesday evenings between 7:45 PM and 10 PM ET, change the bar to: "Training is LIVE right now — Join on Zoom."

### 2.3 About Page — Allen Wu Headshot Is Missing

**Page:** `/about`

**Issue:** The About page has Allen Wu's leadership section with his quote and bio, but there is no headshot image. The original site had a photo of Allen Wu. A leadership section without a photo feels impersonal and reduces trust.

**Fix Required:** Add a professional headshot placeholder for Allen Wu. If a real photo is not available, use a high-quality AI-generated professional headshot (dark suit, neutral background) with a note in the code: `// TODO: Replace with Allen Wu's actual headshot — contact marketing@seqsolution.com`. The image should be circular, 120px diameter, positioned to the left of the quote block.

### 2.4 Opportunity Page — FAQ Accordion Is Not Rendering

**Page:** `/opportunity`

**Issue:** The Consultant Opportunity page ends with "Common Questions — Straight answers to the questions every new consultant asks before enrolling" but no FAQ items are visible in the extracted content. The accordion component is either not rendering or the FAQ data is empty.

**Fix Required:** Populate the FAQ accordion with the following 8 questions and answers:

**Q: Do I need a license to refer clients?**
A: No. Sequoia consultants refer clients — they do not originate loans. No mortgage license, securities license, or insurance license is required to participate in the referral program. We recommend consulting with a local attorney if you have specific questions about your state's regulations.

**Q: How quickly can I earn my first commission?**
A: Most consultants who follow the 30-Day Challenge framework close their first EHMP deal within 30 days. EHMP commissions are the fastest path to income because the employer conversation is straightforward and the product costs them nothing.

**Q: What is the $29.99/month membership fee for?**
A: Your membership gives you access to 500+ vetted lending partners, the full product suite, the CEA AI assistant, 190+ training videos, weekly live training, your personal replicated website, and the back office with real-time deal tracking. It is a professional platform subscription, not a product purchase.

**Q: Can I do this part-time?**
A: Absolutely. Many of our most successful consultants started part-time alongside existing careers. The EHMP program in particular is designed for professionals who already have business owner relationships — it is an add-on conversation, not a full-time job.

**Q: Is there a money-back guarantee?**
A: Yes. Complete the 30-Day Reactivation Challenge in full and do not close a deal, and we will refund your membership fee for that month. No questions asked.

**Q: How does the revenue share work?**
A: When you introduce other professionals to Sequoia and they enroll, you earn a percentage of their funded deal commissions and wellness enrollments. The exact structure is detailed in the Compensation 6.0 document available in the training library.

**Q: What support is available after I enroll?**
A: You have access to weekly live training every Wednesday at 8 PM ET, 190+ on-demand training videos, the CEA AI assistant for instant product guidance, the community feed for peer support, and direct access to the Sequoia team at 301-337-8035.

**Q: What happens if I want to cancel?**
A: You can cancel your membership at any time with no penalty. Your back office access continues through the end of your current billing period. There are no long-term contracts or cancellation fees.

### 2.5 Partner Page — Contact Form Is Missing

**Page:** `/partner`

**Issue:** The Partner page has a "Get in Touch — Schedule a Partnership Call" section with a heading, but the actual contact form is not rendering. The page ends with "Tell us about your business and we will connect you with the right partnership model" but no form fields are visible.

**Fix Required:** Add a validated contact form to the Partner page with the following fields:
- Full Name (required)
- Email Address (required, email validation)
- Phone Number (required)
- Professional Role (dropdown: Real Estate Agent, Loan Officer, Insurance Agent, CPA/Accountant, Financial Advisor, Attorney, Other)
- How many business owner clients do you work with? (dropdown: 1–10, 11–50, 51–100, 100+)
- Which partnership model interests you? (radio: Referral Partner, Independent Consultant, Team Leader)
- Message (optional, textarea)
- Submit button: "Schedule My Partnership Call"

On successful submission, show a confirmation message: "Thank you, [Name]. A Sequoia partnership advisor will contact you within one business day. In the meantime, explore our solutions at /solutions."

---

## Part 3: Design and UX Polish (Important for World-Class Delivery)

### 3.1 Mobile Navigation — Hamburger Menu Must Be Verified

The site uses a responsive navbar, but the mobile hamburger menu behavior must be verified on small screens. Ensure:
- The mobile menu opens with a smooth slide-down or slide-right animation (not an abrupt toggle)
- The Solutions and For Consultants dropdowns work as accordions on mobile (not hover-triggered)
- The "Get Funding" and "Consultant Login" CTAs are both visible in the mobile menu
- The portal secondary nav bar collapses correctly on mobile

### 3.2 Scroll-to-Top Button

Add a scroll-to-top button that appears after the user scrolls 400px down any page. The button should be a small circular gold button (40px) with an upward chevron icon, positioned in the bottom-right corner (above the footer). Animate it in with a fade + scale transition. This is especially important on the long Solutions and Opportunity pages.

### 3.3 Page Transition Animations

Framer Motion is listed as an installed dependency. Ensure all page transitions use a consistent `FadeIn` animation: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.4, ease: "easeOut" }}`. Apply this to every page's root container. Without this, navigation between pages feels abrupt and unpolished.

### 3.4 Form Success States

Every form on the site (Apply, Contact, Enroll, Partner) must have a clearly designed success state that replaces the form after submission. The success state should include:
- A large green checkmark icon
- A headline: "You're all set, [First Name]."
- A subheading with the specific next step (e.g., "A Sequoia advisor will contact you within one business day.")
- A secondary CTA (e.g., "While you wait, explore our solutions" or "Learn about the consultant opportunity")

Do not use a toast notification alone — the full form area should transform into the success state.

### 3.5 Active Navigation Highlighting

The current active page should be highlighted in the navbar. Use an underline or color change on the active nav item. In the portal sidebar, the active page should have a filled background highlight (forest green background, gold text). This is a basic UX convention that appears to be missing.

### 3.6 Footer — Social Links Must Open in New Tab

All social links in the footer (YouTube, LinkedIn, Instagram, Facebook) must have `target="_blank"` and `rel="noopener noreferrer"`. Verify this is implemented.

### 3.7 Footer — Copyright Year and Company Name

Verify the footer reads "Copyright © 2026 Sequoia Enterprise Solutions. All Rights Reserved." — not "Sequoia Lending" or "2024" or "2025". This was a critical branding violation in the original back office.

---

## Part 4: New Features to Build (Pre-Delivery Additions)

### 4.1 Earnings Page — `/portal/earnings`

This page is missing entirely from the current build but is listed as a required portal page in the back office audit. Build it with:

**Header:** "My Earnings" with the current period dates

**Summary cards (4):**
- Open Period: $2,340 (estimated, pending close)
- Last Period: $1,890 (paid March 1, 2026)
- This Year: $8,640
- All Time: $24,750

**Earnings breakdown table:**
| Date | Deal / Source | Type | Amount | Status |
|---|---|---|---|---|
| Mar 15 | Green Valley Dental — EHMP | Wellness Commission | $846 | Pending |
| Mar 1 | Metro Logistics — Working Capital | Loan Referral | $1,850 | Paid |
| Feb 15 | Sunrise Capital — Fix & Flip | Loan Referral | $1,890 | Paid |
| Feb 1 | EHMP Monthly Residuals (47 employees) | Wellness Residual | $846 | Paid |

**Smart empty state (for new consultants with $0 earned):**
Show a motivational card instead of a blank table: "Your first commission is one conversation away. The average EHMP placement pays $846/month in recurring income. Here's what to do today:" with 3 action buttons linking to the training, pipeline, and community pages.

**Add to portal sidebar navigation** between "My Pipeline" and "Training."

### 4.2 Notifications Page — `/portal/notifications`

The navbar shows a notification bell with an unread badge (4 notifications), but clicking it should open a dropdown AND there should be a full notifications page. Build:

**Notification bell dropdown (in navbar):**
- Show the 4 most recent notifications
- "Mark all read" button
- "View all" link to `/portal/notifications`

**Full notifications page:**
| Notification | Type | Time |
|---|---|---|
| Your pipeline deal "Pacific Rim Realty" moved to In Review | Deal Update | 2 hours ago |
| New training video: "SBA Loans: Eligibility & the Application" | New Content | 1 day ago |
| Joseph C. liked your community post | Community | 2 days ago |
| Wednesday training replay is now available | Training | 3 days ago |
| Welcome to Sequoia! Your account is active. | System | Nov 15, 2025 |

Notification types should have distinct icons and color badges: deal updates (gold), new content (green), community (blue), training (purple), system (gray).

### 4.3 Vision Board / Goals Widget on Dashboard

Add a "My 2026 Goals" widget to the Dashboard (below the checklist). The widget should show 3 editable goal fields:
- Monthly Income Goal: $[editable number]
- EHMP Enrollees Goal: [editable number] employees
- Deals to Close: [editable number] deals

Below each goal, show a progress bar with current progress vs. goal. Values persist via localStorage. Include a "Update Goals" button that opens an edit modal.

### 4.4 EHMP Calculator on Dashboard

The EHMP Calculator is the most powerful sales tool in the platform and should be surfaced on the Dashboard, not just on the Wellness page. Add a compact "EHMP Quick Calculator" widget to the Dashboard sidebar:

- Input: "How many employees?" (number input, default 50)
- Output: "Monthly commission: $[X]" and "Annual commission: $[Y]"
- Formula: employees × $18 = monthly (show the math)
- CTA: "See full projection" linking to `/solutions/wellness`

---

## Part 5: Technical Requirements

### 5.1 Protected Routes

The portal pages (`/portal/*`) must redirect unauthenticated users to `/login`. Implement a `ProtectedRoute` component that:
- Checks `AuthContext.isAuthenticated`
- If false, redirects to `/login?redirect=[current path]`
- After login, redirects back to the originally requested path

### 5.2 Persistent Authentication State

The demo login must persist across page refreshes. Store the auth state in `localStorage` under the key `seq_auth_user`. On app load, check localStorage and restore the auth state before rendering. Without this, a consultant who refreshes the page gets logged out — a critical UX failure.

### 5.3 React Context Architecture

Verify all four contexts are properly implemented and wrapped at the App level:
- `AuthContext` — user authentication state, login/logout functions
- `NotificationContext` — unread count, notifications array, mark-read functions
- `ProgressContext` — onboarding checklist completion, training progress
- `BookingContext` — booking modal open/close state

### 5.4 TypeScript — No `any` Types

Audit all TypeScript files for `any` type usage and replace with proper interfaces. Key interfaces needed:
```typescript
interface Consultant {
  id: string;
  name: string;
  email: string;
  tier: 'Associate' | 'Active' | 'Senior' | 'Managing Director';
  consultantId: string;
  memberSince: string;
  totalFundedVolume: number;
  wellnessEnrollees: number;
}

interface Deal {
  id: string;
  clientName: string;
  dealType: string;
  amount: number;
  status: 'Application' | 'In Review' | 'Approved' | 'Funded' | 'Declined';
  submittedDate: string;
  advisor?: string;
  nextStep?: string;
}

interface TrainingVideo {
  id: string;
  title: string;
  category: 'Agent Training' | 'Product Deep Dives' | 'Success Stories' | 'Wellness / EHMP' | 'Commercial Lending';
  duration: string;
  progress: number;
  isNew: boolean;
  thumbnail: string;
  youtubeId?: string;
}

interface CommunityPost {
  id: string;
  author: Consultant;
  content: string;
  category: 'Win' | 'Tip' | 'Question' | 'Announcement';
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: number;
}
```

### 5.5 SEO Meta Tags

Every public page must have unique `<title>` and `<meta name="description">` tags. Implement using Next.js `metadata` exports:

| Page | Title | Description |
|---|---|---|
| / | Sequoia Enterprise Solutions — Business Funding & Consulting | Access 500+ lending partners for commercial real estate, business funding, and wellness programs. Nationwide reach since 2015. |
| /solutions | Business Solutions — Sequoia Enterprise Solutions | 22 financing and advisory programs across real estate, business funding, clean energy, and wellness. Find the right solution for your business. |
| /solutions/wellness | EHMP Wellness Program — Zero-Cost Employee Benefits | The Employee Health Management Program saves employers $500–$800 per employee per year in FICA taxes at zero net cost. |
| /opportunity | Become a Sequoia Consultant — Build Recurring Income | Join 2,500+ professionals earning through commercial lending referrals and wellness program placements. $29.99/month, cancel anytime. |
| /about | About Sequoia Enterprise Solutions | Founded in 2015, Sequoia has funded $70.4M+ and built a network of 2,500+ consultants. BBB Accredited. Nationwide reach. |

### 5.6 Open Graph Tags

Add Open Graph meta tags to the homepage for proper social media sharing:
```html
<meta property="og:title" content="Sequoia Enterprise Solutions" />
<meta property="og:description" content="Your trusted partner for business solutions, commercial lending, and recurring income opportunities." />
<meta property="og:image" content="https://sequoia-platform.vercel.app/og-image.jpg" />
<meta property="og:url" content="https://sequoia-platform.vercel.app" />
<meta property="og:type" content="website" />
```

---

## Part 6: Exact Content and Brand Assets

### Company Facts (Use These Exact Numbers)
- Founded: 2015
- Total funded (2025): $70.4M
- Annual funding goal (2026): $100M
- Lending partners: 500+
- Consultant network: 2,500+
- Active consultants: 219
- Training videos: 190+
- EHMP employees enrolled (current): 153
- EHMP enrollment goal (2026): 5,000
- Phone: 301-337-8035
- Email: info@seqsolution.com
- Marketing email: marketing@seqsolution.com
- Address: Rockville, MD
- CEO: Allen Wu
- Wednesday training time: 8:00 PM Eastern Time (every week)

### Brand Colors
- Forest Green (primary): #0D2B1E
- Gold (accent/achievement): #C9A84C
- Cream (background): #F5F0E8
- Dark charcoal (text): #1A1A1A
- Muted green (secondary): #2D5A3D

### Typography
- Display/headings: Playfair Display (serif)
- Body/UI: Inter (sans-serif)
- Monospace (IDs, codes): JetBrains Mono

### Tier System
- Associate: 0–$499K funded volume
- Active: $500K–$1.99M funded volume
- Senior: $2M–$4.99M funded volume
- Managing Director: $5M+ funded volume

### Social Links
- YouTube: https://www.youtube.com/@seqsolution
- LinkedIn: https://www.linkedin.com/company/seqsolution
- Instagram: https://www.instagram.com/seqsolution
- Facebook: https://www.facebook.com/profile.php?id=100085730042712

### Partner Logos (Already in /public/logos/)
- EXP Commercial Realty: `/logos/exp-commercial.svg`
- Keller Williams: `/logos/kw-commercial.png`
- National ACE: `/logos/national-ace.jpg`
- Cal Asia Chamber of Commerce: `/logos/calasian-chamber.svg`
- Filipino Chamber of Commerce: `/logos/filipino-chamber.png`
- BBB Accredited Business: `/logos/bbb.png`

---

## Part 7: Execution Order

Execute in this exact order to minimize broken states:

1. Fix the Pipeline table empty rows bug (Part 1.1) — highest visibility bug
2. Fix the CountUp animation showing "0+" (Part 2.1) — homepage first impression
3. Add the Wednesday training sticky announcement bar (Part 2.2)
4. Fix the Dashboard onboarding checklist rendering (Part 1.4)
5. Add the Deal of the Week widget to Dashboard (Part 1.5)
6. Fix the Resources page — add video preview grid (Part 1.2)
7. Add EHMP, Business Funding, and Clean Energy flyers to Marketing Materials (Part 1.3)
8. Add referral links section to Profile page (Part 1.6)
9. Populate the Opportunity page FAQ accordion (Part 2.4)
10. Add the Partner page contact form (Part 2.5)
11. Verify and fix Login → Portal redirect flow (Part 1.7)
12. Replace placeholder Zoom link with real or clearly labeled placeholder (Part 1.8)
13. Build the Earnings page `/portal/earnings` (Part 4.1)
14. Build the Notifications page `/portal/notifications` and bell dropdown (Part 4.2)
15. Add Vision Board / Goals widget to Dashboard (Part 4.3)
16. Add EHMP Quick Calculator widget to Dashboard (Part 4.4)
17. Implement ProtectedRoute component (Part 5.1)
18. Implement persistent auth state via localStorage (Part 5.2)
19. Add scroll-to-top button (Part 3.2)
20. Verify and fix page transition animations (Part 3.3)
21. Verify active navigation highlighting (Part 3.5)
22. Add Allen Wu headshot placeholder (Part 2.3)
23. Add SEO meta tags to all public pages (Part 5.5)
24. Add Open Graph tags to homepage (Part 5.6)
25. Audit and fix all TypeScript `any` types (Part 5.4)
26. Final pass: verify footer copyright, social link targets, mobile nav behavior

---

## Part 8: Definition of Done

The site is ready for client delivery when:

- [ ] All 24 routes return 200 (no 404s)
- [ ] Pipeline table shows 6+ populated deal rows
- [ ] CountUp animations fire correctly on scroll
- [ ] Wednesday training countdown is visible above the fold on homepage
- [ ] Dashboard checklist shows all 4 items with interactive checkboxes
- [ ] Marketing Materials has flyers for all 4 product verticals (Real Estate, EHMP, Business Funding, Clean Energy)
- [ ] Referral links are visible on Profile page with one-click copy
- [ ] Opportunity page FAQ accordion renders all 8 questions
- [ ] Partner page contact form is present and validates correctly
- [ ] Login redirects to `/portal` after demo login and persists on refresh
- [ ] Earnings page exists at `/portal/earnings` with populated data
- [ ] Notifications bell dropdown works and full page exists at `/portal/notifications`
- [ ] All forms have success states (not just toast notifications)
- [ ] Footer reads "Copyright © 2026 Sequoia Enterprise Solutions"
- [ ] All social links open in new tab
- [ ] SEO meta tags are unique on every public page
- [ ] No TypeScript errors (`tsc --noEmit` passes clean)
- [ ] Mobile navigation works correctly on 375px viewport

### Framework Score Targets (Post-Fix)

| Framework | Current Score | Target Score |
|---|---|---|
| StoryBrand | 7.7 | 9.0+ |
| Hormozi Value Stack | 7.4 | 8.5+ |
| Brunson Funnel Architecture | 5.6 | 8.5+ |
| Engagement & Gamification | 6.4 | 8.5+ |
| UX & SEO Fundamentals | 6.5 | 8.5+ |
| **Overall** | **6.7** | **8.6+** |

---

*Prepared by Manus AI | March 20, 2026 | Based on live audit of sequoia-platform.vercel.app*
