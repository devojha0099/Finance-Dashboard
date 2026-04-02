import React from 'react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { state, dispatch } = useApp()

  function handleRoleChange(e) {
    dispatch({ type: 'SET_ROLE', payload: e.target.value })
  }

  return (
    <nav className="bg-dark-surf border-b border-slate-700/30 h-14 flex items-center justify-between px-5 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-display font-bold text-dark-bg text-sm">
          ₹
        </div>
        <span className="font-display font-bold text-base tracking-tight text-slate-100">
          FinTrack
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role toggle */}
        <div className="flex items-center gap-2 bg-dark-card border border-slate-700/30 rounded-lg px-3 py-1.5">
          <span className="text-[11px] text-slate-500">Role:</span>
          <select
            value={state.role}
            onChange={handleRoleChange}
            className="bg-transparent border-none text-amber-500 text-xs font-bold cursor-pointer outline-none font-sans"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* User badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-display font-bold text-dark-bg text-xs flex-shrink-0">
            DK
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold font-display text-slate-100 leading-tight tracking-tight">
              Devendra Kumar Ojha
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              {state.role === 'admin' ? 'Administrator' : 'Viewer'}
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}