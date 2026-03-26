'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, ChevronRight, ChevronDown, Users, UserCheck, UserX, UserPlus, Mail, Phone, ExternalLink, X, Loader2 } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────

interface ConsultantNode {
  id: string
  full_name: string
  email: string
  phone: string | null
  tier: string
  rank: string
  is_active: boolean
  sponsor_id: string | null
  created_at: string
  slug: string | null
  /** Number of direct children (from count query) */
  child_count?: number
}

// ── Display helpers ──────────────────────────────────────────

const ALLEN_WU_ID = '00000000-0000-0000-0000-000000000001'

const tierLabels: Record<string, string> = {
  associate: 'Associate', active: 'Active', senior: 'Senior',
  managing_director: 'MD', executive_director: 'ED',
}
const tierColors: Record<string, string> = {
  associate: 'bg-gray-100 text-gray-600', active: 'bg-blue-100 text-blue-600',
  senior: 'bg-purple-100 text-purple-600',
  managing_director: 'bg-amber-100 text-amber-700', executive_director: 'bg-yellow-100 text-yellow-800',
}
const avatarColors: Record<string, string> = {
  associate: 'bg-gray-200 text-gray-700', active: 'bg-blue-200 text-blue-700',
  senior: 'bg-purple-200 text-purple-700',
  managing_director: 'bg-amber-200 text-amber-800', executive_director: 'bg-yellow-200 text-yellow-800',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function leftBorderClass(c: ConsultantNode) {
  if (c.tier === 'executive_director') return 'border-l-yellow-500'
  if (c.tier === 'managing_director') return 'border-l-amber-400'
  return c.is_active ? 'border-l-green-400' : 'border-l-amber-300'
}

// ── Supabase helpers ─────────────────────────────────────────

const supabase = createClient()

async function fetchDirectChildren(parentId: string): Promise<ConsultantNode[]> {
  const { data } = await supabase
    .from('consultants')
    .select('id, full_name, email, phone, tier, rank, is_active, sponsor_id, created_at, slug')
    .eq('sponsor_id', parentId)
    .order('full_name', { ascending: true })
  return data ?? []
}

async function fetchChildCounts(parentIds: string[]): Promise<Record<string, number>> {
  if (parentIds.length === 0) return {}
  // Count children per sponsor_id
  const { data } = await supabase
    .from('consultants')
    .select('sponsor_id')
    .in('sponsor_id', parentIds)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    if (row.sponsor_id) counts[row.sponsor_id] = (counts[row.sponsor_id] ?? 0) + 1
  }
  return counts
}

async function fetchConsultantById(id: string): Promise<ConsultantNode | null> {
  const { data } = await supabase
    .from('consultants')
    .select('id, full_name, email, phone, tier, rank, is_active, sponsor_id, created_at, slug')
    .eq('id', id)
    .single()
  return data
}

async function fetchOrgStats() {
  const { count: total } = await supabase
    .from('consultants')
    .select('*', { count: 'exact', head: true })
  const { count: active } = await supabase
    .from('consultants')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { count: newThisMonth } = await supabase
    .from('consultants')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())
  return {
    total: total ?? 0,
    active: active ?? 0,
    inactive: (total ?? 0) - (active ?? 0),
    newThisMonth: newThisMonth ?? 0,
  }
}

async function searchConsultants(query: string, tierFilter: string, statusFilter: string): Promise<ConsultantNode[]> {
  let q = supabase
    .from('consultants')
    .select('id, full_name, email, phone, tier, rank, is_active, sponsor_id, created_at, slug')
    .order('full_name', { ascending: true })
    .limit(100)

  if (query) q = q.ilike('full_name', `%${query}%`)
  if (tierFilter !== 'all') q = q.eq('tier', tierFilter)
  if (statusFilter === 'active') q = q.eq('is_active', true)
  else if (statusFilter === 'inactive') q = q.eq('is_active', false)

  const { data } = await q
  return data ?? []
}

// ── TreeNode Component (lazy-loading) ────────────────────────

function TreeNode({
  consultant, level, selectedId, onSelect, onExpand,
  childrenMap, loadingIds,
}: {
  consultant: ConsultantNode
  level: number
  selectedId: string | null
  onSelect: (c: ConsultantNode) => void
  onExpand: (id: string) => void
  childrenMap: Record<string, ConsultantNode[]>
  loadingIds: Set<string>
}) {
  const [expanded, setExpanded] = useState(level < 1)
  const hasKids = (consultant.child_count ?? 0) > 0
  const kids = childrenMap[consultant.id]
  const isLoading = loadingIds.has(consultant.id)
  const isSelected = selectedId === consultant.id
  const border = leftBorderClass(consultant)

  const handleExpand = () => {
    const next = !expanded
    setExpanded(next)
    if (next && hasKids && !kids) {
      onExpand(consultant.id)
    }
  }

  return (
    <div style={{ paddingLeft: level * 24 }}>
      <div
        onClick={() => onSelect(consultant)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border-l-[3px] cursor-pointer transition-all text-sm ${border} ${
          isSelected ? 'bg-gold-50 ring-1 ring-gold-500/40' : 'hover:bg-gray-50'
        }`}
      >
        {/* Expand/collapse */}
        <button
          onClick={e => { e.stopPropagation(); handleExpand() }}
          className={`w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors ${!hasKids ? 'invisible' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[consultant.tier] ?? 'bg-gray-200 text-gray-600'}`}>
          {initials(consultant.full_name)}
        </div>

        {/* Name & info */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-800 truncate block">{consultant.full_name}</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Level {level}</span>
            {consultant.child_count != null && <span>{consultant.child_count} direct</span>}
            <span>{new Date(consultant.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Tier badge */}
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${tierColors[consultant.tier] ?? 'bg-gray-100 text-gray-600'}`}>
          {tierLabels[consultant.tier] ?? consultant.tier}
        </span>

        {/* Active dot */}
        <span className={`w-2 h-2 rounded-full shrink-0 ${consultant.is_active ? 'bg-green-400' : 'bg-amber-300'}`} />
      </div>

      {/* Children (lazy loaded) */}
      {expanded && kids && (
        <div>
          {kids.map(kid => (
            <TreeNode
              key={kid.id}
              consultant={kid}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onExpand={onExpand}
              childrenMap={childrenMap}
              loadingIds={loadingIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detail Sidebar ──────────────────────────────────────────

function DetailSidebar({ consultant, onClose }: {
  consultant: ConsultantNode
  onClose: () => void
}) {
  const [sponsor, setSponsor] = useState<ConsultantNode | null>(null)
  const [teamStats, setTeamStats] = useState<{ total: number; active: number } | null>(null)
  const [directCount, setDirectCount] = useState<number>(0)

  useEffect(() => {
    let cancelled = false
    // Fetch sponsor name
    if (consultant.sponsor_id) {
      fetchConsultantById(consultant.sponsor_id).then(s => { if (!cancelled) setSponsor(s) })
    } else {
      setSponsor(null)
    }
    // Fetch team stats via RPC
    supabase.rpc('get_team_stats', { p_consultant_id: consultant.id }).then(({ data }) => {
      if (!cancelled && data?.[0]) {
        setTeamStats({ total: data[0].total_team, active: data[0].active_team })
      }
    })
    // Fetch direct child count
    supabase
      .from('consultants')
      .select('*', { count: 'exact', head: true })
      .eq('sponsor_id', consultant.id)
      .then(({ count }) => { if (!cancelled) setDirectCount(count ?? 0) })

    return () => { cancelled = true }
  }, [consultant.id, consultant.sponsor_id])

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${avatarColors[consultant.tier] ?? 'bg-gray-200 text-gray-600'}`}>
            {initials(consultant.full_name)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{consultant.full_name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[consultant.tier] ?? 'bg-gray-100 text-gray-600'}`}>
              {tierLabels[consultant.tier] ?? consultant.tier}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4 text-gray-400" /> {consultant.email}
        </div>
        {consultant.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" /> {consultant.phone}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Sponsor</span>
          <span className="font-medium text-gray-700">{sponsor?.full_name ?? 'None (Root)'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Personal Recruits</span>
          <span className="font-semibold text-gray-800">{directCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Team Size</span>
          <span className="font-semibold text-gray-800">{teamStats?.total ?? '...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Active in Team</span>
          <span className="font-semibold text-green-600">{teamStats?.active ?? '...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Joined</span>
          <span className="font-medium text-gray-700">
            {new Date(consultant.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className={`font-medium ${consultant.is_active ? 'text-green-600' : 'text-amber-600'}`}>
            {consultant.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4 flex flex-col gap-2">
        <Link href={`/admin/deals?consultant=${consultant.id}`} className="flex items-center gap-2 text-sm font-medium text-sequoia-700 hover:text-sequoia-900 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> View Deals
        </Link>
        <Link href={`/admin/commissions?consultant=${consultant.id}`} className="flex items-center gap-2 text-sm font-medium text-sequoia-700 hover:text-sequoia-900 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> View Commissions
        </Link>
      </div>
    </div>
  )
}

// ── Search Results (flat list) ──────────────────────────────

function SearchResults({
  results, selectedId, onSelect,
}: {
  results: ConsultantNode[]
  selectedId: string | null
  onSelect: (c: ConsultantNode) => void
}) {
  return (
    <div className="space-y-1">
      {results.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No consultants match your search.</p>
      )}
      {results.map(c => (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg border-l-[3px] cursor-pointer transition-all text-sm ${leftBorderClass(c)} ${
            selectedId === c.id ? 'bg-gold-50 ring-1 ring-gold-500/40' : 'hover:bg-gray-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[c.tier] ?? 'bg-gray-200 text-gray-600'}`}>
            {initials(c.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-gray-800 truncate block">{c.full_name}</span>
            <span className="text-[11px] text-gray-400">{c.email}</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${tierColors[c.tier] ?? 'bg-gray-100 text-gray-600'}`}>
            {tierLabels[c.tier] ?? c.tier}
          </span>
          <span className={`w-2 h-2 rounded-full shrink-0 ${c.is_active ? 'bg-green-400' : 'bg-amber-300'}`} />
        </div>
      ))}
    </div>
  )
}

// ── Page Component ──────────────────────────────────────────

export default function AdminGenealogyPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantNode | null>(null)

  // Tree state
  const [root, setRoot] = useState<ConsultantNode | null>(null)
  const [childrenMap, setChildrenMap] = useState<Record<string, ConsultantNode[]>>({})
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [pageLoading, setPageLoading] = useState(true)

  // Stats
  const [orgStats, setOrgStats] = useState({ total: 0, active: 0, inactive: 0, newThisMonth: 0 })

  // Search results (when filters are active)
  const [searchResults, setSearchResults] = useState<ConsultantNode[] | null>(null)
  const [searching, setSearching] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isFiltering = search.length > 0 || tierFilter !== 'all' || statusFilter !== 'all'

  useEffect(() => { document.title = 'Genealogy | Sequoia Admin' }, [])

  // Initial load: root + direct children + stats
  useEffect(() => {
    let cancelled = false
    async function load() {
      const [rootData, stats] = await Promise.all([
        fetchConsultantById(ALLEN_WU_ID),
        fetchOrgStats(),
      ])
      if (cancelled) return
      if (!rootData) { setPageLoading(false); return }

      // Fetch Allen's direct children
      const children = await fetchDirectChildren(rootData.id)
      if (cancelled) return

      // Get child counts for those children
      const counts = await fetchChildCounts(children.map(c => c.id))
      if (cancelled) return
      const childrenWithCounts = children.map(c => ({ ...c, child_count: counts[c.id] ?? 0 }))

      // Count Allen's children
      rootData.child_count = children.length

      setRoot(rootData)
      setChildrenMap({ [rootData.id]: childrenWithCounts })
      setOrgStats(stats)
      setPageLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Lazy-load children when a node is expanded
  const handleExpand = useCallback(async (parentId: string) => {
    setLoadingIds(prev => new Set(prev).add(parentId))
    const children = await fetchDirectChildren(parentId)
    const counts = await fetchChildCounts(children.map(c => c.id))
    const childrenWithCounts = children.map(c => ({ ...c, child_count: counts[c.id] ?? 0 }))
    setChildrenMap(prev => ({ ...prev, [parentId]: childrenWithCounts }))
    setLoadingIds(prev => { const next = new Set(prev); next.delete(parentId); return next })
  }, [])

  // Debounced search
  useEffect(() => {
    if (!isFiltering) {
      setSearchResults(null)
      return
    }
    setSearching(true)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(async () => {
      const results = await searchConsultants(search, tierFilter, statusFilter)
      setSearchResults(results)
      setSearching(false)
    }, 300)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [search, tierFilter, statusFilter, isFiltering])

  const stats = [
    { label: 'Total Consultants', value: orgStats.total, icon: Users, color: 'text-sequoia-700' },
    { label: 'Active', value: orgStats.active, icon: UserCheck, color: 'text-green-600' },
    { label: 'Inactive', value: orgStats.inactive, icon: UserX, color: 'text-amber-600' },
    { label: 'New This Month', value: orgStats.newThisMonth, icon: UserPlus, color: 'text-blue-600' },
  ]

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-sequoia-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <button
            key={s.label}
            onClick={() => {
              if (s.label === 'Active') setStatusFilter(prev => prev === 'active' ? 'all' : 'active')
              else if (s.label === 'Inactive') setStatusFilter(prev => prev === 'inactive' ? 'all' : 'inactive')
              else setStatusFilter('all')
            }}
            className={`rounded-xl border bg-white p-5 text-left transition-all hover:shadow-md cursor-pointer ${
              (s.label === 'Active' && statusFilter === 'active') || (s.label === 'Inactive' && statusFilter === 'inactive')
                ? 'border-sequoia-400 shadow-sm' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-50 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
          />
        </div>
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-gold-500 outline-none"
        >
          <option value="all">All Tiers</option>
          <option value="associate">Associate</option>
          <option value="active">Active</option>
          <option value="senior">Senior</option>
          <option value="managing_director">MD</option>
          <option value="executive_director">ED</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-gold-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Main content: tree + sidebar */}
      <div className="flex gap-6">
        {/* Tree view / search results */}
        <div className={`flex-1 min-w-0 rounded-xl border border-neutral-200 bg-white p-4 overflow-auto max-h-[calc(100vh-340px)] ${selectedConsultant ? 'lg:w-[60%]' : 'w-full'}`}>
          {isFiltering ? (
            searching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <SearchResults
                results={searchResults ?? []}
                selectedId={selectedConsultant?.id ?? null}
                onSelect={setSelectedConsultant}
              />
            )
          ) : root ? (
            <TreeNode
              consultant={root}
              level={0}
              selectedId={selectedConsultant?.id ?? null}
              onSelect={setSelectedConsultant}
              onExpand={handleExpand}
              childrenMap={childrenMap}
              loadingIds={loadingIds}
            />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No root consultant found.</p>
          )}
        </div>

        {/* Detail sidebar */}
        {selectedConsultant && (
          <div className="hidden lg:block w-[40%] shrink-0 sticky top-0">
            <DetailSidebar
              consultant={selectedConsultant}
              onClose={() => setSelectedConsultant(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
