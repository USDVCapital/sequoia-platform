'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────

interface ProductConfig {
  id: string
  name: string
  category_key: string
  description: string
  agent_rate_referral: number
  agent_rate_personal: number
  same_rate: boolean
  overhead_rate: number
  bonus_pool_rate: number
  override_l1: number
  override_l2: number
  override_l3: number
  override_l4: number
  override_l5: number
  override_l6: number
  default_commission_rate: number
  agent_label_referral: string
  agent_label_personal: string
  is_active: boolean
  sort_order: number
}

type NewProduct = Omit<ProductConfig, 'id'>

const emptyProduct: NewProduct = {
  name: '',
  category_key: '',
  description: '',
  agent_rate_referral: 0.23,
  agent_rate_personal: 0.46,
  same_rate: false,
  overhead_rate: 0.30,
  bonus_pool_rate: 0.02,
  override_l1: 0.10,
  override_l2: 0.05,
  override_l3: 0.03,
  override_l4: 0.015,
  override_l5: 0.015,
  override_l6: 0.01,
  default_commission_rate: 0.02,
  agent_label_referral: 'Referral',
  agent_label_personal: 'Personal',
  is_active: true,
  sort_order: 0,
}

// ── Helpers ─────────────────────────────────────────────────

function pct(rate: number) {
  return `${(rate * 100).toFixed(2)}%`
}

function RateInput({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          value={(value * 100).toFixed(2)}
          onChange={e => onChange(Number(e.target.value) / 100)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
        />
        <span className="absolute right-3 top-2 text-xs text-gray-400">%</span>
      </div>
      {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ProductConfig | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState<NewProduct>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('product_configs')
      .select('*')
      .order('sort_order', { ascending: true })
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { document.title = 'Products & Commissions | Sequoia Admin' }, [])

  // ── CRUD handlers ───────────────────────────────────────

  const handleAdd = async () => {
    if (!addForm.name || !addForm.category_key) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('product_configs').insert(addForm)
    setShowAddForm(false)
    setAddForm(emptyProduct)
    await fetchProducts()
    setSaving(false)
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    setSaving(true)
    const supabase = createClient()
    const { id, ...updates } = editForm
    await supabase.from('product_configs').update(updates).eq('id', id)
    setEditingId(null)
    setEditForm(null)
    await fetchProducts()
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from('product_configs').delete().eq('id', id)
    await fetchProducts()
  }

  const startEdit = (product: ProductConfig) => {
    setEditingId(product.id)
    setEditForm({ ...product })
    setExpandedId(product.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  // ── Render ──────────────────────────────────────────────

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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Products & Commissions</h2>
        <p className="text-sequoia-300 mt-1 text-sm">Configure commission rates for each product type and override level</p>
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-sequoia-900 text-white hover:bg-sequoia-800 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-5 space-y-4">
          <h3 className="text-base font-bold text-sequoia-900">New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
              <input
                type="text"
                value={addForm.name}
                onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Real Estate Lending"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category Key *</label>
              <input
                type="text"
                value={addForm.category_key}
                onChange={e => setAddForm(p => ({ ...p, category_key: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                placeholder="e.g., real_estate_lending"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={addForm.description}
                onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Agent Commission</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <RateInput label="Referral Rate" value={addForm.agent_rate_referral} onChange={v => setAddForm(p => ({ ...p, agent_rate_referral: v }))} />
              <RateInput label="Personal Rate" value={addForm.agent_rate_personal} onChange={v => setAddForm(p => ({ ...p, agent_rate_personal: v }))} />
              <RateInput label="Overhead" value={addForm.overhead_rate} onChange={v => setAddForm(p => ({ ...p, overhead_rate: v }))} />
              <RateInput label="Bonus Pool" value={addForm.bonus_pool_rate} onChange={v => setAddForm(p => ({ ...p, bonus_pool_rate: v }))} />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Override Rates (6 Levels)</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              <RateInput label="Level 1" value={addForm.override_l1} onChange={v => setAddForm(p => ({ ...p, override_l1: v }))} />
              <RateInput label="Level 2" value={addForm.override_l2} onChange={v => setAddForm(p => ({ ...p, override_l2: v }))} />
              <RateInput label="Level 3" value={addForm.override_l3} onChange={v => setAddForm(p => ({ ...p, override_l3: v }))} />
              <RateInput label="Level 4" value={addForm.override_l4} onChange={v => setAddForm(p => ({ ...p, override_l4: v }))} />
              <RateInput label="Level 5" value={addForm.override_l5} onChange={v => setAddForm(p => ({ ...p, override_l5: v }))} />
              <RateInput label="Level 6" value={addForm.override_l6} onChange={v => setAddForm(p => ({ ...p, override_l6: v }))} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={addForm.same_rate}
                onChange={e => setAddForm(p => ({ ...p, same_rate: e.target.checked }))}
                className="rounded border-gray-300"
              />
              Same rate (no referral/personal distinction)
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => { setShowAddForm(false); setAddForm(emptyProduct) }} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={saving || !addForm.name || !addForm.category_key} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-sequoia-900 hover:bg-sequoia-800 disabled:opacity-50 transition-colors">
              <Save size={14} /> {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-3">
        {products.map(product => {
          const isEditing = editingId === product.id
          const isExpanded = expandedId === product.id
          const form = isEditing ? editForm! : product

          return (
            <div key={product.id} className={`rounded-xl border bg-white transition-all ${isEditing ? 'border-gold-400 shadow-md' : 'border-neutral-200'}`}>
              {/* Header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : product.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-sequoia-900">{product.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500">{product.category_key}</span>
                    {!product.is_active && <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">Inactive</span>}
                  </div>
                  {product.description && <p className="text-xs text-gray-400 mt-0.5">{product.description}</p>}
                </div>

                {/* Rate summary pills */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
                    Agent: {product.same_rate ? product.agent_label_personal : `${pct(product.agent_rate_referral)} / ${pct(product.agent_rate_personal)}`}
                  </span>
                  {product.overhead_rate > 0 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-50 text-gray-600 font-medium border border-gray-200">
                      OH: {pct(product.overhead_rate)}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-200">
                    {product.category_key === 'wellness'
                      ? `L1: $1/emp`
                      : `L1: ${pct(product.override_l1)}`}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  {!isEditing && (
                    <>
                      <button onClick={() => startEdit(product)} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-sequoia-700 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>

                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>

              {/* Expanded detail / edit form */}
              {isExpanded && (
                <div className="border-t border-neutral-100 px-5 py-4 space-y-4">
                  {isEditing ? (
                    <>
                      {/* Editable fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Product Name</label>
                          <input type="text" value={form.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Category Key</label>
                          <input type="text" value={form.category_key} onChange={e => setEditForm(f => f ? { ...f, category_key: e.target.value } : f)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                          <input type="text" value={form.description} onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Agent Commission</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <RateInput label="Referral Rate" value={form.agent_rate_referral} onChange={v => setEditForm(f => f ? { ...f, agent_rate_referral: v } : f)} />
                          <RateInput label="Personal Rate" value={form.agent_rate_personal} onChange={v => setEditForm(f => f ? { ...f, agent_rate_personal: v } : f)} />
                          <RateInput label="Overhead" value={form.overhead_rate} onChange={v => setEditForm(f => f ? { ...f, overhead_rate: v } : f)} />
                          <RateInput label="Bonus Pool" value={form.bonus_pool_rate} onChange={v => setEditForm(f => f ? { ...f, bonus_pool_rate: v } : f)} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                          <RateInput label="Default Commission Rate" value={form.default_commission_rate} onChange={v => setEditForm(f => f ? { ...f, default_commission_rate: v } : f)}
                            hint="Multiplied by funded amount" />
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Referral Label</label>
                            <input type="text" value={form.agent_label_referral} onChange={e => setEditForm(f => f ? { ...f, agent_label_referral: e.target.value } : f)}
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Personal Label</label>
                            <input type="text" value={form.agent_label_personal} onChange={e => setEditForm(f => f ? { ...f, agent_label_personal: e.target.value } : f)}
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={e => setEditForm(f => f ? { ...f, sort_order: Number(e.target.value) } : f)}
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Override Rates (6 Levels)</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                          <RateInput label="Level 1" value={form.override_l1} onChange={v => setEditForm(f => f ? { ...f, override_l1: v } : f)} />
                          <RateInput label="Level 2" value={form.override_l2} onChange={v => setEditForm(f => f ? { ...f, override_l2: v } : f)} />
                          <RateInput label="Level 3" value={form.override_l3} onChange={v => setEditForm(f => f ? { ...f, override_l3: v } : f)} />
                          <RateInput label="Level 4" value={form.override_l4} onChange={v => setEditForm(f => f ? { ...f, override_l4: v } : f)} />
                          <RateInput label="Level 5" value={form.override_l5} onChange={v => setEditForm(f => f ? { ...f, override_l5: v } : f)} />
                          <RateInput label="Level 6" value={form.override_l6} onChange={v => setEditForm(f => f ? { ...f, override_l6: v } : f)} />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={form.same_rate} onChange={e => setEditForm(f => f ? { ...f, same_rate: e.target.checked } : f)}
                            className="rounded border-gray-300" />
                          Same rate (no referral/personal distinction)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={form.is_active} onChange={e => setEditForm(f => f ? { ...f, is_active: e.target.checked } : f)}
                            className="rounded border-gray-300" />
                          Active
                        </label>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                          <X size={14} /> Cancel
                        </button>
                        <button onClick={handleSaveEdit} disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-sequoia-900 hover:bg-sequoia-800 disabled:opacity-50 transition-colors">
                          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Read-only view */
                    <div className="space-y-4">
                      {product.category_key === 'wellness' ? (
                        /* EHMP/Wellness — show PEPM dollar amounts */
                        <>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Agent Commission (PEPM, Paid Monthly)</h4>
                            <div className="rounded-lg border border-neutral-200 overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-[#0D2B1E] text-white text-xs">
                                    <th className="px-4 py-2 text-left font-semibold">Group Size</th>
                                    <th className="px-4 py-2 text-left font-semibold">Commission</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-neutral-100">
                                    <td className="px-4 py-2 text-gray-600">5 – 199 employees</td>
                                    <td className="px-4 py-2 font-bold text-sequoia-900">$20 PEPM</td>
                                  </tr>
                                  <tr className="border-b border-neutral-100 bg-neutral-50">
                                    <td className="px-4 py-2 text-gray-600">200 – 499 employees</td>
                                    <td className="px-4 py-2 font-bold text-sequoia-900">$22 PEPM</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 text-gray-600">500+ employees</td>
                                    <td className="px-4 py-2 font-bold text-sequoia-900">$24 PEPM</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Team Revenue Share (Override)</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                                <span className="text-xs text-emerald-600 font-medium">1st Level</span>
                                <p className="text-lg font-bold text-emerald-800">$1.00</p>
                                <span className="text-[10px] text-emerald-500">per employee</span>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                                <span className="text-xs text-emerald-600 font-medium">2nd Level</span>
                                <p className="text-lg font-bold text-emerald-800">$1.00</p>
                                <span className="text-[10px] text-emerald-500">per employee</span>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                                <span className="text-xs text-emerald-600 font-medium">3rd Level</span>
                                <p className="text-lg font-bold text-emerald-800">$0.50</p>
                                <span className="text-[10px] text-emerald-500">per employee</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                            Paid in perpetuity while employees remain enrolled. Enroll 500+ employees = $10,600+/month in residual income.
                          </div>
                        </>
                      ) : (
                        /* Standard percentage-based products */
                        <>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Agent Commission</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <span className="text-xs text-gray-400">Referral Rate</span>
                                <p className="text-sm font-semibold text-gray-800">{pct(product.agent_rate_referral)}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400">Personal Rate</span>
                                <p className="text-sm font-semibold text-gray-800">{pct(product.agent_rate_personal)}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400">Overhead</span>
                                <p className="text-sm font-semibold text-gray-800">{pct(product.overhead_rate)}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400">Bonus Pool</span>
                                <p className="text-sm font-semibold text-gray-800">{pct(product.bonus_pool_rate)}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Override Rates (6 Levels)</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                              {[
                                ['L1', product.override_l1],
                                ['L2', product.override_l2],
                                ['L3', product.override_l3],
                                ['L4', product.override_l4],
                                ['L5', product.override_l5],
                                ['L6', product.override_l6],
                              ].map(([label, val]) => (
                                <div key={label as string}>
                                  <span className="text-xs text-gray-400">{label as string}</span>
                                  <p className="text-sm font-semibold text-gray-800">{pct(val as number)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-6 text-xs text-gray-400">
                        {product.category_key !== 'wellness' && <span>Default commission rate: {pct(product.default_commission_rate)}</span>}
                        <span>Labels: {product.agent_label_referral} / {product.agent_label_personal}</span>
                        {product.same_rate && <span className="text-amber-600 font-medium">Same rate (no distinction)</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No products configured yet. Run migration 002_product_configs.sql in the Supabase SQL Editor, or click &quot;Add Product&quot; to create one.
          </div>
        )}
      </div>
    </div>
  )
}
