export type ReportsSubItem = {
  id: string
  path: string
  icon: string
  labelKey: string
  end?: boolean
}

export const REPORTS_SUB_ITEMS: ReportsSubItem[] = [
  { id: 'financial-statements', path: '/reports/financial-statements', icon: '📊', labelKey: 'reports.sub.financialStatements' },
  { id: 'accounts', path: '/reports/accounts', icon: '📋', labelKey: 'reports.sub.accounts' },
  { id: 'budget-analysis', path: '/reports/budget-analysis', icon: '📈', labelKey: 'reports.sub.budgetAnalysis' },
  { id: 'treasury', path: '/reports/treasury', icon: '🏦', labelKey: 'reports.sub.treasury' },
  { id: 'fixed-assets', path: '/reports/fixed-assets', icon: '🏗️', labelKey: 'reports.sub.fixedAssets' },
  { id: 'tax', path: '/reports/tax', icon: '🧾', labelKey: 'reports.sub.tax' },
  { id: 'cost', path: '/reports/cost', icon: '💰', labelKey: 'reports.sub.cost' },
  { id: 'management-bi', path: '/reports/management-bi', icon: '🧠', labelKey: 'reports.sub.managementBi', end: true },
]
