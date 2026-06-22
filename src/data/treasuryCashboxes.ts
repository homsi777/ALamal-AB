import type { FinanceStatus } from './financeWorkspace'

export type CashboxCurrency = 'USD' | 'SYP'
export type CashboxKind = 'main' | 'branch' | 'petty'
export type CashboxTransferStatus = 'draft' | 'pendingReview' | 'posted'

export type TreasuryCashbox = {
  id: string
  code: string
  name: string
  branch: string
  responsible: string
  currency: CashboxCurrency
  kind: CashboxKind
  balance: number
  lastCloseAt: string
  openSession: string
  status: FinanceStatus
}

export type CashboxTransfer = {
  id: string
  ref: string
  fromCashboxId: string
  toCashboxId: string
  amount: number
  currency: CashboxCurrency
  date: string
  requester: string
  note: string
  status: CashboxTransferStatus
}

export const cashboxKindLabels: Record<CashboxKind, { ar: string; en: string }> = {
  main: { ar: 'صندوق رئيسي', en: 'Main cashbox' },
  branch: { ar: 'صندوق فرع', en: 'Branch cashbox' },
  petty: { ar: 'عهدة نقدية', en: 'Petty cash' },
}

export const cashboxTransferStatusLabels: Record<CashboxTransferStatus, { label: { ar: string; en: string }; variant: FinanceStatus }> = {
  draft: { label: { ar: 'مسودة', en: 'Draft' }, variant: 'neutral' },
  pendingReview: { label: { ar: 'بانتظار الاعتماد', en: 'Pending review' }, variant: 'warning' },
  posted: { label: { ar: 'مرحل', en: 'Posted' }, variant: 'success' },
}

export const treasuryCashboxes: TreasuryCashbox[] = [
  {
    id: 'main-damascus',
    code: 'BOX-01',
    name: 'الصندوق الرئيسي - دمشق',
    branch: 'الإدارة',
    responsible: 'المدير المالي',
    currency: 'USD',
    kind: 'main',
    balance: 24800,
    lastCloseAt: '2026-06-21 18:30',
    openSession: 'CLS-128',
    status: 'success',
  },
  {
    id: 'showroom',
    code: 'BOX-02',
    name: 'صندوق المعرض',
    branch: 'المعرض',
    responsible: 'أمين الصندوق',
    currency: 'USD',
    kind: 'branch',
    balance: 8400,
    lastCloseAt: '2026-06-21 17:45',
    openSession: 'CLS-129',
    status: 'warning',
  },
  {
    id: 'purchases-petty',
    code: 'BOX-03',
    name: 'عهدة مشتريات صغيرة',
    branch: 'المشتريات',
    responsible: 'الإدارة',
    currency: 'USD',
    kind: 'petty',
    balance: 1200,
    lastCloseAt: '2026-06-20 16:20',
    openSession: 'CLS-126',
    status: 'success',
  },
  {
    id: 'aleppo-branch',
    code: 'BOX-04',
    name: 'صندوق فرع حلب',
    branch: 'حلب',
    responsible: 'محاسب الفرع',
    currency: 'SYP',
    kind: 'branch',
    balance: 18500000,
    lastCloseAt: '2026-06-21 18:00',
    openSession: 'CLS-130',
    status: 'info',
  },
]

export const cashboxTransfers: CashboxTransfer[] = [
  {
    id: 'tr-901',
    ref: 'TR-CB-901',
    fromCashboxId: 'showroom',
    toCashboxId: 'main-damascus',
    amount: 1800,
    currency: 'USD',
    date: '2026-06-21',
    requester: 'أمين الصندوق',
    note: 'توريد نهاية يوم المعرض إلى الصندوق الرئيسي',
    status: 'posted',
  },
  {
    id: 'tr-902',
    ref: 'TR-CB-902',
    fromCashboxId: 'main-damascus',
    toCashboxId: 'purchases-petty',
    amount: 500,
    currency: 'USD',
    date: '2026-06-22',
    requester: 'قسم المشتريات',
    note: 'تغذية عهدة مشتريات صغيرة',
    status: 'pendingReview',
  },
]

export function formatCashboxAmount(amount: number, currency: CashboxCurrency) {
  if (currency === 'SYP') {
    return `${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ل.س`
  }

  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
