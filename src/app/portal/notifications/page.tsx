'use client'

import { useState } from 'react'
import {
  Bell,
  DollarSign,
  Play,
  Heart,
  GraduationCap,
  Settings,
  CheckCheck,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Notification {
  id: string
  text: string
  type: 'Deal Update' | 'New Content' | 'Community' | 'Training' | 'System'
  timeAgo: string
  read: boolean
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; bg: string; text: string; dot: string }
> = {
  'Deal Update': {
    icon: <DollarSign size={16} aria-hidden="true" />,
    bg: 'bg-gold-100',
    text: 'text-gold-700',
    dot: 'bg-gold-500',
  },
  'New Content': {
    icon: <Play size={16} aria-hidden="true" />,
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  Community: {
    icon: <Heart size={16} aria-hidden="true" />,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  Training: {
    icon: <GraduationCap size={16} aria-hidden="true" />,
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  System: {
    icon: <Settings size={16} aria-hidden="true" />,
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    text: 'Your pipeline deal "Pacific Rim Realty" moved to In Review',
    type: 'Deal Update',
    timeAgo: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    text: 'New training video: "SBA Loans: Eligibility & the Application"',
    type: 'New Content',
    timeAgo: '1 day ago',
    read: false,
  },
  {
    id: '3',
    text: 'Joseph C. liked your community post',
    type: 'Community',
    timeAgo: '2 days ago',
    read: false,
  },
  {
    id: '4',
    text: 'Wednesday training replay is now available',
    type: 'Training',
    timeAgo: '3 days ago',
    read: false,
  },
  {
    id: '5',
    text: 'Welcome to Sequoia! Your account is active.',
    type: 'System',
    timeAgo: 'Nov 15, 2025',
    read: true,
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-sequoia-900 tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-sequoia-600" aria-hidden="true" />
            Notifications
          </h2>
          <p className="text-sm text-brand-neutral-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-sequoia-700 border border-sequoia-200 hover:bg-sequoia-50 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="card-sequoia overflow-hidden divide-y divide-brand-neutral-100">
        {notifications.map((notif) => {
          const config = TYPE_CONFIG[notif.type]
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-5 py-4 transition-colors ${
                notif.read ? 'bg-white' : 'bg-sequoia-50/30'
              }`}
            >
              {/* Type icon */}
              <div
                className={`mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${config.bg} ${config.text}`}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    notif.read
                      ? 'text-brand-neutral-600'
                      : 'text-brand-neutral-800 font-medium'
                  }`}
                >
                  {notif.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${config.text}`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`}
                      aria-hidden="true"
                    />
                    {notif.type}
                  </span>
                  <span className="text-xs text-brand-neutral-400">
                    {notif.timeAgo}
                  </span>
                </div>
              </div>

              {/* Unread indicator */}
              {!notif.read && (
                <div className="mt-2 shrink-0">
                  <span className="inline-block w-2 h-2 rounded-full bg-gold-500" aria-label="Unread" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
