'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  Target,
  MessageSquare,
  Presentation,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Shield,
  Calendar,
  Star,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

const weeks = [
  {
    week: 1,
    title: 'Foundation',
    icon: Target,
    color: 'bg-neutral-100 text-neutral-700',
    steps: [
      'Update your personal profile and headshot',
      'Review the EHMP product training (Module 1-3)',
      'Set up your CRM pipeline with 10 warm leads',
      'Join the community Slack channel and introduce yourself',
      'Schedule your 1-on-1 accountability call',
      'Complete the "Why I Joined Sequoia" exercise',
      'Watch 3 training videos on objection handling',
    ],
  },
  {
    week: 2,
    title: 'First Conversation',
    icon: MessageSquare,
    color: 'bg-gold-100 text-gold-800',
    steps: [
      'Reach out to 5 business owners in your network',
      'Book at least 2 discovery calls',
      'Practice the EHMP elevator pitch (60-second version)',
      'Review the ROI calculator and run 3 sample projections',
      'Attend the Wednesday training live',
      'Post your first win or learning in the community',
      'Complete 2 role-play sessions with your accountability partner',
    ],
  },
  {
    week: 3,
    title: 'EHMP Pitch',
    icon: Presentation,
    color: 'bg-neutral-100 text-neutral-700',
    steps: [
      'Deliver a full EHMP presentation to a qualified prospect',
      'Send follow-up proposals to your top 3 leads',
      'Learn the cost segregation cross-sell opportunity',
      'Collect at least 2 referrals from existing contacts',
      'Review and update your pipeline in the CRM',
      'Complete the advanced objection handling module',
      'Share your pitch recording for team feedback',
    ],
  },
  {
    week: 4,
    title: 'Close & Celebrate',
    icon: Trophy,
    color: 'bg-gold-100 text-gold-800',
    steps: [
      'Follow up with all open proposals',
      'Close your first deal or get a signed LOI',
      'Submit your deal for processing',
      'Set your 90-day income goal with your team leader',
      'Plan your prospecting calendar for the next month',
      'Celebrate your progress in the community',
      'Schedule your next accountability check-in',
    ],
  },
]

export default function ReactivationPage() {
  const router = useRouter()
  const [starting, setStarting] = useState(false)

  const handleStart = () => {
    setStarting(true)
    localStorage.setItem('challengeStartDate', new Date().toISOString())
    setTimeout(() => {
      router.push('/portal')
    }, 600)
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
                <Rocket className="size-3.5" />
                30-Day Reactivation Challenge
              </span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
                Your Business Didn&apos;t Fail.{' '}
                <span className="text-gold-400">It Just Needs a Restart.</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl">
                The 30-Day Reactivation Challenge is a structured, step-by-step program designed to
                get you from dormant to deal-closing in just four weeks. No fluff, no theory — just
                daily actions that lead to real results.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 px-7 py-3.5 text-base gap-2.5 bg-gold-500 hover:bg-gold-600 shadow-sm cursor-pointer disabled:opacity-60"
                  style={{ color: '#000000' }}
                >
                  {starting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Start the Challenge
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
                <a href="#timeline" className="btn-ghost-light" style={{ color: '#FFFFFF' }}>
                  See the Plan
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-brand">
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Calendar, value: '30', label: 'Days to Restart' },
              { icon: Target, value: '4', label: 'Weekly Milestones' },
              { icon: Star, value: '28+', label: 'Action Items' },
              { icon: Trophy, value: '1', label: 'Deal to Close' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <StaggerItem key={stat.label} direction="up">
                  <div className="rounded-2xl px-4 sm:px-8 py-6 text-center bg-neutral-50 border border-neutral-200">
                    <div className="flex justify-center mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold tracking-tight text-black">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* 4-Week Timeline */}
      <section id="timeline" className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-700">
                The Roadmap
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                4 Weeks. 4 Milestones. 1 Deal.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                Each week builds on the last. Follow the steps, do the work, and you will close your
                first deal by Day 30.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-8 md:grid-cols-2">
            {weeks.map((week) => {
              const Icon = week.icon
              return (
                <StaggerItem key={week.week} direction="up">
                  <Card className="h-full">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${week.color}`}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                            Week {week.week}
                          </p>
                          <h3 className="text-lg font-bold text-sequoia-900">{week.title}</h3>
                        </div>
                      </div>

                      <ul className="space-y-2 flex-1">
                        {week.steps.map((step) => (
                          <li key={step} className="flex items-start gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="size-4 shrink-0 text-gold-600 mt-0.5" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Guarantee Card */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <div className="max-w-2xl mx-auto rounded-2xl border-2 p-8 sm:p-12 text-center" style={{ borderColor: '#C8A84E' }}>
              <div className="flex justify-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
                  <Shield className="size-7 text-gold-700" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black">Our Guarantee</h3>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                Complete all 30 days and don&apos;t close a deal? We&apos;ll refund your membership
                for that month. No questions asked. We believe in this program — and we believe in you.
              </p>
              <div className="mt-8">
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 px-7 py-3.5 text-base gap-2.5 bg-black hover:bg-neutral-800 shadow-sm cursor-pointer disabled:opacity-60"
                  style={{ color: '#FFFFFF' }}
                >
                  {starting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Start the Challenge
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
