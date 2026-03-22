'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Heart,
  MessageCircle,
  Send,
  Users,
  Trophy,
  Lightbulb,
  TrendingUp,
  Star,
  Pin,
  MoreHorizontal,
  Image as ImageIcon,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tier = 'Associate' | 'Active' | 'Senior' | 'Managing Director'
type PostCategory = 'Win' | 'Question' | 'Tip' | 'Announcement'
type FilterTab = 'All' | 'Win' | 'Question' | 'Tip'

interface Post {
  id: number
  author: string
  tier: Tier
  initials: string
  avatarColor: string
  timestamp: string
  content: string
  likes: number
  comments: number
  category: PostCategory
  isPinned?: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SEED_POSTS: Post[] = [
  {
    id: 1,
    author: 'Marcus Rivera',
    tier: 'Managing Director',
    initials: 'MR',
    avatarColor: 'from-gold-600 to-gold-800',
    timestamp: '2 hours ago',
    content:
      'Just hit $22M in all-time funded volume. I remember when $1M felt impossible. If you\'re in your first 90 days — just keep going. The compounding effect is real. Happy to jump on a call with anyone who wants to talk strategy.',
    likes: 47,
    comments: 14,
    category: 'Win',
    isPinned: true,
  },
  {
    id: 2,
    author: 'Sarah Chen',
    tier: 'Senior',
    initials: 'SC',
    avatarColor: 'from-sequoia-700 to-sequoia-900',
    timestamp: '4 hours ago',
    content:
      'Just closed my first commercial deal! $425K for a mixed-use property in Atlanta. Huge shoutout to the Wednesday training for the confidence boost — the objection handling module was a game-changer.',
    likes: 34,
    comments: 9,
    category: 'Win',
  },
  {
    id: 3,
    author: 'Todd Billings',
    tier: 'Active',
    initials: 'TB',
    avatarColor: 'from-blue-600 to-blue-800',
    timestamp: '6 hours ago',
    content:
      'Quick question for the group — has anyone had success pairing the wellness program pitch with commercial lending clients? Curious if there\'s a talk track for doing both in the same conversation.',
    likes: 12,
    comments: 7,
    category: 'Question',
  },
  {
    id: 4,
    author: 'Priya Nair',
    tier: 'Managing Director',
    initials: 'PN',
    avatarColor: 'from-purple-600 to-purple-900',
    timestamp: '1 day ago',
    content:
      'TIP: Stop leading with rates. Clients don\'t care about rates until they trust you. Lead with problems you solve — "We help business owners access capital they couldn\'t get at a bank" lands 10x better. Tried this on 3 calls this week. 2 turned into deals.',
    likes: 63,
    comments: 18,
    category: 'Tip',
  },
  {
    id: 5,
    author: 'Denise Okafor',
    tier: 'Active',
    initials: 'DO',
    avatarColor: 'from-teal-600 to-teal-800',
    timestamp: '1 day ago',
    content:
      'Enrolled my first 5-employee company into the wellness program today. It was a dental office — they\'d been looking for a benefits solution for 2 years. Sometimes the easiest clients are right in your network.',
    likes: 28,
    comments: 5,
    category: 'Win',
  },
  {
    id: 6,
    author: 'James Caldwell',
    tier: 'Senior',
    initials: 'JC',
    avatarColor: 'from-emerald-600 to-emerald-800',
    timestamp: '2 days ago',
    content:
      'Reminder: the new DSCR product update is live. We can now go up to 80% LTV on 1-4 unit properties with a 1.1 DSCR minimum. Big deal for investors who were getting turned down before. Check the portal for the updated one-pager.',
    likes: 41,
    comments: 11,
    category: 'Announcement',
  },
  {
    id: 7,
    author: 'Ryan Park',
    tier: 'Associate',
    initials: 'RP',
    avatarColor: 'from-orange-600 to-orange-800',
    timestamp: '3 days ago',
    content:
      'Does anyone have a good script for cold outreach to CPAs? I feel like that\'s a goldmine referral source but I have no idea how to approach them. Any help appreciated!',
    likes: 9,
    comments: 16,
    category: 'Question',
  },
  {
    id: 8,
    author: 'Amara Williams',
    tier: 'Associate',
    initials: 'AW',
    avatarColor: 'from-rose-600 to-rose-800',
    timestamp: '4 days ago',
    content:
      'Finally got my first deal approved after 3 weeks of back and forth — $185K working capital for a trucking company. The underwriting team was incredibly helpful when I called in. Do NOT be afraid to pick up the phone!',
    likes: 52,
    comments: 12,
    category: 'Win',
  },
]

// ── localStorage helpers ──────────────────────────────────────────────────────

const POSTS_STORAGE_KEY = 'sequoia-community-posts'
const LIKES_STORAGE_KEY = 'sequoia-community-likes'

function loadPosts(): Post[] | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return null
}

function savePosts(posts: Post[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
  } catch { /* ignore */ }
}

function loadLikedIds(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch { /* ignore */ }
  return new Set()
}

function saveLikedIds(ids: Set<number>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...ids]))
  } catch { /* ignore */ }
}

// ── Config ────────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<Tier, { bg: string; text: string }> = {
  'Managing Director': { bg: 'bg-gold-100', text: 'text-gold-800' },
  Senior: { bg: 'bg-sequoia-100', text: 'text-sequoia-800' },
  Active: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Associate: { bg: 'bg-[var(--neutral-100)]', text: 'text-[var(--neutral-600)]' },
}

const CATEGORY_CONFIG: Record<PostCategory, { bg: string; text: string; icon: React.ReactNode }> = {
  Win: { bg: 'bg-sequoia-100', text: 'text-sequoia-800', icon: <Trophy size={11} /> },
  Question: { bg: 'bg-blue-50', text: 'text-blue-700', icon: <MessageCircle size={11} /> },
  Tip: { bg: 'bg-gold-100', text: 'text-gold-800', icon: <Lightbulb size={11} /> },
  Announcement: { bg: 'bg-purple-50', text: 'text-purple-700', icon: <Star size={11} /> },
}

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'All' },
  { label: 'Wins', value: 'Win' },
  { label: 'Questions', value: 'Question' },
  { label: 'Pro Tips', value: 'Tip' },
]

const COMPOSER_CATEGORIES: { label: string; value: PostCategory }[] = [
  { label: 'Win', value: 'Win' },
  { label: 'Question', value: 'Question' },
  { label: 'Pro Tip', value: 'Tip' },
  { label: 'Resource', value: 'Announcement' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [composerText, setComposerText] = useState('')
  const [composerCategory, setComposerCategory] = useState<PostCategory>('Win')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All')
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const storedPosts = loadPosts()
    if (storedPosts) setPosts(storedPosts)
    setLikedIds(loadLikedIds())
    setHydrated(true)
  }, [])

  // Persist posts and likes
  useEffect(() => {
    if (hydrated) savePosts(posts)
  }, [posts, hydrated])

  useEffect(() => {
    if (hydrated) saveLikedIds(likedIds)
  }, [likedIds, hydrated])

  const toggleLike = useCallback((id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setPosts((p) => p.map((post) => (post.id === id ? { ...post, likes: post.likes - 1 } : post)))
      } else {
        next.add(id)
        setPosts((p) => p.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
      }
      return next
    })
  }, [])

  function handlePost() {
    if (!composerText.trim()) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const newPost: Post = {
      id: Date.now(),
      author: 'Todd Billings',
      tier: 'Active',
      initials: 'TB',
      avatarColor: 'from-blue-600 to-blue-800',
      timestamp: `Today at ${timeStr}`,
      content: composerText.trim(),
      likes: 0,
      comments: 0,
      category: composerCategory,
    }
    setPosts((p) => [newPost, ...p])
    setComposerText('')
    setComposerCategory('Win')
  }

  function handleReplyClick() {
    alert('Replies coming in the next update.')
  }

  // Filter posts
  const filteredPosts = activeFilter === 'All'
    ? posts
    : posts.filter((p) => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-sequoia">
        <div className="container-brand py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sequoia-300 text-sm font-medium uppercase tracking-widest mb-1">
                Consultant Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Users size={28} className="text-sequoia-300 shrink-0" />
                Community Feed
              </h1>
              <p className="text-sequoia-200 mt-1 text-sm">
                Share wins, ask questions, and grow together.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="glass rounded-xl px-4 py-3 text-center">
                <p className="text-white font-bold text-xl">{posts.length}</p>
                <p className="text-sequoia-300 text-xs">Posts</p>
              </div>
              <div className="glass rounded-xl px-4 py-3 text-center">
                <p className="text-white font-bold text-xl">
                  {posts.reduce((s, p) => s + p.likes, 0)}
                </p>
                <p className="text-sequoia-300 text-xs">Total Likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-brand py-8 max-w-2xl mx-auto">

        {/* ── Post Composer ─────────────────────────────────────────── */}
        <div className="card-sequoia p-5 mb-6">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
              TB
            </div>
            <div className="flex-1">
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Share a win, ask a question, or post a tip..."
                className="w-full resize-none rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-3 text-sm text-[var(--sequoia-900)] placeholder-[var(--neutral-400)] focus:outline-none focus:border-sequoia-500 focus:ring-2 focus:ring-sequoia-100 transition-all duration-150 min-h-[80px]"
              />

              {/* Category selector */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {COMPOSER_CATEGORIES.map((cat) => {
                  const isSelected = composerCategory === cat.value
                  const catConfig = CATEGORY_CONFIG[cat.value]
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setComposerCategory(cat.value)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? `${catConfig.bg} ${catConfig.text} border-current`
                          : 'border-[var(--neutral-200)] text-[var(--neutral-500)] hover:border-[var(--neutral-300)]'
                      }`}
                    >
                      {catConfig.icon}
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-[var(--neutral-400)] hover:text-sequoia-600 transition-colors cursor-pointer"
                  >
                    <ImageIcon size={14} />
                    Photo
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-[var(--neutral-400)] hover:text-sequoia-600 transition-colors cursor-pointer"
                  >
                    <TrendingUp size={14} />
                    Milestone
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={!composerText.trim()}
                  className="btn-gold px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                  Post to Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                activeFilter === tab.value
                  ? 'bg-sequoia-800 text-white shadow-sm'
                  : 'bg-white border border-[var(--neutral-200)] text-[var(--neutral-600)] hover:border-sequoia-400 hover:text-sequoia-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Feed ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filteredPosts.length === 0 && (
            <div className="card-sequoia p-8 text-center">
              <p className="text-[var(--neutral-400)] text-sm">No posts in this category yet. Be the first!</p>
            </div>
          )}
          {filteredPosts.map((post) => {
            const isLiked = likedIds.has(post.id)
            const tierConfig = TIER_CONFIG[post.tier]
            const catConfig = CATEGORY_CONFIG[post.category]
            const isCurrentUser = post.author === 'Todd Billings'

            return (
              <article
                key={post.id}
                className={`card-sequoia p-5 ${post.isPinned ? 'border-gold-300 bg-gradient-to-br from-white to-gold-50' : ''}`}
              >
                {post.isPinned && (
                  <div className="flex items-center gap-1.5 text-gold-700 text-xs font-semibold mb-3">
                    <Pin size={12} className="fill-gold-600 text-gold-600" />
                    Pinned Post
                  </div>
                )}

                {/* Post header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${post.avatarColor} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {post.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-sm ${isCurrentUser ? 'text-blue-700' : 'text-[var(--sequoia-900)]'}`}>
                          {post.author}
                          {isCurrentUser && <span className="ml-1 text-xs text-blue-500 font-semibold">(You)</span>}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tierConfig.bg} ${tierConfig.text}`}
                        >
                          {post.tier}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${catConfig.bg} ${catConfig.text}`}
                        >
                          {catConfig.icon}
                          {post.category}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--neutral-400)] mt-0.5">{post.timestamp}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 p-1.5 rounded-lg text-[var(--neutral-300)] hover:text-[var(--neutral-500)] hover:bg-[var(--neutral-50)] transition-colors cursor-pointer"
                    aria-label="Post options"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Post content */}
                <p className="text-[var(--neutral-700)] text-sm leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--neutral-100)]">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isLiked
                        ? 'text-red-500'
                        : 'text-[var(--neutral-400)] hover:text-red-400'
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? 'fill-red-500 text-red-500' : ''}
                    />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={handleReplyClick}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--neutral-400)] hover:text-sequoia-600 transition-colors duration-150 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>{post.comments} {post.comments === 1 ? 'reply' : 'replies'}</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
