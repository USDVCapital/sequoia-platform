'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  CheckCircle,
  UserPlus,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Search,
  Phone,
  Mail,
  List,
  GitBranch,
  X,
} from 'lucide-react'

/* ─── Types ─── */
interface TeamMember {
  id: string
  name: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  status: 'active' | 'inactive' | 'new' | 'at-risk'
  rank: string
  enrolledDate: string
  lastActiveDate: string
  phone: string
  email: string
  sponsorId: string | null
  personalRecruits: number
  teamSize: number
  incomeStreams: string[]
}

/* ─── Mock data generation ─── */
const names = [
  'Marcus Chen','Sophia Rivera','James Okafor','Priya Patel','Liam Brennan',
  'Amara Johnson','Ethan Kowalski','Isabella Torres','Noah Washington','Olivia Kim',
  'Aiden Nakamura','Mia Gupta','Lucas Fernandez','Emma Johansson','Mason Dubois',
  'Ava Singh','Logan Mitchell','Charlotte Wu','Jackson Brooks','Harper Moreau',
  'Elijah Tanaka','Abigail Reeves','Benjamin Osei','Emily Larsson','Alexander Diaz',
  'Scarlett Nkomo','Daniel Petrov','Grace Hwang','Sebastian Flores','Chloe Andersen',
  'Henry Okonkwo','Aria Bergström','Owen Castillo','Lily Bianchi','Samuel Achebe',
  'Zoe Lefèvre','Gabriel Santos','Penelope Voss','Matthew Adebayo','Layla Johansen',
  'Jack Ramirez','Nora Chandra','Ryan Ito','Hannah Müller','Dylan Afolabi',
  'Victoria Strand','Caleb Jimenez',
]

const ranks = ['Associate', 'Builder', 'Senior Builder', 'Director', 'Senior Director', 'Executive']
const streams = ['Retail', 'Override', 'Leadership', 'Bonus Pool', 'Lifestyle']
const phones = (i: number) => `(${200 + i}) 555-${String(1000 + i).slice(-4)}`
const emails = (n: string) => `${n.toLowerCase().replace(/\s/g, '.')}@email.com`

type StatusKey = 'active' | 'inactive' | 'new' | 'at-risk'

const levelConfig: { level: 1|2|3|4|5|6; statuses: StatusKey[] }[] = [
  { level: 1, statuses: ['active','active','active','inactive','inactive','inactive','new','at-risk'] },
  { level: 2, statuses: ['active','active','active','active','inactive','inactive','inactive','inactive','inactive','inactive','inactive','new','new','at-risk'] },
  { level: 3, statuses: ['active','active','active','inactive','inactive','inactive','inactive','inactive','inactive','new','at-risk','at-risk'] },
  { level: 4, statuses: ['active','inactive','inactive','inactive','inactive','inactive','at-risk','at-risk'] },
  { level: 5, statuses: ['active','inactive','inactive'] },
  { level: 6, statuses: ['inactive','inactive'] },
]

function buildMembers(): TeamMember[] {
  const members: TeamMember[] = []
  let idx = 0
  const idsByLevel: Record<number, string[]> = {}

  for (const { level, statuses } of levelConfig) {
    idsByLevel[level] = []
    const parentIds = level === 1 ? ['root'] : idsByLevel[level - 1]
    statuses.forEach((status, si) => {
      const id = `TM-${String(idx + 1).padStart(3, '0')}`
      idsByLevel[level].push(id)
      const sponsorId = level === 1 ? 'root' : parentIds[si % parentIds.length]
      members.push({
        id,
        name: names[idx],
        level,
        status,
        rank: ranks[Math.min(level - 1, ranks.length - 1)],
        enrolledDate: `2024-${String((idx % 12) + 1).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')}`,
        lastActiveDate: status === 'inactive' ? '2025-11-15' : status === 'at-risk' ? '2026-01-10' : '2026-03-20',
        phone: phones(idx),
        email: emails(names[idx]),
        sponsorId,
        personalRecruits: Math.max(0, 8 - level * 2 + (si % 3)),
        teamSize: Math.max(0, 20 - level * 4 + (si % 5)),
        incomeStreams: streams.slice(0, Math.max(1, 4 - level + (si % 2))),
      })
      idx++
    })
  }
  return members
}

const allMembers = buildMembers()

/* ─── Status helpers ─── */
const statusColor: Record<StatusKey, { border: string; bg: string; text: string; dot: string }> = {
  active:   { border: 'border-l-green-500',  bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  inactive: { border: 'border-l-amber-400',  bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  'at-risk':{ border: 'border-l-red-500',    bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  new:      { border: 'border-l-blue-500',   bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
}

const avatarBg: Record<StatusKey, string> = {
  active: 'bg-green-600', inactive: 'bg-amber-500', 'at-risk': 'bg-red-600', new: 'bg-blue-600',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

/* ─── Tree Node ─── */
function TreeNode({ member, members, depth, onSelect, selectedId, expandedIds, toggleExpand, filter }: {
  member: TeamMember; members: TeamMember[]; depth: number; onSelect: (m: TeamMember) => void
  selectedId: string | null; expandedIds: Set<string>; toggleExpand: (id: string) => void; filter: string
}) {
  const children = members.filter(m => m.sponsorId === member.id)
  const hasChildren = children.length > 0
  const expanded = expandedIds.has(member.id)
  const sc = statusColor[member.status]

  return (
    <div style={{ paddingLeft: depth * 24 }}>
      <div
        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border-l-4 ${sc.border} ${
          selectedId === member.id ? 'bg-neutral-100 ring-1 ring-[#C8A84E]' : 'hover:bg-neutral-50'
        }`}
        onClick={() => onSelect(member)}
      >
        {hasChildren ? (
          <button onClick={e => { e.stopPropagation(); toggleExpand(member.id) }} className="p-0.5 hover:bg-neutral-200 rounded">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : <span className="w-5" />}
        <div className={`w-8 h-8 rounded-full ${avatarBg[member.status]} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
          {initials(member.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-neutral-900 truncate">{member.name}</span>
            <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded">{member.rank}</span>
            <span className="text-[10px] text-neutral-400">L{member.level}</span>
          </div>
          <span className="text-[11px] text-neutral-400">Joined {member.enrolledDate}</span>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} shrink-0`}>
          {member.status}
        </span>
      </div>
      {expanded && hasChildren && (
        <div>
          {children
            .filter(c => !filter || c.name.toLowerCase().includes(filter) || c.id.toLowerCase().includes(filter))
            .map(c => (
              <TreeNode key={c.id} member={c} members={members} depth={depth + 1}
                onSelect={onSelect} selectedId={selectedId} expandedIds={expandedIds}
                toggleExpand={toggleExpand} filter={filter} />
            ))}
        </div>
      )}
    </div>
  )
}

/* ─── Detail Panel ─── */
function DetailPanel({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const sc = statusColor[member.status]
  const contribution = (member.teamSize * 12.5 + member.personalRecruits * 25).toFixed(2)
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${avatarBg[member.status]} flex items-center justify-center text-white font-bold text-lg`}>
            {initials(member.name)}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{member.name}</h3>
            <p className="text-xs text-neutral-500">{member.rank} &middot; {member.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded lg:hidden"><X size={18} /></button>
      </div>
      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
      </span>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-neutral-400 text-xs">Enrolled</p><p className="font-medium">{member.enrolledDate}</p></div>
        <div><p className="text-neutral-400 text-xs">Last Active</p><p className="font-medium">{member.lastActiveDate}</p></div>
      </div>
      <div className="space-y-2">
        <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-[#C8A84E] hover:underline">
          <Phone size={14} /> {member.phone}
        </a>
        <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-[#C8A84E] hover:underline">
          <Mail size={14} /> {member.email}
        </a>
      </div>
      <div>
        <p className="text-xs text-neutral-400 mb-1.5">Income Streams</p>
        <div className="flex flex-wrap gap-1.5">
          {member.incomeStreams.map(s => (
            <span key={s} className="text-[11px] font-medium bg-[#C8A84E]/10 text-[#C8A84E] px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-neutral-400 text-xs">Personal Recruits</p><p className="font-bold text-lg">{member.personalRecruits}</p></div>
        <div><p className="text-neutral-400 text-xs">Team Size</p><p className="font-bold text-lg">{member.teamSize}</p></div>
      </div>
      <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
        <strong>Commission contribution:</strong> This member&apos;s team has contributed <span className="font-bold text-[#C8A84E]">${contribution}</span> to your overrides this month.
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function TeamPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StatusKey>('all')
  const [view, setView] = useState<'tree' | 'list'>('tree')
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(allMembers.filter(m => m.level <= 2).map(m => m.id)))

  useEffect(() => { document.title = 'Team | Sequoia Enterprise Solutions' }, [])

  const q = search.toLowerCase()
  const filtered = useMemo(() =>
    allMembers.filter(m =>
      (statusFilter === 'all' || m.status === statusFilter) &&
      (!q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
    ), [statusFilter, q])

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const roots = filtered.filter(m => m.sponsorId === 'root')

  const stats = [
    { label: 'Total Team', value: 47, icon: Users, color: 'text-sequoia-900' },
    { label: 'Active Members', value: allMembers.filter(m => m.status === 'active').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'New This Month', value: allMembers.filter(m => m.status === 'new').length, icon: UserPlus, color: 'text-blue-600' },
    { label: 'At Risk (60+ days)', value: allMembers.filter(m => m.status === 'at-risk').length, icon: AlertTriangle, color: 'text-red-600' },
  ]

  const pills: { label: string; value: 'all' | StatusKey }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'New', value: 'new' },
    { label: 'At Risk', value: 'at-risk' },
  ]

  return (
    <div className="min-h-screen bg-brand-neutral-50 p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sequoia-900">My Team</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-neutral-100 ${s.color}`}><s.icon size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A84E]/40"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {pills.map(p => (
            <button
              key={p.value}
              onClick={() => setStatusFilter(p.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                statusFilter === p.value
                  ? 'bg-sequoia-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >{p.label}</button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView('tree')}
            className={`p-2 rounded-lg ${view === 'tree' ? 'bg-sequoia-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}>
            <GitBranch size={16} />
          </button>
          <button onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view === 'list' ? 'bg-sequoia-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Mobile detail */}
      {selected && (
        <div className="lg:hidden">
          <DetailPanel member={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* Content area */}
      <div className="flex gap-6">
        {/* Tree / List */}
        <div className={`${selected ? 'lg:w-[60%]' : 'w-full'} min-w-0`}>
          {view === 'tree' ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-1">
              {roots.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">No members match your filters.</p>}
              {roots.map(m => (
                <TreeNode key={m.id} member={m} members={filtered} depth={0}
                  onSelect={setSelected} selectedId={selected?.id ?? null}
                  expandedIds={expandedIds} toggleExpand={toggleExpand} filter={q} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                    {['Level','Name','Status','Enrolled','Last Active','Recruits','Team Size','Streams'].map(h => (
                      <th key={h} className="px-4 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-neutral-400">No members match your filters.</td></tr>
                  )}
                  {filtered.map(m => {
                    const sc = statusColor[m.status]
                    return (
                      <tr key={m.id}
                        onClick={() => setSelected(m)}
                        className={`border-b border-neutral-50 cursor-pointer ${
                          selected?.id === m.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        }`}>
                        <td className="px-4 py-2.5 font-medium">{m.level}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${avatarBg[m.status]} flex items-center justify-center text-white text-[10px] font-semibold`}>
                              {initials(m.name)}
                            </div>
                            {m.name}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{m.status}</span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-500">{m.enrolledDate}</td>
                        <td className="px-4 py-2.5 text-neutral-500">{m.lastActiveDate}</td>
                        <td className="px-4 py-2.5 text-center">{m.personalRecruits}</td>
                        <td className="px-4 py-2.5 text-center">{m.teamSize}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1 flex-wrap">
                            {m.incomeStreams.map(s => (
                              <span key={s} className="text-[10px] bg-[#C8A84E]/10 text-[#C8A84E] px-1.5 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Desktop detail sidebar */}
        {selected && (
          <div className="hidden lg:block lg:w-[40%] sticky top-6 self-start">
            <DetailPanel member={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  )
}
