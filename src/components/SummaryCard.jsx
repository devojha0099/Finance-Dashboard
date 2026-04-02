import React from 'react'

/**
 * @param {object} props
 * @param {string}  props.label
 * @param {string}  props.value
 * @param {string}  props.sub
 * @param {'amber'|'green'|'red'|'default'} props.color
 */
export default function SummaryCard({ label, value, sub, color = 'default' }) {
  const valueClass = {
    amber:   'text-amber-500',
    green:   'text-emerald-400',
    red:     'text-rose-400',
    default: 'text-slate-100',
  }[color]

  return (
    <div className="card-sm flex flex-col gap-1.5">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`font-display font-bold text-xl leading-none ${valueClass}`}>{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  )
}