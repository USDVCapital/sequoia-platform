# SEQ Solution — Content Pages Integration
## Claude Code Implementation Prompt

---

## CONTEXT

This prompt adds four pieces of content from the legacy Sequoia platform to the new React + TypeScript + Tailwind v4 + shadcn/ui platform at `sequoia-platform.vercel.app`. The content was captured from the following source URLs:

1. Income Disclosure Statement — `https://toddbillings.seqsolution.com/Income-Disclosure-Statement/?mitem=19862`
2. You Are the Boss — `https://toddbillings.seqsolution.com/Your-are-the-Boss/?mitem=1450`
3. How to Be Liked by Others — `https://toddbillings.seqsolution.com/How-to-be-Liked-by-Others/?mitem=1449`
4. Weekly Q&A Form — `https://docs.google.com/forms/d/13iQROYvblCPl8xuMcEBQrOugq_rCcBrXmGU3yX9v0zE/viewform`

**Brand tokens (already defined in index.css — do not change):**
- Primary: `#0D2B1E` (deep forest green)
- Gold accent: `#C9A84C`
- Background: `#F5F0E8` (warm cream)
- Font: Playfair Display (headings), Inter (body)

**Important editorial note:** The legacy content references "Sequoia Lending" throughout. On the new platform, all instances of "Sequoia Lending" must be replaced with "Sequoia Enterprise Solutions" and all instances of "Independent Sales Representative" or "ISR" must be replaced with "Consultant." This is a branding correction, not a content change.

---

## WHAT TO BUILD — OVERVIEW

| Route | Page Title | Location in Nav | Audience |
|---|---|---|---|
| `/legal/income-disclosure` | Income Disclosure Statement | Footer > Legal | Public |
| `/resources/you-are-the-boss` | You Are the Boss | Portal Training Library | Consultants (portal) |
| `/resources/how-to-be-liked` | How to Be Liked by Others | Portal Training Library | Consultants (portal) |
| `/portal/weekly-qa` | Weekly Q&A | Portal sidebar nav | Consultants (portal) |

---

## TASK 1: Income Disclosure Statement Page

### Route: `/legal/income-disclosure`

### Purpose
This is a legally required disclosure page that must be accessible from the public site footer. It must be honest, clearly formatted, and compliant in tone. The data in the table is real and must be presented accurately — it shows that the vast majority of consultants earn less than $100/month. This is a legal document, not a marketing page.

### Page Structure

**Header Section** — dark green background (`bg-[#0D2B1E]`):
```
Heading (Playfair Display, white): "Income Disclosure Statement"
Subheading (gold): "Sequoia Enterprise Solutions — Effective June 19, 2022 through February 28, 2026"
```

**Introduction Section** — cream background, max-width `max-w-4xl mx-auto`, generous padding:

Render the following three paragraphs verbatim (with "Sequoia Lending" replaced by "Sequoia Enterprise Solutions"):

> The Sequoia Enterprise Solutions Compensation Plan is an exciting opportunity that rewards you for selling our products and services and for sponsoring other participants who do the same. Although the opportunity is unlimited, individual results will vary depending on commitment levels and sales skills of each participant. Since Sequoia Enterprise Solutions has recently launched, it lacks enough statistical data to prepare reliable income disclosures. The numbers below reflect estimates prepared by the company pending a more detailed survey to be conducted after its first year. Based on industry standards and company projections, the average annual gross income for consultants is projected to be anywhere between $500 and $2,000. There will certainly be participants who will earn less while others will earn much more. We are excited about the Sequoia Enterprise Solutions Compensation Plan and we are confident it will provide you a solid foundation to help you achieve your financial goals.

> Sequoia Enterprise Solutions pays commissions according to the current compensation plan. Study our commission structure and the income statistics below. Discuss our company with professional advisers and experienced affiliate marketers before deciding to purchase or promote any of Sequoia Enterprise Solutions' products and services. Sequoia Enterprise Solutions does not guarantee you will make any money from your use or promotion of our products and services.

> If income projections were presented to you prior to your enrollment, such projections are not necessarily representative of the income, if any, that you can or will earn through your participation in the Compensation Plan. These income projections should not be considered as guarantees or projections of your actual earnings or profits. Success with Sequoia Enterprise Solutions results only from hard work, dedication, and leadership.

**Income Statistics Table:**

Render as a styled HTML table with the following exact data. Use a dark green header row (`bg-[#0D2B1E] text-white`) and alternating row backgrounds (`bg-white` / `bg-[#F5F0E8]`). Add a gold top border to the table container.

Table title (centered, above the table): **"Income Statistics from June 19, 2022 to February 28, 2026"**

| Monthly Income Level | % Of Active Consultants | % Of All Consultants | Monthly Income High | Monthly Income Low | Monthly Income Average | Annualized Average Income |
|---|---|---|---|---|---|---|
| $25,000 + | 0% | 0% | $0 | $0 | $0 | $0 |
| $10,000 – $24,999 | 0% | 0% | $0 | $0 | $0 | $0 |
| $5,000 – $9,999 | 0% | 0% | $0 | $0 | $0 | $0 |
| $2,500 – $4,999 | 0% | 0% | $0 | $0 | $0 | $0 |
| $1,000 – $2,499 | 0% | 0% | $0 | $0 | $0 | $0 |
| $500 – $999 | 0% | 0% | $0 | $0 | $0 | $0 |
| $250 – $499 | < 1% | < 1% | $304 | $304 | $304 | $3,654 |
| $100 – $249 | 1% | < 1% | $227 | $106 | $162 | $1,945 |
| Less Than $100 (Active Consultants) | 99% | 11% | $62 | $0 | $0 | $8 |
| Less Than $100 (All Consultants) | N/A | 88% | $39 | $0 | $0 | $0 |

**Table Footnote** — render as a `bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm` block immediately below the table:

> *Each month we track the high, low and average monthly income for our Consultants for the income levels shown. This table shows for each monthly income level the corresponding income statistics over the indicated time frame. Incomes are for our Consultants, are net of refunds and chargebacks, and do not account for any costs incurred by the Consultant. The average consultant spends between $500 and $3,000 in expenses as they build their business. Less than 4% earn sufficient commissions to cover their costs. Note that it takes hard work to make substantial income in this business and some Consultants make no money at all. A Consultant is someone who: (a) has executed a Consultant application; (b) is qualified to earn commissions during the month; and (c) has not been terminated or chosen to discontinue for any reason during that month. A Consultant is considered active if they have additionally earned a commission during the month. All figures are in US dollars.*

**Bottom CTA Section** — light green background `bg-[#0D2B1E]/5 border-t border-[#C9A84C]`:

```
Text: "Questions about the compensation plan? Review the full plan document or speak with your sponsor."
Button 1: "View Compensation Plan" → links to /portal/compensation
Button 2: "Contact Support" → links to /contact
```

### Footer Link

Add "Income Disclosure" as a link in the Footer component under a "Legal" column. If the Footer does not already have a Legal column, add one with:
- Income Disclosure → `/legal/income-disclosure`
- Terms & Conditions → `/legal/terms` (placeholder, show toast "Coming soon" on click)
- Privacy Policy → `/legal/privacy` (placeholder, show toast "Coming soon" on click)

---

## TASK 2: "You Are the Boss" Training Page

### Route: `/resources/you-are-the-boss`

### Purpose
This is a foundational mindset training article for new consultants. It explains the independent contractor model, the network marketing philosophy, and the four sales channels. It belongs in the Training Library inside the consultant portal, accessible from the portal sidebar and from the training video grid as a "Reading" type resource.

### Page Structure

This page uses the standard portal layout (sidebar nav visible, same as `/portal/training`).

**Page Header** — inside the portal content area, not a full-width hero:
```
Breadcrumb: Training Library > Mindset & Business Basics > You Are the Boss
Badge: "Foundational Reading" (gold badge, small)
Heading (Playfair Display, #0D2B1E): "You Are the Boss"
Meta line: "5 min read · Mindset & Business Basics"
```

**Content Body** — render as a well-formatted article with `prose prose-lg max-w-3xl`:

Render the following content with proper heading hierarchy and formatting. Replace "Affiliates" with "Consultants" and "Independent Sales Representatives" with "Consultants" throughout:

---

**Opening paragraph:**

You are the Boss — you really are. You decide who you want to have as customers and who as Consultants. No one will be looking over your shoulder; there is no time clock to punch; no set number of hours you have to work. You make every decision. You are a member of our family. The only one setting limits and goals is YOU.

**Numbered list — render as a styled ordered list with gold numbers:**

1. Your income is determined by your level of effort.
2. You decide how many hours you are going to work.
3. Do you want to work out of your home? Fine. An office? Fine. Do it. Like everything else, the decision is yours.
4. You keep your own records.
5. You enjoy the tax benefits of being in business for yourself.
6. You must agree to abide by the Terms and Conditions and Company Policies and Procedures.

**Paragraph (no heading):**

These standards are to ensure the highest levels of product and customer satisfaction. You work as an independent contractor, not as an employee. If you truly dedicate 100% of your efforts to the program, the results could amaze you. A key to reaching those stratospheric plateaus is being very selective about whom you sponsor. You will achieve your maximum potential by selecting individuals with great care. Like yourself, they must be goal-oriented, profit-motivated, and not afraid to expend the total effort that will help both them and you achieve your common goals. For your part, it is not enough to simply sign up Consultants — you have to set the standard by working with them until they feel comfortable enough to go out on their own, and even then, continue to motivate, train, and lead them.

**Section heading (h2): "How Products Are Sold"**

Render the four sales channels as a 2x2 card grid (on desktop) / single column (on mobile). Each card has a number badge, title, and description:

**Card 1 — Retail**
Your income is determined by your level of effort. Traditional retail involves buying products at wholesale prices and selling them at retail prices, keeping the markup as profit.

**Card 2 — Catalog / Online Sales**
We either order from a website or the manufacturer sends catalogues, allowing us to order the items we want. The manufacturer then ships the merchandise directly to us, thereby eliminating two links in the distribution chain.

**Card 3 — Direct Sales**
The door-to-door selling technique. A manufacturer's representative comes to our home, shows us the line and we make our selections. The only markup is the commission paid to the manufacturer's representative. Fuller Brush, the Avon Lady, Tupperware, home parties — these are all examples of Direct Sales companies.

**Card 4 — Network Marketing**
This is the modern form of selling. Goods and services are available directly from the company through its network of Consultants. The company provides the materials and support needed to make each Consultant a successful business person.

**Closing paragraph (render with a gold left border `border-l-4 border-[#C9A84C] pl-4 italic`):**

The ultimate goal of any marketing system is to sell product. A major difference between Network Marketing and other sales systems is the Network Marketing philosophy of sharing the profits. The moment you become a Consultant, you instantly become the BOSS. We will, of course, be there every step of the way — but as a partner, not your employer. It is in our most selfish interest to make sure that you succeed.

**Motto callout (render as a centered, large-text block with green background):**

```
"YOUR SUCCESS IS OUR SUCCESS"
That is the key philosophy behind our Network Marketing plan — you working with your people to make them winners so they can do the same for you.
```

**Bottom navigation:**
- "Previous Article" button (left arrow) → links to previous article in the series (placeholder: `/resources/getting-started`)
- "Next Article" button (right arrow) → links to `/resources/how-to-be-liked`
- "Back to Training Library" link → `/portal/training`

---

## TASK 3: "How to Be Liked by Others" Training Page

### Route: `/resources/how-to-be-liked`

### Purpose
This is a people skills and relationship-building training article for consultants. It covers the interpersonal principles that drive success in network marketing. It belongs in the Training Library alongside "You Are the Boss" as part of the "Mindset & Business Basics" series.

### Page Structure

Same portal layout as Task 2.

**Page Header:**
```
Breadcrumb: Training Library > Mindset & Business Basics > How to Be Liked by Others
Badge: "Foundational Reading" (gold badge, small)
Heading (Playfair Display, #0D2B1E): "How to Be Liked by Others"
Meta line: "4 min read · Mindset & Business Basics"
```

**Content Body** — `prose prose-lg max-w-3xl`:

**Opening paragraph:**

You will get what you want out of life only if you are able to get along with people. Getting along with others means that they like you and will do things for you. In other words, they react positively to your personality. Your personality is nothing more nor less than your attitudes in action — it is the way you communicate your thoughts about others and yourself. Here are some principles to remember to make your personality pleasing and create positive reactions in others.

**The 17 Principles — render as a styled list with gold numbered circles:**

Render each item as a card with a large gold number on the left and the principle text on the right. Use a subtle hover effect (`hover:shadow-md transition-shadow`). Layout: single column on mobile, 2 columns on desktop for items 1–16, full-width for item 17.

1. To have a friend, you must be one.
2. The greatest hunger that people have is to be needed, wanted, and loved. Help create those feelings in others.
3. Do not try to impress others. Let them impress you.
4. Be kind to people. You cannot always love them, but you can be kind to them.
5. Learn to like yourself. Others will respond to you the way you respond to yourself.
6. Be enthusiastic. Nothing significant was ever achieved without enthusiasm — including deep, rich human relationships.
7. Be positive. Positive people attract others; negative people repel others.
8. Do things to make people feel important. Write a letter. Give a compliment. Say "Thank you." Praise. Encourage. Support. Cooperate.
9. Sticking up for your rights is great, but do you always have to be right? Letting the other person be right once in a while will keep friendships warm.
10. Be a good listener. You can have a greater effect on others by the way that you listen than by the way that you talk.
11. Unless you can say something worthy about a person, say nothing.
12. Call a person by name. Use it often in your conversation.
13. Communicate cheerfulness. Smile. Be pleasant. Talk about the brighter things in life.
14. Avoid arguments.
15. If you are going to make fun of someone, make sure it is yourself.
16. Help people like themselves. The greatest compliment someone can give you is to say, "I like myself better when I am with you."
17. Be genuinely interested in others. Get them to talk about themselves. Ask for their opinions, ideas, and viewpoints.

**Reflection prompt (render as a `bg-[#0D2B1E]/5 rounded-xl p-6 mt-8`):**

```
Heading: "Reflect on This"
Text: "Which of these 17 principles do you find most challenging? Which comes most naturally to you? The consultants who build the largest and most loyal teams are almost always those who master the art of genuine human connection."
```

**Bottom navigation:**
- "Previous Article" button (left arrow) → `/resources/you-are-the-boss`
- "Next Article" button (right arrow) → placeholder, show toast "More articles coming soon"
- "Back to Training Library" link → `/portal/training`

---

## TASK 4: Weekly Q&A Page

### Route: `/portal/weekly-qa`

### Purpose
This page replaces the Google Form that consultants were previously sent to for submitting questions for the weekly Friday Q&A video. The form is simple (4 fields), but it should be integrated natively into the portal so consultants do not have to leave the platform. It also needs to display the upcoming Q&A schedule and links to past Q&A videos.

### Page Structure

Portal layout (sidebar nav visible).

**Page Header:**
```
Heading (Playfair Display, #0D2B1E): "Weekly Q&A"
Subheading: "Submit your questions for Friday's video. Answers are posted to the YouTube channel every Friday."
```

**Two-column layout (desktop): Left column 60%, Right column 40%**

**Left Column — Question Submission Form:**

Section heading: "Submit a Question"

Render a clean form with the following fields (matching the original Google Form exactly):

```typescript
interface WeeklyQAFormData {
  question: string;     // required, textarea, label: "What question would you like us to cover in Friday's video?"
  firstName: string;    // required, text input, label: "First Name"
  lastName: string;     // required, text input, label: "Last Name"
  email: string;        // required, email input, label: "Email"
}
```

**Form design:**
- All fields use shadcn/ui `Input` and `Textarea` components
- Textarea for the question field: `rows={4}`, `placeholder="Ask anything about our products, compensation plan, how to find clients, or how to grow your team..."`
- Submit button text: "Submit Question"
- On submit: show 1.5 second loading state, then success state:
  - Heading: "Question Submitted!"
  - Body: "Thank you, [First Name]. Your question has been submitted and may be featured in Friday's video. We'll post the answer on our YouTube channel at youtube.com/@seqsolution"
  - Link: "Watch Past Q&A Videos" → opens `https://www.youtube.com/@seqsolution` in new tab
  - Button: "Submit Another Question" → resets form

**Right Column — Schedule & Past Videos:**

Section heading: "Upcoming Q&A Schedule"

Render a styled schedule card showing:
```
Next Q&A Recording: This Friday
Posted to YouTube: Every Friday
YouTube Channel: @seqsolution
```

Add a "Watch on YouTube" button linking to `https://www.youtube.com/@seqsolution` (opens in new tab).

Below the schedule card, add a "Past Q&A Videos" section with a list of 5 placeholder video entries (these will be replaced with real data):

```
Video 1: "How to Approach Your First Client" — March 21, 2026
Video 2: "Understanding the EHMP Commission Structure" — March 14, 2026
Video 3: "Fix & Flip Loan Criteria Explained" — March 7, 2026
Video 4: "Building Your Team: Levels 1-3" — February 28, 2026
Video 5: "Working Capital vs. Term Loan: What's the Difference?" — February 21, 2026
```

Each entry links to `https://www.youtube.com/@seqsolution` (opens in new tab) with a `ExternalLink` icon from lucide-react.

Add a note below the list: "New videos are posted every Friday. Subscribe to the channel to be notified."

---

## TASK 5: Add Training Articles to the Portal Training Library

In `/client/src/pages/portal/Training.tsx` (or wherever the portal training library is implemented), add the two new reading articles to the content grid.

Add a new filter tab called **"Reading"** alongside the existing video category tabs (All, Getting Started, Products, etc.).

Add the following two entries to the training content array:

```typescript
{
  id: "you-are-the-boss",
  type: "article",
  title: "You Are the Boss",
  description: "Understand your role as an independent contractor and the network marketing model that powers your business.",
  category: "Mindset & Business Basics",
  duration: "5 min read",
  badge: "Foundational",
  route: "/resources/you-are-the-boss",
},
{
  id: "how-to-be-liked",
  type: "article",
  title: "How to Be Liked by Others",
  description: "17 principles for building the human connections that drive team growth and client loyalty.",
  category: "Mindset & Business Basics",
  duration: "4 min read",
  badge: "Foundational",
  route: "/resources/how-to-be-liked",
},
```

Render article cards differently from video cards:
- Replace the video thumbnail with a `BookOpen` icon from lucide-react on a green background
- Replace the "Watch" button with a "Read" button
- Show "X min read" instead of a video duration timestamp
- On click, navigate to the article route (do not open a modal — navigate directly)

---

## TASK 6: Add Weekly Q&A to Portal Sidebar Navigation

In the portal sidebar navigation component, add "Weekly Q&A" as a nav item under the "Community" section (after "Community Feed" and before "Leaderboard", or wherever makes sense in the existing sidebar structure).

Use the `MessageCircleQuestion` icon from lucide-react (or `HelpCircle` if that icon is not available in the installed version).

Route: `/portal/weekly-qa`

---

## TASK 7: Update App.tsx with All New Routes

Add the following routes to `/client/src/App.tsx`:

```typescript
// Legal pages (public)
<Route path="/legal/income-disclosure" component={IncomeDisclosure} />
<Route path="/legal/terms" component={TermsPlaceholder} />
<Route path="/legal/privacy" component={PrivacyPlaceholder} />

// Resource articles (public — accessible without login for SEO, but also linked from portal)
<Route path="/resources/you-are-the-boss" component={YouAreTheBoss} />
<Route path="/resources/how-to-be-liked" component={HowToBeLiked} />

// Portal pages (protected)
<Route path="/portal/weekly-qa" component={WeeklyQA} />
```

For `TermsPlaceholder` and `PrivacyPlaceholder`, create minimal stub pages that show:
- The page title in the standard dark green header
- Body text: "This page is being prepared. Please contact support@seqsolution.com for questions."
- A "Contact Support" button linking to `/contact`

---

## EXECUTION ORDER

Execute in this exact sequence:

1. Create `/client/src/pages/legal/IncomeDisclosure.tsx` with the full income disclosure table and all three paragraphs
2. Create `/client/src/pages/legal/TermsPlaceholder.tsx` (stub)
3. Create `/client/src/pages/legal/PrivacyPlaceholder.tsx` (stub)
4. Create `/client/src/pages/resources/YouAreTheBoss.tsx` with full article content
5. Create `/client/src/pages/resources/HowToBeLiked.tsx` with full article content and 17-principle card grid
6. Create `/client/src/pages/portal/WeeklyQA.tsx` with the Q&A form and schedule panel
7. Update the Footer component to add the Legal column with three links
8. Update the portal Training page to add the "Reading" tab and two article cards
9. Update the portal sidebar to add the "Weekly Q&A" nav item
10. Update `App.tsx` to register all six new routes
11. Verify all routes resolve correctly and no TypeScript errors exist

---

## DESIGN SPECIFICATIONS

**Article pages (YouAreTheBoss, HowToBeLiked):**

These pages are accessible both from the public site (via `/resources/`) and from the portal. They should use the standard Navbar and Footer when accessed from the public site, and the portal sidebar layout when accessed from within the portal. Implement this by checking whether the current path starts with `/portal/` — if so, use the portal layout; otherwise, use the public layout.

Since these routes are at `/resources/`, they will always use the public layout. This is intentional — the articles are also useful as public SEO content.

**Income Disclosure table — mobile responsiveness:**

On mobile, the 7-column table will overflow. Wrap the table in a `overflow-x-auto` div so it scrolls horizontally on small screens. Add a subtle hint text below the table on mobile: "Scroll right to see all columns."

**Article card grid (HowToBeLiked — 17 principles):**

On desktop (lg+): 2 columns
On tablet (md): 2 columns
On mobile (sm): 1 column

Each card: `bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4 items-start`

Number badge: `w-10 h-10 rounded-full bg-[#C9A84C] text-white font-bold flex items-center justify-center flex-shrink-0 font-playfair`

Principle text: `text-[#0D2B1E] text-base leading-relaxed`

**Weekly Q&A form:**

The form should feel native to the portal — not like an embedded Google Form. Use the same input styling as the rest of the portal (shadcn/ui Input with focus ring in gold).

The right column schedule card: `bg-[#0D2B1E] text-white rounded-2xl p-6`
Schedule labels: `text-[#C9A84C] text-sm font-medium uppercase tracking-wide`
Schedule values: `text-white text-lg font-semibold`

---

## CONTENT NOTES

### On the Income Disclosure Data

The income disclosure table shows that 99% of active consultants earn less than $100/month and 88% of all consultants earn less than $100/month. This data must be presented accurately and without modification. Do not add any marketing language near the table. The footnote disclaimer must appear in full immediately below the table. This is a legal compliance requirement.

The page should not be hidden or hard to find. It must be linked from the footer of every page on the public site.

### On the Training Articles

Both "You Are the Boss" and "How to Be Liked by Others" are foundational mindset articles that were part of the original platform's training curriculum. They are evergreen content — the principles are timeless and directly applicable to building a Sequoia consultant business. They should be presented as polished, well-formatted reading experiences, not raw text dumps.

The content is not original to Sequoia — these are widely circulated network marketing principles. The instruction to prefer original content applies to marketing copy, not to foundational training materials that are part of the company's established curriculum.

### On the Weekly Q&A Form

The original Google Form was titled "Weekly Q&A" with the description: "Videos will be posted on YouTube channel 'Sequoia Lending' each Friday." On the new platform, update this to: "Videos will be posted to the Sequoia Enterprise Solutions YouTube channel (@seqsolution) each Friday."

The form had exactly four fields: question (required), first name (required), last name (required), email (required). Replicate these exactly. Do not add additional fields.

The form submission on the new platform is a simulated submission (no backend). Show the success state after 1.5 seconds. In a future phase, this will be wired to a real email notification system.

---

## DEFINITION OF DONE

The implementation is complete when:

- [ ] `/legal/income-disclosure` renders the full table with all 10 rows of data, all three disclaimer paragraphs, and the footnote
- [ ] All instances of "Sequoia Lending" and "Independent Sales Representative" have been replaced with the correct terminology
- [ ] The Footer on every public page shows a "Legal" column with the Income Disclosure link
- [ ] `/resources/you-are-the-boss` renders the full article with the 4-card sales channel grid and the motto callout
- [ ] `/resources/how-to-be-liked` renders all 17 principles as individual cards in a 2-column grid on desktop
- [ ] Both article pages show correct breadcrumbs and Previous/Next article navigation
- [ ] `/portal/weekly-qa` renders the 4-field form and the schedule panel side by side on desktop
- [ ] The Q&A form shows a success state with the YouTube channel link after submission
- [ ] The portal Training page shows a "Reading" tab that filters to show the two article cards
- [ ] The portal sidebar shows "Weekly Q&A" as a nav item
- [ ] All 6 new routes are registered in App.tsx and resolve without 404 errors
- [ ] No TypeScript errors
- [ ] All pages are fully responsive on mobile
