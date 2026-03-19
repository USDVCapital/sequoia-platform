'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Users,
  Layers,
  Zap,
  BookOpen,
  Play,
  Globe,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CircleCheck,
} from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const valueItems = [
  { icon: <Users size={17} />, text: 'Access to 500+ vetted lending partners' },
  { icon: <Layers size={17} />, text: 'Full product suite: Real Estate, Business Funding, Services, Clean Energy' },
  { icon: <Zap size={17} />, text: 'CEA AI Assistant for instant product guidance' },
  { icon: <BookOpen size={17} />, text: 'Weekly live training — Wednesdays 8 PM ET' },
  { icon: <Play size={17} />, text: '190+ on-demand training videos' },
  { icon: <Globe size={17} />, text: 'Personal replicated website' },
  { icon: <BarChart3 size={17} />, text: 'Back office with real-time deal tracking' },
]

const backgrounds = [
  'Real Estate Agent / Broker',
  'Loan Officer / Mortgage Professional',
  'Insurance Agent / Broker',
  'CPA / Accountant',
  'Financial Advisor / Planner',
  'Business Consultant',
  'Other',
]

interface FormState {
  fullName: string
  email: string
  phone: string
  background: string
  referralCode: string
}

export default function EnrollPage() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    background: '',
    referralCode: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  function validate(): boolean {
    const newErrors: Partial<FormState> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'A valid email address is required.'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.'
    if (!form.background) newErrors.background = 'Please select your professional background.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      setSubmitted(true)
    }
  }

  return (
    <div className="bg-background">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-hero py-16">
        <div className="container-brand text-center">
          <span className="badge-dark mb-5 inline-flex">
            <ShieldCheck size={12} />
            Secure Enrollment
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Become a Sequoia Consultant
          </h1>
          <p className="text-sequoia-200 text-lg max-w-xl mx-auto">
            One flat monthly fee. Full platform access. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Left — Value Recap */}
            <div className="lg:col-span-2">
              {/* Pricing callout */}
              <div className="rounded-2xl bg-gradient-sequoia p-8 text-center mb-8">
                <p className="text-sequoia-200 text-sm uppercase tracking-widest font-semibold mb-2">
                  Consultant Membership
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-black text-white">$29</span>
                  <span className="text-xl font-bold text-sequoia-300 mb-1">.99</span>
                  <span className="text-sequoia-300 mb-1">/month</span>
                </div>
                <p className="text-sequoia-300 text-xs mt-2">Cancel anytime. No contracts.</p>
              </div>

              {/* What's included */}
              <h2 className="text-xl font-bold text-gray-900 mb-5">What You Get</h2>
              <ul className="space-y-4">
                {valueItems.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sequoia-100 text-sequoia-700 flex items-center justify-center mt-0.5">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="divider-gold my-8" />

              {/* Trust signals */}
              <div className="space-y-3">
                {[
                  'No license required to refer clients',
                  'Weekly live support and training',
                  'Real people, real deals — 500+ funded',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                    <CircleCheck size={16} className="text-sequoia-600 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Enrollment Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <SuccessState name={form.fullName} email={form.email} />
              ) : (
                <div className="card-sequoia p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h2>
                  <p className="text-gray-500 text-sm mb-7">
                    Complete the form below to start your Sequoia consultant membership.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Smith"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`input-brand ${errors.fullName ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={`input-brand ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="(555) 000-0000"
                        value={form.phone}
                        onChange={handleChange}
                        className={`input-brand ${errors.phone ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Professional Background */}
                    <div>
                      <label
                        htmlFor="background"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Professional Background <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="background"
                        name="background"
                        value={form.background}
                        onChange={handleChange}
                        className={`input-brand ${errors.background ? 'border-red-400' : ''}`}
                      >
                        <option value="">Select your background…</option>
                        {backgrounds.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      {errors.background && (
                        <p className="mt-1 text-xs text-red-600">{errors.background}</p>
                      )}
                    </div>

                    {/* Referral Code */}
                    <div>
                      <label
                        htmlFor="referralCode"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Referral Code{' '}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="referralCode"
                        name="referralCode"
                        type="text"
                        placeholder="Enter referral code if you have one"
                        value={form.referralCode}
                        onChange={handleChange}
                        className="input-brand"
                      />
                    </div>

                    {/* Pricing reminder */}
                    <div className="rounded-lg bg-sequoia-50 border border-sequoia-200 p-4 flex items-center justify-between">
                      <span className="text-sequoia-800 font-semibold text-sm">
                        Consultant Membership
                      </span>
                      <span className="text-sequoia-900 font-black text-xl">
                        $29.99<span className="text-sm font-normal text-sequoia-700">/mo</span>
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="btn-gold w-full justify-center text-base py-4"
                    >
                      Complete Enrollment
                      <ArrowRight size={18} />
                    </button>

                    <p className="text-center text-xs text-gray-400 leading-relaxed">
                      By enrolling you agree to our Terms of Service and Privacy Policy.
                      Cancel anytime from your account dashboard.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SuccessState({ name, email }: { name: string; email: string }) {
  const firstName = name.split(' ')[0]
  return (
    <div className="card-sequoia p-10 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-sequoia-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-sequoia-700" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to Sequoia, {firstName}!
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed mb-1 max-w-sm mx-auto">
        Your enrollment is confirmed. Check{' '}
        <span className="font-semibold text-sequoia-700">{email}</span> for your
        account details and onboarding instructions.
      </p>

      <div className="divider-gold my-7 mx-auto max-w-xs" />

      <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
        Your Next Steps
      </h3>
      <ol className="space-y-3 text-left max-w-sm mx-auto">
        {[
          'Check your email for login credentials',
          'Log in to your back office and complete your profile',
          'Watch the New Consultant Quick-Start Guide',
          'Join the next Wednesday live training at 8 PM ET',
        ].map((step, i) => (
          <li key={step} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sequoia-700 text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/resources" className="btn-primary">
          Go to Training Library
          <ArrowRight size={16} />
        </a>
        <a href="/opportunity" className="btn-outline">
          Review the Opportunity
        </a>
      </div>
    </div>
  )
}
