'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TrainingVideo, Material } from '@/lib/supabase/types'
import { Film, FolderOpen, Plus, Star, Sparkles, Clock } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminContentPage() {
  const [tab, setTab] = useState<'videos' | 'materials'>('videos')
  const [videos, setVideos] = useState<TrainingVideo[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  // Add video form state
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-sequoia rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Content</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Manage training videos and marketing materials</p>
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

      {/* Training Videos */}
      {tab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-sequoia-900">
              Training Videos ({videos.length})
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-gold text-sm py-1.5 px-4"
            >
              <Plus size={16} /> Add Video
            </button>
          </div>

          {/* Add Video Form */}
          {showAddForm && (
            <div className="card-sequoia p-5">
              <h4 className="text-sm font-bold text-sequoia-900 mb-3">New Training Video</h4>
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
              <div className="flex flex-wrap items-center gap-4 mt-3">
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
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddVideo}
                  disabled={addingVideo || !newVideo.title || !newVideo.youtubeId || !newVideo.duration}
                  className="btn-primary text-sm"
                >
                  <span style={{ color: '#FFFFFF' }}>{addingVideo ? 'Adding...' : 'Add Video'}</span>
                </button>
                <button onClick={() => setShowAddForm(false)} className="btn-outline text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Videos List */}
          <div className="space-y-2">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-sequoia p-4 flex items-center gap-4 hover:shadow-md hover:border-sequoia-300 transition-all cursor-pointer block"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 shrink-0">
                  <Film size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-sequoia-900 truncate">{video.title}</p>
                    {video.is_new && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        <Sparkles size={10} /> NEW
                      </span>
                    )}
                    {video.is_recommended && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                        <Star size={10} /> REC
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-neutral-500">
                    {video.category} &middot; <Clock size={10} className="inline" /> {video.duration} &middot; ID: {video.youtube_id}
                  </p>
                </div>
              </a>
            ))}
            {videos.length === 0 && (
              <p className="text-sm text-brand-neutral-400 text-center py-8">No training videos yet</p>
            )}
          </div>
        </div>
      )}

      {/* Materials */}
      {tab === 'materials' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-sequoia-900">
            Materials ({materials.length})
          </h3>
          <div className="space-y-2">
            {materials.map((material) => (
              <a
                key={material.id}
                href={material.filename || '#'}
                target={material.filename ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`card-sequoia p-4 flex items-center gap-4 block transition-all ${material.filename && !material.is_coming_soon ? 'hover:shadow-md hover:border-sequoia-300 cursor-pointer' : 'opacity-75'}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-neutral-100 text-brand-neutral-600 shrink-0">
                  <FolderOpen size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-sequoia-900 truncate">{material.title}</p>
                    {material.is_coming_soon && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-brand-neutral-100 text-brand-neutral-500 border border-brand-neutral-200">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-neutral-500">
                    {material.category}
                    {material.filename && <> &middot; {material.filename}</>}
                  </p>
                </div>
              </a>
            ))}
            {materials.length === 0 && (
              <p className="text-sm text-brand-neutral-400 text-center py-8">No materials yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
