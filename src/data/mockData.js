export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2026-01-05', merchant: 'Swiggy',                  category: 'Food',          type: 'expense', amount: 850   },
  { id: 2,  date: '2026-01-07', merchant: 'Amazon',                   category: 'Shopping',      type: 'expense', amount: 2340  },
  { id: 3,  date: '2026-01-10', merchant: 'Salary Credit',            category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 4,  date: '2026-01-15', merchant: 'Zomato',                   category: 'Food',          type: 'expense', amount: 650   },
  { id: 5,  date: '2026-01-18', merchant: 'Uber',                     category: 'Transport',     type: 'expense', amount: 420   },
  { id: 6,  date: '2026-01-22', merchant: 'Netflix',                  category: 'Entertainment', type: 'expense', amount: 649   },
  { id: 7,  date: '2026-01-25', merchant: 'Electricity Bill',         category: 'Utilities',     type: 'expense', amount: 1200  }]

export const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Freelance']

export const CATEGORY_COLORS = {
  Food:          '#34d399',
  Shopping:      '#fb7185',
  Transport:     '#60a5fa',
  Entertainment: '#a78bfa',
  Utilities:     '#f59e0b',
  Salary:        '#34d399',
  Freelance:     '#2dd4bf',
}

export const CATEGORY_ABBR = {
  Food:          'FD',
  Shopping:      'SH',
  Transport:     'TR',
  Entertainment: 'EN',
  Utilities:     'UT',
  Salary:        'SL',
  Freelance:     'FL',
}