import { customers, type PartyRecord } from './parties'

export type CustomerOpeningBalanceStatus = 'draft' | 'ready' | 'posted' | 'needs_review'
export type CustomerOpeningBalanceDirection = 'debit' | 'credit' | 'zero'

export type CustomerOpeningBalanceEntry = {
  id: string
  customerId: string
  fiscalYear: number
  openingDate: string
  direction: CustomerOpeningBalanceDirection
  amount: number
  currency: PartyRecord['currency']
  source: string
  reference: string
  reviewer: string
  status: CustomerOpeningBalanceStatus
  note: string
}

export const customerOpeningBalances: CustomerOpeningBalanceEntry[] = [
  {
    id: 'COB-001',
    customerId: 'CUS-001',
    fiscalYear: 2026,
    openingDate: '2026-01-01',
    direction: 'debit',
    amount: 2200,
    currency: 'usd',
    source: 'مطابقة كشف حساب سابق',
    reference: 'OB-CUS-001-2026',
    reviewer: 'أحمد الحموي',
    status: 'posted',
    note: 'رصيد مدين على العميل من السنة السابقة.',
  },
  {
    id: 'COB-002',
    customerId: 'CUS-002',
    fiscalYear: 2026,
    openingDate: '2026-01-01',
    direction: 'debit',
    amount: 950,
    currency: 'usd',
    source: 'إدخال يدوي من المحاسب',
    reference: 'OB-CUS-002-2026',
    reviewer: 'سارة ناصر',
    status: 'ready',
    note: 'بانتظار اعتماد المدير المالي.',
  },
  {
    id: 'COB-003',
    customerId: 'CUS-003',
    fiscalYear: 2026,
    openingDate: '2026-01-01',
    direction: 'credit',
    amount: 400,
    currency: 'usd',
    source: 'رصيد دائن مرحل',
    reference: 'OB-CUS-003-2026',
    reviewer: 'محمد العلي',
    status: 'needs_review',
    note: 'يحتاج مطابقة سبب الرصيد الدائن قبل الاعتماد.',
  },
  {
    id: 'COB-004',
    customerId: 'CUS-004',
    fiscalYear: 2026,
    openingDate: '2026-01-01',
    direction: 'zero',
    amount: 0,
    currency: 'usd',
    source: 'افتتاح بدون رصيد',
    reference: 'OB-CUS-004-2026',
    reviewer: 'ليلى حمدان',
    status: 'posted',
    note: 'لا يوجد رصيد افتتاحي.',
  },
]

export function getCustomerOpeningBalanceRows(entries = customerOpeningBalances) {
  return entries.map((entry) => {
    const customer = customers.find((item) => item.id === entry.customerId)
    return { ...entry, customer }
  })
}

export function getCustomerOpeningBalanceTotals(entries: CustomerOpeningBalanceEntry[]) {
  return entries.reduce(
    (totals, entry) => {
      totals.count += 1
      if (entry.status === 'posted') totals.posted += 1
      if (entry.status === 'ready') totals.ready += 1
      if (entry.status === 'needs_review') totals.needsReview += 1
      if (entry.direction === 'debit') totals.debit += entry.amount
      if (entry.direction === 'credit') totals.credit += entry.amount
      totals.net = totals.debit - totals.credit
      return totals
    },
    { count: 0, posted: 0, ready: 0, needsReview: 0, debit: 0, credit: 0, net: 0 },
  )
}
