'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Save,
  CheckCircle2,
  DollarSign,
  Users,
  Calendar,
  Award,
  Star,
  Zap,
  BookOpen,
  TrendingUp,
  Edit3,
  Shield,
  Copy,
  CheckCheck,
  Link2,
  ExternalLink,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfileForm {
  name: string
  email: string
  phone: string
  bio: string
  background: string
}

interface Badge {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  earned: boolean
  earnedDate?: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_FORM: ProfileForm = {
  name: 'Todd Billings',
  email: 'todd.billings@example.com',
  phone: '(555) 214-8830',
  bio: 'Commercial lending consultant with a background in financial services. Passionate about helping small business owners and real estate investors access the capital they need to grow.',
  background: 'Former branch manager at a regional bank. Transitioned to Sequoia after 8 years in traditional banking to provide clients with more flexible financing options.',
}

const BADGES: Badge[] = [
  {
    id: 'first-deal',
    label: 'First Deal',
    description: 'Funded your first commercial deal',
    icon: <DollarSign size={20} />,
    color: 'from-gold-500 to-gold-700',
    earned: true,
    earnedDate: 'Jan 2026',
  },
  {
    id: 'training-completist',
    label: 'Training Completist',
    description: 'Completed 5+ training videos',
    icon: <BookOpen size={20} />,
    color: 'from-sequoia-600 to-sequoia-800',
    earned: true,
    earnedDate: 'Dec 2025',
  },
  {
    id: 'wellness-pioneer',
    label: 'Wellness Pioneer',
    description: 'Enrolled your first employer in EHMP',
    icon: <Shield size={20} />,
    color: 'from-teal-500 to-teal-700',
    earned: true,
    earnedDate: 'Feb 2026',
  },
  {
    id: 'rising-star',
    label: 'Rising Star',
    description: 'Hit $1M in funded volume',
    icon: <Star size={20} />,
    color: 'from-purple-500 to-purple-700',
    earned: true,
    earnedDate: 'Mar 2026',
  },
  {
    id: 'power-closer',
    label: 'Power Closer',
    description: 'Fund 5 deals in a single month',
    icon: <Zap size={20} />,
    color: 'from-orange-500 to-orange-700',
    earned: false,
  },
  {
    id: 'community-champion',
    label: 'Community Champion',
    description: 'Receive 50+ likes on community posts',
    icon: <TrendingUp size={20} />,
    color: 'from-blue-500 to-blue-700',
    earned: false,
  },
]

const STATS = [
  {
    label: 'Total Funded Volume',
    value: '$4,250,000',
    icon: <DollarSign size={20} />,
    color: 'text-sequoia-700',
    bg: 'bg-sequoia-50',
  },
  {
    label: 'Wellness Enrollees',
    value: '88',
    icon: <Users size={20} />,
    color: 'text-teal-700',
    bg: 'bg-teal-50',
  },
  {
    label: 'Active Since',
    value: 'Nov 2025',
    icon: <Calendar size={20} />,
    color: 'text-gold-700',
    bg: 'bg-gold-50',
  },
  {
    label: 'Deals Funded',
    value: '14',
    icon: <CheckCircle2 size={20} />,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const CONSULTANT_ID = 'SEQ-2025-7842'

  function handleChange(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setIsEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  function copyId() {
    navigator.clipboard.writeText(CONSULTANT_ID)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url)
    setCopiedLink(url)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const REFERRAL_LINKS = [
    { label: 'Personal Site', url: 'https://toddbillings.seqsolution.com' },
    { label: 'EHMP Referral', url: 'https://seqsolution.com/wellness?ref=222902' },
    { label: 'Funding Referral', url: 'https://seqsolution.com/apply?ref=222902' },
  ]

  const earnedBadges = BADGES.filter((b) => b.earned)
  const unearnedBadges = BADGES.filter((b) => !b.earned)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-sequoia">
        <div className="container-brand py-10">
          <p className="text-sequoia-300 text-sm font-medium uppercase tracking-widest mb-1">
            Consultant Portal
          </p>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-sequoia-200 mt-1 text-sm">
            Manage your account details and track your achievements.
          </p>
        </div>
      </div>

      <div className="container-brand py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column ────────────────────────────────────────── */}
          <div className="xl:col-span-1 space-y-5">

            {/* Profile card */}
            <div className="card-sequoia p-6 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sequoia-700 to-sequoia-900 flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-[var(--shadow-md)]">
                TB
              </div>

              <h2 className="text-xl font-bold text-[var(--sequoia-900)]">{form.name}</h2>

              {/* Tier badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
                <Award size={13} />
                Active Consultant
              </div>

              {/* Consultant ID */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <code className="text-xs text-[var(--neutral-500)] bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded px-2.5 py-1 font-mono">
                  {CONSULTANT_ID}
                </code>
                <button
                  onClick={copyId}
                  className="p-1 rounded text-[var(--neutral-400)] hover:text-sequoia-700 transition-colors cursor-pointer"
                  title="Copy Consultant ID"
                >
                  {copiedId ? <CheckCheck size={14} className="text-sequoia-600" /> : <Copy size={14} />}
                </button>
              </div>

              <p className="text-xs text-[var(--neutral-400)] mt-1">Member since November 2025</p>

              <div className="divider-sequoia my-5" />

              {/* Quick stats */}
              <div className="space-y-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
                        {stat.icon}
                      </span>
                      <span className="text-sm text-[var(--neutral-500)]">{stat.label}</span>
                    </div>
                    <span className="font-bold text-sm text-[var(--sequoia-900)]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges card */}
            <div className="card-sequoia p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-gold-600" />
                <h3 className="font-bold text-[var(--sequoia-900)]">
                  Your Badges
                </h3>
                <span className="ml-auto text-xs text-[var(--neutral-400)]">
                  {earnedBadges.length}/{BADGES.length} earned
                </span>
              </div>

              {/* Earned */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1.5 group">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-[var(--shadow-sm)] transition-transform duration-150 group-hover:-translate-y-0.5`}
                      title={badge.description}
                    >
                      {badge.icon}
                    </div>
                    <p className="text-xs text-center text-[var(--sequoia-900)] font-semibold leading-tight">
                      {badge.label}
                    </p>
                    <p className="text-xs text-[var(--neutral-400)]">{badge.earnedDate}</p>
                  </div>
                ))}
              </div>

              {/* Unearned */}
              {unearnedBadges.length > 0 && (
                <>
                  <p className="text-xs text-[var(--neutral-400)] font-semibold uppercase tracking-wider mb-3">
                    Locked
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {unearnedBadges.map((badge) => (
                      <div key={badge.id} className="flex flex-col items-center gap-1.5 group">
                        <div
                          className="w-12 h-12 rounded-xl bg-[var(--neutral-100)] flex items-center justify-center text-[var(--neutral-300)] grayscale"
                          title={badge.description}
                        >
                          {badge.icon}
                        </div>
                        <p className="text-xs text-center text-[var(--neutral-400)] font-medium leading-tight">
                          {badge.label}
                        </p>
                        <p className="text-xs text-[var(--neutral-300)] text-center leading-tight">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right column — Edit form ────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">
            <div className="card-sequoia p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Edit3 size={18} className="text-sequoia-600" />
                  <h3 className="font-bold text-[var(--sequoia-900)] text-lg">
                    Profile Information
                  </h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--neutral-200)] text-sm font-semibold text-[var(--neutral-600)] hover:border-sequoia-400 hover:text-sequoia-700 transition-all duration-150 cursor-pointer"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--sequoia-900)] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      Full Name
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="input-brand"
                    />
                  ) : (
                    <p className="text-[var(--neutral-700)] py-2 px-3 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)] text-sm">
                      {form.name}
                    </p>
                  )}
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--sequoia-900)] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        Email Address
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="input-brand"
                      />
                    ) : (
                      <p className="text-[var(--neutral-700)] py-2 px-3 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)] text-sm">
                        {form.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--sequoia-900)] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        Phone Number
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="input-brand"
                      />
                    ) : (
                      <p className="text-[var(--neutral-700)] py-2 px-3 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)] text-sm">
                        {form.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--sequoia-900)] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} />
                      Bio
                    </span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="input-brand resize-none"
                    />
                  ) : (
                    <p className="text-[var(--neutral-700)] py-2 px-3 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)] text-sm leading-relaxed">
                      {form.bio}
                    </p>
                  )}
                </div>

                {/* Professional Background */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--sequoia-900)] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} />
                      Professional Background
                    </span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={form.background}
                      onChange={(e) => handleChange('background', e.target.value)}
                      rows={3}
                      className="input-brand resize-none"
                    />
                  ) : (
                    <p className="text-[var(--neutral-700)] py-2 px-3 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)] text-sm leading-relaxed">
                      {form.background}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                {isEditing && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Save size={15} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setForm(INITIAL_FORM)
                        setIsEditing(false)
                      }}
                      className="btn-outline px-4 py-2.5 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {saved && (
                  <div className="flex items-center gap-2 text-sequoia-700 text-sm font-semibold">
                    <CheckCircle2 size={16} className="fill-sequoia-100 text-sequoia-700" />
                    Profile saved successfully!
                  </div>
                )}
              </div>
            </div>

            {/* Stats Summary card */}
            <div className="card-sequoia p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={18} className="text-sequoia-700" />
                <h3 className="font-bold text-[var(--sequoia-900)] text-lg">Performance Summary</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.bg}`}>
                    <span className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</span>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-[var(--neutral-500)] mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* My Referral Links */}
            <div className="card-sequoia p-6">
              <div className="flex items-center gap-2 mb-5">
                <Link2 size={18} className="text-sequoia-700" />
                <h3 className="font-bold text-[var(--sequoia-900)] text-lg">My Referral Links</h3>
              </div>
              <p className="text-sm text-[var(--neutral-500)] mb-4">
                Share these links to track referrals back to your account.
              </p>
              <div className="space-y-3">
                {REFERRAL_LINKS.map((link) => (
                  <div
                    key={link.label}
                    className="flex items-center gap-3 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--sequoia-900)] mb-0.5">{link.label}</p>
                      <p className="text-sm text-[var(--neutral-500)] truncate font-mono">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[var(--neutral-400)] hover:text-sequoia-700 hover:bg-white transition-colors"
                        title="Open link"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => copyLink(link.url)}
                        className="p-1.5 rounded-lg text-[var(--neutral-400)] hover:text-sequoia-700 hover:bg-white transition-colors cursor-pointer"
                        title="Copy link"
                      >
                        {copiedLink === link.url ? (
                          <CheckCheck size={14} className="text-sequoia-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    {copiedLink === link.url && (
                      <span className="text-xs font-semibold text-sequoia-600 animate-pulse">
                        Copied!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
