'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressContextType {
  videoProgress: Record<string, number>;
  checklistItems: Record<string, boolean>;
  streak: number;
  likedPosts: string[];
  updateVideoProgress: (videoId: string, progress: number) => void;
  toggleChecklistItem: (itemId: string) => void;
  toggleLike: (postId: string) => void;
  setStreak: (count: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const [streak, setStreakState] = useState(4);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const vp = localStorage.getItem('seq_video_progress');
    const cl = localStorage.getItem('seq_checklist');
    const st = localStorage.getItem('seq_streak');
    const lp = localStorage.getItem('seq_liked_posts');
    if (vp) setVideoProgress(JSON.parse(vp));
    if (cl) setChecklistItems(JSON.parse(cl));
    if (st) setStreakState(JSON.parse(st));
    if (lp) setLikedPosts(JSON.parse(lp));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('seq_video_progress', JSON.stringify(videoProgress));
    localStorage.setItem('seq_checklist', JSON.stringify(checklistItems));
    localStorage.setItem('seq_streak', JSON.stringify(streak));
    localStorage.setItem('seq_liked_posts', JSON.stringify(likedPosts));
  }, [videoProgress, checklistItems, streak, likedPosts, loaded]);

  const updateVideoProgress = (videoId: string, progress: number) => {
    setVideoProgress(prev => ({ ...prev, [videoId]: progress }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const setStreak = (count: number) => setStreakState(count);

  return (
    <ProgressContext.Provider value={{ videoProgress, checklistItems, streak, likedPosts, updateVideoProgress, toggleChecklistItem, toggleLike, setStreak }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
