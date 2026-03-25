# Sequoia Enterprise Solutions — Genealogy & Compensation System
## Complete Analysis + Claude Code Implementation Prompt

---

## PART 1: WHAT THE CURRENT SYSTEM HAS (AND WHAT'S BROKEN)

### Current Genealogy System — Observed Structure

The existing back office (built on a white-label MLM platform) has four genealogy views:

| View | What It Shows | Problems |
|---|---|---|
| **POV3 Tree View** | Visual node tree, levels 1–6, expandable | Slow, horizontal scroll required, no search, no filter by status, deleted users show as "(Deleted)" cluttering the tree |
| **POV3 List View** | Tabular: Level, ID, Rank, Name, Username, Phone, Email, Enrollment Date | No activity date, no commission data, no product activity, no "last login" field |
| **Genealogy Data Viewer** | Admin-only data export grid | Not accessible to individual consultants |
| **Downline Report Generator** | Bulk export | Requires admin access |

**What the tree reveals about the actual data:**
- Nodes show: Name, Level (1–4+), Status (Active LC / Inactive LC / LC 1 / Deleted)
- Real names visible in tree: Dr. Edwin Elam (Inactive LC, L4), YUTONG LI (Active LC, L4), Ligia Penagos (LC 1, L4), Dante Guerrero Banaga (Active LC, L3), Jianhui He (Active LC, L3), Bao Ly (Inactive LC, L2), Tien Nguyen (Active LC, L3)
- The vast majority of nodes are "Deleted user (Deleted)" — meaning the 2,500 enrolled but only ~219 active problem is visible right in the tree
- Maximum depth observed: Level 4 in Todd's downline (6 levels exist in the full company tree)

**Status types in the existing system:**
- `Active LC` — paying $29.99/month, considered active
- `Inactive LC` — enrolled but not paying / lapsed
- `LC 1` — new enrollment, not yet classified
- `Deleted` — account removed

---

## PART 2: COMPLETE COMPENSATION STRUCTURE (FROM SPM7.5 PDF + FLYERS)

### Income Stream 1: Membership Fee Override (Unilevel)
The $29.99/month membership generates override commissions down 6 levels:

| Level | Override % of $29.99 |
|---|---|
| Level 1 (Personal Recruits) | 20% = $5.99/month per active LC |
| Level 2 | 10% = $2.99/month per active LC |
| Level 3 | 5% = $1.50/month per active LC |
| Level 4 | 5% = $1.50/month per active LC |
| Level 5 | 5% = $1.50/month per active LC |
| Level 6 | 5% = $1.50/month per active LC |

**Rank Advancement Bonuses (one-time):**
- LC 1 → LC 2: $25 bonus
- LC 2 → LC 3: $50 bonus
- LC 3 → Senior LC: $100 bonus
- Senior LC → Managing Director: $250 bonus
- Managing Director → Executive Director: $500 bonus

**Rank Requirements:**
- LC 1: Enrolled, paying $29.99/month
- LC 2: 2 personally enrolled active LCs
- LC 3: 4 personally enrolled active LCs
- Senior LC: 6 personally enrolled active LCs + 50 total team active LCs
- Managing Director: 10 personally enrolled active LCs + 200 total team active LCs
- Executive Director: 15 personally enrolled active LCs + 500 total team active LCs

---

### Income Stream 2: EHMP (Employee Health & Membership Program)
**Source: 2026 EHMP Big Leap flyer**

**Direct Commission (PEPM = Per Employee Per Month, paid monthly in perpetuity):**

| Employer Size | Monthly Commission |
|---|---|
| 5–199 employees | $20 PEPM |
| 200–499 employees | $22 PEPM |
| 500+ employees | $24 PEPM |

**Team Revenue Share (Override) — 3 levels:**

| Level | Override |
|---|---|
| Level 1 | $1.00 per employee per month |
| Level 2 | $1.00 per employee per month |
| Level 3 | $0.50 per employee per month |

**Income Example (from flyer):**
- 500+ employees enrolled → $10,600+/month = $127,200+/year in residual income
- This is the flagship "dream income" product

---

### Income Stream 3: Commercial Real Estate Loans
**Agent Commission: Varies by loan type, typically 1–2% of funded amount**

**Team Override (Unilevel, 6 levels):**

| Level | Override % of Agent Commission |
|---|---|
| Level 1 | 10% |
| Level 2 | 8% |
| Level 3 | 5% |
| Level 4 | 4% |
| Level 5 | 3% |
| Level 6 | 2% |

**Loan products covered:** Bridge Loans, Hard Money, Fix & Flip, DSCR, Commercial, SBA, Construction, Ground-Up

---

### Income Stream 4: Business Funding (Working Capital / MCA)
**Agent Commission: 5–8% of funded amount (varies by lender)**

**Team Override (Unilevel, 6 levels):**

| Level | Override % |
|---|---|
| Level 1 | 10% |
| Level 2 | 8% |
| Level 3 | 5% |
| Level 4 | 4% |
| Level 5 | 3% |
| Level 6 | 2% |

---

### Income Stream 5: Property Restoration & Claims
**Source: Property Restoration Compensation flyer**

**Agent Commission: 8% of project value**

**Team Override (Unilevel, 6 levels):**

| Level | Override % |
|---|---|
| Level 1 | 1.0% |
| Level 2 | 0.75% |
| Level 3 | 0.50% |
| Level 4 | 0.50% |
| Level 5 | 0.25% |
| Level 6 | 0.25% |

---

### Income Stream 6: Clean Energy (Solar)
**Agent Commission: $500–$2,000 per installation (varies by system size)**

**Team Override (Unilevel, 6 levels):**

| Level | Override % |
|---|---|
| Level 1 | 10% |
| Level 2 | 8% |
| Level 3 | 5% |
| Level 4 | 4% |
| Level 5 | 3% |
| Level 6 | 2% |

---

### Income Stream 7: Business Services (Merchant Processing, Telecom, etc.)
**Agent Commission: Residual monthly (varies by service)**

**Team Override:** 3 levels, $1/$1/$0.50 per account per month (same structure as EHMP)

---

## PART 3: WHAT NEEDS TO BE BUILT

### The Core Problem
The existing genealogy system is a read-only viewer. It shows the tree but:
1. Cannot filter by activity status to find who to coach
2. Cannot show commission contribution per node
3. Cannot show "at risk" consultants (inactive for 30/60/90 days)
4. Cannot calculate projected income based on team activity
5. Cannot show which income streams each downline member is active in
6. Has no engagement tools (no "send message", no "share resource", no "invite to training")

### What to Build: 4 New Portal Pages

---

## PART 4: CLAUDE CODE IMPLEMENTATION PROMPT

---

```
You are building the Genealogy & Compensation Intelligence System for the Sequoia Enterprise Solutions consultant portal at sequoia-platform.vercel.app. This is a React + TypeScript + Tailwind v4 + shadcn/ui project.

The existing portal is at /portal with a sidebar navigation. You need to add 4 new pages to the portal:

1. /portal/team — My Team (Genealogy Viewer)
2. /portal/earnings — My Earnings (Commission Dashboard)  
3. /portal/compensation — Compensation Plan (Interactive Reference)
4. /portal/income-calculator — Income Projector (Interactive Calculator)

Plus update the existing /portal dashboard to show a Team Summary widget.

---

## BRAND TOKENS (already in index.css — do not change)
- Primary: #0D2B1E (deep forest green)
- Gold: #C9A84C (achievement accent)
- Cream: #F5F0E8 (background)
- Font: Playfair Display (headings), Inter (body)

---

## PAGE 1: /portal/team — My Team

### Purpose
Replace the existing back office genealogy viewer with a beautiful, actionable team management interface. Consultants need to see their downline, understand who is active vs. inactive, and take action to coach/reactivate team members.

### Layout
Split layout: Left panel (40%) = tree/list toggle + filters. Right panel (60%) = selected member detail card.

### Top Stats Bar (4 cards)
```tsx
const teamStats = [
  { label: "Total Team", value: 47, icon: Users, color: "green" },
  { label: "Active Members", value: 12, icon: CheckCircle, color: "gold" },
  { label: "New This Month", value: 3, icon: UserPlus, color: "blue" },
  { label: "At Risk (60+ days inactive)", value: 8, icon: AlertTriangle, color: "red" },
];
```

### Filter Bar
Horizontal filter pills above the tree:
- All Levels (dropdown: Level 1, 2, 3, 4, 5, 6)
- Status filter pills: All | Active | Inactive | New | At Risk
- Search input: "Search by name or ID..."
- View toggle: Tree View | List View

### Tree View
Use a recursive React component to render the genealogy tree. Each node is a card showing:
- Avatar (initials-based, color-coded by status)
- Name
- Status badge: Active (green), Inactive (amber), New (blue), At Risk (red)
- Level indicator
- Joined date
- Click to expand/collapse children

Node color coding:
- Active: border-l-4 border-green-500
- Inactive: border-l-4 border-amber-400
- At Risk (60+ days no login): border-l-4 border-red-400
- New (< 30 days): border-l-4 border-blue-400

### List View
Sortable table with columns:
| Level | Name | Status | Enrolled Date | Last Active | Personal Recruits | Team Size | Income Streams Active |

Clicking a row opens the detail panel.

### Member Detail Panel (right side)
When a team member is selected, show:
- Profile header: Avatar, Name, ID, Rank badge, Joined date
- Contact: Phone, Email (with click-to-call/email links)
- Activity metrics: Last login, Days since last activity
- Income streams active: Colored badges for each stream they have submitted deals in
- Team stats: Their personal recruits count, their total team size
- Action buttons:
  - "Send Encouragement" (opens a pre-written message modal with 3 template options)
  - "Share Resource" (opens resource picker modal)
  - "View Their Downline" (navigates tree to their node as root)
- Commission contribution: "This member's team has contributed $X to your overrides this month" (calculated from mock data)

### Mock Data
Generate 47 team members across 6 levels with realistic names, statuses, and dates. Use this seed data structure:

```tsx
interface TeamMember {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  status: "active" | "inactive" | "new" | "at-risk";
  rank: "LC 1" | "LC 2" | "LC 3" | "Senior LC" | "Managing Director";
  enrolledDate: string;
  lastActiveDate: string;
  phone: string;
  email: string;
  sponsorId: string; // parent node ID
  personalRecruits: number;
  teamSize: number;
  incomeStreams: ("ehmp" | "real-estate" | "business-funding" | "clean-energy" | "property-restoration")[];
}
```

Populate with 47 members:
- Level 1: 8 members (3 active, 3 inactive, 1 new, 1 at-risk)
- Level 2: 14 members (4 active, 7 inactive, 2 new, 1 at-risk)
- Level 3: 12 members (3 active, 6 inactive, 1 new, 2 at-risk)
- Level 4: 8 members (1 active, 5 inactive, 0 new, 2 at-risk)
- Level 5: 3 members (1 active, 2 inactive)
- Level 6: 2 members (0 active, 2 inactive)

---

## PAGE 2: /portal/earnings — My Earnings

### Purpose
A beautiful commission dashboard showing earnings across all income streams, by period, with level-by-level override breakdown.

### Layout
Full-width dashboard with:
1. Earnings Summary Bar (top)
2. Income Stream Breakdown (recharts bar chart)
3. Level Override Breakdown (recharts stacked bar)
4. Recent Commission Transactions (table)
5. Projected Monthly Residual (calculator widget)

### Earnings Summary Bar
4 stat cards:
```tsx
const earningsSummary = [
  { label: "This Period", value: "$1,847.50", change: "+12%", trend: "up" },
  { label: "Last Period", value: "$1,649.00", change: "", trend: "neutral" },
  { label: "This Year", value: "$14,230.00", change: "+34%", trend: "up" },
  { label: "Projected Annual", value: "$22,140.00", change: "Based on current activity", trend: "up" },
];
```

### Income Stream Breakdown (Recharts BarChart)
Horizontal bar chart showing earnings by income stream for the current period:
- EHMP Residual: $680.00 (gold bar)
- Real Estate Overrides: $420.00 (green bar)
- Business Funding Overrides: $380.00 (blue bar)
- Membership Overrides: $247.50 (teal bar)
- Property Restoration: $120.00 (amber bar)

### Level Override Breakdown (Recharts StackedBarChart)
Monthly stacked bar chart (last 6 months) showing override income by level:
- Level 1 overrides (darkest green)
- Level 2 overrides
- Level 3 overrides
- Level 4 overrides
- Level 5 overrides
- Level 6 overrides (lightest)

### Commission Transaction Table
Sortable table with columns:
| Date | Type | Source | Level | Amount | Status |

Types: "EHMP Residual", "Membership Override", "Real Estate Override", "Business Funding Override", "Rank Bonus"
Status: "Paid", "Pending", "Processing"

Populate with 20 realistic transactions over the past 60 days.

### Projected Monthly Residual Widget
A card at the bottom showing:
- "Your current EHMP residual: $680/month"
- "If your team adds 10 more employers: +$X/month"
- "At your current growth rate, you'll hit $2,000/month by [date]"
- Link to Income Calculator page

### Period Selector
Tab bar at top: This Period | Last Period | Q1 2026 | Q4 2025 | YTD | Custom Range

---

## PAGE 3: /portal/compensation — Compensation Plan

### Purpose
A beautiful, interactive reference page for the full compensation plan. Replaces the PDF. Consultants can explore each income stream's commission structure and understand how overrides work at each level.

### Layout
Tab-based layout with one tab per income stream + one "Rank Advancement" tab.

### Tab 1: Membership Overrides
Visual pyramid diagram showing 6 levels with:
- Level number
- Override percentage
- Dollar amount per active LC (calculated from $29.99)
- "If you had 10 active LCs at this level, you'd earn: $X/month"

### Tab 2: EHMP
Visual table matching the 2026 EHMP Big Leap flyer:
- Commission Tier table (5-199: $20 PEPM, 200-499: $22 PEPM, 500+: $24 PEPM)
- Team Revenue Share pyramid (3 levels: $1/$1/$0.50 per employee)
- Interactive slider: "Drag to set number of employees" → shows monthly income
- Dream income callout: "500+ employees = $10,600+/month"

### Tab 3: Real Estate
Commission structure table for each loan product:
- Bridge Loans: 1.5% agent commission
- Hard Money: 1.5%
- Fix & Flip: 1.5%
- DSCR: 1%
- Commercial: 1%
- SBA: 1%
- Construction: 1.5%
- Ground-Up: 1.5%

Override pyramid: 6 levels (10%, 8%, 5%, 4%, 3%, 2%)

### Tab 4: Business Funding
Agent commission: 5–8% of funded amount
Override pyramid: 6 levels (10%, 8%, 5%, 4%, 3%, 2%)

### Tab 5: Property Restoration
Agent commission: 8% of project value
Override pyramid: 6 levels (1.0%, 0.75%, 0.50%, 0.50%, 0.25%, 0.25%)
Source: Property Restoration Compensation flyer

### Tab 6: Clean Energy
Agent commission: $500–$2,000 per installation
Override pyramid: 6 levels (10%, 8%, 5%, 4%, 3%, 2%)

### Tab 7: Rank Advancement
Visual rank ladder showing all 6 ranks:
- LC 1 → LC 2 → LC 3 → Senior LC → Managing Director → Executive Director
- Requirements for each rank (personal recruits + team size)
- One-time bonus for each rank advancement ($25, $50, $100, $250, $500)
- Current user's position highlighted with a "You are here" indicator
- Progress bar showing how close they are to the next rank

### Design Notes for Compensation Page
- Use the Sequoia gold (#C9A84C) for commission amounts
- Use animated counter for dollar amounts (count up on scroll into view)
- Each income stream tab should have a distinct icon
- The pyramid diagrams should use CSS/SVG, not images
- Add a "Download PDF" button that links to the existing SPM7.5 PDF

---

## PAGE 4: /portal/income-calculator — Income Projector

### Purpose
An interactive "dream income" calculator that lets consultants model their potential earnings across all income streams. This is the most powerful recruitment and motivation tool on the platform.

### Layout
Two-column layout:
- Left (40%): Input sliders and controls
- Right (60%): Live updating income projection charts and totals

### Input Section (Left)

**Section 1: Your Team**
- Slider: "Active LCs at Level 1" (0–20, default 3)
- Slider: "Active LCs at Level 2" (0–50, default 8)
- Slider: "Active LCs at Level 3" (0–100, default 15)
- Slider: "Active LCs at Level 4" (0–200, default 20)
- Slider: "Active LCs at Level 5" (0–300, default 10)
- Slider: "Active LCs at Level 6" (0–500, default 5)

**Section 2: EHMP Activity**
- Slider: "Employers you personally enrolled" (0–20, default 2)
- Slider: "Avg employees per employer" (5–500, default 50)
- Slider: "Employers enrolled by your Level 1 team" (0–50, default 5)
- Slider: "Employers enrolled by your Level 2 team" (0–100, default 10)
- Slider: "Employers enrolled by your Level 3 team" (0–200, default 8)

**Section 3: Loan Activity**
- Slider: "Loans funded per month (personal)" (0–10, default 1)
- Select: "Average loan size" ($50K / $100K / $250K / $500K / $1M+)
- Slider: "Loans funded by team per month" (0–50, default 5)

**Section 4: Business Funding**
- Slider: "Deals funded per month (personal)" (0–10, default 1)
- Select: "Average deal size" ($25K / $50K / $100K / $250K)
- Slider: "Deals funded by team per month" (0–30, default 3)

### Output Section (Right)

**Total Monthly Income (large, animated counter)**
```
$12,847 / month
$154,164 / year
```
Display in Playfair Display font, gold color, large size.

**Income Breakdown (Recharts PieChart)**
Donut chart showing income by stream:
- EHMP Residual
- Membership Overrides
- Real Estate Overrides
- Business Funding Overrides

**Income by Level (Recharts BarChart)**
Stacked bar showing how much comes from each level of the downline.

**Rank Projection**
"At this activity level, you qualify for: Managing Director"
Show the rank badge with requirements met/not met.

**Share / Save**
- "Save this projection" button (saves to localStorage)
- "Share with a prospect" button (generates a shareable URL with params encoded)

### Calculation Logic (TypeScript)

```typescript
// Membership Override Calculation
const membershipOverrides = {
  level1: activeLCs.l1 * 29.99 * 0.20,
  level2: activeLCs.l2 * 29.99 * 0.10,
  level3: activeLCs.l3 * 29.99 * 0.05,
  level4: activeLCs.l4 * 29.99 * 0.05,
  level5: activeLCs.l5 * 29.99 * 0.05,
  level6: activeLCs.l6 * 29.99 * 0.05,
};

// EHMP Calculation
const ehmpRate = (employees: number) => 
  employees >= 500 ? 24 : employees >= 200 ? 22 : 20;

const ehmpPersonal = employers.personal * avgEmployees * ehmpRate(avgEmployees);
const ehmpL1Override = employers.l1 * avgEmployees * 1.00;
const ehmpL2Override = employers.l2 * avgEmployees * 1.00;
const ehmpL3Override = employers.l3 * avgEmployees * 0.50;

// Real Estate Calculation
const reAgentCommission = loansPersonal * avgLoanSize * 0.015;
const reTeamOverride = loansTeam * avgLoanSize * 0.015 * 0.10; // simplified L1 override

// Business Funding Calculation  
const bfAgentCommission = dealsPersonal * avgDealSize * 0.065; // avg 6.5%
const bfTeamOverride = dealsTeam * avgDealSize * 0.065 * 0.10;

// Total
const totalMonthly = 
  Object.values(membershipOverrides).reduce((a, b) => a + b, 0) +
  ehmpPersonal + ehmpL1Override + ehmpL2Override + ehmpL3Override +
  reAgentCommission + reTeamOverride +
  bfAgentCommission + bfTeamOverride;
```

---

## DASHBOARD UPDATE: Team Summary Widget

Add a "My Team" widget to the existing /portal dashboard (after the existing stats cards):

```tsx
// Team Summary Widget
<Card className="col-span-2">
  <CardHeader>
    <CardTitle>Team Activity</CardTitle>
    <CardDescription>Your 47-member downline at a glance</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-700">12</div>
        <div className="text-sm text-muted-foreground">Active</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-amber-500">27</div>
        <div className="text-sm text-muted-foreground">Inactive</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-red-500">8</div>
        <div className="text-sm text-muted-foreground">At Risk</div>
      </div>
    </div>
    {/* Mini level breakdown bar */}
    <div className="space-y-2">
      {[1,2,3,4,5,6].map(level => (
        <div key={level} className="flex items-center gap-3">
          <span className="text-xs w-14 text-muted-foreground">Level {level}</span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2" 
              style={{ width: `${(activeByLevel[level] / totalByLevel[level]) * 100}%` }}
            />
          </div>
          <span className="text-xs w-12 text-right">{activeByLevel[level]}/{totalByLevel[level]}</span>
        </div>
      ))}
    </div>
    <Button variant="outline" className="w-full mt-4" asChild>
      <Link to="/portal/team">View Full Team →</Link>
    </Button>
  </CardContent>
</Card>
```

---

## SIDEBAR NAVIGATION UPDATE

Add 3 new items to the portal sidebar (in the existing PortalLayout or sidebar component):

```tsx
// Add to existing sidebar nav items array
{ href: "/portal/team", icon: Users, label: "My Team" },
{ href: "/portal/earnings", icon: DollarSign, label: "My Earnings" },
{ href: "/portal/compensation", icon: Award, label: "Comp Plan" },
{ href: "/portal/income-calculator", icon: Calculator, label: "Income Projector" },
```

---

## ROUTING UPDATE (App.tsx or router file)

Add these routes:
```tsx
<Route path="/portal/team" component={TeamPage} />
<Route path="/portal/earnings" component={EarningsPage} />
<Route path="/portal/compensation" component={CompensationPage} />
<Route path="/portal/income-calculator" component={IncomeCalculatorPage} />
```

---

## DESIGN REQUIREMENTS

1. **All pages must use the existing Sequoia brand tokens** — forest green primary, gold accent, cream background, Playfair Display headings.

2. **The Team page tree view** must use a custom recursive component, not a third-party tree library. Keep it lightweight.

3. **All charts use Recharts** (already installed). Use the existing chart color tokens from index.css.

4. **All sliders use the existing shadcn/ui Slider component** from @/components/ui/slider.

5. **Animated counters**: Use a simple useEffect with requestAnimationFrame to count up numbers on mount. Do not use a third-party animation library.

6. **The compensation pyramid diagrams** must be built with CSS/Tailwind, not SVG or images. Use a series of divs with decreasing width and the gold background color.

7. **Mobile responsive**: All pages must work on mobile. The team page should stack the tree/list panel above the detail panel on mobile. The income calculator should stack inputs above outputs.

8. **Loading states**: All pages should have a 1-second simulated loading state with skeleton cards before showing content (to simulate real API calls).

9. **Empty states**: If a consultant has no team members at a given level, show an encouraging empty state: "No team members at Level 3 yet. [Invite someone →]"

---

## EXECUTION ORDER

1. Create `/portal/compensation` first (no complex state, just display)
2. Create `/portal/income-calculator` second (pure calculation logic)
3. Create `/portal/earnings` third (charts + mock data)
4. Create `/portal/team` last (most complex, recursive tree)
5. Update the dashboard with the Team Summary widget
6. Update the sidebar navigation
7. Update App.tsx routing

---

## DEFINITION OF DONE

- [ ] All 4 new pages render without TypeScript errors
- [ ] All 4 pages are accessible from the portal sidebar
- [ ] The income calculator updates in real-time as sliders move
- [ ] The team tree renders all 47 mock members across 6 levels
- [ ] The team list view is sortable by all columns
- [ ] The earnings page shows charts for all 5 income streams
- [ ] The compensation page has all 7 tabs with accurate rate data
- [ ] The dashboard shows the Team Summary widget
- [ ] All pages are mobile responsive
- [ ] No broken routes or 404s
- [ ] All commission math matches the rates in this document exactly
```

---

## PART 5: WHAT NOT TO BUILD (SCOPE BOUNDARIES)

The following are **out of scope** for the front-end platform because they require real API integration with the existing back office system:

| Feature | Why Out of Scope |
|---|---|
| Real-time genealogy data from the back office | Requires API access to the existing MLM platform (not available) |
| Actual commission payment processing | Handled by the existing back office payment system |
| Real earnings data | Requires back office API integration |
| Sending actual emails/SMS to downline | Requires email service integration (Mailchimp is already connected to back office) |
| Rank advancement triggers | Handled by the back office commission calculation engine |

**The platform is a beautiful motivational front-end layer.** All real financial transactions and official records remain in the existing back office. The new platform shows consultants what is possible, what to do today, and celebrates their progress — it does not replace the financial back-end.

---

## PART 6: FUTURE PHASE — REAL DATA INTEGRATION

Once the front-end is complete, the path to real data is:

1. **Supabase schema** (already scaffolded in the project) — create tables for:
   - `consultants` (mirrors back office distributor data)
   - `team_relationships` (parent/child genealogy)
   - `commission_periods` (monthly snapshots)
   - `deals` (loan/EHMP submissions)

2. **Data sync** — Build a nightly webhook or manual CSV import from the back office to populate Supabase

3. **Replace mock data** — Swap all mock data constants with Supabase queries using the existing tRPC or fetch setup

4. **Authentication** — Link the existing back office login (via Single Sign On settings already visible in the admin panel) to the new platform's auth system

This phased approach means the platform can launch immediately with mock data and be progressively upgraded to real data without rebuilding anything.
