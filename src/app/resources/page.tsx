'use client'

import { useState, useEffect } from 'react'
import {
  Play,
  Download,
  Clock,
  Calendar,
  FileText,
  Video,
  BookOpen,
  ChevronRight,
  Wifi,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import Badge from '@/components/ui/Badge'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'

// ── Types ────────────────────────────────────────────────────────────────────

type FilterKey =
  | 'All'
  | 'Agent Training'
  | 'Success Stories'
  | 'Wellness / EHMP'
  | 'Commercial Lending'
  | 'Product Deep Dives'

interface VideoCard {
  id: number
  title: string
  category: FilterKey
  duration: string
  color: string
  description: string
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FILTERS: FilterKey[] = [
  'All',
  'Agent Training',
  'Success Stories',
  'Wellness / EHMP',
  'Commercial Lending',
  'Product Deep Dives',
]

const VIDEOS: VideoCard[] = [
  {
    id: 1,
    title: 'Disrupting the Commercial Lending Industry',
    category: 'Commercial Lending',
    duration: '22 min',
    color: 'from-sequoia-800 to-sequoia-600',
    description: 'How Sequoia gives independent consultants access to institutional-grade lending.',
  },
  {
    id: 2,
    title: 'Compensation 6.0 Explained',
    category: 'Agent Training',
    duration: '18 min',
    color: 'from-gold-700 to-gold-500',
    description: "A full walkthrough of how commissions, revenue share, and bonuses are calculated.",
  },
  {
    id: 3,
    title: 'Why Loans Get Denied — and How to Prevent It',
    category: 'Commercial Lending',
    duration: '31 min',
    color: 'from-sequoia-900 to-sequoia-700',
    description: 'Common deal-killers in commercial lending and the pre-qualification checklist.',
  },
  {
    id: 4,
    title: 'EHMP Discovery Session: Live Demo',
    category: 'Wellness / EHMP',
    duration: '27 min',
    color: 'from-emerald-700 to-emerald-500',
    description: 'Watch a live employer discovery call from intro to close.',
  },
  {
    id: 5,
    title: 'Agent Success Story: Emily',
    category: 'Success Stories',
    duration: '14 min',
    color: 'from-gold-800 to-gold-600',
    description: "How Emily closed $500K+ in commercial volume in her first year as a Sequoia consultant.",
  },
  {
    id: 6,
    title: 'The Real Estate Product Suite Deep Dive',
    category: 'Product Deep Dives',
    duration: '35 min',
    color: 'from-sequoia-800 to-sequoia-500',
    description: 'Fix-and-flip, DSCR, bridge loans, construction — every RE product explained.',
  },
  {
    id: 7,
    title: 'Business Funding 101: What Clients Need to Know',
    category: 'Agent Training',
    duration: '20 min',
    color: 'from-blue-700 to-blue-500',
    description: 'How to qualify a business for funding and set realistic expectations.',
  },
  {
    id: 8,
    title: 'EHMP: Objection Handling Masterclass',
    category: 'Wellness / EHMP',
    duration: '24 min',
    color: 'from-teal-700 to-teal-500',
    description: "The 10 most common employer objections and how to handle every one of them.",
  },
  {
    id: 9,
    title: 'Joseph Cordeira: The $652K Deal Story',
    category: 'Success Stories',
    duration: '11 min',
    color: 'from-gold-900 to-gold-700',
    description: 'Joseph shares how he found, qualified, and funded a $652,000 commercial deal.',
  },
  {
    id: 10,
    title: 'Clean Energy Financing Explained',
    category: 'Product Deep Dives',
    duration: '19 min',
    color: 'from-green-700 to-green-500',
    description: 'Solar, LED retrofits, and PACE financing — opportunities in clean energy lending.',
  },
  {
    id: 11,
    title: 'Your First 30 Days as a Consultant',
    category: 'Agent Training',
    duration: '29 min',
    color: 'from-sequoia-700 to-sequoia-500',
    description: 'Step-by-step onboarding roadmap: tools, first calls, first commissions.',
  },
  {
    id: 12,
    title: 'SBA Loans: Eligibility and the Application Process',
    category: 'Commercial Lending',
    duration: '33 min',
    color: 'from-indigo-700 to-indigo-500',
    description: 'A practical guide to identifying SBA-eligible clients and preparing a strong file.',
  },
]

const QUICK_START = [
  {
    icon: <FileText size={20} />,
    title: 'New Borrower Welcome Checklist',
    type: 'PDF',
    size: '1.2 MB',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'New Consultant Quick-Start Guide',
    type: 'PDF',
    size: '3.4 MB',
  },
  {
    icon: <FileText size={20} />,
    title: 'Commercial Lending Product One-Pager',
    type: 'PDF',
    size: '0.8 MB',
  },
  {
    icon: <FileText size={20} />,
    title: 'EHMP / Wellness Program One-Pager',
    type: 'PDF',
    size: '0.9 MB',
  },
  {
    icon: <FileText size={20} />,
    title: 'Clean Energy Solutions One-Pager',
    type: 'PDF',
    size: '0.7 MB',
  },
]

const categoryBadgeVariant: Record<FilterKey, 'success' | 'warning' | 'info' | 'neutral'> = {
  'All': 'neutral',
  'Agent Training': 'success',
  'Success Stories': 'warning',
  'Wellness / EHMP': 'info',
  'Commercial Lending': 'neutral',
  'Product Deep Dives': 'info',
}

// ── Countdown hook ───────────────────────────────────────────────────────────

function useNextWednesday(): string {
  const [label, setLabel] = useState('')

  useEffect(() => {
    function calc() {
      const now = new Date()
      // Next Wednesday 8 PM ET (UTC-4 during EDT, UTC-5 during EST)
      // We calculate in local time for display purposes
      const day = now.getDay() // 0 Sun … 6 Sat
      const daysUntilWed = day <= 3 ? 3 - day : 10 - day // 3 = Wednesday
      const next = new Date(now)
      next.setDate(now.getDate() + daysUntilWed)
      next.setHours(20, 0, 0, 0) // 8 PM local

      const diff = next.getTime() - now.getTime()
      if (diff <= 0) {
        setLabel('Live now!')
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setLabel(`${days}d ${hours}h ${mins}m`)
      } else {
        setLabel(`${hours}h ${mins}m`)
      }
    }
    calc()
    const id = setInterval(calc, 30_000)
    return () => clearInterval(id)
  }, [])

  return label
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All')
  const countdown = useNextWednesday()

  const filtered =
    activeFilter === 'All'
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === activeFilter)

  return (
    <div className="bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        <HeroVideo />

        <FadeIn direction="up">
          <div className="container-brand text-center relative z-10">
            <span className="badge-dark mb-5 inline-flex">
              <Video size={12} />
              Training Library
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Your Training Library
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              190+ videos, guides, and resources to help you succeed as a Sequoia consultant.
            </p>

            {/* Live training countdown */}
            <div className="mt-10 inline-flex items-center gap-3 glass rounded-full px-5 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-400" />
              </span>
              <Wifi size={16} className="text-white/70" />
              <span className="text-white font-semibold text-sm">
                Next Live Training: Wednesday 8 PM ET
              </span>
              {countdown && (
                <span className="badge-gold text-xs">
                  <Clock size={11} />
                  {countdown}
                </span>
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Filter Tabs + Video Grid ────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-brand">

          {/* Filter tabs */}
          <FadeIn direction="up">
            <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter training videos">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer border ${
                    activeFilter === f
                      ? 'bg-sequoia-700 text-white border-sequoia-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-sequoia-300 hover:text-sequoia-700'
                  }`}
                >
                  {f}
                  {f !== 'All' && (
                    <span className="ml-1.5 opacity-60 text-xs">
                      ({VIDEOS.filter((v) => v.category === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Video grid */}
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((video) => (
              <StaggerItem key={video.id} direction="up">
                <VideoCard video={video} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Video size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No videos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Next Live Training Banner ───────────────────────────────────── */}
      <section className="bg-gradient-sequoia py-14">
        <div className="container-brand">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Calendar size={28} className="text-gold-400" />
              </div>
              <div>
                <p className="text-white font-bold text-xl">Next Live Training</p>
                <p className="text-white/80 text-sm mt-0.5">
                  Wednesday at 8:00 PM Eastern Time — every week
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {countdown && (
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{countdown}</p>
                  <p className="text-white/70 text-xs uppercase tracking-wider">Until next session</p>
                </div>
              )}
              <a
                href="https://zoom.us"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ color: '#000000' }}
              >
                Join on Zoom
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Start Resources ───────────────────────────────────────── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="Quick Start"
              heading="Downloadable Resources"
              subheading="Essential guides and one-pagers to get your consulting business off the ground quickly."
            />
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="mt-10 max-w-2xl mx-auto space-y-3">
              {QUICK_START.map((item) => (
                <div
                  key={item.title}
                  className="card-sequoia p-4 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="icon-box-sequoia flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.type} &middot; {item.size}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Download ${item.title}`}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sequoia-700 hover:text-sequoia-900 text-sm font-semibold transition-colors duration-150 cursor-pointer"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container-brand text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Not a consultant yet?
          </h2>
          <p className="text-gray-600 mb-7 max-w-md mx-auto">
            Get full access to all 190+ training videos plus the complete Sequoia
            platform for $29.99/month.
          </p>
          <a href="/enroll" className="btn-gold" style={{ color: '#000000' }}>
            Enroll for $29.99/month
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

    </div>
  )
}

// ── Video Card sub-component ─────────────────────────────────────────────────

function VideoCard({ video }: { video: VideoCard }) {
  return (
    <div className="card-sequoia overflow-hidden p-0 flex flex-col group cursor-pointer">
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${video.color} flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative circle */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

        {/* Play button */}
        <div className="relative z-10 w-14 h-14 rounded-full bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200">
          <Play size={20} className="text-white ml-0.5 fill-white" />
        </div>

        {/* Duration pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 rounded-full px-2.5 py-1 text-white text-xs font-medium">
          <Clock size={11} />
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Badge variant={categoryBadgeVariant[video.category]}>
          {video.category}
        </Badge>
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {video.description}
        </p>
      </div>
    </div>
  )
}
