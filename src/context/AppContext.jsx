import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'
import { loadFromStorage, saveToStorage } from '../utils/helpers'


const initialState = {
  transactions: loadFromStorage(INITIAL_TRANSACTIONS),
  role: 'admin', 
  activeTab: 'dashboard',
  filters: {
    search:   '',
    type:     'all',
    category: 'all',
    sort:     'date-desc',
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
      return { ...state, transactions: updated }
    }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      }

    default:
      return state
  }
}


const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  
  useEffect(() => {
    saveToStorage(state.transactions)
  }, [state.transactions])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}