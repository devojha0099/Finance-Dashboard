import React from 'react'
import { LayoutDashboard, ArrowLeftRight, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: TrendingUp      },
]

export default function MobileNav() {
  const { state, dispatch } = useApp()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden">
      <div className="bg-dark-surf border-t border-slate-700/40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
        <div className="grid grid-cols-3 gap-2">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = state.activeTab === id
            return (
              <button
                key={id}
                onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-dark-card text-amber-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-card'
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px] font-semibold">{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
