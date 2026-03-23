'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CommunityPostWithAuthor } from '@/lib/supabase/types'

export function useRealtimePosts(initialPosts: CommunityPostWithAuthor[]) {
  const [posts, setPosts] = useState<CommunityPostWithAuthor[]>(initialPosts)
  const supabase = createClient()

  // Update posts when initialPosts changes (e.g., filter change)
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  useEffect(() => {
    const channel = supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts' },
        async (payload) => {
          // Fetch the full post with author info
          const { data } = await supabase
            .from('community_posts')
            .select('*, author:consultants(full_name, tier, avatar_url, avatar_color)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setPosts((prev) => [data as CommunityPostWithAuthor, ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'community_posts' },
        (payload) => {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === payload.new.id
                ? { ...p, ...payload.new } as CommunityPostWithAuthor
                : p
            )
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'community_posts' },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const addOptimisticPost = useCallback((post: CommunityPostWithAuthor) => {
    setPosts((prev) => [post, ...prev])
  }, [])

  return { posts, addOptimisticPost }
}
