import type { CustomerStatementLine, CustomerVoucher, PartyRecord } from '../../data/parties'
import type { ExportLocale } from '../shared/types'

/** قالب كشف فاتورة — سطر لكل صنف/بند داخل الفاتورة */
export type InvoiceStatementLabels = {
  title: string
  party: string
  period: string
  balance: string
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
  kpiLines: string
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

export type InvoiceStatementTemplateData = {
  party: PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  locale: ExportLocale
  lines: CustomerStatementLine[]
  vouchers: CustomerVoucher[]
  lineTotals: { pieces: number; lengths: number; amount: number }
  labels: InvoiceStatementLabels
  isSample?: boolean
}
