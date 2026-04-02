import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useApp } from '../context/AppContext'
import SummaryCard   from '../components/SummaryCard'
import CategoryIcon  from '../components/CategoryIcon'
import {
  computeSummary, groupByMonth, groupByCategory,
  formatAmount, formatDate,
} from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/mockData'

// ── Custom chart tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-card2 border border-slate-700/40 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {formatAmount(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const { transactions } = state
  const { income, expenses, balance, savings } = computeSummary(transactions)
  const monthlyData  = groupByMonth(transactions)
  const categoryData = groupByCategory(transactions)
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Heading */}
      <div>
        <h1 className="font-display font-bold text-lg text-slate-100 leading-tight">
          Financial Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Jan – Mar 2026 · All accounts</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="Total Balance"
          value={formatAmount(balance)}
          sub="↑ 206% since Jan"
          color="amber"
        />
        <SummaryCard
          label="Total Income"
          value={formatAmount(income)}
          sub="Across 3 months"
          color="green"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatAmount(expenses)}
          sub={`${((expenses / income) * 100).toFixed(1)}% of income`}
          color="red"
        />
        <SummaryCard
          label="Savings Rate"
          value={savings.toFixed(1) + '%'}
          sub="Excellent"
          color="default"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Balance trend */}
        <div className="card lg:col-span-3">
          <h2 className="font-display font-semibold text-sm text-slate-200 mb-4">Balance Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="label" tick={{ fill: '#536580', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#536580', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending breakdown */}
        <div className="card lg:col-span-2">
          <h2 className="font-display font-semibold text-sm text-slate-200 mb-4">Spending Breakdown</h2>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map(entry => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [formatAmount(v), n]}
                contentStyle={{
                  background: '#1a2b4a',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
            {categoryData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[d.name] || '#94a3b8' }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-sm text-slate-200">Recent Transactions</h2>
          <button
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
            className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            View all →
          </button>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-700/30">
            {recent.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <CategoryIcon category={t.category} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{t.merchant}</p>
                    <p className="text-[11px] text-slate-500">{formatDate(t.date)} · {t.category}</p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: t.type === 'income' ? '#34d399' : '#fb7185' }}
                >
                  {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}