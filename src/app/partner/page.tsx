'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Handshake,
  Users,
  UserPlus,
  Crown,
  ArrowRight,
  CheckCircle2,
  Phone,
  Building2,
} from 'lucide-react'
import { useBooking } from '@/contexts/BookingContext'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

// ─── Zod Schema ─────────────────────────────────────────────────────────────────

const partnerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(/^[\d\s\-\(\)\+]+$/, 'Phone must contain only numbers'),
  organization: z.string().min(1, 'Organization is required'),
  message: z.string().optional(),
})

type PartnerFormData = z.infer<typeof partnerSchema>

const partnershipModels = [
  {
    icon: Handshake,
    title: 'Referral Partner',
    price: 'Free',
    description:
      'Simply refer clients who need funding and earn a referral fee on every closed deal. No enrollment, no commitment — just warm introductions.',
    features: [
      'No cost to join',
      'Referral fee on closed deals',
      'No training required',
      'Submit referrals via email or portal',
      'Ideal for professionals with existing client base',
      'Real estate agents, CPAs, attorneys welcome',
    ],
  },
  {
    icon: UserPlus,
    title: 'Independent Consultant',
    price: '$29.99/mo',
    featured: true,
    description:
      'Full access to the Sequoia platform, 500+ lending partners, training library, AI assistant, and all product lines. Build your own book of business.',
    features: [
      'Access to 500+ lending partners',
      '190+ training videos & resources',
      'CEA AI Assistant for product guidance',
      'Full CRM and pipeline tools',
      'EHMP wellness program access',
      'Community of 2,500+ consultants',
      'Weekly live training sessions',
      'Marketing materials & templates',
    ],
  },
  {
    icon: Crown,
    title: 'Team Leader',
    price: 'By Invitation',
    description:
      'Build and lead your own team of consultants. Earn overrides on your team\'s production in addition to your own deals. For proven performers ready to scale.',
    features: [
      'Everything in Independent Consultant',
      'Override commissions on team production',
      'Team management dashboard',
      'Recruiting & onboarding tools',
      'Priority support & dedicated success manager',
      'Leadership training & retreats',
      'Revenue share on team growth',
    ],
  },
]

const partnerLogos = [
  'EXP Commercial Realty',
  'Keller Williams',
  'National ACE',
  'Cal Asia Chamber',
  'Filipino Chamber of Commerce',
]

export default function PartnerPage() {
  const { openBooking } = useBooking()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', organization: '', message: '' },
  })

  function onSubmit() {
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroVideo />
        <div className="container-brand relative z-10 section-padding-lg">
          <div className="max-w-3xl">
            <FadeIn direction="up" delay={0}>
              <span className="badge-dark mb-6 inline-flex items-center gap-2">
                <Handshake className="size-3.5" />
                Partner With Sequoia
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
                Your Clients Need Capital.{' '}
                <span className="text-gold-400">We Have 500+ Ways to Fund It.</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl">
                Whether you are a real estate professional, financial advisor, CPA, or community leader,
                partnering with Sequoia gives you a full financing platform to serve your clients better
                and earn additional income.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => openBooking()}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 px-7 py-3.5 text-base gap-2.5 bg-gold-500 hover:bg-gold-600 shadow-sm cursor-pointer"
                  style={{ color: '#000000' }}
                >
                  Schedule a Partnership Call
                  <ArrowRight className="size-4" />
                </button>
                <a href="#models" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
                  View Partnership Models
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section id="models" className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Partnership Models"
              heading="Three Ways to Partner"
              subheading="Choose the model that fits your business. From simple referrals to building your own team, there's a path for every professional."
            />
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3">
            {partnershipModels.map((model) => {
              const Icon = model.icon
              return (
                <StaggerItem key={model.title} direction="up">
                  <Card
                    className={`h-full ${
                      model.featured
                        ? 'relative border-gold-400/60 bg-gradient-to-br from-gold-100 to-sequoia-50 ring-1 ring-gold-400/40'
                        : ''
                    }`}
                  >
                    {model.featured && (
                      <span className="badge-gold absolute -top-3 left-5">Most Popular</span>
                    )}
                    <div className="flex flex-col gap-5 h-full">
                      <div className="flex items-center gap-3">
                        <div className="icon-box-sequoia">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-sequoia-900">{model.title}</h3>
                          <p className="text-sm font-semibold text-gold-700">{model.price}</p>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-600">
                        {model.description}
                      </p>

                      <ul className="space-y-2 flex-1">
                        {model.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="size-4 shrink-0 text-gold-600 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-2">
                        <a
                          href="#contact-form"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sequoia-700 hover:text-sequoia-900 transition-colors group"
                        >
                          Get Started
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="container-brand">
          <FadeIn direction="up">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-10">
              Trusted by Partners Nationwide
            </p>
          </FadeIn>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center px-6 py-3 rounded-lg bg-neutral-50 border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-600">{logo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="max-w-2xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-10">
                <p className="text-sm font-semibold uppercase tracking-widest text-gold-700">
                  Get in Touch
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  Schedule a Partnership Call
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                  Tell us about your business and we will connect you with the right partnership model.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              {submitted ? (
                <Card>
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
                        <CheckCircle2 className="size-7 text-gold-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-black">Thank you!</h3>
                    <p className="mt-2 text-neutral-600">
                      We have received your inquiry and will be in touch within 24 hours to schedule
                      your partnership call.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition ${errors.name ? 'border-red-500' : 'border-neutral-300'}`}
                          placeholder="Your full name"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-neutral-300'}`}
                          placeholder="you@example.com"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition ${errors.phone ? 'border-red-500' : 'border-neutral-300'}`}
                          placeholder="(555) 123-4567"
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="organization"
                          type="text"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition ${errors.organization ? 'border-red-500' : 'border-neutral-300'}`}
                          placeholder="Your company or organization"
                          {...register('organization')}
                        />
                        {errors.organization && (
                          <p className="mt-1 text-xs text-red-500">{errors.organization.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Tell Us About Your Business
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition resize-none"
                        placeholder="What type of partnership are you interested in? How many clients do you typically serve?"
                        {...register('message')}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl bg-black hover:bg-neutral-800 font-semibold transition flex items-center justify-center gap-2"
                      style={{ color: '#FFFFFF' }}
                    >
                      Schedule a Partnership Call
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </Card>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-sequoia-dark section-padding">
        <div className="container-brand text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
              Ready to Partner?
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              Your clients need capital. Let&apos;s fund them together.
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Join hundreds of professionals who are earning additional income by connecting their
              clients with the right capital solutions.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/enroll" variant="secondary" size="lg">
                Enroll as a Consultant
              </Button>
              <a href="tel:+13013378035" className="btn-ghost-light inline-flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <Phone className="size-4" />
                Talk to Our Team
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
