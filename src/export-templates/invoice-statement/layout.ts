/**
 * قالب Excel — كشف فاتورة (تفصيل أصناف) — مرجع ثابت
 * منفصل عن account-statement/layout.ts
 */
import type { CustomerStatementLine, CustomerVoucher } from '../../data/parties'
import type { ExportLocale } from '../shared/types'
import type { InvoiceStatementLabels } from './types'

export function lineGoods(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
}

export function lineUnit(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.unitAr : line.unitEn
}

export function lineNotes(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.notesAr : line.notesEn
}

export function voucherNotes(voucher: CustomerVoucher, locale: ExportLocale) {
  return locale === 'ar' ? voucher.noteAr : voucher.noteEn
}

export function buildInvoiceLineExcelRows(
  lines: CustomerStatementLine[],
  locale: ExportLocale,
  lineTotals: { pieces: number; lengths: number; amount: number },
  labels: InvoiceStatementLabels,
) {
  const rows = lines.map((line) => [
    lineGoods(line, locale),
    line.pieces,
    `${line.totalLength} ${lineUnit(line, locale)}`,
    line.unitPrice,
    line.lineTotal,
    line.invoiceNo,
    line.date,
    lineNotes(line, locale),
  ])

  rows.push([
    labels.footerTotal,
    lineTotals.pieces,
    lineTotals.lengths,
    '',
    lineTotals.amount,
    '',
    '',
    '',
  ])

  return rows
}

export function buildInvoiceVoucherExcelRows(
  vouchers: CustomerVoucher[],
  locale: ExportLocale,
  labels: InvoiceStatementLabels,
) {
  return vouchers.map((voucher) => [
    voucher.date,
    voucher.type === 'receipt' ? labels.receipt : labels.payment,
    voucher.ref,
    voucher.amount,
    voucherNotes(voucher, locale),
  ])
}
