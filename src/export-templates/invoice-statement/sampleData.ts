import { getCustomerStatementTotals } from '../../data/parties'
import type { ExportLocale } from '../shared/types'
import type { InvoiceStatementLabels, InvoiceStatementTemplateData } from './types'

const sampleParty = {
  id: 'CUS-PREVIEW',
  type: 'customer' as const,
  nameAr: 'محل الأناقة — معاينة',
  nameEn: 'Al-Anaqa Store — Preview',
  phone: '0933 111 222',
  cityAr: 'دمشق',
  cityEn: 'Damascus',
  addressAr: 'المزة — شارع الجلاء',
  addressEn: 'Al-Mazzah — Al-Jalaa St.',
  balance: 73500,
  currency: 'usd' as const,
  creditLimit: 10000,
  status: 'active' as const,
  lastActivity: '2026-06-17',
  invoiceCount: 24,
}

const sampleLines = [
  {
    id: 'PREVIEW-1',
    partyId: 'CUS-PREVIEW',
    goodsTypeAr: 'كتان F12 — أبيض',
    goodsTypeEn: 'Linen F12 — White',
    pieces: 10,
    totalLength: 4200,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 52500,
    invoiceNo: 'SINV-1035',
    date: '2026-06-10',
    notesAr: 'تفنيد من المستودع — حاوية CN-2026-A1',
    notesEn: 'Warehouse detailing — container CN-2026-A1',
  },
  {
    id: 'PREVIEW-2',
    partyId: 'CUS-PREVIEW',
    goodsTypeAr: 'كتان F12 — بيج',
    goodsTypeEn: 'Linen F12 — Beige',
    pieces: 4,
    totalLength: 1680,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 21000,
    invoiceNo: 'SINV-1035',
    date: '2026-06-10',
    notesAr: 'نفس الفاتورة — لون ثانٍ',
    notesEn: 'Same invoice — second color',
  },
  {
    id: 'PREVIEW-3',
    partyId: 'CUS-PREVIEW',
    goodsTypeAr: 'شيفون S08 — وردي',
    goodsTypeEn: 'Chiffon S08 — Pink',
    pieces: 6,
    totalLength: 2400,
    unitAr: 'متر',
    unitEn: 'meter',
    unitPrice: 8,
    lineTotal: 19200,
    invoiceNo: 'SINV-1041',
    date: '2026-06-14',
    notesAr: 'طلب عاجل — تسليم جزئي',
    notesEn: 'Urgent order — partial delivery',
  },
]

const sampleVouchers = [
  {
    id: 'PV-1',
    partyId: 'CUS-PREVIEW',
    type: 'receipt' as const,
    ref: 'RCV-220',
    date: '2026-06-12',
    amount: 15000,
    noteAr: 'تحصيل نقدي — دفعة أولى',
    noteEn: 'Cash collection — first payment',
  },
  {
    id: 'PV-2',
    partyId: 'CUS-PREVIEW',
    type: 'receipt' as const,
    ref: 'RCV-225',
    date: '2026-06-16',
    amount: 8000,
    noteAr: 'سند قبض — تحصيل آجل',
    noteEn: 'Receipt voucher — deferred collection',
  },
]

export function getInvoiceStatementSampleData(
  locale: ExportLocale,
  labels: InvoiceStatementLabels,
): InvoiceStatementTemplateData {
  const lineTotals = getCustomerStatementTotals(sampleLines)
  return {
    party: sampleParty,
    partyName: locale === 'ar' ? sampleParty.nameAr : sampleParty.nameEn,
    dateFrom: '2026-06-01',
    dateTo: '2026-06-17',
    locale,
    lines: sampleLines,
    vouchers: sampleVouchers,
    lineTotals,
    labels,
    isSample: true,
  }
}
