export type FinanceSubItem = {
  id: string
  path: string
  icon: string
  labelKey: string
  end?: boolean
}

export const FINANCE_SUB_ITEMS: FinanceSubItem[] = [
  { id: 'general-ledger', path: '/finance/general-ledger', icon: '📒', labelKey: 'finance.sub.generalLedger' },
  { id: 'payable', path: '/finance/payable', icon: '💳', labelKey: 'finance.sub.payable' },
  { id: 'receivable', path: '/finance/receivable', icon: '💚', labelKey: 'finance.sub.receivable' },
  { id: 'treasury', path: '/finance/treasury', icon: '🏦', labelKey: 'finance.sub.treasury' },
  { id: 'fixed-assets', path: '/finance/fixed-assets', icon: '🏗️', labelKey: 'finance.sub.fixedAssets' },
  { id: 'budgeting', path: '/finance/budgeting', icon: '📊', labelKey: 'finance.sub.budgeting' },
  { id: 'tax', path: '/finance/tax', icon: '🧾', labelKey: 'finance.sub.tax' },
  { id: 'cost', path: '/finance/cost', icon: '⚖️', labelKey: 'finance.sub.cost', end: true },
]
