'use client'

import { useState } from 'react'
import {
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Lock,
  Video,
  ChevronRight,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type VideoCategory =
  | 'Agent Training'
  | 'Commercial Lending'
  | 'Wellness / EHMP'
  | 'Product Deep Dives'
  | 'Success Stories'

type ProgressStatus = 'completed' | 'in-progress' | 'not-started' | 'locked'

interface TrainingVideo {
  id: number
  title: string
  category: VideoCategory
  duration: string
  gradientFrom: string
  gradientTo: string
  description: string
  progress: number // 0–100
  status: ProgressStatus
  isNew?: boolean
  recommendedFor?: string[]
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const VIDEOS: TrainingVideo[] = [
  // Continue watching
  {
    id: 1,
    title: 'Your First 30 Days as a Consultant',
    category: 'Agent Training',
    duration: '29 min',
    gradientFrom: 'from-sequoia-700',
    gradientTo: 'to-sequoia-500',
    description: 'Step-by-step onboarding roadmap: tools, first calls, first commissions.',
    progress: 65,
    status: 'in-progress',
    isNew: false,
  },
  {
    id: 2,
    title: 'Compensation 6.0 Explained',
    category: 'Agent Training',
    duration: '18 min',
    gradientFrom: 'from-gold-700',
    gradientTo: 'to-gold-500',
    description: 'A full walkthrough of how commissions, revenue share, and bonuses are calculated.',
    progress: 42,
    status: 'in-progress',
    isNew: false,
  },
  {
    id: 3,
    title: 'EHMP Discovery Session: Live Demo',
    category: 'Wellness / EHMP',
    duration: '27 min',
    gradientFrom: 'from-emerald-700',
    gradientTo: 'to-emerald-500',
    description: 'Watch a live employer discovery call from intro to close.',
    progress: 15,
    status: 'in-progress',
    isNew: true,
  },
  // Completed
  {
    id: 4,
    title: 'Disrupting the Commercial Lending Industry',
    category: 'Commercial Lending',
    duration: '22 min',
    gradientFrom: 'from-sequoia-800',
    gradientTo: 'to-sequoia-600',
    description: 'How Sequoia gives independent consultants access to institutional-grade lending.',
    progress: 100,
    status: 'completed',
    isNew: false,
  },
  {
    id: 5,
    title: 'Business Funding 101',
    category: 'Agent Training',
    duration: '20 min',
    gradientFrom: 'from-blue-700',
    gradientTo: 'to-blue-500',
    description: 'How to qualify a business for funding and set realistic expectations.',
    progress: 100,
    status: 'completed',
    isNew: false,
  },
  {
    id: 6,
    title: 'Agent Success Story: Emily',
    category: 'Success Stories',
    duration: '14 min',
    gradientFrom: 'from-gold-800',
    gradientTo: 'to-gold-600',
    description: 'How Emily closed $500K+ in commercial volume in her first year.',
    progress: 100,
    status: 'completed',
    isNew: false,
  },
  // Recommended / not started
  {
    id: 7,
    title: 'Why Loans Get Denied — and How to Prevent It',
    category: 'Commercial Lending',
    duration: '31 min',
    gradientFrom: 'from-sequoia-900',
    gradientTo: 'to-sequoia-700',
    description: 'Common deal-killers in commercial lending and the pre-qualification checklist.',
    progress: 0,
    status: 'not-started',
    isNew: false,
    recommendedFor: ['Active', 'Senior'],
  },
  {
    id: 8,
    title: 'EHMP: Objection Handling Masterclass',
    category: 'Wellness / EHMP',
    duration: '24 min',
    gradientFrom: 'from-teal-700',
    gradientTo: 'to-teal-500',
    description: 'The 10 most common employer objections and how to handle every one of them.',
    progress: 0,
    status: 'not-started',
    isNew: false,
    recommendedFor: ['Active', 'Senior'],
  },
  {
    id: 9,
    title: 'SBA Loans: Eligibility & the Application',
    category: 'Commercial Lending',
    duration: '33 min',
    gradientFrom: 'from-indigo-700',
    gradientTo: 'to-indigo-500',
    description: 'A practical guide to identifying SBA-eligible clients and preparing a strong file.',
    progress: 0,
    status: 'not-started',
    isNew: true,
    recommendedFor: ['Active', 'Senior'],
  },
  // New this week
  {
    id: 10,
    title: 'Clean Energy Financing Explained',
    category: 'Product Deep Dives',
    duration: '19 min',
    gradientFrom: 'from-green-700',
    gradientTo: 'to-green-500',
    description: 'Solar, LED retrofits, and PACE financing — clean energy lending opportunities.',
    progress: 0,
    status: 'not-started',
    isNew: true,
  },
  {
    id: 11,
    title: 'The Real Estate Product Suite Deep Dive',
    category: 'Product Deep Dives',
    duration: '35 min',
    gradientFrom: 'from-sequoia-800',
    gradientTo: 'to-sequoia-500',
    description: 'Fix-and-flip, DSCR, bridge loans, construction — every RE product explained.',
    progress: 0,
    status: 'not-started',
    isNew: true,
  },
  {
    id: 12,
    title: 'Joseph Cordeira: The $652K Deal Story',
    category: 'Success Stories',
    duration: '11 min',
    gradientFrom: 'from-gold-900',
    gradientTo: 'to-gold-700',
    description: 'Joseph shares how he found, qualified, and funded a $652,000 commercial deal.',
    progress: 0,
    status: 'not-started',
    isNew: true,
  },
]

const CATEGORY_COLORS: Record<VideoCategory, string> = {
  'Agent Training': 'bg-sequoia-100 text-sequoia-800',
  'Commercial Lending': 'bg-blue-50 text-blue-700',
  'Wellness / EHMP': 'bg-teal-50 text-teal-700',
  'Product Deep Dives': 'bg-purple-50 text-purple-700',
  'Success Stories': 'bg-gold-100 text-gold-800',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const continueWatching = VIDEOS.filter((v) => v.status === 'in-progress')
const completed = VIDEOS.filter((v) => v.status === 'completed')
const recommended = VIDEOS.filter((v) => v.status === 'not-started' && v.recommendedFor)
const newThisWeek = VIDEOS.filter((v) => v.isNew && v.status === 'not-started')

const completedCount = completed.length
const totalCount = VIDEOS.length

// ── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ video }: { video: TrainingVideo }) {
  const [localStatus, setLocalStatus] = useState<ProgressStatus>(video.status)

  function handleClick() {
    if (localStatus === 'not-started') setLocalStatus('in-progress')
  }

  return (
    <div
      className={`card-sequoia overflow-hidden p-0 flex flex-col group cursor-pointer ${
        localStatus === 'completed' ? 'ring-1 ring-sequoia-300' : ''
      }`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-40 bg-gradient-to-br ${video.gradientFrom} ${video.gradientTo} flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative circles */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

        {/* Status overlay */}
        {localStatus === 'completed' ? (
          <div className="relative z-10 w-12 h-12 rounded-full bg-sequoia-700/80 border-2 border-sequoia-300 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-white fill-white/20" />
          </div>
        ) : localStatus === 'locked' ? (
          <div className="relative z-10 w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
            <Lock size={18} className="text-white/60" />
          </div>
        ) : (
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200">
            <Play size={18} className="text-white ml-0.5 fill-white" />
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5 text-white text-xs font-medium">
          <Clock size={10} />
          {video.duration}
        </div>

        {/* New badge */}
        {video.isNew && localStatus !== 'completed' && (
          <div className="absolute top-2 left-2 bg-gold-500 text-sequoia-950 text-xs font-bold px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}

        {/* Completed checkmark overlay */}
        {localStatus === 'completed' && (
          <div className="absolute inset-0 bg-sequoia-900/20" />
        )}
      </div>

      {/* Progress bar */}
      {(localStatus === 'in-progress' || localStatus === 'completed') && (
        <div className="h-1 bg-[var(--neutral-100)]">
          <div
            className={`h-full transition-all duration-300 ${
              localStatus === 'completed'
                ? 'bg-sequoia-500 w-full'
                : 'bg-gold-500'
            }`}
            style={{ width: localStatus === 'completed' ? '100%' : `${video.progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${CATEGORY_COLORS[video.category]}`}
          >
            {video.category}
          </span>
          {localStatus === 'completed' && (
            <CheckCircle2 size={16} className="text-sequoia-600 shrink-0 mt-0.5" />
          )}
          {localStatus === 'in-progress' && (
            <span className="text-xs text-gold-700 font-semibold shrink-0">{video.progress}%</span>
          )}
        </div>
        <h3 className="font-bold text-[var(--sequoia-900)] text-sm leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-[var(--neutral-500)] leading-relaxed line-clamp-2 flex-1">
          {video.description}
        </p>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="icon-box-sequoia w-9 h-9">{icon}</span>
        <div>
          <h2 className="text-lg font-bold text-[var(--sequoia-900)]">{title}</h2>
          {subtitle && <p className="text-sm text-[var(--neutral-400)]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-hero">
        <div className="container-brand py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sequoia-300 text-sm font-medium uppercase tracking-widest mb-1">
                Consultant Portal
              </p>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Video size={28} className="text-sequoia-300" />
                Training Center
              </h1>
              <p className="text-sequoia-200 mt-1 text-sm">
                190+ videos, guides, and resources — all with progress tracking.
              </p>
            </div>

            {/* Progress overview */}
            <div className="flex items-center gap-4 self-start sm:self-auto">
              <div className="glass rounded-xl px-5 py-3 text-center min-w-[80px]">
                <p className="text-white font-black text-2xl">{completedCount}</p>
                <p className="text-sequoia-300 text-xs">Completed</p>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center min-w-[80px]">
                <p className="text-white font-black text-2xl">{totalCount}</p>
                <p className="text-sequoia-300 text-xs">Total</p>
              </div>
              <div className="glass rounded-xl px-5 py-3 min-w-[100px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-sequoia-300">Progress</span>
                  <span className="text-white font-bold">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold-400"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-brand py-8">

        {/* ── Continue Watching ────────────────────────────────────── */}
        <Section
          icon={<RotateCcw size={18} />}
          title="Continue Watching"
          subtitle="Pick up where you left off"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {continueWatching.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </Section>

        {/* ── Recommended for You ──────────────────────────────────── */}
        <Section
          icon={<Sparkles size={18} />}
          title="Recommended for You"
          subtitle="Based on your Active tier and recent activity"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </Section>

        {/* ── New This Week ─────────────────────────────────────────── */}
        <Section
          icon={<TrendingUp size={18} />}
          title="New This Week"
          subtitle="Fresh content added to the library"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newThisWeek.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </Section>

        {/* ── Completed ─────────────────────────────────────────────── */}
        <Section
          icon={<CheckCircle2 size={18} />}
          title="Completed"
          subtitle={`${completedCount} videos finished`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {completed.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </Section>

        {/* ── Browse All CTA ─────────────────────────────────────────── */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[var(--neutral-500)] text-sm mb-4">
            Showing 12 of 190+ training videos
          </p>
          <button className="btn-primary flex items-center gap-2 mx-auto">
            <BookOpen size={16} />
            Browse Full Library
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
