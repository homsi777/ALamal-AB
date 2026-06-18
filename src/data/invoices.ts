export type InvoiceStatus = 'draft' | 'approved' | 'paid' | 'partial' | 'pending'

export type InvoiceRecord = {
  id: string
  partyAr: string
  partyEn: string
  amount: number
  currency: string
  status: InvoiceStatus
  date: string
  pieces: number
  warehouseAr?: string
  warehouseEn?: string
  originalInvoiceId?: string
}

export const salesInvoices: InvoiceRecord[] = [
  {
    id: 'SINV-1042',
    partyAr: 'محل الأناقة',
    partyEn: 'Al-Anaqa Store',
    amount: 3200,
    currency: '$',
    status: 'paid',
    date: '2026-06-17',
    pieces: 24,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
  {
    id: 'SINV-1041',
    partyAr: 'خياطة الرافدين',
    partyEn: 'Al-Rafidain Tailoring',
    amount: 1850,
    currency: '$',
    status: 'partial',
    date: '2026-06-16',
    pieces: 12,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
  {
    id: 'SINV-1040',
    partyAr: 'مؤسسة النور',
    partyEn: 'Al-Noor Co.',
    amount: 5400,
    currency: '$',
    status: 'pending',
    date: '2026-06-16',
    pieces: 32,
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
  },
  {
    id: 'SINV-1039',
    partyAr: 'بوتيك ليلى',
    partyEn: 'Layla Boutique',
    amount: 920,
    currency: '$',
    status: 'paid',
    date: '2026-06-15',
    pieces: 8,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
  {
    id: 'SINV-1038',
    partyAr: 'دار الأزياء',
    partyEn: 'Fashion House',
    amount: 2100,
    currency: '$',
    status: 'draft',
    date: '2026-06-14',
    pieces: 16,
    warehouseAr: 'فرع دمشق',
    warehouseEn: 'Damascus branch',
  },
]

export const purchaseInvoices: InvoiceRecord[] = [
  {
    id: 'PINV-2088',
    partyAr: 'Guangzhou Textile Co.',
    partyEn: 'Guangzhou Textile Co.',
    amount: 8500,
    currency: '$',
    status: 'paid',
    date: '2026-06-16',
    pieces: 48,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
  {
    id: 'PINV-2087',
    partyAr: 'Shaoxing Fabrics Ltd.',
    partyEn: 'Shaoxing Fabrics Ltd.',
    amount: 3200,
    currency: '$',
    status: 'partial',
    date: '2026-06-14',
    pieces: 20,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
  {
    id: 'PINV-2086',
    partyAr: 'Hangzhou Silk Group',
    partyEn: 'Hangzhou Silk Group',
    amount: 12400,
    currency: '$',
    status: 'pending',
    date: '2026-06-12',
    pieces: 64,
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
  },
  {
    id: 'PINV-2085',
    partyAr: 'مصنع الأقمشة السوري',
    partyEn: 'Syrian Fabrics Factory',
    amount: 1800,
    currency: '$',
    status: 'approved',
    date: '2026-06-10',
    pieces: 14,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
  },
]

export const salesReturnInvoices: InvoiceRecord[] = [
  {
    id: 'SRNV-2002',
    partyAr: 'محل الأناقة',
    partyEn: 'Al-Anaqa Store',
    amount: 850,
    currency: '$',
    status: 'approved',
    date: '2026-06-16',
    pieces: 3,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    originalInvoiceId: 'SINV-1042',
  },
  {
    id: 'SRNV-2001',
    partyAr: 'بوتيك ليلى',
    partyEn: 'Layla Boutique',
    amount: 420,
    currency: '$',
    status: 'paid',
    date: '2026-06-14',
    pieces: 2,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    originalInvoiceId: 'SINV-1039',
  },
  {
    id: 'SRNV-2000',
    partyAr: 'خياطة الرافدين',
    partyEn: 'Al-Rafidain Tailoring',
    amount: 310,
    currency: '$',
    status: 'draft',
    date: '2026-06-12',
    pieces: 1,
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
    originalInvoiceId: 'SINV-1041',
  },
]

export function getInvoiceTotals(invoices: InvoiceRecord[]) {
  return invoices.reduce(
    (totals, invoice) => {
      totals.count += 1
      totals.amount += invoice.amount
      totals.pieces += invoice.pieces
      if (invoice.status === 'draft') totals.drafts += 1
      if (invoice.status === 'paid') totals.paid += 1
      if (invoice.status === 'pending' || invoice.status === 'partial') totals.unpaid += 1
      return totals
    },
    { count: 0, amount: 0, pieces: 0, drafts: 0, paid: 0, unpaid: 0 },
  )
}

export function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString('en-US', { useGrouping: true })} ${currency}`
}
