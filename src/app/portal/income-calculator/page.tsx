'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DollarSign,
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Award,
  ChevronDown,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SliderDef {
  label: string;
  key: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TEAM_SLIDERS: SliderDef[] = [
  { label: 'Active LCs at Level 1', key: 'l1', min: 0, max: 20, defaultValue: 3 },
  { label: 'Active LCs at Level 2', key: 'l2', min: 0, max: 50, defaultValue: 8 },
  { label: 'Active LCs at Level 3', key: 'l3', min: 0, max: 100, defaultValue: 15 },
  { label: 'Active LCs at Level 4', key: 'l4', min: 0, max: 200, defaultValue: 20 },
  { label: 'Active LCs at Level 5', key: 'l5', min: 0, max: 300, defaultValue: 10 },
  { label: 'Active LCs at Level 6', key: 'l6', min: 0, max: 500, defaultValue: 5 },
];

const EHMP_SLIDERS: SliderDef[] = [
  { label: 'Personal employers enrolled', key: 'personalEmployers', min: 0, max: 20, defaultValue: 2 },
  { label: 'Avg employees per employer', key: 'avgEmployees', min: 5, max: 500, defaultValue: 50 },
  { label: 'L1 team employers', key: 'l1Employers', min: 0, max: 50, defaultValue: 5 },
  { label: 'L2 team employers', key: 'l2Employers', min: 0, max: 100, defaultValue: 10 },
  { label: 'L3 team employers', key: 'l3Employers', min: 0, max: 200, defaultValue: 8 },
];

const LOAN_SLIDERS: SliderDef[] = [
  { label: 'Loans funded per month (personal)', key: 'personalLoans', min: 0, max: 10, defaultValue: 1 },
  { label: 'Loans funded by team per month', key: 'teamLoans', min: 0, max: 50, defaultValue: 5 },
];

const BF_SLIDERS: SliderDef[] = [
  { label: 'Deals per month (personal)', key: 'personalDeals', min: 0, max: 10, defaultValue: 1 },
  { label: 'Deals by team per month', key: 'teamDeals', min: 0, max: 30, defaultValue: 3 },
];

const LOAN_SIZE_OPTIONS = [
  { label: '$50K', value: 50_000 },
  { label: '$100K', value: 100_000 },
  { label: '$250K', value: 250_000 },
  { label: '$500K', value: 500_000 },
  { label: '$1M+', value: 1_000_000 },
];

const DEAL_SIZE_OPTIONS = [
  { label: '$25K', value: 25_000 },
  { label: '$50K', value: 50_000 },
  { label: '$100K', value: 100_000 },
  { label: '$250K', value: 250_000 },
];

const PEPM = 22; // mid-tier PEPM rate

const RANKS = [
  { title: 'Licensed Consultant', minPersonal: 0, minTeam: 0 },
  { title: 'Senior Consultant', minPersonal: 3, minTeam: 10 },
  { title: 'Executive Consultant', minPersonal: 5, minTeam: 25 },
  { title: 'Director', minPersonal: 8, minTeam: 50 },
  { title: 'Senior Director', minPersonal: 10, minTeam: 100 },
  { title: 'Vice President', minPersonal: 12, minTeam: 200 },
  { title: 'Senior Vice President', minPersonal: 15, minTeam: 350 },
  { title: 'National Director', minPersonal: 18, minTeam: 500 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function fmtDecimal(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */

function useAnimatedValue(target: number, duration = 500) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  const startVal = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    startVal.current = display;
    startTime.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(startVal.current + (target - startVal.current) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gold-500">{icon}</span>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-sequoia-900">{title}</h3>
    </div>
  );
}

function RangeSlider({
  def,
  value,
  onChange,
}: {
  def: SliderDef;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-neutral-600">{def.label}</label>
        <span className="text-sm font-semibold text-sequoia-900 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-gold-500"
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[10px] text-neutral-400">{def.min}</span>
        <span className="text-[10px] text-neutral-400">{def.max}</span>
      </div>
    </div>
  );
}

function SelectInput({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: number }[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-neutral-600 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-8 text-sm text-sequoia-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      </div>
    </div>
  );
}

function BreakdownRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className="text-sm font-semibold text-gold-500 tabular-nums">{fmtDecimal(amount)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function IncomeCalculatorPage() {
  /* --- State ------------------------------------------------------- */
  const [vals, setVals] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    [...TEAM_SLIDERS, ...EHMP_SLIDERS, ...LOAN_SLIDERS, ...BF_SLIDERS].forEach(
      (s) => (init[s.key] = s.defaultValue),
    );
    init.loanSize = 500_000;
    init.dealSize = 100_000;
    return init;
  });

  const set = useCallback(
    (key: string, v: number) => setVals((prev) => ({ ...prev, [key]: v })),
    [],
  );

  /* --- Calculations ------------------------------------------------ */
  const l1 = vals.l1;
  const l2 = vals.l2;
  const l3 = vals.l3;
  const l4 = vals.l4;
  const l5 = vals.l5;
  const l6 = vals.l6;
  const totalTeam = l1 + l2 + l3 + l4 + l5 + l6;

  const membership =
    l1 * 29.99 * 0.2 +
    l2 * 29.99 * 0.1 +
    (l3 + l4 + l5 + l6) * 29.99 * 0.05;

  const ehmpPersonal = vals.personalEmployers * vals.avgEmployees * PEPM;
  const ehmpOverrides =
    vals.l1Employers * vals.avgEmployees * 1.0 +
    vals.l2Employers * vals.avgEmployees * 1.0 +
    vals.l3Employers * vals.avgEmployees * 0.5;

  const rePersonal = vals.personalLoans * vals.loanSize * 0.015;
  const reTeam = vals.teamLoans * vals.loanSize * 0.0125 * 0.1;

  const bfPersonal = vals.personalDeals * vals.dealSize * 0.065;
  const bfTeam = vals.teamDeals * vals.dealSize * 0.065 * 0.1;

  const totalMonthly =
    membership + ehmpPersonal + ehmpOverrides + rePersonal + reTeam + bfPersonal + bfTeam;

  const animatedTotal = useAnimatedValue(Math.round(totalMonthly));

  /* --- Rank -------------------------------------------------------- */
  let qualifiedRank = RANKS[0];
  for (const rank of RANKS) {
    if (l1 >= rank.minPersonal && totalTeam >= rank.minTeam) {
      qualifiedRank = rank;
    }
  }

  /* --- Page title -------------------------------------------------- */
  useEffect(() => {
    document.title = 'Income Projector | Sequoia Enterprise Solutions';
  }, []);

  /* --- Render ------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-brand-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-sequoia-900">Income Projector</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Adjust the sliders to model your potential monthly and annual income across all revenue streams.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* ============================================================= */}
        {/*  LEFT COLUMN — INPUTS                                         */}
        {/* ============================================================= */}
        <div className="lg:w-2/5 space-y-6">
          {/* Section 1: Your Team */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<Users className="h-4 w-4" />} title="Your Team" />
            {TEAM_SLIDERS.map((s) => (
              <RangeSlider key={s.key} def={s} value={vals[s.key]} onChange={(v) => set(s.key, v)} />
            ))}
          </div>

          {/* Section 2: EHMP Activity */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<Building2 className="h-4 w-4" />} title="EHMP Activity" />
            {EHMP_SLIDERS.map((s) => (
              <RangeSlider key={s.key} def={s} value={vals[s.key]} onChange={(v) => set(s.key, v)} />
            ))}
          </div>

          {/* Section 3: Loan Activity */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<Briefcase className="h-4 w-4" />} title="Loan Activity" />
            {LOAN_SLIDERS.map((s) => (
              <RangeSlider key={s.key} def={s} value={vals[s.key]} onChange={(v) => set(s.key, v)} />
            ))}
            <SelectInput
              label="Average loan size"
              options={LOAN_SIZE_OPTIONS}
              value={vals.loanSize}
              onChange={(v) => set('loanSize', v)}
            />
          </div>

          {/* Section 4: Business Funding */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<DollarSign className="h-4 w-4" />} title="Business Funding" />
            {BF_SLIDERS.map((s) => (
              <RangeSlider key={s.key} def={s} value={vals[s.key]} onChange={(v) => set(s.key, v)} />
            ))}
            <SelectInput
              label="Average deal size"
              options={DEAL_SIZE_OPTIONS}
              value={vals.dealSize}
              onChange={(v) => set('dealSize', v)}
            />
          </div>
        </div>

        {/* ============================================================= */}
        {/*  RIGHT COLUMN — OUTPUT                                        */}
        {/* ============================================================= */}
        <div className="lg:w-3/5 space-y-6">
          {/* Total Monthly Income */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Projected Monthly Income
            </p>
            <p className="text-5xl font-extrabold text-gold-500 tabular-nums">
              {fmt(animatedTotal)}
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              <span className="font-semibold text-sequoia-900">{fmt(Math.round(totalMonthly * 12))}</span>{' '}
              projected annually
            </p>
          </div>

          {/* Income Breakdown */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<TrendingUp className="h-4 w-4" />} title="Income Breakdown" />
            <BreakdownRow label="Membership Overrides" amount={membership} />
            <BreakdownRow label="EHMP Personal" amount={ehmpPersonal} />
            <BreakdownRow label="EHMP Team Overrides" amount={ehmpOverrides} />
            <BreakdownRow label="Real Estate Personal" amount={rePersonal} />
            <BreakdownRow label="Real Estate Team" amount={reTeam} />
            <BreakdownRow label="Business Funding Personal" amount={bfPersonal} />
            <BreakdownRow label="Business Funding Team" amount={bfTeam} />
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-neutral-300">
              <span className="text-sm font-bold text-sequoia-900">Total</span>
              <span className="text-sm font-bold text-gold-500 tabular-nums">
                {fmtDecimal(totalMonthly)}
              </span>
            </div>
          </div>

          {/* Rank Projection */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <SectionHeading icon={<Award className="h-4 w-4" />} title="Rank Projection" />
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500/10">
                <Award className="h-7 w-7 text-gold-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-sequoia-900">{qualifiedRank.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Based on {l1} personal recruits (L1) &middot; {totalTeam} total team members
                </p>
              </div>
            </div>

            {/* Mini rank ladder */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RANKS.map((r) => {
                const active =
                  l1 >= r.minPersonal && totalTeam >= r.minTeam;
                return (
                  <div
                    key={r.title}
                    className={`rounded-lg px-3 py-2 text-center text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                        : 'bg-neutral-50 text-neutral-400 border border-neutral-100'
                    }`}
                  >
                    {r.title}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            This projector is for illustrative purposes only. Actual earnings depend on individual
            effort, market conditions, and product availability. Sequoia Enterprise Solutions does
            not guarantee any specific level of income. All figures are estimates based on current
            compensation plan rates and the assumptions you provide above.
          </p>
        </div>
      </div>
    </div>
  );
}
