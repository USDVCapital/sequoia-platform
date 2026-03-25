# SEQ Solution — Consolidated Dynamic Application Form
## Complete Field Analysis + Claude Code Implementation Prompt

---

## PART 1: WHAT WAS FOUND — THE CURRENT STATE

### 25 Forms Audited Across 5 Product Categories

All 25 application forms were visited and every field was documented. The findings reveal a significant opportunity: the forms are highly repetitive, inconsistently designed, and spread across 25 separate URLs — but they share a common field architecture that makes a single consolidated dynamic form not only possible but superior in every measurable way.

### The Duplication Problem

Three separate products (Business Acquisition, Accounts Receivable Funding, and Working Capital) all point to the same URL (`/wk/`) — the Working Capital form. This means consultants are sending clients to the wrong form for two out of three products. The Term Loan form (`/Termloan/`) is structurally identical to the Working Capital form with minor variations. The real estate forms (1-4 Unit, Fix & Flip, Multi-Family, Mixed Use, Commercial, Land, Construction) share 70–80% of their fields.

---

## PART 2: COMPLETE FIELD INVENTORY BY CATEGORY

### Universal Fields (Present in 20+ of 25 forms — always include)

| Field | Type | Notes |
|---|---|---|
| Today's Date | Date picker | Auto-populate with today's date |
| Consultant/Company Name | Text | Pre-fill from logged-in consultant profile |
| Client Name | Text | Required |
| Client Email | Email | Required |
| Client Phone | Phone | Required |
| Note / Additional Comments | Textarea | Optional |

### Near-Universal Fields (Present in 15–19 forms)

| Field | Type | Notes |
|---|---|---|
| Credit Score / FICO | Number | Required for all lending products |
| Business Name | Text | Required for all business products |
| Business Address (full) | Address group | Street, City, State, ZIP |
| How many full-time employees? | Number | Required for most business products |
| Are you a US Citizen / Green Card? | Radio/Dropdown | Yes / No / Green Card / Foreign National |
| Do you own your primary residence? | Radio | Yes / No |
| Business Website | URL | Optional on most |

### Real Estate Lending Fields (Forms 1–9: RE, Fix & Flip, Multi-Family, Mixed Use, Commercial, Land, Construction, Church/Non-Profit, HELOC)

| Field | Type | Products |
|---|---|---|
| Loan Purpose | Radio | Purchase / Rate & Term Refi / Cash Out Refi |
| Property Address (full) | Address group | All RE products |
| Property Type | Dropdown/Checkbox | Varies by product (see below) |
| Purchase Price | Currency | All purchase scenarios |
| As-Is Value | Currency | All RE products |
| Purchase Date / Target Closing Date | Date | All RE products |
| Down Payment Amount | Currency | Purchase scenarios |
| Current Loan Amount (if Refi) | Currency | Refi scenarios |
| Cash Out Amount (if Refi) | Currency | Cash-out scenarios |
| Monthly Rental Income | Currency | Investment properties |
| Annual Tax | Currency | All RE products |
| Annual Insurance | Currency | All RE products |
| Annual HOA | Currency | All RE products |
| How many investment properties owned? | Number | All RE products |
| Is property currently rented? | Radio | Vacant / Long-term / Short-term/Airbnb |
| ARV (After Repair Value) | Currency | Fix & Flip only |
| Rehab Amount | Currency | Fix & Flip only |
| Loan Amount | Currency | Fix & Flip only |
| Is property under contract? | Radio | Fix & Flip only |
| Cash available for closing? | Currency | Fix & Flip only |
| Total deals completed last 36 months | Number | Fix & Flip only |
| Total deals completed last 5 years | Number | Fix & Flip only |
| Number of Units | Number | Multi-Family, Mixed Use, Commercial |
| Loan Amount Requested | Currency | Multi-Family, Mixed Use |
| Is client a US Citizen or Green Card? | Radio | Multi-Family, Mixed Use, Commercial |
| Does client occupy commercial space? | Radio | Mixed Use only |
| Number of Commercial Units | Number | Mixed Use only |
| Total Commercial Sqft | Number | Mixed Use only |
| Number of Residential Units | Number | Mixed Use only |
| Total Residential Sqft | Number | Mixed Use only |
| If Refi, current mortgage balance | Currency | Mixed Use only |
| Usage (owner occupy / investment) | Radio | Commercial only |
| Type of Property | Dropdown | Commercial only (17 options) |
| Church Name | Text | Church/Non-Profit only |
| Church Website | URL | Church/Non-Profit only |
| Denomination | Text | Church/Non-Profit only |
| Inception Date | Date | Church/Non-Profit only |
| Property Type | Dropdown | HELOC: SFR, Townhouse, Condo, Duplex |
| Occupancy | Dropdown | HELOC: Primary / Investment |
| Mortgage Balance | Currency | HELOC only |
| Construction Type | Dropdown | Construction: Vacant Lot / Tear Down |
| Loan Type | Dropdown | Construction: Purchase+Build / Build Only / Refi |
| Exit Strategy | Dropdown | Construction: Sell / Hold as Rental |
| Construction Period | Dropdown | Construction: 1-3 / 4-6 / 7-9 / 10-12 / 13-18 months |
| Lot Purchase Price | Currency | Construction only |
| Current Lot Market Value | Currency | Construction only |
| Total Construction Budget Remaining | Currency | Construction only |
| Construction Completed to Date | Currency | Construction only |
| Estimated Complete Value | Currency | Construction only |
| Is Lot Zoned with Parcel ID? | Yes/No | Construction only |
| Building Permit Obtained? | Yes/No | Construction only |
| Any Construction Done? | Yes/No | Construction only |
| Lot Ready to Build? | Yes/No | Construction only |
| Plans and Specs Ready? | Yes/No | Construction only |
| Zoning Change Required? | Yes/No | Construction only |
| Lot Requires Subdivision? | Yes/No | Construction only |
| Any Mortgage on Lot? | Yes/No | Construction only |
| Any Other Existing Lien? | Yes/No | Construction only |
| Total Mortgage and Lien on Lot | Currency | Construction only |
| Ground-up builds last 36 months | Number | Construction only |
| Heavy Fix & Flip last 36 months | Number | Construction only |
| Using Third-Party General Contractor? | Yes/No | Construction only |
| Well or Septic System? | Yes/No | Construction only |

### Business Funding Fields (Forms 10–18: Equity Injection, Equipment, Truck/Heavy Equipment, Working Capital, Term Loan, Business Acquisition, Gap Funding, AR Funding, Retirement Rollover)

| Field | Type | Products |
|---|---|---|
| Amount of Financing Requested | Currency | All business funding |
| Average Monthly Sales | Currency | Working Capital, Term Loan, Business Acquisition |
| Actual Gross Sales Last Year | Currency | Working Capital, Term Loan, Business Acquisition |
| Purpose of Loan | Textarea | Working Capital, Term Loan, Business Acquisition |
| Nature of Business | Textarea | Working Capital, Term Loan, Business Acquisition |
| How soon is funding needed? | Text/Select | Working Capital, Term Loan, Gap Funding |
| How many years of business tax returns? | Number | Working Capital, Term Loan |
| Do you have any other short-term loans or tax liens? | Radio | Working Capital, Term Loan |
| If yes, how many loans and total balance? | Text | Conditional |
| Types of Assets | Checkbox | Cash / Real Estate / Retirement / Insurance |
| Asset Value or Balance | Currency | Working Capital, Term Loan |
| Are you purchasing a business? | Radio | Working Capital, Term Loan |
| If purchasing, will it involve real estate? | Radio | Conditional |
| Property Address (if real estate involved) | Address group | Conditional |
| Total Project Cost | Currency | Equity Injection only |
| Equity Needed | Currency | Equity Injection only |
| Have you secured a loan from any lenders? | Dropdown | Equity Injection only |
| How long in development/construction? | Text | Equity Injection only |
| How many projects currently? | Number | Equity Injection only |
| Company Website | URL | Equity Injection only |
| Provide website to the equipment | URL | Equipment Funding only |
| Loan Purpose | Dropdown | Truck: Cash out Equipment / Cash out Truck / Truck / Heavy Equipment |
| Employer Name | Text | Gap Funding only |
| Credit Utilization | Percentage | Gap Funding only |
| DTI % | Percentage | Gap Funding only |
| W2 Income Per Year | Currency | Gap Funding only |
| 1099 Income Per Year | Currency | Gap Funding only |
| Self-Employed Income Per Year | Currency | Gap Funding only |
| Time in Business / Employed | Text | Gap Funding only |
| Use of Funds | Textarea | Gap Funding only |
| Do you have any other loans currently? | Radio | Gap Funding only |
| Client Status | Dropdown | Rollover: US Citizen / Green Card |
| Credit Score Range | Dropdown | Rollover: 650-680 / 681-700 / 701-750 / 751+ |
| How much funding are you looking for? | Currency | Rollover only |
| What type of account do you have? | Checkbox | Rollover: IRA / 401K / Keogh / TSP / 457 / 403b / Pension / Annuities |

### Business Services Fields (Forms 19–22: Workers Comp, Property Restoration, Cost Segregation, Tax Appeal, Credit Repair)

| Field | Type | Products |
|---|---|---|
| Client Title | Text | Workers Comp only |
| Payroll Contact Name | Text | Workers Comp only |
| Payroll Contact Email | Email | Workers Comp only |
| Payroll Contact Phone | Phone | Workers Comp only |
| Company Address | Text | Workers Comp only |
| Company Owner Name | Text | Workers Comp only |
| Company Owner Phone | Phone | Workers Comp only |
| Company Owner Email | Email | Workers Comp only |
| Industry | Text | Workers Comp only |
| Number of Years in Business | Number | Workers Comp only |
| Number of Employees | Number | Workers Comp only |
| Number of W-2 Employees | Number | Workers Comp only |
| Company EIN | Text | Workers Comp only |
| Current Payroll System | Text | Workers Comp only |
| How often do you run payroll? | Dropdown | Weekly / Bi-Weekly / Twice Monthly / Monthly |
| Does client currently offer Medical Insurance? | Dropdown | Workers Comp only |
| Language support needed? | Text | Workers Comp only |
| Payroll Journal | File upload | Workers Comp only |
| W4 | File upload | Workers Comp only |
| Census | File upload | Workers Comp only |
| Client Property Type | Dropdown | Property Restoration: Hotel / Office / Warehouse / Apartment / Shopping Center / Mall / Airport / Government / Residential |
| Do you need help on Business Credit? | Dropdown | Credit Repair only |

### Clean Energy Fields (Forms 23–24: Commercial Solar, EV Charging)

| Field | Type | Products |
|---|---|---|
| Business Address (full) | Address group | Both |
| Utility Company | Text | Solar only |
| Annual Electrical Usage (KWH) | Number | Solar only |
| Roof Type | Text | Solar only |
| Ground Mount / Carport / EV Chargers | Text | Solar only |
| Date of Appointment | Date | Solar only |
| Do you have tax liability? | Text | Solar only |
| Eversource electric account number | Text | EV Charging only |
| Site Host: Name | Text | EV Charging only |
| Site Host: Company | Text | EV Charging only |
| Site Host: Address | Text | EV Charging only |
| Site Host: Email | Email | EV Charging only |
| Site Host: Phone | Phone | EV Charging only |
| Site Host: Federal Tax ID | Text | EV Charging only |
| Site Host: Alternative Email | Email | EV Charging only |
| Property Owner: Name | Text | EV Charging only |
| Property Owner: Address | Text | EV Charging only |
| Property Owner: Email | Email | EV Charging only |
| Property Owner: Phone | Phone | EV Charging only |

---

## PART 3: CONSOLIDATION ARCHITECTURE

### The Decision: One Form, Five Modes

Rather than 25 separate forms, the new platform should have **one dynamic application form** at `/apply` with a product selector dropdown at the top. When the user selects a product, the form dynamically shows only the relevant fields. This eliminates the routing problem (3 products pointing to the wrong form), creates a consistent UX, and allows the consultant's information to be pre-filled automatically.

### The Five Form Modes

| Mode | Products Covered | Unique Field Count |
|---|---|---|
| **Real Estate Lending** | 1-4 Unit, Fix & Flip, Multi-Family, Mixed Use, Commercial, Land, Construction, Church/Non-Profit, HELOC | ~55 fields (most conditional) |
| **Business Funding** | Equipment, Truck/Heavy Equipment, Working Capital, Term Loan, Business Acquisition, Gap Funding, AR Funding, Equity Injection, Retirement Rollover | ~40 fields (most conditional) |
| **Business Services** | Workers Comp, Property Restoration, Cost Segregation, Tax Appeal, Credit Repair | ~25 fields |
| **Clean Energy** | Commercial Solar, EV Charging Station | ~15 fields |
| **Workplace Wellness (EHMP)** | EHMP Enrollment | ~10 fields (separate simple form) |

### Shared Universal Section (Always Shown — Step 1)

```
Step 1: Tell Us About Your Client
- Product Category [Dropdown — triggers form mode]
- Specific Product [Dropdown — filtered by category]
- Consultant Name [Pre-filled from auth context]
- Consultant ID [Pre-filled from auth context]
- Client Name [Text, required]
- Client Email [Email, required]
- Client Phone [Phone, required]
- Client Company / Business Name [Text, required for business products]
- Today's Date [Date, auto-filled]
```

### Conditional Logic Map

The following shows which fields appear based on product selection:

**Real Estate Mode — Sub-product conditions:**
- All RE products: Property Address, Credit Score, Annual Tax/Insurance/HOA, Investment Properties Owned, Loan Purpose, Purchase Price, As-Is Value
- Fix & Flip adds: ARV, Rehab Amount, Deal history (36 months / 5 years), Under contract, Cash for closing
- Construction adds: All 15 construction-specific Yes/No fields, Construction period, Lot values
- Mixed Use adds: Commercial/Residential unit counts and sqft
- Commercial adds: Property type dropdown (17 options), Usage radio, Number of units
- Church adds: Church Name, Website, Denomination, Inception Date
- HELOC adds: Occupancy dropdown, Mortgage Balance (replaces purchase fields)

**Business Funding Mode — Sub-product conditions:**
- All business products: Amount Requested, Employees, Citizenship, Primary Residence ownership
- Working Capital / Term Loan / Business Acquisition: Monthly Sales, Annual Sales, Purpose of Loan, Nature of Business, Tax returns, Short-term loans/liens, Liquid Assets
- Equipment: Equipment website link
- Truck/Heavy Equipment: Loan purpose dropdown (Cash out Equipment / Cash out Truck / Truck / Heavy Equipment)
- Gap Funding: Income fields (W2/1099/Self-employed), DTI, Credit Utilization, Use of Funds
- Equity Injection: Project Cost, Equity Needed, Existing lenders, Development history
- Retirement Rollover: Account type checkboxes (IRA/401K/etc.), Credit Score range dropdown

---

## PART 4: CLAUDE CODE IMPLEMENTATION PROMPT

---

**SYSTEM CONTEXT:**
You are building a consolidated dynamic application form for Sequoia Enterprise Solutions, a commercial lending and business services company. The form replaces 25 separate application forms that currently exist on their old platform. The new form lives at `/apply` on a React + TypeScript + Tailwind v4 + shadcn/ui project.

**BRAND TOKENS (already defined in index.css — do not change):**
- Primary: `#0D2B1E` (deep forest green)
- Gold accent: `#C9A84C`
- Background: `#F5F0E8` (warm cream)
- Font: Playfair Display (headings), Inter (body)

---

### TASK: Build the Complete Dynamic Application Form System

Build the following files and components. Follow the exact specifications below.

---

### FILE 1: `/client/src/pages/Apply.tsx`

This is the main application page. It renders the `DynamicApplicationForm` component inside the standard page layout with Navbar and Footer.

**Page structure:**
```
<Navbar />
<main>
  <section className="bg-[#0D2B1E] py-16">
    <h1 className="font-playfair text-4xl text-white">Apply for Funding</h1>
    <p className="text-[#C9A84C]">Complete the form below — your consultant will review and contact you within 24 hours.</p>
    <div className="flex gap-4 mt-4">
      <span>No Credit Pull Required</span>
      <span>Confidential</span>
      <span>24-Hour Response</span>
    </div>
  </section>
  <section className="py-16 bg-[#F5F0E8]">
    <DynamicApplicationForm />
  </section>
</main>
<Footer />
```

---

### FILE 2: `/client/src/components/forms/DynamicApplicationForm.tsx`

This is the core form component. It is a **multi-step form** with the following steps:

**Step 1: Product Selection**
**Step 2: Client Information**
**Step 3: Product-Specific Details**
**Step 4: Review & Submit**

#### Step 1: Product Selection

Render a product category selector followed by a product selector. When a category is chosen, the product dropdown filters to show only products in that category.

**Product Category options and their products:**

```typescript
const PRODUCT_CATALOG = {
  "Real Estate Lending": [
    { id: "re-1-4-unit", label: "1-4 Unit Investment Properties" },
    { id: "re-fix-flip", label: "Fix & Flip / Fix & Hold" },
    { id: "re-multi-family", label: "Multi-Family Loan (5+ Units)" },
    { id: "re-mixed-use", label: "Mixed Use Properties" },
    { id: "re-commercial", label: "Commercial Properties" },
    { id: "re-land", label: "Land Loan" },
    { id: "re-construction", label: "Construction Loan" },
    { id: "re-church", label: "Church / Non-Profit Loan" },
    { id: "re-heloc", label: "Second Mortgage / HELOC" },
  ],
  "Business Funding": [
    { id: "bf-equity-injection", label: "Equity Injection" },
    { id: "bf-equipment", label: "Equipment Funding" },
    { id: "bf-truck", label: "Truck & Heavy Equipment" },
    { id: "bf-working-capital", label: "Working Capital" },
    { id: "bf-term-loan", label: "Term Loan" },
    { id: "bf-acquisition", label: "Business Acquisition" },
    { id: "bf-gap", label: "Gap Funding" },
    { id: "bf-ar", label: "Accounts Receivable (AR) Funding" },
    { id: "bf-rollover", label: "Retirement Account Rollover (ROBS)" },
  ],
  "Business Services": [
    { id: "bs-workers-comp", label: "Workers Compensation Savings Program" },
    { id: "bs-property-restoration", label: "Property Restoration" },
    { id: "bs-cost-segregation", label: "Cost Segregation" },
    { id: "bs-tax-appeal", label: "Tax Appeal" },
    { id: "bs-credit-repair", label: "Credit Repair / Business Credit" },
  ],
  "Clean Energy": [
    { id: "ce-solar", label: "Commercial Solar" },
    { id: "ce-ev", label: "EV Charging Station" },
  ],
  "Workplace Wellness": [
    { id: "ww-ehmp", label: "Employee Health & Wellness Program (EHMP)" },
  ],
};
```

Display each category as a large clickable card with an icon:
- Real Estate Lending: `Building2` icon
- Business Funding: `DollarSign` icon
- Business Services: `Briefcase` icon
- Clean Energy: `Leaf` icon
- Workplace Wellness: `Heart` icon

Once a category is selected, show the product dropdown below the cards. The selected category card should have a gold border and green background.

#### Step 2: Client Information (Universal — shown for all products)

```typescript
interface ClientInfo {
  consultantName: string;      // Pre-filled from auth context if available
  consultantId: string;        // Pre-filled from auth context if available
  clientName: string;          // required
  clientEmail: string;         // required, email validation
  clientPhone: string;         // required, phone format
  clientCompanyName: string;   // required for Business Funding, Business Services, Clean Energy
  todaysDate: string;          // auto-filled with today's date, read-only display
  notes: string;               // optional textarea
}
```

#### Step 3: Product-Specific Details

This step renders a different set of fields based on the `selectedProductId`. Use a `switch` statement or lookup object to render the correct field group component.

Build the following **field group components** in `/client/src/components/forms/fieldGroups/`:

---

**`RealEstateLendingFields.tsx`**

Props: `{ productId: string, formData: any, onChange: (field, value) => void }`

Always render:
```
- Loan Purpose [Radio: Purchase | Rate & Term Refi | Cash Out Refi]
- Credit Score [Number, min 300, max 850]
- Property Address [Address group: Street, City, State dropdown (all 50 states + DC), ZIP]
- Purchase Price [Currency input, show if Loan Purpose = Purchase or Refi]
- As-Is Value [Currency input]
- If Loan Purpose = Purchase: Down Payment Amount [Currency]
- If Loan Purpose includes Refi: Current Loan Amount [Currency], Cash Out Amount [Currency, show only if Cash Out Refi]
- Monthly Rental Income [Currency]
- Annual Property Tax [Currency]
- Annual Property Insurance [Currency]
- Annual HOA [Currency, label "Annual HOA (enter 0 if none)"]
- How many investment properties do you own? [Number]
- Do you own your primary residence? [Radio: Yes | No]
- Is client a US Citizen or Green Card? [Radio: US Citizen | Green Card | Foreign National]
```

Conditionally render based on `productId`:

**If `re-fix-flip`:** Add after Credit Score:
```
- ARV (After Repair Value) [Currency]
- Rehab Amount [Currency]
- Loan Amount Requested [Currency]
- Total deals completed in last 36 months [Number]
- Total deals completed in last 5 years [Number]
- Is property under contract? [Radio: Yes | No]
- How much cash do you have available for closing? [Currency]
```

**If `re-multi-family`:** Add after Property Address:
```
- Number of Units [Number, min 5]
- Loan Amount Requested [Currency]
- Download links for: Rent Roll template, Operating Statement template (use placeholder PDF links)
```

**If `re-mixed-use`:** Add after Property Address:
```
- Does client occupy the commercial space for their own business? [Radio: Yes | No]
- Number of Commercial Units [Number]
- Total Commercial Unit Sqft [Number]
- Number of Residential Units [Number]
- Total Residential Unit Sqft [Number]
- If Refi: Current Mortgage Balance [Currency]
```

**If `re-commercial`:** Add after Loan Purpose:
```
- Usage [Radio: 100% Owner Occupy | 100% Investment | Owner Occupy and Investment]
- Type of Property [Dropdown: 5+ Multi Family, Apartment, Automotive, Church, Commercial Condo, Day Care, Gas Station, Hotel/Motel, Mixed Use, Office, Retail, RV/Mobile Park, Storage, Warehouse, Funeral Home, Other]
- Number of Units [Number]
```

**If `re-construction`:** Replace standard fields with construction-specific layout:
```
Section: "Property Information"
- Property Type [Dropdown: Single Family, 2-4 Units, Townhome, Condo, Warehouse, Office Building, Shopping Center, ADU, Mixed Use, Other]
- Loan Type [Dropdown: Purchase Land and Construction Cost | Construction Cost Only | Refinance]
- Construction Type [Dropdown: Vacant Lot | Tear Down]
- Exit Strategy [Dropdown: Sell | Hold as Rental]
- Construction Period [Dropdown: 1-3 Months | 4-6 Months | 7-9 Months | 10-12 Months | 13-18 Months]

Section: "Financial Details"
- Requested Loan Amount [Currency]
- Lot Purchase Price [Currency]
- Current Lot Market Value [Currency]
- Total Construction Budget Remaining [Currency]
- Construction Completed to Date (Value) [Currency]
- Estimated Complete Value [Currency]

Section: "Property Status Checklist" (render as a clean Yes/No toggle grid)
- Is the Lot Zoned with Parcel ID #?
- Building Permit Obtained?
- Any Construction Done (Demo, Lot Prep, etc.)?
- Lot Ready to Build?
- Plans and Specs Ready?
- Any Zoning Change Required?
- Lot Requires Subdivision?
- Any Mortgage on the Lot?
- Any Other Existing Lien?
- Total Mortgage and Lien on Lot [Currency, show if either mortgage/lien = Yes]
- Are You Using a Third-Party General Contractor?
- Will Property Have a Well or Septic System?

Section: "Experience"
- How many ground-up constructions have you built in the last 36 months? [Number]
- How many heavy fix & flips have you done in the last 36 months? [Number]
```

**If `re-church`:** Add before Property Address:
```
- Church / Organization Name [Text]
- Church Website [URL, optional]
- Denomination [Text, optional]
- Inception Date [Date, optional]
- Loan Purpose [Dropdown: Purchase | Refinance | Renovation | Construction]
- Loan Amount Requested [Currency]
- As-Is Value of Property [Currency, optional]
```

**If `re-heloc`:** Replace standard fields with:
```
- Credit Score [Number]
- Property Address [Text]
- Property Type [Dropdown: Single Family Residence (SFR) | Townhouse | Condo | Duplex]
- Occupancy [Dropdown: Primary Residence | Investment]
- As-Is Value [Currency]
- Current Mortgage Balance [Currency]
- Annual Tax [Currency]
- Annual Insurance [Currency]
- Annual HOA [Currency]
- How many investment properties do you own? [Number]
```

---

**`BusinessFundingFields.tsx`**

Props: `{ productId: string, formData: any, onChange: (field, value) => void }`

Always render for business funding:
```
- Credit Score [Number]
- Amount of Financing Requested [Currency]
- How many full-time employees do you have? [Number]
- Are you a US Citizen? [Radio: Yes | No | Green Card]
- Do you own your primary residence? [Radio: Yes | No]
- Business Website [URL, optional]
```

**If `bf-working-capital`, `bf-term-loan`, or `bf-acquisition`:** Add:
```
Section: "Business Financials"
- Average Monthly Sales [Currency]
- Actual Gross Sales Last Year [Currency]
- Purpose of Loan [Textarea]
- Nature of Business [Textarea]
- Credit Score [Number]
- How soon is the funding needed? [Dropdown: Immediately | Within 2 Weeks | Within 30 Days | 30-60 Days | 60-90 Days]
- How many years of business tax returns do you have? [Number]
- Do you own your primary residence? [Radio: Yes | No]
- Do you have any other short-term loans or tax liens? [Radio: Yes | No]
- If Yes: How many loans, and what is the total balance? [Text, conditional]
- Are you purchasing a business? [Radio: Yes | No]
- If Yes: Will it involve any real estate? [Radio: Yes | No, conditional]
- If Yes: Property Address [Address group, conditional]

Section: "Liquid Assets"
- Types of Assets [Checkbox: Cash | Real Estate | Retirement | Insurance]
- Value or Balance [Currency]
```

**If `bf-equipment`:** Add:
```
- How long has the company been in business? [Number, label "Years in Business"]
- Loan Amount Requested (Min $10,000) [Currency]
- Provide a link to the equipment you wish to purchase [URL]
- Note: Display info box: "You will also need to download and complete the Equipment Purchase Application PDF and Credit Application PDF. Links will be provided after submission."
```

**If `bf-truck`:** Add:
```
- Loan Purpose [Dropdown: Cash Out on Equipment | Cash Out on Truck | Purchase Truck | Purchase Heavy Equipment]
- Loan Amount Requested [Currency]
- Business Website [URL, optional]
```

**If `bf-gap`:** Add:
```
Section: "Income Information"
- Employer Name [Text, optional]
- W2 Income Per Year [Currency]
- 1099 Income Per Year [Currency]
- Self-Employed Income Per Year [Currency]
- Time in Business / Employed [Text]
- Credit Utilization [Percentage, 0-100]
- DTI % (Debt-to-Income Ratio) [Percentage, 0-100]

Section: "Funding Details"
- Amount of Money Needed [Currency]
- Use of Funds [Textarea]
- How Soon is Funding Needed? [Dropdown: Immediately | Within 2 Weeks | Within 30 Days | 30-60 Days | 60-90 Days]
- Do You Have Any Other Loans Currently? [Radio: Yes | No]
```

**If `bf-equity-injection`:** Replace with:
```
- Project Address [Text]
- Total Project Cost [Currency]
- Equity Needed [Currency]
- Have you secured a loan from any lenders yet? [Dropdown: Yes | No]
- How long have you been in development or construction? [Text]
- How many projects do you have currently? [Number]
- Company Website [URL]
- Note: Display upload link info box: "Please upload your project documents to our secure portal: https://upload-sequoiapm.titanfile.com/wU5E2f/"
```

**If `bf-rollover`:** Replace with:
```
- Client Status [Dropdown: US Citizen | Green Card]
- Credit Score Range [Dropdown: 650-680 | 681-700 | 701-750 | 751+]
- How much funding are you looking for? [Currency]
- What type of retirement account do you have? [Checkbox: IRA | 401K | Keogh | TSP | 457 | 403b | Pension | Annuities]
- How many full-time employees do you have? [Number]
- Business Website [URL, optional]
```

---

**`BusinessServicesFields.tsx`**

**If `bs-workers-comp`:**
```
Section: "Company Information"
- Client Title [Text]
- Company Address [Text]
- Company City and State [Text]
- Company ZIP Code [Text]
- Company Owner Name [Text]
- Company Owner Phone [Phone]
- Company Owner Email [Email]
- Industry [Text]
- Number of Years in Business [Number]
- Number of Employees [Number]
- Number of W-2 Employees [Number, optional]
- Company EIN [Text]
- Current Payroll System [Text, optional]
- How often do you run payroll? [Dropdown: Weekly (52 pay periods) | Bi-Weekly (26 pay periods) | Twice Monthly (24 pay periods) | Once a Month (12 pay periods)]
- Does the client currently offer Medical Insurance? [Dropdown: Yes | No]

Section: "Payroll Contact"
- Payroll Contact Person's Name [Text]
- Payroll Contact Person's Email [Email]
- Payroll Contact Person's Phone [Phone]

Section: "Language Support"
- Does the client need language support? If so, please specify. [Text, optional]

Section: "Document Upload"
- Display info box: "Please provide the following documents in .csv or Excel format. Upload via our secure portal: https://upload-sequoiapm.titanfile.com/wU5E2f/"
- List: Payroll Journal, W4, Census
```

**If `bs-property-restoration`:**
```
- Client Address [Text]
- Client Property Type [Dropdown: Hotel | Office | Warehouse | Apartment Complex | Shopping Center | Shopping Mall | Airport Building | Government Building | Residential]
- Display info box: "Please upload property damage documentation to our secure portal: https://upload-sequoiapm.titanfile.com/wU5E2f/"
```

**If `bs-cost-segregation`:**
```
- How many full-time employees do you have? [Number]
- Display info box: "Cost Segregation studies can accelerate depreciation deductions on commercial properties. Our team will contact you to discuss your specific property portfolio."
```

**If `bs-tax-appeal`:**
```
- Display info box: "Our tax appeal specialists will review your current property tax assessment and identify opportunities for reduction. Please provide any relevant property details in the Notes field below."
- Notes field is required for this product.
```

**If `bs-credit-repair`:**
```
- Credit Score [Number]
- Do you need help with Business Credit as well? [Dropdown: Yes — Personal and Business Credit | No — Personal Credit Only]
```

---

**`CleanEnergyFields.tsx`**

**If `ce-solar`:**
```
Section: "Business Location"
- Business Address [Text]
- Business City [Text]
- Business State [Text]
- Business ZIP Code [Number]
- Utility Company [Text]

Section: "Energy Details"
- Annual Electrical Usage (KWH) [Number]
- Roof Type [Text, placeholder: "e.g., Flat, Pitched, Metal, TPO"]
- Ground Mount / Carport / EV Chargers [Text, placeholder: "Describe if applicable"]
- Do you have tax liability? [Dropdown: Yes | No | Unsure]

Section: "Appointment"
- Preferred Date of Appointment [Date]
```

**If `ce-ev`:**
```
Section: "Site Information"
- Does the site host have an Eversource electric account number at the proposed EV charger location? [Text, placeholder: "Enter account number or N/A"]

Section: "Site Host Contact"
- Name [Text]
- Company [Text]
- Address (Street, City, ZIP) [Text]
- Email [Email]
- Phone [Phone]
- Federal Tax ID [Text]
- Alternative Email [Email, optional]

Section: "Property Owner Contact"
- Name [Text]
- Address (Street, City, ZIP) [Text]
- Email [Email]
- Phone [Phone]
```

---

**`WellnessFields.tsx`**

**If `ww-ehmp`:**
```
Section: "Employer Information"
- Company Name [Text]
- Company Address [Text]
- Industry [Text]
- Number of Employees [Number, min 5, helper text: "Minimum 5 employees to qualify"]
- Does your company currently offer health benefits? [Dropdown: Yes | No | Partial]
- Estimated Annual Payroll [Currency, optional]

Section: "Decision Maker"
- Decision Maker Name [Text]
- Decision Maker Title [Text]
- Decision Maker Email [Email]
- Decision Maker Phone [Phone]
- Best time to contact [Dropdown: Morning (8am-12pm) | Afternoon (12pm-5pm) | Evening (5pm-8pm)]

Section: "Interest Level"
- What is your primary interest? [Checkbox: Reduce healthcare costs | Improve employee retention | Add benefits at no cost to company | All of the above]
```

---

#### Step 4: Review & Submit

Display a clean summary card showing:
- Product selected (category + specific product name)
- Client name, email, phone
- Consultant name and ID
- A collapsible "View All Details" section showing all filled fields

Submit button text: **"Submit Application"**

On submit:
1. Show a loading spinner on the button
2. After 1.5 seconds (simulated), show a success state:
   - Green checkmark icon
   - Heading: "Application Submitted Successfully"
   - Body: "Thank you, [Client Name]. Your application for [Product Name] has been received. Your consultant [Consultant Name] will review your information and contact you within 24 hours."
   - Two buttons: "Submit Another Application" (resets form) and "Return to Dashboard" (navigates to /portal)

---

### FILE 3: `/client/src/components/forms/FormProgress.tsx`

A step progress indicator component used at the top of the form.

Props: `{ currentStep: number, totalSteps: number, steps: string[] }`

Render as a horizontal stepper with:
- Step numbers in circles (filled gold for completed, filled green for current, outlined for future)
- Step labels below each circle
- Connecting lines between circles (gold for completed segments, gray for future)

---

### FILE 4: `/client/src/components/forms/CurrencyInput.tsx`

A reusable currency input component.

Props: `{ label: string, value: number | null, onChange: (value: number) => void, required?: boolean, helperText?: string }`

- Renders with a `$` prefix inside the input
- Formats the number with commas as the user types (e.g., 1000000 → 1,000,000)
- Stores the raw number value in state
- Shows red border and error message if required and empty on blur

---

### FILE 5: `/client/src/components/forms/AddressGroup.tsx`

A reusable address field group component.

Props: `{ label: string, value: AddressValue, onChange: (value: AddressValue) => void, required?: boolean }`

```typescript
interface AddressValue {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}
```

Renders:
- Address Line 1 [Text, required if group is required]
- Address Line 2 [Text, optional]
- City [Text, required if group is required]
- State [Dropdown, all 50 states + DC, required if group is required]
- ZIP Code [Text, 5-digit validation, required if group is required]

---

### FILE 6: Update `/client/src/App.tsx`

Add the route:
```typescript
<Route path="/apply" component={Apply} />
```

Import Apply from `@/pages/Apply`.

---

### FILE 7: Update all Solutions pages

On every product card in `/client/src/pages/Solutions.tsx` and all sub-solution pages, update the "Apply Now" button to navigate to:

```
/apply?product=[product-id]
```

For example, the Fix & Flip "Apply Now" button should link to `/apply?product=re-fix-flip`.

In `Apply.tsx`, read the `product` query parameter on mount and pre-select the matching product in Step 1, then auto-advance to Step 2.

```typescript
import { useSearch } from "wouter";

const search = useSearch();
const params = new URLSearchParams(search);
const preselectedProduct = params.get("product");

useEffect(() => {
  if (preselectedProduct) {
    // Find the category for this product
    for (const [category, products] of Object.entries(PRODUCT_CATALOG)) {
      const match = products.find(p => p.id === preselectedProduct);
      if (match) {
        setSelectedCategory(category);
        setSelectedProduct(preselectedProduct);
        setCurrentStep(2); // Skip to client info step
        break;
      }
    }
  }
}, [preselectedProduct]);
```

---

### FORM VALIDATION RULES

Use `react-hook-form` with `zod` for all validation. The schema should be built dynamically based on the selected product.

Minimum validation rules:
- Email fields: valid email format
- Phone fields: 10-digit US phone number, auto-format as (XXX) XXX-XXXX
- Currency fields: positive number, max 2 decimal places
- Credit Score: integer between 300 and 850
- ZIP Code: exactly 5 digits
- Percentage fields: 0–100
- Required text fields: minimum 2 characters

---

### DESIGN SPECIFICATIONS

**Form container:** White card with `shadow-lg`, `rounded-2xl`, padding `p-8`, max-width `max-w-4xl mx-auto`

**Section headers within forms:** `text-[#0D2B1E] font-playfair text-xl font-semibold border-b border-[#C9A84C] pb-2 mb-4`

**Field labels:** `text-sm font-medium text-[#0D2B1E]`

**Input fields:** Use shadcn/ui `Input` component, add `focus:ring-[#C9A84C] focus:border-[#C9A84C]`

**Required field indicator:** Gold asterisk `*` after label, `text-[#C9A84C]`

**Info boxes:** Light green background `bg-green-50 border border-green-200 rounded-lg p-4`, with an `Info` icon from lucide-react

**Navigation buttons:**
- Back: `variant="outline"` with left arrow icon
- Next/Submit: `bg-[#0D2B1E] text-white hover:bg-[#1a4a32]` with right arrow icon (or checkmark on final step)

**Product category cards (Step 1):**
- Default: `border-2 border-gray-200 bg-white rounded-xl p-6 cursor-pointer hover:border-[#C9A84C] transition-all`
- Selected: `border-2 border-[#C9A84C] bg-[#0D2B1E] text-white rounded-xl p-6`
- Icon size: `w-8 h-8`
- Category name: `font-playfair text-lg font-semibold mt-3`

**Yes/No toggle grid (Construction checklist):**
- Render as a 2-column grid
- Each item: label on left, toggle switch (shadcn/ui Switch) on right
- Use `bg-gray-50 rounded-lg p-3` for each row

---

### TYPESCRIPT INTERFACES

```typescript
// /client/src/types/application.ts

export interface ApplicationFormState {
  step: 1 | 2 | 3 | 4;
  selectedCategory: string | null;
  selectedProductId: string | null;
  selectedProductLabel: string | null;
  clientInfo: ClientInfo;
  productFields: Record<string, any>;
}

export interface ClientInfo {
  consultantName: string;
  consultantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompanyName: string;
  todaysDate: string;
  notes: string;
}

export interface AddressValue {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming"
];
```

---

### EXECUTION ORDER

Execute in this exact sequence to minimize broken states:

1. Create `/client/src/types/application.ts` with all interfaces and the US_STATES array
2. Create `/client/src/components/forms/CurrencyInput.tsx`
3. Create `/client/src/components/forms/AddressGroup.tsx`
4. Create `/client/src/components/forms/FormProgress.tsx`
5. Create `/client/src/components/forms/fieldGroups/RealEstateLendingFields.tsx`
6. Create `/client/src/components/forms/fieldGroups/BusinessFundingFields.tsx`
7. Create `/client/src/components/forms/fieldGroups/BusinessServicesFields.tsx`
8. Create `/client/src/components/forms/fieldGroups/CleanEnergyFields.tsx`
9. Create `/client/src/components/forms/fieldGroups/WellnessFields.tsx`
10. Create `/client/src/components/forms/DynamicApplicationForm.tsx` (imports all field groups)
11. Create `/client/src/pages/Apply.tsx` (imports DynamicApplicationForm)
12. Update `/client/src/App.tsx` to add the `/apply` route
13. Update all Solutions pages to link Apply Now buttons to `/apply?product=[id]`
14. Test all 5 form modes by navigating to `/apply?product=re-fix-flip`, `/apply?product=bf-gap`, `/apply?product=bs-workers-comp`, `/apply?product=ce-solar`, `/apply?product=ww-ehmp`

---

### DEFINITION OF DONE

The form is complete when:

- [ ] All 5 product categories render distinct field sets with zero missing fields from the original 25 forms
- [ ] All conditional fields show/hide correctly based on selections (Loan Purpose, Yes/No toggles, purchasing a business, etc.)
- [ ] Currency inputs format numbers with commas and store raw numeric values
- [ ] Address groups validate all 5 sub-fields when required
- [ ] The Construction Loan Yes/No checklist renders as a clean toggle grid (not 15 separate dropdowns)
- [ ] Deep-linking via `?product=` query param pre-selects the product and skips to Step 2
- [ ] All Solutions page "Apply Now" buttons link to the correct `?product=` URL
- [ ] The success state shows the correct client name, product name, and consultant name
- [ ] Form resets cleanly when "Submit Another Application" is clicked
- [ ] All fields pass zod validation before advancing to the next step
- [ ] The form is fully responsive on mobile (single column) and desktop (two column for most field groups)
- [ ] No TypeScript errors

---

### IMPORTANT NOTES FOR CLAUDE CODE

1. The three products that previously shared the Working Capital form URL (`/wk/`) — Working Capital, Business Acquisition, and Accounts Receivable Funding — should all map to `bf-working-capital`, `bf-acquisition`, and `bf-ar` respectively. AR Funding is structurally identical to Working Capital and should use the same field group.

2. The Retirement Rollover form uses a **credit score range dropdown** (650-680, 681-700, 701-750, 751+) instead of a numeric input. This is intentional — preserve it.

3. The Workers Compensation form is the most complex Business Services form. It has three separate contact sections (Client, Payroll Contact, Company Owner) and file upload instructions. Render each section with a clear visual separator.

4. The EV Charging form has three separate contact blocks (Client, Site Host, Property Owner). Render each as a distinct card with a header.

5. Do not add reCAPTCHA to the form — the new platform uses consultant authentication as the spam prevention layer.

6. The "Today's Date" field should be auto-populated with `new Date().toLocaleDateString('en-US')` and displayed as read-only text, not an editable field. The consultant should not have to type the date.

7. All currency fields should accept input without the `$` sign and format automatically. Store values as numbers, not strings.

8. The form should save progress to `localStorage` under the key `seq_application_draft` so that if the user navigates away and returns, their progress is preserved. Show a "Resume Draft" banner at the top of Step 1 if a draft exists.
