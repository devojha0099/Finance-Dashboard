
export function formatAmount(n) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2).replace(/\.?0+$/, '') + 'L'
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(1) + 'K'
  return '₹' + n.toLocaleString('en-IN')
}

export function formatFull(n) {
  return '₹' + n.toLocaleString('en-IN')
}


export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })
}

export function formatMonthYear(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}


export function computeSummary(transactions) {
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance  = income - expenses
  const savings  = income > 0 ? ((income - expenses) / income) * 100 : 0
  return { income, expenses, balance, savings }
}

export function groupByMonth(transactions) {
  const map = {}
  transactions.forEach(t => {
    const key = t.date.slice(0, 7) 
    if (!map[key]) map[key] = { income: 0, expenses: 0 }
    if (t.type === 'income')  map[key].income   += t.amount
    if (t.type === 'expense') map[key].expenses += t.amount
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, vals]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      ...vals,
      balance: vals.income - vals.expenses,
    }))
}

export function groupByCategory(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const map = {}
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount
  })
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }))
}

export function getTopCategory(transactions) {
  const grouped = groupByCategory(transactions)
  return grouped[0] || null
}



const LS_KEY = 'fintrack_transactions'

export function loadFromStorage(fallback) {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(transactions) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(transactions))
  } catch {
    
  }
}