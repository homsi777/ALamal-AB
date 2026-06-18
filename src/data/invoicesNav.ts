export type InvoicesSubItem = {
  id: string
  path: string
  icon: string
  labelKey: string
  end?: boolean
}

export const INVOICES_SUB_ITEMS: InvoicesSubItem[] = [
  { id: 'sales-new', path: '/invoices/sales/new', icon: '📤', labelKey: 'invoices.sub.salesNew' },
  { id: 'sales-list', path: '/invoices/sales', icon: '📋', labelKey: 'invoices.sub.salesList' },
  { id: 'sales-return-new', path: '/invoices/sales-return/new', icon: '↩️', labelKey: 'invoices.sub.salesReturnNew' },
  { id: 'sales-return-list', path: '/invoices/sales-return', icon: '📑', labelKey: 'invoices.sub.salesReturnList', end: true },
  { id: 'purchase-new', path: '/invoices/purchase/new', icon: '📥', labelKey: 'invoices.sub.purchaseNew' },
  { id: 'purchase-list', path: '/invoices/purchase', icon: '📑', labelKey: 'invoices.sub.purchaseList', end: true },
]
