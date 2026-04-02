import React from 'react'
import { useApp } from '../context/AppContext'
import { LayoutDashboard, ArrowLeftRight, TrendingUp } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',      Icon: TrendingUp      },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()

  return (
    <aside className="hidden md:flex w-44 bg-dark-surf border-r border-slate-700/30 flex-col gap-1 p-2.5 flex-shrink-0">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = state.activeTab === id
        return (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
            className={active ? 'nav-link-active' : 'nav-link'}
          >
            <Icon size={14} />
            {label}
          </button>
        )
      })}

      <div className="mt-auto pt-3 border-t border-slate-700/30 px-1">
        <p className="text-[10px] text-slate-600">Last sync</p>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Apr 2, 2026</p>
      </div>
    </aside>
  )
}
