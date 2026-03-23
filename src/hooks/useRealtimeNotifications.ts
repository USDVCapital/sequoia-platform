'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/lib/supabase/types'

export function useRealtimeNotifications(
  consultantId: string | undefined,
  initialNotifications: Notification[]
) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications.filter((n) => !n.read).length
  )
  const supabase = createClient()

  useEffect(() => {
    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read).length)
  }, [initialNotifications])

  useEffect(() => {
    if (!consultantId) return

    const channel = supabase
      .channel(`notifications-${consultantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `consultant_id=eq.${consultantId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `consultant_id=eq.${consultantId}`,
        },
        (payload) => {
          const updated = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          )
          // Recalculate unread count
          setNotifications((prev) => {
            setUnreadCount(prev.filter((n) => !n.read).length)
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [consultantId, supabase])

  const markAsRead = useCallback(async (notificationIds?: string[]) => {
    if (!consultantId) return

    let query = supabase
      .from('notifications')
      .update({ read: true })
      .eq('consultant_id', consultantId)

    if (notificationIds && notificationIds.length > 0) {
      query = query.in('id', notificationIds)
    }

    await query

    setNotifications((prev) =>
      prev.map((n) =>
        !notificationIds || notificationIds.includes(n.id)
          ? { ...n, read: true }
          : n
      )
    )
    setUnreadCount(0)
  }, [consultantId, supabase])

  return { notifications, unreadCount, markAsRead }
}
