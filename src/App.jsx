import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar       from './components/Navbar'
import Sidebar      from './components/Sidebar'
import MobileNav    from './components/MobileNav'
import Dashboard    from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights     from './pages/Insights'

function AppShell() {
  const { state } = useApp()

  const PAGE = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-dark-bg pb-16 md:pb-0">
          {PAGE[state.activeTab] ?? <Dashboard />}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
