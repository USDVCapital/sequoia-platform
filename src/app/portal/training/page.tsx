'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Video,
  ChevronRight,
  Filter,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type VideoCategory =
  | 'Agent Training'
  | 'Commercial Lending'
  | 'Wellness/EHMP'
  | 'Success Stories'

interface TrainingVideo {
  id: string
  title: string
  category: VideoCategory
  duration: string
  thumbnail: string
  progress: number // 0–100
  isNew: boolean
  isRecommended?: boolean
  isContinueWatching?: boolean
}

// ── Video Data ────────────────────────────────────────────────────────────────

const ALL_VIDEOS: TrainingVideo[] = [
  // Continue Watching (first 3 with fake progress)
  {
    id: 'RuWpu3IvhOk',
    title: 'Case Studies: Recently Closed Deals',
    category: 'Agent Training',
    duration: '45:00',
    thumbnail: 'https://img.youtube.com/vi/RuWpu3IvhOk/mqdefault.jpg',
    progress: 40,
    isNew: true,
    isContinueWatching: true,
  },
  {
    id: 'TKGUzP5GrBI',
    title: 'Expediting Property Insurance Claims',
    category: 'Agent Training',
    duration: '38:20',
    thumbnail: 'https://img.youtube.com/vi/TKGUzP5GrBI/mqdefault.jpg',
    progress: 75,
    isNew: true,
    isContinueWatching: true,
  },
  {
    id: 'vuxR-DSjLlI',
    title: 'SBA Eligibility: How to Avoid Common Pitfalls',
    category: 'Agent Training',
    duration: '42:15',
    thumbnail: 'https://img.youtube.com/vi/vuxR-DSjLlI/mqdefault.jpg',
    progress: 20,
    isNew: true,
    isContinueWatching: true,
  },
  // Recommended (4 EHMP/Wellness videos)
  {
    id: 'QTZFGrV1zW0',
    title: 'Wellness Program (EHMP) Case Studies',
    category: 'Wellness/EHMP',
    duration: '18:40',
    thumbnail: 'https://img.youtube.com/vi/QTZFGrV1zW0/mqdefault.jpg',
    progress: 0,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'QqbhPDwSUe4',
    title: 'Wellness Program Process Explained',
    category: 'Wellness/EHMP',
    duration: '25:00',
    thumbnail: 'https://img.youtube.com/vi/QqbhPDwSUe4/mqdefault.jpg',
    progress: 0,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'mYKGH21_9ew',
    title: 'EHMP Deep Dive: A Closer Look',
    category: 'Wellness/EHMP',
    duration: '20:30',
    thumbnail: 'https://img.youtube.com/vi/mYKGH21_9ew/mqdefault.jpg',
    progress: 0,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'Srq_Xf2K3_w',
    title: 'How Employers Save More with EHMP',
    category: 'Wellness/EHMP',
    duration: '22:45',
    thumbnail: 'https://img.youtube.com/vi/Srq_Xf2K3_w/mqdefault.jpg',
    progress: 0,
    isNew: false,
    isRecommended: true,
  },
  // Remaining videos
  {
    id: 'YwBu61B50JY',
    title: 'DSCR Loans Made Simple',
    category: 'Commercial Lending',
    duration: '28:15',
    thumbnail: 'https://img.youtube.com/vi/YwBu61B50JY/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'M7THwiRrItA',
    title: 'Innovating Insurance Claims for Property Owners',
    category: 'Agent Training',
    duration: '35:40',
    thumbnail: 'https://img.youtube.com/vi/M7THwiRrItA/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: '93SSkY3KunA',
    title: 'SBA Loans Explained: How SBA Lending Works',
    category: 'Commercial Lending',
    duration: '32:10',
    thumbnail: 'https://img.youtube.com/vi/93SSkY3KunA/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'tekFBzCrmB4',
    title: 'The Year of the Hero | 2026 Strategy',
    category: 'Agent Training',
    duration: '52:30',
    thumbnail: 'https://img.youtube.com/vi/tekFBzCrmB4/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'Rv8JeFqpOlI',
    title: '2025 Year in Review & 2026 Vision',
    category: 'Agent Training',
    duration: '58:30',
    thumbnail: 'https://img.youtube.com/vi/Rv8JeFqpOlI/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'xtDxU9gHfrI',
    title: 'Non-Traditional Funding for Real Estate Investors',
    category: 'Commercial Lending',
    duration: '34:15',
    thumbnail: 'https://img.youtube.com/vi/xtDxU9gHfrI/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'qs2bHkLCjms',
    title: 'Funding Solutions for Land Development',
    category: 'Commercial Lending',
    duration: '29:00',
    thumbnail: 'https://img.youtube.com/vi/qs2bHkLCjms/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'QJYI8H_0oSQ',
    title: 'How Emily Closed $500K+ in Commercial Loans',
    category: 'Success Stories',
    duration: '12:45',
    thumbnail: 'https://img.youtube.com/vi/QJYI8H_0oSQ/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: '15MuBpRAGiI',
    title: '1-Minute Guide: How to Access SEA',
    category: 'Wellness/EHMP',
    duration: '1:30',
    thumbnail: 'https://img.youtube.com/vi/15MuBpRAGiI/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'FULGTSH5knA',
    title: '100% Fix and Flip Loan',
    category: 'Commercial Lending',
    duration: '19:45',
    thumbnail: 'https://img.youtube.com/vi/FULGTSH5knA/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'UU0iWIKVJdE',
    title: 'Gap Funding Explained',
    category: 'Commercial Lending',
    duration: '23:10',
    thumbnail: 'https://img.youtube.com/vi/UU0iWIKVJdE/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'K7vX7QIQfvE',
    title: 'How to Enroll Clients in EHMP',
    category: 'Wellness/EHMP',
    duration: '17:20',
    thumbnail: 'https://img.youtube.com/vi/K7vX7QIQfvE/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: '91mLzmXHX0E',
    title: 'Case Study: The Wellness Program',
    category: 'Wellness/EHMP',
    duration: '14:55',
    thumbnail: 'https://img.youtube.com/vi/91mLzmXHX0E/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'hhMmDcxK45E',
    title: '$652,000 Deal — Joseph Cordeira',
    category: 'Success Stories',
    duration: '8:20',
    thumbnail: 'https://img.youtube.com/vi/hhMmDcxK45E/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'OnR0ChPOwnc',
    title: 'EHMP: The Wellness Program Overview',
    category: 'Wellness/EHMP',
    duration: '22:15',
    thumbnail: 'https://img.youtube.com/vi/OnR0ChPOwnc/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'EbdF1guVcWQ',
    title: 'How to Use TitanFile for File Collection',
    category: 'Agent Training',
    duration: '11:40',
    thumbnail: 'https://img.youtube.com/vi/EbdF1guVcWQ/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'QTtiOX-lDy8',
    title: 'Top 10 Reasons Commercial Loans Fail',
    category: 'Commercial Lending',
    duration: '24:30',
    thumbnail: 'https://img.youtube.com/vi/QTtiOX-lDy8/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 're_L5_njqWM',
    title: 'Sequoia Loan Process Made Simple',
    category: 'Commercial Lending',
    duration: '16:50',
    thumbnail: 'https://img.youtube.com/vi/re_L5_njqWM/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
  {
    id: 'YIc43aEYlZU',
    title: 'Live Interview with Sequoia Agents',
    category: 'Success Stories',
    duration: '35:10',
    thumbnail: 'https://img.youtube.com/vi/YIc43aEYlZU/mqdefault.jpg',
    progress: 0,
    isNew: false,
  },
]

// ── Article Data ──────────────────────────────────────────────────────────────

interface TrainingArticle {
  id: string
  title: string
  description: string
  category: string
  duration: string
  badge: string
  route: string
}

const ALL_ARTICLES: TrainingArticle[] = [
  {
    id: 'you-are-the-boss',
    title: 'You Are the Boss',
    description: 'Understand your role as an independent contractor and the network marketing model that powers your business.',
    category: 'Mindset & Business Basics',
    duration: '5 min read',
    badge: 'Foundational',
    route: '/resources/you-are-the-boss',
  },
  {
    id: 'how-to-be-liked',
    title: 'How to Be Liked by Others',
    description: '17 principles for building the human connections that drive team growth and client loyalty.',
    category: 'Mindset & Business Basics',
    duration: '4 min read',
    badge: 'Foundational',
    route: '/resources/how-to-be-liked',
  },
]

const CATEGORY_COLORS: Record<VideoCategory, string> = {
  'Agent Training': 'bg-sequoia-100 text-sequoia-800',
  'Commercial Lending': 'bg-blue-50 text-blue-700',
  'Wellness/EHMP': 'bg-teal-50 text-teal-700',
  'Success Stories': 'bg-gold-100 text-gold-800',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const continueWatching = ALL_VIDEOS.filter((v) => v.isContinueWatching)
const recommended = ALL_VIDEOS.filter((v) => v.isRecommended)
const newThisWeek = ALL_VIDEOS.filter((v) => v.isNew && !v.isContinueWatching)

const completedCount = 3
const totalCount = ALL_VIDEOS.length

// ── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ video }: { video: TrainingVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="card-sequoia overflow-hidden p-0 flex flex-col group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
        <img
          src={video.thumbnail.replace('mqdefault', 'hqdefault')}
          alt={video.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Play button */}
        <div className="relative z-10 w-10 h-10 rounded-full bg-black/40 border border-white/30 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-200">
          <Play size={14} className="text-white ml-0.5 fill-white" />
        </div>

        {/* Duration */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/40 rounded-full px-1.5 py-0.5 text-white text-[10px] font-medium">
          <Clock size={9} />
          {video.duration}
        </div>

        {/* New badge */}
        {video.isNew && (
          <div className="absolute top-1.5 left-1.5 bg-gold-500 text-sequoia-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            NEW
          </div>
        )}
      </div>

      {/* Progress bar */}
      {video.progress > 0 && (
        <div className="h-1 bg-[var(--neutral-100)]">
          <div
            className="h-full transition-all duration-300 bg-gold-500"
            style={{ width: `${video.progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${CATEGORY_COLORS[video.category]}`}
          >
            {video.category}
          </span>
          {video.progress > 0 && (
            <span className="text-[10px] text-gold-700 font-semibold shrink-0">{video.progress}%</span>
          )}
        </div>
        <h3 className="font-bold text-[var(--sequoia-900)] text-xs leading-snug line-clamp-2">
          {video.title}
        </h3>
      </div>
    </a>
  )
}

// ── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: TrainingArticle }) {
  return (
    <Link
      href={article.route}
      className="card-sequoia overflow-hidden p-0 flex flex-col group cursor-pointer"
    >
      {/* Icon header */}
      <div className="relative aspect-video bg-[#0D2B1E] flex items-center justify-center">
        <BookOpen size={36} className="text-[#C9A84C] opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-1.5 left-1.5 bg-[#C9A84C] text-[#0D2B1E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {article.badge}
        </div>
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/40 rounded-full px-1.5 py-0.5 text-white text-[10px] font-medium">
          <Clock size={9} />
          {article.duration}
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 self-start">
          {article.category}
        </span>
        <h3 className="font-bold text-[var(--sequoia-900)] text-xs leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[10px] text-gray-500 line-clamp-2">{article.description}</p>
        <span className="mt-auto text-[10px] font-semibold text-[#C9A84C] flex items-center gap-1">
          Read <ChevronRight size={10} />
        </span>
      </div>
    </Link>
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

// ── Full Library with Filters ─────────────────────────────────────────────────

type LibraryFilter = 'All' | VideoCategory | 'Reading'

const LIBRARY_FILTERS: LibraryFilter[] = [
  'All',
  'Agent Training',
  'Commercial Lending',
  'Wellness/EHMP',
  'Success Stories',
  'Reading',
]

function FullLibrary() {
  const [filter, setFilter] = useState<LibraryFilter>('All')

  const isReading = filter === 'Reading'
  const filtered = isReading
    ? []
    : filter === 'All'
      ? ALL_VIDEOS
      : ALL_VIDEOS.filter((v) => v.category === filter)

  const showArticles = filter === 'All' || isReading

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="icon-box-sequoia w-9 h-9"><Filter size={18} /></span>
        <div>
          <h2 className="text-lg font-bold text-[var(--sequoia-900)]">Full Library</h2>
          <p className="text-sm text-[var(--neutral-400)]">{ALL_VIDEOS.length} videos &middot; {ALL_ARTICLES.length} articles</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter training videos">
        {LIBRARY_FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer border ${
              filter === f
                ? 'bg-sequoia-700 text-white border-sequoia-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sequoia-300 hover:text-sequoia-700'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-60 text-xs">
                ({ALL_VIDEOS.filter((v) => v.category === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

      {/* Articles section */}
      {showArticles && (
        <div className={filtered.length > 0 ? 'mt-8' : ''}>
          {filtered.length > 0 && (
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Reading</h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {ALL_ARTICLES.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && !showArticles && (
        <div className="text-center py-16 text-gray-400">
          <Video size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No videos in this category yet.</p>
        </div>
      )}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newThisWeek.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </Section>

        {/* ── Full Library ─────────────────────────────────────────── */}
        <FullLibrary />
      </div>
    </div>
  )
}
