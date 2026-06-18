import type { CustomerVoucher, PartyRecord } from '../../data/parties'
import type { ExportLocale } from '../shared/types'

/** صف مجمّع — فاتورة واحدة في كشف الحساب */
export type AccountInvoiceRow = {
  invoiceNo: string
  date: string
  goodsSummaryAr: string
  goodsSummaryEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: string
  avgUnitPrice: number
  invoiceTotal: number
  notesAr: string
  notesEn: string
  lineCount: number
}

export type AccountFinancialSummary = {
  openingBalance: number
  invoicesTotal: number
  receiptsTotal: number
  paymentsTotal: number
  closingBalance: number
  creditLimit: number
}

/** قالب كشف حساب — سطر لكل فاتورة + ملخص مالي في الرأس */
export type AccountStatementLabels = {
  title: string
  party: string
  period: string
  balance: string
  phone: string
  city: string
  address: string
  financialSummary: string
  openingBalance: string
  invoicesTotal: string
  receiptsTotal: string
  paymentsTotal: string
  closingBalance: string
  receivables: string
  creditLimit: string
  linesSheet: string
  vouchersSheet: string
  colGoodsType: string
  colPieces: string
  colLengths: string
  colPrice: string
  colLineTotal: string
  colInvoiceNo: string
  colDate: string
  colNotes: string
  colVoucherType: string
  colVoucherRef: string
  colVoucherAmount: string
  footerTotal: string
  receipt: string
  payment: string
  kpiInvoices: string
  kpiPieces: string
  kpiLengths: string
  kpiAmount: string
  generatedAt: string
  sampleBadge: string
  previewBanner: string
  previewExcelBanner: string
  print: string
  close: string
}

export type AccountStatementTemplateData = {
  party: PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  locale: ExportLocale
  invoiceRows: AccountInvoiceRow[]
  vouchers: CustomerVoucher[]
  financial: AccountFinancialSummary
  rowTotals: { pieces: number; lengths: number; amount: number }
  labels: AccountStatementLabels
  isSample?: boolean
}
