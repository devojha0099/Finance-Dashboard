import React, { useState, useMemo } from 'react'
import { Trash2, Plus, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CategoryIcon from '../components/CategoryIcon'
import AddTransactionModal from '../components/AddTransactionModal'
import { CATEGORIES } from '../data/mockData'
import { formatAmount, formatDate } from '../utils/helpers'

export default function Transactions() {
  const { state, dispatch } = useApp()
  const { transactions, role, filters } = state
  const [showModal, setShowModal] = useState(false)

  function setFilter(key, value) {
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } })
  }

  const filtered = useMemo(() => {
    let list = [...transactions]

    if (filters.search)
      list = list.filter(
        t =>
          t.merchant.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.category.toLowerCase().includes(filters.search.toLowerCase())
      )

    if (filters.type !== 'all')
      list = list.filter(t => t.type === filters.type)

    if (filters.category !== 'all')
      list = list.filter(t => t.category === filters.category)

    const [sortKey, sortDir] = filters.sort.split('-')
    list.sort((a, b) => {
      const va = sortKey === 'date' ? new Date(a.date).getTime() : a.amount
      const vb = sortKey === 'date' ? new Date(b.date).getTime() : b.amount
      return sortDir === 'desc' ? vb - va : va - vb
    })

    return list
  }, [transactions, filters])

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-lg text-slate-100 leading-tight">Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} results</p>
        </div>
        {role === 'admin' && (
          <button className="btn-primary flex items-center gap-1.5" onClick={() => setShowModal(true)}>
            <Plus size={14} />
            Add Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-36">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input w-full pl-8"
            placeholder="Search merchants..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
        </div>
        <select className="input" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="input" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.sort} onChange={e => setFilter('sort', e.target.value)}>
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-dark-surf border border-slate-700/30 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1.2fr_2fr_1fr_0.9fr_1fr] gap-2 px-4 py-3 bg-dark-card2 text-[10px] text-slate-500 uppercase tracking-widest">
          <span>Date</span>
          <span>Merchant</span>
          <span>Category</span>
          <span>Type</span>
          <span className="text-right">Amount</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-14 text-slate-500 text-sm">
            No transactions match your filters.
          </div>
        ) : (
          filtered.map(t => (
            <div
              key={t.id}
              className="grid grid-cols-[1.2fr_2fr_1fr_0.9fr_1fr] gap-2 px-4 py-3 items-center border-t border-slate-700/20 hover:bg-white/[0.015] transition-colors"
            >
              {/* Date */}
              <span className="text-xs text-slate-500">{formatDate(t.date)}</span>

              {/* Merchant */}
              <div className="flex items-center gap-2 min-w-0">
                <CategoryIcon category={t.category} size="sm" />
                <span className="text-sm font-medium text-slate-200 truncate">{t.merchant}</span>
              </div>

              {/* Category badge */}
              <span
                className="badge text-[10px] w-fit"
                style={{
                  background: (CATEGORY_COLORS_ALPHA[t.category] || 'rgba(148,163,184,0.12)'),
                  color: (CATEGORY_COLORS[t.category] || '#94a3b8'),
                }}
              >
                {t.category}
              </span>

              {/* Type badge */}
              <span
                className={`badge text-[10px] w-fit ${
                  t.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {t.type}
              </span>

              {/* Amount + delete */}
              <div className="flex items-center justify-end gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: t.type === 'income' ? '#34d399' : '#fb7185' }}
                >
                  {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                </span>
                {role === 'admin' && (
                  <button
                    onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: t.id })}
                    className="text-slate-600 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

// Inline alpha versions for badges (avoids import cycle)
import { CATEGORY_COLORS } from '../data/mockData'
const CATEGORY_COLORS_ALPHA = Object.fromEntries(
  Object.entries(CATEGORY_COLORS).map(([k, v]) => [k, v + '20'])
)