import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/mockData'

export default function AddTransactionModal({ onClose }) {
  const { dispatch } = useApp()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    date: today,
    merchant: '',
    category: CATEGORIES[0],
    type: 'expense',
    amount: '',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!form.merchant.trim()) return setError('Merchant is required')
    if (!amount || amount <= 0) return setError('Enter a valid amount')
    if (!form.date) return setError('Date is required')

    const txn = {
      id: Date.now(),
      date: form.date,
      merchant: form.merchant.trim(),
      category: form.category,
      type: form.type,
      amount: Math.round(amount),
    }

    dispatch({ type: 'ADD_TRANSACTION', payload: txn })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-surf border border-slate-700/40 rounded-xl w-full sm:max-w-md p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">New Entry</p>
            <h3 className="font-display font-semibold text-lg text-slate-100 leading-tight">Add Transaction</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Merchant
              <input
                className="input"
                name="merchant"
                value={form.merchant}
                onChange={handleChange}
                placeholder="e.g. Swiggy"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Date
              <input
                type="date"
                className="input"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Category
              <select
                className="input"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Type
              <select
                className="input"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs text-slate-500">
            Amount
            <input
              type="number"
              className="input"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="₹0"
              min="0"
              step="100"
            />
          </label>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
