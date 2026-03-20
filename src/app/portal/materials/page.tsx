'use client'

import { useEffect, useState } from 'react'
import {
  FileText,
  Download,
  Search,
  Building2,
  Home,
  Landmark,
  TreePine,
  Layers,
  MapPin,
  Hammer,
  Heart,
  Banknote,
  Zap,
  Clock,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Flyer data
// ---------------------------------------------------------------------------

interface Flyer {
  id: string
  title: string
  filename: string
  category: string
  description: string
  icon: React.ReactNode
  comingSoon?: boolean
}

const flyers: Flyer[] = [
  {
    id: 'new-construction',
    title: 'New Construction Loans',
    filename: '01_NEW_CONSTRUCTION_LOANS.pdf',
    category: 'Real Estate',
    description: 'Ground-up construction financing with draw schedules and flexible terms for residential and commercial projects.',
    icon: <Hammer size={20} />,
  },
  {
    id: 'multi-family',
    title: 'Multi-Family Loan Program',
    filename: '02_MULTI-FAMILY_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Financing for 5+ unit apartment buildings including bridge, stabilized, and value-add multifamily properties.',
    icon: <Building2 size={20} />,
  },
  {
    id: 'bridge-loan',
    title: 'Bridge Loan Program',
    filename: '03_BRIDGE_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Short-term bridge financing for time-sensitive acquisitions, repositioning, and value-add opportunities.',
    icon: <Layers size={20} />,
  },
  {
    id: 'fix-flip-3-options',
    title: 'Fix & Flip — 3 Options',
    filename: '04_FIX_and_FLIP_LOAN_3 OPTIONS_20250702.pdf',
    category: 'Real Estate',
    description: 'Comprehensive comparison of three fix-and-flip loan structures — choose the best fit for your investor clients.',
    icon: <Home size={20} />,
  },
  {
    id: 'fix-flip-standard',
    title: 'Fix & Flip Loan Program',
    filename: '04_FIX_and_FLIP_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Standard fix-and-flip financing: up to 90% of purchase, 100% of rehab, based on 70% ARV. 5-10 day funding.',
    icon: <Home size={20} />,
  },
  {
    id: '1-4-unit',
    title: '1-4 Unit Investment Properties',
    filename: '07_1-4_UNIT_INVESTMENT_PROPERTIES.pdf',
    category: 'Real Estate',
    description: 'DSCR and investor loans for 1-4 unit rental properties. No income verification. 30-year fixed available.',
    icon: <Home size={20} />,
  },
  {
    id: 'commercial',
    title: 'Commercial Properties',
    filename: '10_COMMERCIAL_PROPERTIES.pdf',
    category: 'Real Estate',
    description: 'Office, retail, industrial, and mixed-use commercial property financing from $500K to $50M.',
    icon: <Landmark size={20} />,
  },
  {
    id: 'land-loan',
    title: 'Land Loan',
    filename: '13_LAND_LOAN.pdf',
    category: 'Real Estate',
    description: 'Raw land, entitled land, and land with approved plans. Up to 65% LTV with 12-36 month terms.',
    icon: <MapPin size={20} />,
  },
  {
    id: 'mixed-use',
    title: 'Mixed-Use Properties',
    filename: '14_MIXED-USED_PROPERTIES_LOAN.pdf',
    category: 'Real Estate',
    description: 'Financing for properties combining residential and commercial uses — retail ground floor with apartments above, etc.',
    icon: <TreePine size={20} />,
  },
  // ── EHMP / Wellness ──────────────────────────────────────────────
  {
    id: 'ehmp-overview',
    title: 'EHMP Program Overview',
    filename: '',
    category: 'EHMP / Wellness',
    description: 'The zero-cost wellness benefit for employers',
    icon: <Heart size={20} />,
    comingSoon: true,
  },
  {
    id: 'ehmp-roi',
    title: 'EHMP Employer ROI One-Pager',
    filename: '',
    category: 'EHMP / Wellness',
    description: 'How your company saves $500\u2013$800 per employee per year',
    icon: <Heart size={20} />,
    comingSoon: true,
  },
  {
    id: 'ehmp-pitch',
    title: 'EHMP Consultant Pitch Guide',
    filename: '',
    category: 'EHMP / Wellness',
    description: 'How to introduce the EHMP in 60 seconds',
    icon: <Heart size={20} />,
    comingSoon: true,
  },
  {
    id: 'ehmp-welcome-call',
    title: 'EHMP Welcome Call Script',
    filename: '',
    category: 'EHMP / Wellness',
    description: 'What to say on your first employer call',
    icon: <Heart size={20} />,
    comingSoon: true,
  },
  // ── Business Funding ─────────────────────────────────────────────
  {
    id: 'biz-funding-overview',
    title: 'Business Funding Overview',
    filename: '',
    category: 'Business Funding',
    description: '8 programs for every stage of business growth',
    icon: <Banknote size={20} />,
    comingSoon: true,
  },
  {
    id: 'sba-loan-guide',
    title: 'SBA Loan Guide',
    filename: '',
    category: 'Business Funding',
    description: "Is your client SBA-eligible? Here\u2019s how to find out",
    icon: <Banknote size={20} />,
    comingSoon: true,
  },
  {
    id: 'working-capital',
    title: 'Working Capital One-Pager',
    filename: '',
    category: 'Business Funding',
    description: 'Fast funding for cash flow gaps',
    icon: <Banknote size={20} />,
    comingSoon: true,
  },
  // ── Clean Energy ─────────────────────────────────────────────────
  {
    id: 'commercial-solar',
    title: 'Commercial Solar Overview',
    filename: '',
    category: 'Clean Energy',
    description: 'How to save 50\u201375% on electricity costs',
    icon: <Zap size={20} />,
    comingSoon: true,
  },
  {
    id: 'ev-charging',
    title: 'EV Charging Station Guide',
    filename: '',
    category: 'Clean Energy',
    description: 'Federal incentives + revenue generation',
    icon: <Zap size={20} />,
    comingSoon: true,
  },
]

const categories = ['All', ...Array.from(new Set(flyers.map(f => f.category)))]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MaterialsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    document.title = 'Marketing Materials — Sequoia Consultant Portal'
  }, [])

  const filtered = flyers.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Marketing Materials
        </h2>
        <p className="mt-1 text-neutral-500 text-sm">
          Download program flyers and share them with your clients. All materials are branded and ready to use.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gold-600" />
          <span className="text-sm font-semibold text-neutral-900">{flyers.length} Flyers</span>
        </div>
        <div className="text-sm text-neutral-500">
          {filtered.length === flyers.length ? 'Showing all' : `${filtered.length} matching`}
        </div>
      </div>

      {/* Flyer grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(flyer => (
          <div
            key={flyer.id}
            className="group rounded-xl border border-neutral-200 bg-white p-5 hover:border-gold-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 group-hover:bg-gold-100 group-hover:text-gold-700 transition-colors">
                {flyer.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 text-sm leading-snug">
                    {flyer.title}
                  </h3>
                  {flyer.comingSoon && (
                    <span className="inline-flex items-center gap-1 shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Clock size={10} />
                      Coming Soon
                    </span>
                  )}
                </div>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                  {flyer.category}
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
              {flyer.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {flyer.comingSoon ? (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-400 cursor-not-allowed"
                >
                  <Clock size={14} />
                  Coming Soon
                </button>
              ) : (
                <>
                  <a
                    href={`/Program Flyers/${flyer.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Download size={14} />
                    Download PDF
                  </a>
                  <a
                    href={`/Program Flyers/${flyer.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    Preview
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText size={40} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 text-sm">No materials match your search.</p>
        </div>
      )}

      {/* Tip */}
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-semibold text-gold-800">
          Tip: Share these flyers directly with your clients
        </p>
        <p className="mt-1 text-xs text-gold-700 leading-relaxed">
          Each flyer is designed to be client-ready. Download, email, or print them for meetings.
          For custom materials with your name and contact info, reach out to marketing@seqsolution.com.
        </p>
      </div>
    </div>
  )
}
