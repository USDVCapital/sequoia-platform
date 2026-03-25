'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, ChevronDown, Users, UserCheck, UserX, UserPlus, Mail, Phone, ExternalLink, X } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────

interface Consultant {
  id: string
  name: string
  rank: string
  sponsorId: string | null
  isActive: boolean
  email: string
  phone: string
  joinedDate: string
  slug: string
}

// ── Mock Data Generation (100 consultants, 6 levels) ────────

const ranks = ['lc_1', 'lc_2', 'lc_3', 'senior_lc', 'managing_director', 'executive_director'] as const
const rankLabels: Record<string, string> = {
  lc_1: 'LC 1', lc_2: 'LC 2', lc_3: 'LC 3', senior_lc: 'Senior LC',
  managing_director: 'MD', executive_director: 'ED',
}
const rankColors: Record<string, string> = {
  lc_1: 'bg-gray-100 text-gray-600', lc_2: 'bg-blue-100 text-blue-600',
  lc_3: 'bg-indigo-100 text-indigo-600', senior_lc: 'bg-purple-100 text-purple-600',
  managing_director: 'bg-amber-100 text-amber-700', executive_director: 'bg-yellow-100 text-yellow-800',
}
const avatarColors: Record<string, string> = {
  lc_1: 'bg-gray-200 text-gray-700', lc_2: 'bg-blue-200 text-blue-700',
  lc_3: 'bg-indigo-200 text-indigo-700', senior_lc: 'bg-purple-200 text-purple-700',
  managing_director: 'bg-amber-200 text-amber-800', executive_director: 'bg-yellow-200 text-yellow-800',
}
const borderColors: Record<string, string> = {
  executive_director: 'border-l-yellow-500', managing_director: 'border-l-amber-400',
  active: 'border-l-green-400', inactive: 'border-l-amber-300',
}

const firstNames = ['Marcus','Priya','Jordan','Sarah','David','Emily','Carlos','Keiko','Aisha','Liam','Mei','Omar','Zara','Ethan','Nina','Alex','Fatima','Raj','Chloe','Derek','Sofia','Tyler','Nadia','James','Luna','Hassan','Vera','Leo','Jasmine','Noah','Amara','Isaac','Hana','Cole','Layla','Xavier','Mia','Soren','Yuki','Dante','Elena','Kai','Brenna','Felix','Indira','Theo','Carmen','Arjun','Kira','Wesley']
const lastNames = ['Rivera','Nair','Blake','Chen','Kim','Okafor','Morales','Tanaka','Patel','Sullivan','Wong','Hassan','Andersen','Cooper','Nakamura','Diaz','Gupta','Monroe','Sato','Ellis','Vasquez','Shah','Brooks','Yamamoto','Foster','Ortiz','Kapoor','Hayes','Li','Bennett','Park','Ahmad','Torres','Singh','Murphy','Huang','Cole','Sharma','Cruz','Davis']

function makeName(i: number): string {
  return `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`
}

function makeDate(monthsAgo: number): string {
  const d = new Date(2026, 2, 24)
  d.setMonth(d.getMonth() - monthsAgo)
  d.setDate(1 + Math.floor(Math.random() * 27))
  return d.toISOString().split('T')[0]
}

// Build 100 consultants across levels
const consultantData: Consultant[] = (() => {
  const out: Consultant[] = []
  let idx = 0

  // L0: root
  out.push({ id: 'c-0', name: 'Allen Wu', rank: 'executive_director', sponsorId: null, isActive: true, email: 'allen@sequoia-es.com', phone: '(555) 100-0000', joinedDate: '2023-01-15', slug: 'allen-wu' })
  idx++

  // L1: 5 directs under root
  const l1Ranks = ['managing_director', 'senior_lc', 'senior_lc', 'lc_3', 'lc_3']
  for (let i = 0; i < 5; i++) {
    out.push({ id: `c-${idx}`, name: makeName(idx), rank: l1Ranks[i], sponsorId: 'c-0', isActive: true, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 1${String(i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(20 + i), slug: makeName(idx).toLowerCase().replace(' ', '-') })
    idx++
  }

  // L2: ~18 under L1 members
  const l1Ids = out.filter(c => c.sponsorId === 'c-0').map(c => c.id)
  const l2Counts = [5, 4, 4, 3, 2]
  const l2Ranks = ['lc_3', 'lc_2', 'lc_2', 'lc_1', 'senior_lc', 'lc_3', 'lc_2', 'lc_1', 'lc_2', 'lc_3', 'lc_1', 'lc_2', 'lc_1', 'lc_1', 'lc_2', 'lc_3', 'lc_1', 'lc_2']
  let l2i = 0
  for (let p = 0; p < l1Ids.length; p++) {
    for (let j = 0; j < l2Counts[p]; j++) {
      const active = Math.random() > 0.25
      out.push({ id: `c-${idx}`, name: makeName(idx), rank: l2Ranks[l2i] || 'lc_1', sponsorId: l1Ids[p], isActive: active, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 2${String(l2i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(12 + l2i), slug: makeName(idx).toLowerCase().replace(' ', '-') })
      idx++; l2i++
    }
  }

  // L3: ~35 under L2 members
  const l2Ids = out.filter(c => c.sponsorId && l1Ids.includes(c.sponsorId)).map(c => c.id)
  for (let i = 0; i < 35; i++) {
    const sponsor = l2Ids[i % l2Ids.length]
    const active = Math.random() > 0.4
    out.push({ id: `c-${idx}`, name: makeName(idx), rank: ranks[Math.min(i % 4, 3)], sponsorId: sponsor, isActive: active, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 3${String(i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(6 + (i % 10)), slug: makeName(idx).toLowerCase().replace(' ', '-') })
    idx++
  }

  // L4: ~25 under L3 members
  const l3Ids = out.slice(out.length - 35).map(c => c.id)
  for (let i = 0; i < 25; i++) {
    const sponsor = l3Ids[i % l3Ids.length]
    const active = Math.random() > 0.5
    out.push({ id: `c-${idx}`, name: makeName(idx), rank: ranks[i % 3], sponsorId: sponsor, isActive: active, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 4${String(i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(3 + (i % 5)), slug: makeName(idx).toLowerCase().replace(' ', '-') })
    idx++
  }

  // L5: ~12 under L4 members
  const l4Ids = out.slice(out.length - 25).map(c => c.id)
  for (let i = 0; i < 12; i++) {
    const sponsor = l4Ids[i % l4Ids.length]
    const active = Math.random() > 0.5
    out.push({ id: `c-${idx}`, name: makeName(idx), rank: ranks[i % 2], sponsorId: sponsor, isActive: active, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 5${String(i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(1 + (i % 3)), slug: makeName(idx).toLowerCase().replace(' ', '-') })
    idx++
  }

  // L6: 5 under L5 members
  const l5Ids = out.slice(out.length - 12).map(c => c.id)
  for (let i = 0; i < 5; i++) {
    const sponsor = l5Ids[i % l5Ids.length]
    out.push({ id: `c-${idx}`, name: makeName(idx), rank: 'lc_1', sponsorId: sponsor, isActive: Math.random() > 0.5, email: `${makeName(idx).toLowerCase().replace(' ', '.')}@email.com`, phone: `(555) 6${String(i).padStart(2, '0')}-${String(1000 + idx).slice(1)}`, joinedDate: makeDate(i), slug: makeName(idx).toLowerCase().replace(' ', '-') })
    idx++
  }

  return out
})()

// ── Helper: build tree map ──────────────────────────────────

function buildChildrenMap(consultants: Consultant[]) {
  const map: Record<string, string[]> = {}
  for (const c of consultants) {
    if (c.sponsorId) {
      if (!map[c.sponsorId]) map[c.sponsorId] = []
      map[c.sponsorId].push(c.id)
    }
  }
  return map
}

function getTeamSize(id: string, childrenMap: Record<string, string[]>): number {
  const kids = childrenMap[id] ?? []
  return kids.length + kids.reduce((sum, kid) => sum + getTeamSize(kid, childrenMap), 0)
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ── TreeNode Component ──────────────────────────────────────

function TreeNode({
  consultant, level, childrenMap, consultantMap, selectedId, onSelect, searchMatch,
}: {
  consultant: Consultant; level: number; childrenMap: Record<string, string[]>
  consultantMap: Record<string, Consultant>; selectedId: string | null
  onSelect: (id: string) => void; searchMatch: Set<string>
}) {
  const [expanded, setExpanded] = useState(level < 1)
  const kids = childrenMap[consultant.id] ?? []
  const hasKids = kids.length > 0
  const isSelected = selectedId === consultant.id
  const isMatch = searchMatch.size === 0 || searchMatch.has(consultant.id)

  const leftBorder = consultant.rank === 'executive_director'
    ? 'border-l-yellow-500'
    : consultant.rank === 'managing_director'
      ? 'border-l-amber-400'
      : consultant.isActive ? 'border-l-green-400' : 'border-l-amber-300'

  if (!isMatch && searchMatch.size > 0) return null

  return (
    <div style={{ paddingLeft: level * 24 }}>
      <div
        onClick={() => onSelect(consultant.id)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border-l-[3px] cursor-pointer transition-all text-sm ${leftBorder} ${
          isSelected ? 'bg-gold-50 ring-1 ring-gold-500/40' : 'hover:bg-gray-50'
        }`}
      >
        {/* Expand/collapse */}
        <button
          onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
          className={`w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors ${!hasKids ? 'invisible' : ''}`}
        >
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[consultant.rank] ?? 'bg-gray-200 text-gray-600'}`}>
          {initials(consultant.name)}
        </div>

        {/* Name & info */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-800 truncate block">{consultant.name}</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Level {level}</span>
            <span>{new Date(consultant.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Rank badge */}
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${rankColors[consultant.rank] ?? 'bg-gray-100 text-gray-600'}`}>
          {rankLabels[consultant.rank] ?? consultant.rank}
        </span>

        {/* Active dot */}
        <span className={`w-2 h-2 rounded-full shrink-0 ${consultant.isActive ? 'bg-green-400' : 'bg-amber-300'}`} />
      </div>

      {/* Children */}
      {expanded && hasKids && (
        <div>
          {kids.map(kidId => {
            const kid = consultantMap[kidId]
            if (!kid) return null
            return (
              <TreeNode
                key={kid.id} consultant={kid} level={level + 1}
                childrenMap={childrenMap} consultantMap={consultantMap}
                selectedId={selectedId} onSelect={onSelect} searchMatch={searchMatch}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Detail Sidebar ──────────────────────────────────────────

function DetailSidebar({ consultant, consultantMap, childrenMap, onClose }: {
  consultant: Consultant; consultantMap: Record<string, Consultant>
  childrenMap: Record<string, string[]>; onClose: () => void
}) {
  const sponsor = consultant.sponsorId ? consultantMap[consultant.sponsorId] : null
  const directRecruits = (childrenMap[consultant.id] ?? []).length
  const totalTeam = getTeamSize(consultant.id, childrenMap)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${avatarColors[consultant.rank] ?? 'bg-gray-200 text-gray-600'}`}>
            {initials(consultant.name)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{consultant.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rankColors[consultant.rank] ?? 'bg-gray-100 text-gray-600'}`}>
              {rankLabels[consultant.rank] ?? consultant.rank}
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
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4 text-gray-400" /> {consultant.phone}
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Sponsor</span>
          <span className="font-medium text-gray-700">{sponsor?.name ?? 'None (Root)'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Personal Recruits</span>
          <span className="font-semibold text-gray-800">{directRecruits}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Team Size</span>
          <span className="font-semibold text-gray-800">{totalTeam}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Joined</span>
          <span className="font-medium text-gray-700">{new Date(consultant.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className={`font-medium ${consultant.isActive ? 'text-green-600' : 'text-amber-600'}`}>
            {consultant.isActive ? 'Active' : 'Inactive'}
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

// ── Page Component ──────────────────────────────────────────

export default function AdminGenealogyPage() {
  const [search, setSearch] = useState('')
  const [rankFilter, setRankFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => { document.title = 'Genealogy | Sequoia Admin' }, [])

  const consultantMap = useMemo(() => {
    const m: Record<string, Consultant> = {}
    for (const c of consultantData) m[c.id] = c
    return m
  }, [])

  const childrenMap = useMemo(() => buildChildrenMap(consultantData), [])

  const root = consultantData.find(c => c.sponsorId === null)!

  // Filter logic: collect IDs that match
  const searchMatch = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    const matched = consultantData.filter(c => {
      if (search && !c.name.toLowerCase().includes(lowerSearch)) return false
      if (rankFilter !== 'all' && c.rank !== rankFilter) return false
      if (statusFilter === 'active' && !c.isActive) return false
      if (statusFilter === 'inactive' && c.isActive) return false
      return true
    })
    // If no filters active, return empty set (show all)
    if (!search && rankFilter === 'all' && statusFilter === 'all') return new Set<string>()
    // Include ancestors so tree remains visible
    const ids = new Set(matched.map(c => c.id))
    for (const c of matched) {
      let current: Consultant | undefined = c
      while (current?.sponsorId) {
        ids.add(current.sponsorId)
        current = consultantMap[current.sponsorId]
      }
    }
    return ids
  }, [search, rankFilter, statusFilter, consultantMap])

  const selectedConsultant = selectedId ? consultantMap[selectedId] : null

  const activeCount = consultantData.filter(c => c.isActive).length
  const inactiveCount = consultantData.length - activeCount
  const newThisMonth = 7

  const stats = [
    { label: 'Total Consultants', value: consultantData.length, icon: Users, color: 'text-sequoia-700' },
    { label: 'Active', value: activeCount, icon: UserCheck, color: 'text-green-600' },
    { label: 'Inactive', value: inactiveCount, icon: UserX, color: 'text-amber-600' },
    { label: 'New This Month', value: newThisMonth, icon: UserPlus, color: 'text-blue-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <button
            key={s.label}
            onClick={() => {
              if (s.label === 'Active') setStatusFilter('active')
              else if (s.label === 'Inactive') setStatusFilter('inactive')
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
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
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
          value={rankFilter}
          onChange={e => setRankFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-gold-500 outline-none"
        >
          <option value="all">All Ranks</option>
          <option value="lc_1">LC 1</option>
          <option value="lc_2">LC 2</option>
          <option value="lc_3">LC 3</option>
          <option value="senior_lc">Senior LC</option>
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
        {/* Tree view */}
        <div className={`flex-1 min-w-0 rounded-xl border border-neutral-200 bg-white p-4 overflow-auto max-h-[calc(100vh-340px)] ${selectedConsultant ? 'lg:w-[60%]' : 'w-full'}`}>
          <TreeNode
            consultant={root}
            level={0}
            childrenMap={childrenMap}
            consultantMap={consultantMap}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchMatch={searchMatch}
          />
        </div>

        {/* Detail sidebar */}
        {selectedConsultant && (
          <div className="hidden lg:block w-[40%] shrink-0 sticky top-0">
            <DetailSidebar
              consultant={selectedConsultant}
              consultantMap={consultantMap}
              childrenMap={childrenMap}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
