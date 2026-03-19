'use client'

import { useState } from 'react'
import {
  ClipboardList,
  Building2,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Lock,
  Phone,
} from 'lucide-react'
import Button from '@/components/ui/Button'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string
  email: string
  phone: string
  businessName: string
  fundingType: string
  estimatedAmount: string
  description: string
}

type FieldKey = keyof FormData

// ─── Constants ─────────────────────────────────────────────────────────────────

const FUNDING_TYPES = [
  { group: 'Real Estate Loans', options: [
    '1–4 Unit Investment Property',
    'Fix & Flip',
    'Multi-Family 5+ Units',
    'Mixed Use',
    'Commercial Real Estate',
    'Land',
    'Construction',
  ]},
  { group: 'Business Funding', options: [
    'Equipment Funding',
    'Truck & Heavy Equipment',
    'Working Capital',
    'Term Loan',
    'Business Acquisition',
    'AR / Invoice Funding',
    'Gap Funding / NINA',
    'Retirement Account Rollover (ROBS)',
  ]},
  { group: 'Business Services', options: [
    'Employee Wellness Program (EHMP)',
    'Property Restoration',
    'Cost Segregation',
    'Tax Appeal',
    'Credit Services',
  ]},
  { group: 'Clean Energy', options: [
    'Commercial Solar',
    'EV Charging Stations',
  ]},
]

const AMOUNT_RANGES = [
  'Under $100,000',
  '$100,000 – $250,000',
  '$250,000 – $500,000',
  '$500,000 – $1,000,000',
  '$1,000,000 – $5,000,000',
  '$5,000,000 – $25,000,000',
  '$25,000,000+',
  'Not sure yet',
]

const STEPS = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Tell us about your project',
    description: "Share what you're working on and what kind of solution you need.",
  },
  {
    number: 2,
    icon: Building2,
    title: 'Tell us about your business',
    description: 'Basic details so we can route you to the right advisor.',
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Get matched',
    description: 'A Sequoia advisor will reach out within one business day.',
  },
]

const EMPTY_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  fundingType: '',
  estimatedAmount: '',
  description: '',
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start gap-0 mb-10">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        const isComplete = currentStep > step.number
        const isActive = currentStep === step.number
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.number} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isComplete
                    ? 'border-sequoia-600 bg-sequoia-600 text-white'
                    : isActive
                    ? 'border-sequoia-700 bg-sequoia-700 text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Icon className="size-4.5" />
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={`text-xs font-semibold ${
                    isActive ? 'text-sequoia-900' : isComplete ? 'text-sequoia-700' : 'text-gray-400'
                  }`}
                >
                  Step {step.number}
                </p>
                <p
                  className={`text-xs max-w-[100px] leading-tight ${
                    isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mt-5 mx-2 transition-colors duration-200 ${
                  isComplete ? 'bg-sequoia-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-gold-700 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  function update(field: FieldKey, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validateStep(step: number): boolean {
    const newErrors: Partial<Record<FieldKey, string>> = {}

    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = 'Please enter your full name.'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        newErrors.email = 'Please enter a valid email address.'
      if (!form.phone.trim()) newErrors.phone = 'Please enter a phone number.'
    }

    if (step === 2) {
      if (!form.fundingType) newErrors.fundingType = 'Please select a solution type.'
      if (!form.estimatedAmount) newErrors.estimatedAmount = 'Please select an estimated amount.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleBack() {
    setCurrentStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validateStep(2)) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-section flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-sequoia-100 mb-6">
            <CheckCircle2 className="size-10 text-sequoia-700" />
          </div>
          <h1 className="text-3xl font-bold text-sequoia-900 mb-4">
            We've received your inquiry
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-2">
            Thank you, <strong>{form.fullName}</strong>. A Sequoia advisor will review your
            request and reach out within one business day.
          </p>
          <p className="text-sm text-gray-400 mb-10">
            Check your inbox at <strong>{form.email}</strong> for a confirmation.
          </p>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-left mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-700 mb-3">
              Your Submission Summary
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Solution Type</span>
                <span className="font-medium text-gray-900">{form.fundingType || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Amount</span>
                <span className="font-medium text-gray-900">{form.estimatedAmount || '—'}</span>
              </div>
              {form.businessName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Business</span>
                  <span className="font-medium text-gray-900">{form.businessName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/solutions" variant="outline">
              Explore More Solutions
            </Button>
            <Button href="/" variant="primary">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Page Hero ── */}
      <section className="bg-gradient-hero py-16 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--gold-500)_0%,_transparent_60%)] opacity-10"
        />
        <div className="container-brand relative z-10 text-center">
          <span className="badge-dark mb-4 inline-flex">Concierge Intake</span>
          <h1 className="text-display-md sm:text-display-lg font-extrabold tracking-tight text-white">
            Let's Find the Right Solution for You
          </h1>
          <p className="mt-4 text-sequoia-300 text-lg max-w-xl mx-auto leading-relaxed">
            This isn't a loan application — it's a conversation starter. Share a little about
            your goals, and we'll match you with the right advisor.
          </p>
        </div>
      </section>

      {/* ── How it Works strip ── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container-brand">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="icon-box-sequoia shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                      Step {step.number}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="size-4 text-gray-300 hidden sm:block mt-1 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="mx-auto max-w-2xl">
            {/* Progress */}
            <ProgressSteps currentStep={currentStep} />

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white border border-gray-100 shadow-brand-md p-8 sm:p-10"
            >
              {/* ── Step 1: Contact Info ── */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-sequoia-900">About You</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Basic contact info so we can reach you. We'll never sell your information.
                    </p>
                  </div>

                  <Field label="Full Name" required>
                    <input
                      type="text"
                      className="input-brand"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      autoComplete="name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </Field>

                  <Field label="Email Address" required>
                    <input
                      type="email"
                      className="input-brand"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </Field>

                  <Field
                    label="Phone Number"
                    required
                    hint="A Sequoia advisor may call to discuss your inquiry."
                  >
                    <input
                      type="tel"
                      className="input-brand"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </Field>

                  <Field
                    label="Business or Company Name"
                    hint="Optional — leave blank if you're an individual investor."
                  >
                    <input
                      type="text"
                      className="input-brand"
                      placeholder="Acme Holdings LLC"
                      value={form.businessName}
                      onChange={(e) => update('businessName', e.target.value)}
                      autoComplete="organization"
                    />
                  </Field>

                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="primary" size="lg" onClick={handleNext}>
                      Continue
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Project Info ── */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-sequoia-900">About Your Project</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Help us match you with the right solution and advisor.
                    </p>
                  </div>

                  <Field label="What type of solution are you looking for?" required>
                    <select
                      className="input-brand"
                      value={form.fundingType}
                      onChange={(e) => update('fundingType', e.target.value)}
                    >
                      <option value="">Select a solution type…</option>
                      {FUNDING_TYPES.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.fundingType && (
                      <p className="text-xs text-red-500 mt-1">{errors.fundingType}</p>
                    )}
                  </Field>

                  <Field label="Estimated Amount Needed" required>
                    <select
                      className="input-brand"
                      value={form.estimatedAmount}
                      onChange={(e) => update('estimatedAmount', e.target.value)}
                    >
                      <option value="">Select a range…</option>
                      {AMOUNT_RANGES.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.estimatedAmount && (
                      <p className="text-xs text-red-500 mt-1">{errors.estimatedAmount}</p>
                    )}
                  </Field>

                  <Field
                    label="Brief Description"
                    hint="Optional but helpful. 2–3 sentences is plenty."
                  >
                    <textarea
                      className="input-brand resize-none"
                      rows={4}
                      placeholder="e.g. I'm looking to acquire a 12-unit apartment building in Phoenix and need bridge financing while I wait on a conventional loan approval…"
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                    />
                  </Field>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Back
                    </button>
                    <Button type="submit" variant="secondary" size="lg">
                      Submit Inquiry
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>

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
        </div>
      </section>

      {/* ── Sidebar reassurance panel ── */}
      <section className="bg-sequoia-50 border-t border-sequoia-100 py-12">
        <div className="container-brand">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-700 mb-3">
              What Happens Next
            </p>
            <h2 className="text-2xl font-bold text-sequoia-900">A concierge experience, not a call center</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 max-w-lg mx-auto">
              When you submit your inquiry, a real Sequoia advisor reviews it personally. We don't
              blast your information to a hundred lenders — we thoughtfully match you with the
              right solution and walk with you through the process.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: CheckCircle2, text: 'Personal advisor assigned within 24 hours' },
                { icon: CheckCircle2, text: 'No hard credit pull without your consent' },
                { icon: CheckCircle2, text: 'Access to 500+ vetted lending partners' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2 rounded-xl bg-white border border-sequoia-100 p-4"
                >
                  <Icon className="size-4 text-sequoia-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
