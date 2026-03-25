'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  hideOnMobile?: boolean
}

interface FilterOption {
  label: string
  value: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchKeys?: string[]
  filters?: { label: string; key: string; options: FilterOption[] }[]
  initialFilters?: Record<string, string>
  onRowClick?: (row: T) => void
  mobileCardRender?: (row: T) => React.ReactNode
  idKey?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  filters = [],
  initialFilters = {},
  onRowClick,
  mobileCardRender,
  idKey = 'id',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilters)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredData = useMemo(() => {
    let result = [...data]

    // Search
    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase()
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key]
          return val != null && String(val).toLowerCase().includes(q)
        })
      )
    }

    // Filters
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value !== 'all') {
        result = result.filter((row) => String(row[key]) === value)
      }
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [data, search, searchKeys, filterValues, sortKey, sortDir])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div>
      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {searchKeys.length > 0 && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-neutral-400" aria-hidden="true" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-brand pl-10"
            />
          </div>
        )}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filterValues[filter.key] ?? 'all'}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, [filter.key]: e.target.value }))
            }
            className="input-brand w-auto min-w-[140px]"
          >
            <option value="all">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-neutral-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-brand-neutral-500 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-brand-neutral-700' : ''
                  } ${col.hideOnMobile ? 'hidden lg:table-cell' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-brand-neutral-400">
                  No results found
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={String(row[idKey])}
                  className={`border-b border-brand-neutral-100 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-brand-neutral-50' : ''
                  }`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-4 text-brand-neutral-700 ${
                        col.hideOnMobile ? 'hidden lg:table-cell' : ''
                      }`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredData.length === 0 ? (
          <div className="py-12 text-center text-brand-neutral-400">No results found</div>
        ) : (
          filteredData.map((row) =>
            mobileCardRender ? (
              <div
                key={String(row[idKey])}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {mobileCardRender(row)}
              </div>
            ) : (
              <div
                key={String(row[idKey])}
                className={`card-sequoia p-4 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.slice(0, 4).map((col) => (
                  <div key={col.key} className="flex justify-between py-1">
                    <span className="text-xs font-semibold text-brand-neutral-500 uppercase">
                      {col.label}
                    </span>
                    <span className="text-sm text-brand-neutral-700">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </div>

      {/* Count */}
      <div className="mt-3 text-xs text-brand-neutral-400">
        {filteredData.length} of {data.length} results
      </div>
    </div>
  )
}
