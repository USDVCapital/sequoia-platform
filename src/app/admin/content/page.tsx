'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TrainingVideo, Material } from '@/lib/supabase/types'
import {
  Film, FolderOpen, Plus, Star, Sparkles, Clock, X,
  Pencil, Trash2, Play, MoreVertical, ExternalLink,
} from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Parse "mm:ss" or "h:mm:ss" into total seconds */
function parseDuration(d: string): number {
  const parts = d.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

function formatTotalTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function AdminContentPage() {
  const [tab, setTab] = useState<'videos' | 'materials'>('videos')
  const [videos, setVideos] = useState<TrainingVideo[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  // Video modal
  const [activeVideo, setActiveVideo] = useState<TrainingVideo | null>(null)

  // Add video form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: '',
    youtubeId: '',
    category: 'Agent Training' as string,
    duration: '',
    isNew: false,
    isRecommended: false,
  })
  const [addingVideo, setAddingVideo] = useState(false)

  // Edit video state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [editVideo, setEditVideo] = useState({
    title: '',
    youtubeId: '',
    category: '',
    duration: '',
    isNew: false,
    isRecommended: false,
  })
  const [savingEdit, setSavingEdit] = useState(false)

  // Delete confirmation
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null)

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  async function fetchContent() {
    const supabase = createClient()
    const [videosRes, materialsRes] = await Promise.all([
      supabase.from('training_videos').select('*').order('sort_order', { ascending: true }),
      supabase.from('materials').select('*').order('sort_order', { ascending: true }),
    ])
    setVideos(videosRes.data ?? [])
    setMaterials(materialsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchContent() }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    // Delay listener to avoid catching the opening click
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick) }
  }, [openMenuId])

  // Close modal on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveVideo(null)
        setShowAddForm(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.youtubeId || !newVideo.duration) return
    setAddingVideo(true)
    const supabase = createClient()
    await supabase.from('training_videos').insert({
      youtube_id: newVideo.youtubeId,
      title: newVideo.title,
      category: newVideo.category,
      duration: newVideo.duration,
      is_new: newVideo.isNew,
      is_recommended: newVideo.isRecommended,
      sort_order: videos.length,
    })
    setNewVideo({ title: '', youtubeId: '', category: 'Agent Training', duration: '', isNew: false, isRecommended: false })
    setShowAddForm(false)
    await fetchContent()
    setAddingVideo(false)
  }

  const handleDeleteVideo = async (id: string) => {
    const supabase = createClient()
    await supabase.from('training_videos').delete().eq('id', id)
    setDeletingVideoId(null)
    setOpenMenuId(null)
    await fetchContent()
  }

  const handleStartEdit = (video: TrainingVideo) => {
    setEditingVideoId(video.id)
    setEditVideo({
      title: video.title,
      youtubeId: video.youtube_id,
      category: video.category,
      duration: video.duration,
      isNew: video.is_new,
      isRecommended: video.is_recommended,
    })
    setOpenMenuId(null)
  }

  const handleSaveEdit = async () => {
    if (!editingVideoId) return
    setSavingEdit(true)
    const supabase = createClient()
    await supabase.from('training_videos').update({
      title: editVideo.title,
      youtube_id: editVideo.youtubeId,
      category: editVideo.category,
      duration: editVideo.duration,
      is_new: editVideo.isNew,
      is_recommended: editVideo.isRecommended,
    }).eq('id', editingVideoId)
    setEditingVideoId(null)
    await fetchContent()
    setSavingEdit(false)
  }

  // Stats
  const totalWatchTime = videos.reduce((sum, v) => sum + parseDuration(v.duration), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Content</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Manage training videos and marketing materials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-brand-neutral-500 text-xs font-semibold uppercase">
            <Film size={14} /> Videos
          </div>
          <p className="text-2xl font-extrabold text-sequoia-900 mt-1">{videos.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-brand-neutral-500 text-xs font-semibold uppercase">
            <Clock size={14} /> Total Time
          </div>
          <p className="text-2xl font-extrabold text-sequoia-900 mt-1">{formatTotalTime(totalWatchTime)}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-brand-neutral-500 text-xs font-semibold uppercase">
            <FolderOpen size={14} /> Materials
          </div>
          <p className="text-2xl font-extrabold text-sequoia-900 mt-1">{materials.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-brand-neutral-500 text-xs font-semibold uppercase">
            <Sparkles size={14} /> New Items
          </div>
          <p className="text-2xl font-extrabold text-sequoia-900 mt-1">
            {videos.filter((v) => v.is_new).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-neutral-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            tab === 'videos' ? 'bg-white text-sequoia-900 shadow-sm' : 'text-brand-neutral-500 hover:text-brand-neutral-700'
          }`}
        >
          <Film size={16} /> Training Videos
        </button>
        <button
          onClick={() => setTab('materials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            tab === 'materials' ? 'bg-white text-sequoia-900 shadow-sm' : 'text-brand-neutral-500 hover:text-brand-neutral-700'
          }`}
        >
          <FolderOpen size={16} /> Materials
        </button>
      </div>

      {/* ─── Training Videos Tab ─────────────────────────── */}
      {tab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-sequoia-900">
              Training Videos ({videos.length})
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-gold text-sm py-1.5 px-4"
            >
              <Plus size={16} /> Add Video
            </button>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.map((video) => {
              // Inline edit mode
              if (editingVideoId === video.id) {
                return (
                  <div key={video.id} className="rounded-xl overflow-hidden border border-sequoia-300 bg-white shadow-md p-4 space-y-3">
                    <h4 className="text-sm font-bold text-sequoia-900">Edit Video</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editVideo.title}
                        onChange={(e) => setEditVideo((p) => ({ ...p, title: e.target.value }))}
                        className="input-brand text-sm"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={editVideo.youtubeId}
                        onChange={(e) => setEditVideo((p) => ({ ...p, youtubeId: e.target.value }))}
                        className="input-brand text-sm"
                        placeholder="YouTube ID"
                      />
                      <select
                        value={editVideo.category}
                        onChange={(e) => setEditVideo((p) => ({ ...p, category: e.target.value }))}
                        className="input-brand text-sm"
                      >
                        <option value="Agent Training">Agent Training</option>
                        <option value="Commercial Lending">Commercial Lending</option>
                        <option value="Wellness/EHMP">Wellness/EHMP</option>
                        <option value="Success Stories">Success Stories</option>
                      </select>
                      <input
                        type="text"
                        value={editVideo.duration}
                        onChange={(e) => setEditVideo((p) => ({ ...p, duration: e.target.value }))}
                        className="input-brand text-sm"
                        placeholder="Duration (e.g. 12:34)"
                      />
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-xs text-brand-neutral-600">
                          <input
                            type="checkbox"
                            checked={editVideo.isNew}
                            onChange={(e) => setEditVideo((p) => ({ ...p, isNew: e.target.checked }))}
                            className="h-3.5 w-3.5 rounded border-brand-neutral-300 text-gold-600 focus:ring-gold-500"
                          />
                          NEW
                        </label>
                        <label className="flex items-center gap-2 text-xs text-brand-neutral-600">
                          <input
                            type="checkbox"
                            checked={editVideo.isRecommended}
                            onChange={(e) => setEditVideo((p) => ({ ...p, isRecommended: e.target.checked }))}
                            className="h-3.5 w-3.5 rounded border-brand-neutral-300 text-gold-600 focus:ring-gold-500"
                          />
                          REC
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={savingEdit || !editVideo.title || !editVideo.youtubeId}
                        className="btn-primary text-xs flex-1"
                      >
                        <span style={{ color: '#FFFFFF' }}>{savingEdit ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={() => setEditingVideoId(null)}
                        className="btn-outline text-xs flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={video.id}
                  className="rounded-xl overflow-hidden border border-neutral-200 bg-white hover:shadow-md transition-all cursor-pointer group relative"
                  onClick={() => setActiveVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={22} className="text-sequoia-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[0.65rem] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} /> {video.duration}
                    </div>
                    {/* NEW badge */}
                    {video.is_new && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={10} /> NEW
                      </div>
                    )}
                    {/* REC badge */}
                    {video.is_recommended && (
                      <div className={`absolute top-2 ${video.is_new ? 'left-[4.5rem]' : 'left-2'} bg-yellow-500 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
                        <Star size={10} /> REC
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-3">
                    <p className="text-[0.7rem] font-semibold text-brand-neutral-500 uppercase tracking-wide">
                      {video.category}
                    </p>
                    <div className="flex items-start justify-between gap-2 mt-0.5">
                      <p className="text-sm font-semibold text-sequoia-900 line-clamp-2 leading-snug">
                        {video.title}
                      </p>
                      {/* Action menu */}
                      <div className="relative shrink-0" ref={openMenuId === video.id ? menuRef : undefined}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(openMenuId === video.id ? null : video.id)
                          }}
                          className="p-1 rounded-md hover:bg-brand-neutral-100 text-brand-neutral-400 hover:text-brand-neutral-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === video.id && (
                          <div className="absolute right-0 top-7 z-20 w-32 rounded-lg border border-neutral-200 bg-white shadow-lg py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEdit(video)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-brand-neutral-700 hover:bg-brand-neutral-50"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingVideoId(video.id)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {videos.length === 0 && (
              <div className="col-span-full">
                <p className="text-sm text-brand-neutral-400 text-center py-12">No training videos yet. Click &ldquo;Add Video&rdquo; to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Materials Tab ───────────────────────────────── */}
      {tab === 'materials' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-sequoia-900">
            Materials ({materials.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {materials.map((material) => (
              <a
                key={material.id}
                href={material.filename || '#'}
                target={material.filename && !material.is_coming_soon ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`rounded-xl overflow-hidden border border-neutral-200 bg-white transition-all block ${
                  material.filename && !material.is_coming_soon
                    ? 'hover:shadow-md cursor-pointer group'
                    : 'opacity-60 cursor-default'
                }`}
                onClick={(e) => {
                  if (!material.filename || material.is_coming_soon) e.preventDefault()
                }}
              >
                {/* Icon header */}
                <div className="relative h-32 bg-gradient-to-br from-brand-neutral-50 to-brand-neutral-100 flex items-center justify-center">
                  <FolderOpen size={40} className="text-brand-neutral-400 group-hover:text-sequoia-600 transition-colors" />
                  {material.is_coming_soon && (
                    <div className="absolute top-2 left-2 bg-brand-neutral-500 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                      COMING SOON
                    </div>
                  )}
                  {material.filename && !material.is_coming_soon && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-brand-neutral-500" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[0.7rem] font-semibold text-brand-neutral-500 uppercase tracking-wide">
                    {material.category}
                  </p>
                  <p className="text-sm font-semibold text-sequoia-900 line-clamp-2 leading-snug mt-0.5">
                    {material.title}
                  </p>
                  {material.description && (
                    <p className="text-xs text-brand-neutral-400 mt-1 line-clamp-2">{material.description}</p>
                  )}
                </div>
              </a>
            ))}

            {materials.length === 0 && (
              <div className="col-span-full">
                <p className="text-sm text-brand-neutral-400 text-center py-12">No materials yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add Video Modal ─────────────────────────────── */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-sequoia-900">New Training Video</h4>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-md hover:bg-brand-neutral-100 text-brand-neutral-500">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-neutral-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo((p) => ({ ...p, title: e.target.value }))}
                  className="input-brand"
                  placeholder="Video title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-neutral-500 uppercase mb-1">YouTube ID</label>
                <input
                  type="text"
                  value={newVideo.youtubeId}
                  onChange={(e) => setNewVideo((p) => ({ ...p, youtubeId: e.target.value }))}
                  className="input-brand"
                  placeholder="e.g. dQw4w9WgXcQ"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-neutral-500 uppercase mb-1">Category</label>
                <select
                  value={newVideo.category}
                  onChange={(e) => setNewVideo((p) => ({ ...p, category: e.target.value }))}
                  className="input-brand"
                >
                  <option value="Agent Training">Agent Training</option>
                  <option value="Commercial Lending">Commercial Lending</option>
                  <option value="Wellness/EHMP">Wellness/EHMP</option>
                  <option value="Success Stories">Success Stories</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-neutral-500 uppercase mb-1">Duration</label>
                <input
                  type="text"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo((p) => ({ ...p, duration: e.target.value }))}
                  className="input-brand"
                  placeholder="e.g. 12:34"
                />
              </div>
            </div>
            {/* Preview thumbnail if YouTube ID entered */}
            {newVideo.youtubeId && (
              <div className="rounded-lg overflow-hidden border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${newVideo.youtubeId}/hqdefault.jpg`}
                  alt="Thumbnail preview"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-brand-neutral-600">
                <input
                  type="checkbox"
                  checked={newVideo.isNew}
                  onChange={(e) => setNewVideo((p) => ({ ...p, isNew: e.target.checked }))}
                  className="h-4 w-4 rounded border-brand-neutral-300 text-gold-600 focus:ring-gold-500"
                />
                Mark as New
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-neutral-600">
                <input
                  type="checkbox"
                  checked={newVideo.isRecommended}
                  onChange={(e) => setNewVideo((p) => ({ ...p, isRecommended: e.target.checked }))}
                  className="h-4 w-4 rounded border-brand-neutral-300 text-gold-600 focus:ring-gold-500"
                />
                Mark as Recommended
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddVideo}
                disabled={addingVideo || !newVideo.title || !newVideo.youtubeId || !newVideo.duration}
                className="btn-primary text-sm flex-1"
              >
                <span style={{ color: '#FFFFFF' }}>{addingVideo ? 'Adding...' : 'Add Video'}</span>
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn-outline text-sm flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Video Player Modal ──────────────────────────── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setActiveVideo(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X size={20} />
            </button>
            {/* YouTube embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {/* Video info */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[0.7rem] font-semibold text-brand-neutral-500 uppercase tracking-wide">
                  {activeVideo.category}
                </span>
                <span className="text-brand-neutral-300">&middot;</span>
                <span className="flex items-center gap-1 text-[0.7rem] text-brand-neutral-500">
                  <Clock size={10} /> {activeVideo.duration}
                </span>
                {activeVideo.is_new && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    <Sparkles size={9} /> NEW
                  </span>
                )}
                {activeVideo.is_recommended && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                    <Star size={9} /> REC
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-sequoia-900">{activeVideo.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Dialog ──────────────────── */}
      {deletingVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeletingVideoId(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sequoia-900">Delete Video?</h4>
                <p className="text-xs text-brand-neutral-500 mt-0.5">
                  This will permanently remove the video. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteVideo(deletingVideoId)}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingVideoId(null)}
                className="flex-1 btn-outline text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
