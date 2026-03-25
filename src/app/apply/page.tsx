'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Building2,
  DollarSign,
  Briefcase,
  Leaf,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'real-estate', label: 'Real Estate Lending', icon: Building2 },
  { key: 'business-funding', label: 'Business Funding', icon: DollarSign },
  { key: 'business-services', label: 'Business Services', icon: Briefcase },
  { key: 'clean-energy', label: 'Clean Energy', icon: Leaf },
  { key: 'wellness', label: 'Workplace Wellness', icon: Heart },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

const PRODUCTS: Record<CategoryKey, { slug: string; label: string }[]> = {
  'real-estate': [
    { slug: 're-1-4-unit', label: '1-4 Unit' },
    { slug: 're-fix-flip', label: 'Fix & Flip' },
    { slug: 're-multi-family', label: 'Multi-Family (5+)' },
    { slug: 're-mixed-use', label: 'Mixed Use' },
    { slug: 're-commercial', label: 'Commercial' },
    { slug: 're-land', label: 'Land' },
    { slug: 're-construction', label: 'Construction' },
    { slug: 're-church-nonprofit', label: 'Church/Non-Profit' },
    { slug: 're-heloc', label: 'HELOC' },
  ],
  'business-funding': [
    { slug: 'bf-equity-injection', label: 'Equity Injection' },
    { slug: 'bf-equipment', label: 'Equipment' },
    { slug: 'bf-truck-heavy', label: 'Truck/Heavy Equipment' },
    { slug: 'bf-working-capital', label: 'Working Capital' },
    { slug: 'bf-term-loan', label: 'Term Loan' },
    { slug: 'bf-acquisition', label: 'Business Acquisition' },
    { slug: 'bf-gap-funding', label: 'Gap Funding' },
    { slug: 'bf-ar-funding', label: 'AR Funding' },
    { slug: 'bf-retirement-rollover', label: 'Retirement Rollover' },
  ],
  'business-services': [
    { slug: 'bs-workers-comp', label: 'Workers Comp' },
    { slug: 'bs-property-restoration', label: 'Property Restoration' },
    { slug: 'bs-cost-segregation', label: 'Cost Segregation' },
    { slug: 'bs-tax-appeal', label: 'Tax Appeal' },
    { slug: 'bs-credit-repair', label: 'Credit Repair' },
  ],
  'clean-energy': [
    { slug: 'ce-commercial-solar', label: 'Commercial Solar' },
    { slug: 'ce-ev-charging', label: 'EV Charging' },
  ],
  wellness: [{ slug: 'w-ehmp', label: 'EHMP' }],
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY',
]

const DRAFT_KEY = 'seq_application_draft'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: string): string {
  const digits = value.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-US')
}

function parseCurrency(formatted: string): string {
  return formatted.replace(/[^\d]/g, '')
}

function todayString(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function findProductBySlug(slug: string): { cat: CategoryKey; product: string } | null {
  for (const [cat, prods] of Object.entries(PRODUCTS)) {
    const found = prods.find((p) => p.slug === slug)
    if (found) return { cat: cat as CategoryKey, product: found.slug }
  }
  return null
}

function productLabel(slug: string): string {
  for (const prods of Object.values(PRODUCTS)) {
    const found = prods.find((p) => p.slug === slug)
    if (found) return found.label
  }
  return slug
}

function categoryLabel(key: CategoryKey): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key
}

function needsBusinessName(cat: CategoryKey | ''): boolean {
  return ['business-funding', 'business-services', 'clean-energy'].includes(cat)
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  category: CategoryKey | ''
  product: string
  // Step 2
  clientName: string
  clientEmail: string
  clientPhone: string
  businessName: string
  notes: string
  // Step 3 — real estate
  loanPurpose: string
  creditScore: string
  street: string
  city: string
  state: string
  zip: string
  purchasePrice: string
  asIsValue: string
  monthlyRental: string
  arv: string
  rehabAmount: string
  dealsLast36: string
  // Step 3 — business funding
  amountRequested: string
  monthlySales: string
  annualSales: string
  loanPurposeBiz: string
  creditScoreBiz: string
  // Step 3 — wellness/EHMP
  companyName: string
  numEmployees: string
  decisionMakerName: string
  decisionMakerEmail: string
  decisionMakerPhone: string
  offersBenefits: string
  // Step 3 — generic
  additionalDetails: string
}

const INITIAL: FormData = {
  category: '', product: '',
  clientName: '', clientEmail: '', clientPhone: '', businessName: '', notes: '',
  loanPurpose: '', creditScore: '', street: '', city: '', state: '', zip: '',
  purchasePrice: '', asIsValue: '', monthlyRental: '', arv: '', rehabAmount: '', dealsLast36: '',
  amountRequested: '', monthlySales: '', annualSales: '', loanPurposeBiz: '', creditScoreBiz: '',
  companyName: '', numEmployees: '', decisionMakerName: '', decisionMakerEmail: '',
  decisionMakerPhone: '', offersBenefits: '', additionalDetails: '',
}

// ─── Field Component ────────────────────────────────────────────────────────

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-800">
        {label}{required && <span className="text-gold-700 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Currency Input ─────────────────────────────────────────────────────────

function CurrencyInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const display = formatCurrency(value)
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
      <input
        type="text"
        inputMode="numeric"
        className="input-brand pl-7"
        placeholder={placeholder ?? '0'}
        value={display}
        onChange={(e) => onChange(parseCurrency(e.target.value))}
      />
    </div>
  )
}

// ─── Progress ───────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  const steps = ['Product', 'Client Info', 'Details', 'Review']
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const num = i + 1
        const done = current > num
        const active = current === num
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                done ? 'border-gold-500 bg-gold-500 text-white'
                  : active ? 'border-green-500 bg-green-500 text-white'
                  : 'border-neutral-200 bg-white text-gray-400'
              }`}>
                {done ? <CheckCircle2 className="size-4" /> : num}
              </div>
              <span className={`text-[10px] mt-1 font-medium hidden sm:block ${
                done ? 'text-gold-700' : active ? 'text-green-700' : 'text-gray-400'
              }`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 sm:w-16 h-0.5 mx-1 ${done ? 'bg-gold-500' : 'bg-neutral-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const refParam = searchParams.get('ref')
  const referrer = refParam ? refParam.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') : null

  // Deep-link: pre-select product from URL
  useEffect(() => {
    const productParam = searchParams.get('product')
    if (productParam) {
      const match = findProductBySlug(productParam)
      if (match) {
        setForm((f) => ({ ...f, category: match.cat, product: match.product }))
      }
    }
  }, [searchParams])

  // Load draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        // Only load if no deep-link product was set
        if (!searchParams.get('product')) {
          setForm((f) => ({ ...f, ...parsed }))
        }
      }
    } catch { /* ignore */ }
  }, [searchParams])

  // Save draft to localStorage
  useEffect(() => {
    if (!submitted) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch { /* ignore */ }
    }
  }, [form, submitted])

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }, [])

  const go = useCallback((s: number) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Validation ──

  function validateStep1(): boolean {
    const e: typeof errors = {}
    if (!form.category) e.category = 'Please select a category'
    if (!form.product) e.product = 'Please select a product'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2(): boolean {
    const e: typeof errors = {}
    if (!form.clientName.trim()) e.clientName = 'Required'
    if (!form.clientEmail.trim()) e.clientEmail = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) e.clientEmail = 'Invalid email'
    if (!form.clientPhone.trim()) e.clientPhone = 'Required'
    if (needsBusinessName(form.category) && !form.businessName.trim()) e.businessName = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3(): boolean {
    // Step 3 is optional / best-effort — no hard validation
    return true
  }

  function handleNext() {
    if (step === 1 && validateStep1()) go(2)
    else if (step === 2 && validateStep2()) go(3)
    else if (step === 3 && validateStep3()) go(4)
  }

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }

  // ── Derived ──

  const isRealEstate = form.category === 'real-estate'
  const isFixFlip = form.product === 're-fix-flip'
  const isBusinessFunding = form.category === 'business-funding'
  const isWellness = form.product === 'w-ehmp'
  const isGenericStep3 = !isRealEstate && !isBusinessFunding && !isWellness

  const selectedProducts = useMemo(
    () => (form.category ? PRODUCTS[form.category] : []),
    [form.category],
  )

  // ── Success screen ──

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-sequoia-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-2">
            <strong>{productLabel(form.product)}</strong> for {form.clientName}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A Sequoia advisor will contact you within one business day.
          </p>
          <a href="/solutions" className="inline-flex items-center gap-2 px-6 py-3 bg-sequoia-900 text-white rounded-lg font-semibold hover:bg-sequoia-800 transition-colors">
            Explore Our Solutions <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    )
  }

  // ── Main render ──

  return (
    <section className="min-h-screen bg-brand-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Referrer banner */}
        {referrer && (
          <div className="mb-6 rounded-lg bg-gold-50 border border-gold-200 px-4 py-3 text-sm text-gold-800 font-medium text-center">
            Referred by: {referrer}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-display-md font-extrabold tracking-tight text-sequoia-900">
            Start Your Application
          </h1>
          <p className="mt-2 text-gray-500">
            Select a product and tell us about your needs. It only takes a few minutes.
          </p>
        </div>

        <StepProgress current={step} />

        <div className="rounded-2xl bg-white border border-neutral-200 shadow-brand-md p-6 sm:p-10">

          {/* ════════ STEP 1: Product Selection ════════ */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-sequoia-900">Select a Product</h2>
                <p className="text-sm text-gray-500 mt-1">Choose a category, then pick the specific product you need.</p>
              </div>

              {/* Category cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const selected = form.category === cat.key
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        set('category', cat.key)
                        if (form.category !== cat.key) set('product', '')
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all cursor-pointer ${
                        selected
                          ? 'border-gold-500 bg-sequoia-900 text-white'
                          : 'border-neutral-200 bg-white text-gray-700 hover:border-gold-500'
                      }`}
                    >
                      <Icon className={`size-6 ${selected ? 'text-gold-400' : 'text-sequoia-500'}`} />
                      <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                      <span className={`text-[10px] ${selected ? 'text-white/60' : 'text-gray-400'}`}>
                        {PRODUCTS[cat.key].length} product{PRODUCTS[cat.key].length > 1 ? 's' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.category && <p className="text-xs text-red-500 -mt-2">{errors.category}</p>}

              {/* Product dropdown */}
              {form.category && (
                <Field label="Select Product" required error={errors.product}>
                  <select
                    className="input-brand"
                    value={form.product}
                    onChange={(e) => set('product', e.target.value)}
                  >
                    <option value="">Choose a product...</option>
                    {selectedProducts.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.label}</option>
                    ))}
                  </select>
                </Field>
              )}

              <div className="flex justify-end pt-2">
                <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 px-6 py-3 bg-sequoia-900 text-white rounded-lg font-semibold hover:bg-sequoia-800 transition-colors">
                  Continue <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP 2: Client Information ════════ */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-sequoia-900">Client Information</h2>
                <p className="text-sm text-gray-500 mt-1">Basic contact info so we can match you with the right advisor.</p>
              </div>

              {/* Read-only consultant info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg bg-brand-neutral-50 border border-neutral-200 p-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">Consultant</span>
                  <span className="font-semibold text-sequoia-900">Allen Wu</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Consultant ID</span>
                  <span className="font-semibold text-sequoia-900">SEQ-2025-0001</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Date</span>
                  <span className="font-semibold text-sequoia-900">{todayString()}</span>
                </div>
              </div>

              <Field label="Client Name" required error={errors.clientName}>
                <input type="text" className={`input-brand ${errors.clientName ? 'border-red-500' : ''}`}
                  placeholder="Jane Smith" value={form.clientName}
                  onChange={(e) => set('clientName', e.target.value)} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Client Email" required error={errors.clientEmail}>
                  <input type="email" className={`input-brand ${errors.clientEmail ? 'border-red-500' : ''}`}
                    placeholder="jane@example.com" value={form.clientEmail}
                    onChange={(e) => set('clientEmail', e.target.value)} />
                </Field>
                <Field label="Client Phone" required error={errors.clientPhone}>
                  <input type="tel" className={`input-brand ${errors.clientPhone ? 'border-red-500' : ''}`}
                    placeholder="(555) 000-0000" value={form.clientPhone}
                    onChange={(e) => set('clientPhone', e.target.value)} />
                </Field>
              </div>

              {needsBusinessName(form.category) && (
                <Field label="Business Name" required error={errors.businessName}>
                  <input type="text" className={`input-brand ${errors.businessName ? 'border-red-500' : ''}`}
                    placeholder="Acme Holdings LLC" value={form.businessName}
                    onChange={(e) => set('businessName', e.target.value)} />
                </Field>
              )}

              <Field label="Notes (optional)">
                <textarea className="input-brand resize-none" rows={3}
                  placeholder="Any additional context..."
                  value={form.notes} onChange={(e) => set('notes', e.target.value)} />
              </Field>

              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => go(1)} className="text-sm font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 px-6 py-3 bg-sequoia-900 text-white rounded-lg font-semibold hover:bg-sequoia-800 transition-colors">
                  Continue <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP 3: Product-Specific Details ════════ */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-sequoia-900">Product Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tell us more about your <strong>{productLabel(form.product)}</strong> needs.
                </p>
              </div>

              {/* ── Real Estate fields ── */}
              {isRealEstate && (
                <>
                  <Field label="Loan Purpose">
                    <select className="input-brand" value={form.loanPurpose} onChange={(e) => set('loanPurpose', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Purchase">Purchase</option>
                      <option value="Refinance">Refinance</option>
                      <option value="Cash Out Refi">Cash Out Refi</option>
                    </select>
                  </Field>

                  <Field label="Credit Score">
                    <select className="input-brand" value={form.creditScore} onChange={(e) => set('creditScore', e.target.value)}>
                      <option value="">Select range...</option>
                      <option value="760+">760+</option>
                      <option value="740-759">740-759</option>
                      <option value="720-739">720-739</option>
                      <option value="700-719">700-719</option>
                      <option value="680-699">680-699</option>
                      <option value="660-679">660-679</option>
                      <option value="640-659">640-659</option>
                      <option value="620-639">620-639</option>
                      <option value="Below 620">Below 620</option>
                    </select>
                  </Field>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Property Address</p>
                    <Field label="Street">
                      <input type="text" className="input-brand" placeholder="123 Main St"
                        value={form.street} onChange={(e) => set('street', e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <Field label="City">
                          <input type="text" className="input-brand" placeholder="Phoenix"
                            value={form.city} onChange={(e) => set('city', e.target.value)} />
                        </Field>
                      </div>
                      <Field label="State">
                        <select className="input-brand" value={form.state} onChange={(e) => set('state', e.target.value)}>
                          <option value="">--</option>
                          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="ZIP">
                        <input type="text" className="input-brand" placeholder="85001" maxLength={10}
                          value={form.zip} onChange={(e) => set('zip', e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Purchase Price">
                      <CurrencyInput value={form.purchasePrice} onChange={(v) => set('purchasePrice', v)} />
                    </Field>
                    <Field label="As-Is Value">
                      <CurrencyInput value={form.asIsValue} onChange={(v) => set('asIsValue', v)} />
                    </Field>
                  </div>

                  <Field label="Monthly Rental Income">
                    <CurrencyInput value={form.monthlyRental} onChange={(v) => set('monthlyRental', v)} />
                  </Field>

                  {/* Fix & Flip extras */}
                  {isFixFlip && (
                    <>
                      <div className="border-t border-neutral-200 pt-4">
                        <p className="text-sm font-semibold text-gold-700 mb-4">Fix &amp; Flip Details</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field label="After Repair Value (ARV)">
                          <CurrencyInput value={form.arv} onChange={(v) => set('arv', v)} />
                        </Field>
                        <Field label="Rehab Amount">
                          <CurrencyInput value={form.rehabAmount} onChange={(v) => set('rehabAmount', v)} />
                        </Field>
                      </div>
                      <Field label="Deals Completed in Last 36 Months">
                        <input type="number" min="0" className="input-brand" placeholder="0"
                          value={form.dealsLast36} onChange={(e) => set('dealsLast36', e.target.value)} />
                      </Field>
                    </>
                  )}
                </>
              )}

              {/* ── Business Funding fields ── */}
              {isBusinessFunding && (
                <>
                  <Field label="Amount Requested">
                    <CurrencyInput value={form.amountRequested} onChange={(v) => set('amountRequested', v)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Monthly Sales">
                      <CurrencyInput value={form.monthlySales} onChange={(v) => set('monthlySales', v)} />
                    </Field>
                    <Field label="Annual Sales">
                      <CurrencyInput value={form.annualSales} onChange={(v) => set('annualSales', v)} />
                    </Field>
                  </div>
                  <Field label="Purpose of Loan">
                    <textarea className="input-brand resize-none" rows={3}
                      placeholder="Describe how you plan to use the funds..."
                      value={form.loanPurposeBiz} onChange={(e) => set('loanPurposeBiz', e.target.value)} />
                  </Field>
                  <Field label="Credit Score">
                    <select className="input-brand" value={form.creditScoreBiz} onChange={(e) => set('creditScoreBiz', e.target.value)}>
                      <option value="">Select range...</option>
                      <option value="760+">760+</option>
                      <option value="740-759">740-759</option>
                      <option value="720-739">720-739</option>
                      <option value="700-719">700-719</option>
                      <option value="680-699">680-699</option>
                      <option value="660-679">660-679</option>
                      <option value="640-659">640-659</option>
                      <option value="620-639">620-639</option>
                      <option value="Below 620">Below 620</option>
                    </select>
                  </Field>
                </>
              )}

              {/* ── Wellness / EHMP fields ── */}
              {isWellness && (
                <>
                  <Field label="Company Name">
                    <input type="text" className="input-brand" placeholder="Acme Corp"
                      value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
                  </Field>
                  <Field label="Number of Employees (minimum 5)">
                    <input type="number" min="5" className="input-brand" placeholder="25"
                      value={form.numEmployees} onChange={(e) => set('numEmployees', e.target.value)} />
                  </Field>
                  <div className="border-t border-neutral-200 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Decision Maker</p>
                  </div>
                  <Field label="Decision Maker Name">
                    <input type="text" className="input-brand" placeholder="John Smith"
                      value={form.decisionMakerName} onChange={(e) => set('decisionMakerName', e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Decision Maker Email">
                      <input type="email" className="input-brand" placeholder="john@acme.com"
                        value={form.decisionMakerEmail} onChange={(e) => set('decisionMakerEmail', e.target.value)} />
                    </Field>
                    <Field label="Decision Maker Phone">
                      <input type="tel" className="input-brand" placeholder="(555) 000-0000"
                        value={form.decisionMakerPhone} onChange={(e) => set('decisionMakerPhone', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Currently offer employee benefits?">
                    <select className="input-brand" value={form.offersBenefits} onChange={(e) => set('offersBenefits', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Unsure">Unsure</option>
                    </select>
                  </Field>
                </>
              )}

              {/* ── Generic fallback ── */}
              {isGenericStep3 && (
                <Field label="Additional Details">
                  <textarea className="input-brand resize-none" rows={5}
                    placeholder={`Provide any additional details about your ${productLabel(form.product)} needs...`}
                    value={form.additionalDetails} onChange={(e) => set('additionalDetails', e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">
                    A Sequoia advisor will follow up for any product-specific information needed for {productLabel(form.product)}.
                  </p>
                </Field>
              )}

              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => go(2)} className="text-sm font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 px-6 py-3 bg-sequoia-900 text-white rounded-lg font-semibold hover:bg-sequoia-800 transition-colors">
                  Review <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP 4: Review & Submit ════════ */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-sequoia-900">Review &amp; Submit</h2>
                <p className="text-sm text-gray-500 mt-1">Please review your application before submitting.</p>
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-neutral-200 bg-brand-neutral-50 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-400 block">Product</span>
                    <span className="font-bold text-sequoia-900">{productLabel(form.product)}</span>
                    <span className="text-xs text-gray-400 ml-2">({categoryLabel(form.category as CategoryKey)})</span>
                  </div>
                  <span className="text-xs text-gray-400">{todayString()}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs block">Client</span>
                    <span className="font-semibold text-gray-800">{form.clientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Email</span>
                    <span className="text-gray-800">{form.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Phone</span>
                    <span className="text-gray-800">{form.clientPhone}</span>
                  </div>
                  {form.businessName && (
                    <div>
                      <span className="text-gray-400 text-xs block">Business</span>
                      <span className="text-gray-800">{form.businessName}</span>
                    </div>
                  )}
                </div>

                {/* Key details preview */}
                {isRealEstate && form.purchasePrice && (
                  <div className="border-t border-neutral-200 pt-3 text-sm">
                    <span className="text-gray-400 text-xs block">Purchase Price</span>
                    <span className="font-semibold text-gray-800">${formatCurrency(form.purchasePrice)}</span>
                  </div>
                )}
                {isBusinessFunding && form.amountRequested && (
                  <div className="border-t border-neutral-200 pt-3 text-sm">
                    <span className="text-gray-400 text-xs block">Amount Requested</span>
                    <span className="font-semibold text-gray-800">${formatCurrency(form.amountRequested)}</span>
                  </div>
                )}
              </div>

              {/* Collapsible full details */}
              <button
                type="button"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
              >
                {detailsOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                {detailsOpen ? 'Hide' : 'View'} All Details
              </button>

              {detailsOpen && (
                <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(form).map(([key, val]) => {
                    if (!val || key === 'category') return null
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (s) => s.toUpperCase())
                      .replace('Biz', '(Business)')
                    const display = ['purchasePrice','asIsValue','monthlyRental','arv','rehabAmount','amountRequested','monthlySales','annualSales'].includes(key)
                      ? `$${formatCurrency(val)}` : key === 'product' ? productLabel(val) : val
                    return (
                      <div key={key} className="flex justify-between py-1 border-b border-neutral-100 last:border-0">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-gray-800 font-medium text-right max-w-[60%] break-words">{display}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => go(3)} className="text-sm font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-sequoia-900 rounded-lg font-bold hover:bg-gold-400 transition-colors disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 className="size-4 animate-spin" /> Submitting...</>
                  ) : (
                    <>Submit Application <ArrowRight className="size-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-sequoia-400" />
            Your information is encrypted and never sold
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="size-3.5 text-sequoia-400" />
            Response within one business day
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-sequoia-400" />
            No commitment required
          </div>
        </div>
      </div>
    </section>
  )
}
