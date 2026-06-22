export type PartiesSubItem = {
  id: string
  path: string
  icon: string
  labelKey: string
  end?: boolean
}

export const PARTIES_SUB_ITEMS: PartiesSubItem[] = [
  { id: 'customers', path: '/parties/customers', icon: '👤', labelKey: 'parties.sub.customers' },
  { id: 'customers-register', path: '/parties/customers/register', icon: '📋', labelKey: 'parties.sub.customersRegister', end: true },
  { id: 'customer-opening-balance', path: '/parties/customers/opening-balance', icon: '🧾', labelKey: 'parties.sub.customerOpeningBalance' },
  { id: 'customer-statement', path: '/parties/customers/statement', icon: '📄', labelKey: 'parties.sub.customerStatement' },
  { id: 'customer-invoice-statement', path: '/parties/customers/invoice-statement', icon: '🧾', labelKey: 'parties.sub.customerInvoiceStatement' },
  { id: 'suppliers', path: '/parties/suppliers', icon: '🏭', labelKey: 'parties.sub.suppliers' },
  { id: 'suppliers-register', path: '/parties/suppliers/register', icon: '📑', labelKey: 'parties.sub.suppliersRegister', end: true },
  { id: 'supplier-statement', path: '/parties/suppliers/statement', icon: '📃', labelKey: 'parties.sub.supplierStatement' },
  { id: 'supplier-invoice-statement', path: '/parties/suppliers/invoice-statement', icon: '🧾', labelKey: 'parties.sub.supplierInvoiceStatement' },
]
