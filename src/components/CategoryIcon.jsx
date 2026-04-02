import React from 'react'
import { CATEGORY_COLORS, CATEGORY_ABBR } from '../data/mockData'

export default function CategoryIcon({ category, size = 'md' }) {
  const color = CATEGORY_COLORS[category] || '#94a3b8'
  const abbr  = CATEGORY_ABBR[category]  || category.slice(0, 2).toUpperCase()
  const dim   = size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-8 h-8 text-[10px]'

  return (
    <div
      className={`${dim} rounded-lg flex items-center justify-center font-display font-bold flex-shrink-0`}
      style={{ background: color + '22', color }}
    >
      {abbr}
    </div>
  )
}