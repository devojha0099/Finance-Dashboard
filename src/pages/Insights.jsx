import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import {
  computeSummary, groupByMonth, groupByCategory,
  getTopCategory, formatAmount, formatFull,
} from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/mockData'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-card2 border border-slate-700/40 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-semibold">
          {p.name}: {formatAmount(p.value)}
        </p>
      ))}
    </div>
  )
}

function InsightCard({ label, value, sub, accent }) {
  return (
    <div className="card-sm">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="font-display font-bold text-lg text-slate-100 leading-tight">{value}</p>
      <p className="text-[11px] mt-1" style={{ color: accent || '#536580' }}>{sub}</p>
    </div>
  )
}

export default function Insights() {
  const { state } = useApp()
  const { transactions } = state
  const { income, expenses, savings } = computeSummary(transactions)
  const monthlyData  = groupByMonth(transactions)
  const categoryData = groupByCategory(transactions)
  const topCat       = getTopCategory(transactions)
  const topCatPct    = expenses > 0 && topCat ? ((topCat.value / expenses) * 100).toFixed(1) : '0'

  // Best month = highest net savings
  const bestMonth = [...monthlyData].sort((a, b) => b.balance - a.balance)[0]
  const avgMonthlySpend = monthlyData.length
    ? Math.round(monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length)
    : 0

  const incomeSources = [...new Set(
    transactions.filter(t => t.type === 'income').map(t => t.category)
  )]

  return (
    <div className="p-5 flex flex-col gap-4">
      <div>
        <h1 className="font-display font-bold text-lg text-slate-100 leading-tight">Insights</h1>
        <p className="text-xs text-slate-500 mt-0.5">Smart analysis of your spending patterns</p>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top spending category */}
        <div className="card">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
            Top Spending Category
          </p>
          {topCat ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: (CATEGORY_COLORS[topCat.name] || '#94a3b8') + '22' }}
                >
                  <span
                    className="text-sm font-display font-bold"
                    style={{ color: CATEGORY_COLORS[topCat.name] || '#94a3b8' }}
                  >
                    SH
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-slate-100">{topCat.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatFull(topCat.value)} · {topCatPct}% of expenses
                  </p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg px-3 py-2.5 text-xs text-slate-400 leading-relaxed">
                Your highest spending is in <span className="text-slate-200 font-medium">{topCat.name}</span>.
                Consider reviewing purchases here to increase savings.
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">No expense data yet.</p>
          )}
        </div>

        {/* Savings health */}
        <div className="card">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Savings Health</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-lg text-emerald-400">
                {savings >= 80 ? 'Excellent' : savings >= 50 ? 'Good' : savings >= 20 ? 'Fair' : 'Low'}
              </p>
              <p className="text-[11px] text-slate-500">{savings.toFixed(1)}% savings rate</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: Math.min(savings, 100) + '%', background: '#34d399' }}
            />
          </div>
          <p className="text-[11px] text-slate-500">Recommendation: maintain above 20%</p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-sm text-slate-200">
            Monthly Income vs Expenses
          </h2>
          <div className="flex gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70 inline-block" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400/70 inline-block" />
              Expenses
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
            <XAxis dataKey="label" tick={{ fill: '#536580', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#536580', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income"   name="Income"   fill="rgba(52,211,153,0.65)"  radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="rgba(251,113,133,0.65)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom 3 insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InsightCard
          label="Best Month"
          value={bestMonth?.label || '—'}
          sub={bestMonth ? `+${formatAmount(bestMonth.balance)} net savings` : '—'}
          accent="#34d399"
        />
        <InsightCard
          label="Avg Monthly Spend"
          value={formatAmount(avgMonthlySpend)}
          sub={`${categoryData.length} spending categories`}
          accent="#94a3b8"
        />
        <InsightCard
          label="Income Sources"
          value={incomeSources.length + ' Source' + (incomeSources.length !== 1 ? 's' : '')}
          sub={incomeSources.join(' + ') || '—'}
          accent="#94a3b8"
        />
      </div>

      {/* Category breakdown table */}
      <div className="card">
        <h2 className="font-display font-semibold text-sm text-slate-200 mb-4">
          Category Breakdown
        </h2>
        {categoryData.length === 0 ? (
          <p className="text-sm text-slate-500">No expense data yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {categoryData.map(d => {
              const pct = expenses > 0 ? (d.value / expenses) * 100 : 0
              const color = CATEGORY_COLORS[d.name] || '#94a3b8'
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{d.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{pct.toFixed(1)}%</span>
                      <span className="text-sm font-semibold" style={{ color }}>
                        {formatAmount(d.value)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: pct + '%', background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}