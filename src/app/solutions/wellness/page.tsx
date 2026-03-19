import {
  HeartPulse,
  Users,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Repeat2,
  Building2,
  UserCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Employee Wellness Program (EHMP) | Sequoia Enterprise Solutions',
  description:
    'Our Employee Health Management Program reduces FICA taxes for employers at zero net cost while giving employees real wellness benefits. Learn how to enroll or become a consultant.',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const howItWorksSteps = [
  {
    step: '01',
    icon: Building2,
    title: 'Employer Enrolls',
    description:
      "Your company enrolls through Sequoia's EHMP platform. Setup is straightforward — our team handles the heavy lifting with payroll integration and compliance documentation.",
  },
  {
    step: '02',
    icon: HeartPulse,
    title: 'Employees Gain Benefits & FICA Taxes Drop',
    description:
      'Each enrolled employee gains access to a comprehensive wellness benefit package. The program is structured as a Section 125 pre-tax arrangement, which legally reduces FICA obligations for both the employer and employee.',
  },
  {
    step: '03',
    icon: DollarSign,
    title: 'Everyone Saves — Every Payroll Cycle',
    description:
      'Employers typically save $500–$800 per enrolled employee per year in FICA taxes. Employees take home more pay. The savings compound with every payroll run — ongoing, automatic, and compliant.',
  },
]

const employerBenefits = [
  {
    icon: TrendingDown,
    title: 'Real FICA Tax Savings',
    description:
      'Employers typically save between $500 and $800 per enrolled employee per year — savings that go directly to your bottom line.',
  },
  {
    icon: DollarSign,
    title: '$0 Net Cost to the Employer',
    description:
      'The program is structured so that employer savings from FICA reduction offset the cost of the wellness benefit — making it effectively free to implement.',
  },
  {
    icon: HeartPulse,
    title: 'Improved Employee Wellness',
    description:
      'Employees receive meaningful wellness benefits, which supports better health outcomes, higher morale, and reduced absenteeism.',
  },
  {
    icon: BadgeCheck,
    title: 'IRS-Compliant Section 125 Structure',
    description:
      'The program leverages a legally recognized pre-tax benefit structure with full compliance support — no guesswork, no gray areas.',
  },
  {
    icon: Repeat2,
    title: 'Automatic, Ongoing Savings',
    description:
      'Once enrolled, savings are generated every payroll cycle with no additional action required from HR or payroll teams.',
  },
  {
    icon: Users,
    title: 'Scalable to Any Workforce',
    description:
      'Whether you have 10 employees or 10,000, the program scales seamlessly. More employees means more savings.',
  },
]

const consultantBenefits = [
  'Earn $12–$18 per enrolled employee per month in recurring commissions',
  'Commissions continue as long as the employees remain enrolled',
  'No ceiling on how many companies or employees you can enroll',
  'Full training, onboarding support, and marketing materials provided',
  'Work alongside your existing business or as a standalone income stream',
  'Access to the full Sequoia platform to cross-sell other solutions',
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatPill({
  value,
  label,
  accent = false,
}: {
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl px-8 py-6 text-center ${
        accent
          ? 'bg-gold-100 border border-gold-300'
          : 'bg-sequoia-50 border border-sequoia-200'
      }`}
    >
      <p
        className={`text-4xl font-extrabold tracking-tight ${
          accent ? 'text-gold-800' : 'text-sequoia-900'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WellnessPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-hero section-padding-lg relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 size-[700px] rounded-full bg-gold-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-32 size-[500px] rounded-full bg-sequoia-600/10 blur-3xl"
        />

        <div className="container-brand relative z-10">
          <div className="max-w-3xl">
            <span className="badge-dark mb-6 inline-flex items-center gap-2">
              <HeartPulse className="size-3.5" />
              Employee Health Management Program (EHMP)
            </span>
            <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-gradient-hero">
              Employee Wellness That Saves Money —{' '}
              <span className="text-gold-400">And Earns You Income</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-sequoia-300 max-w-2xl">
              Our flagship Employee Health Management Program (EHMP) lets employers reduce FICA
              taxes with zero net cost while employees gain genuine wellness benefits. For
              consultants, it creates a powerful, recurring income stream that compounds with
              every new enrollment.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/apply?type=wellness-employer" variant="secondary" size="lg">
                Enroll Your Company
              </Button>
              <a href="#consultant" className="btn-ghost-light">
                Become a Wellness Consultant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Stats ── */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-brand">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatPill value="153" label="Employees Currently Enrolled" />
            <StatPill value="5,000" label="Goal by End of 2026" accent />
            <StatPill value="$0" label="Net Cost to Employer" />
            <StatPill value="$18/mo" label="Max Consultant Commission / Employee" accent />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <SectionHeading
            eyebrow="How It Works"
            heading="Simple, Compliant, and Automatic"
            subheading="The EHMP is built on IRS Section 125 — a well-established, fully compliant pre-tax benefit structure. Here's the three-step process."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {/* Connector line (desktop) */}
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-sequoia-200 z-0 -translate-x-1/2" />
                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-black text-sequoia-100 leading-none select-none">
                        {step.step}
                      </span>
                      <div className="icon-box-sequoia">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-sequoia-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── For Employers ── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="For Employers"
            heading="Real Savings. Zero Risk. Better Benefits."
            subheading="The EHMP is structured so that your FICA tax reduction covers the cost of the program — making it the rare business decision with no downside."
            align="left"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {employerBenefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title}>
                  <div className="flex flex-col gap-3">
                    <div className="icon-box-sequoia">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold text-sequoia-900">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{benefit.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Employer CTA */}
          <div className="mt-12 rounded-2xl bg-sequoia-50 border border-sequoia-200 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="icon-box-sequoia size-14 shrink-0">
              <UserCheck className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-sequoia-900">Ready to enroll your team?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Our team will walk you through the setup, handle compliance, and integrate with
                your existing payroll system — typically within days.
              </p>
            </div>
            <Button href="/apply?type=wellness-employer" variant="primary" size="lg">
              Enroll Your Company
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── For Consultants ── */}
      <section id="consultant" className="section-padding bg-gradient-sequoia-dark relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 size-[600px] rounded-full bg-gold-500/8 blur-3xl"
        />
        <div className="container-brand relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: copy */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                For Consultants &amp; Partners
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Build Real Recurring Income
                <br />
                <span className="text-gradient-gold">One Enrollment at a Time</span>
              </h2>
              <p className="mt-4 text-sequoia-300 leading-relaxed">
                The EHMP is our most powerful door-opener. You introduce employers to a program
                that costs them nothing and saves them money — an easy conversation that pays you
                every single month.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {consultantBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-sequoia-200">
                    <CheckCircle2 className="size-4 shrink-0 text-gold-400 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button href="/apply?type=wellness-consultant" variant="secondary" size="lg">
                  Become a Wellness Consultant
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Right: math callout */}
            <div className="rounded-2xl border border-gold-500/30 bg-sequoia-900/60 backdrop-blur p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="size-5 text-gold-400" />
                <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">
                  Example Income Projection
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-sequoia-300 text-sm">Employees enrolled</span>
                  <span className="text-white font-bold text-lg">200</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-sequoia-300 text-sm">Commission per employee / month</span>
                  <span className="text-white font-bold text-lg">$18</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-sequoia-300 text-sm">Monthly recurring income</span>
                  <span className="text-gold-400 font-extrabold text-2xl">$3,600</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sequoia-300 text-sm">Annual recurring income</span>
                  <span className="text-gold-400 font-extrabold text-2xl">$43,200</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-sequoia-400 leading-relaxed">
                200 employees × $18/month = $3,600/month recurring income. Scale to 500+ employees
                across multiple employers and the income compounds significantly. Commissions range
                from $12–$18 per employee per month depending on group size and structure.
              </p>

              <div className="mt-6 rounded-xl bg-sequoia-800/60 border border-sequoia-600/30 p-4">
                <p className="text-xs font-semibold text-sequoia-300 uppercase tracking-wider mb-2">
                  Current Progress
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sequoia-200">153 enrolled</span>
                  <span className="text-sm text-sequoia-200">5,000 goal</span>
                </div>
                <div className="h-2 bg-sequoia-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold rounded-full"
                    style={{ width: `${Math.round((153 / 5000) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-sequoia-400">
                  {Math.round((153 / 5000) * 100)}% of 2026 enrollment goal — significant
                  opportunity remains
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ-style objection handlers ── */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Common Questions"
            heading="Answers to What You're Already Thinking"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                q: 'Is this IRS-compliant?',
                a: 'Yes. The program is structured under IRS Section 125, a well-established pre-tax benefit framework that has been in use for decades. Full compliance documentation is provided.',
              },
              {
                q: 'What does it cost the employer?',
                a: 'Effectively zero. The FICA tax savings generated by the enrollment typically exceed the cost of the wellness benefit, resulting in a net positive for the employer from day one.',
              },
              {
                q: 'What benefits do employees actually receive?',
                a: 'Employees gain access to a comprehensive wellness benefit package including health-related services. Detailed plan specifics are shared during the enrollment consultation.',
              },
              {
                q: 'How long does enrollment take?',
                a: 'Most employers are fully enrolled within a few business days. Our team handles payroll integration, compliance setup, and employee communication.',
              },
            ].map(({ q, a }) => (
              <Card key={q}>
                <h3 className="font-semibold text-sequoia-900 flex items-start gap-2">
                  <ChevronRight className="size-4 shrink-0 text-gold-500 mt-0.5" />
                  {q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 pl-6">{a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-sequoia section-padding">
        <div className="container-brand text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Two ways to get started today
          </h2>
          <p className="mt-4 text-sequoia-300 text-lg max-w-xl mx-auto">
            Whether you're an employer looking to save money or a consultant building recurring
            income, the EHMP opens the door.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/apply?type=wellness-employer" variant="secondary" size="lg">
              Enroll Your Company
            </Button>
            <Button href="/apply?type=wellness-consultant" variant="outline" size="lg">
              <span className="text-white border-white/40">Become a Wellness Consultant</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
