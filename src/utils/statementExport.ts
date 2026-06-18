import { formatPartyMoney } from '../data/parties'
import type { AccountStatementReconcileMark } from '../export-templates/account-statement/types'
  downloadAccountStatementExcelFile,
  downloadInvoiceStatementExcelFile,
  getAccountStatementExcelPreviewHtml,
  getAccountStatementPdfPreviewHtml,
  getInvoiceStatementExcelPreviewHtml,
  getInvoiceStatementPdfPreviewHtml,
  openAccountStatementPdf,
  openInvoiceStatementPdf,
  type AccountStatementLabels,
  type InvoiceStatementLabels,
} from '../export-templates'

export type StatementExportLabels = AccountStatementLabels & {
  whatsappIntro: string
  whatsappLines: string
  whatsappAmount: string
}

export type InvoiceExportLabels = InvoiceStatementLabels

type StatementPageContext = {
  party: import('../data/parties').PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  locale: 'ar' | 'en'
  lines: import('../data/parties').CustomerStatementLine[]
  vouchers: import('../data/parties').CustomerVoucher[]
  lineTotals: { pieces: number; lengths: number; amount: number }
  labels: StatementExportLabels
}

type InvoicePageContext = {
  party: import('../data/parties').PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  locale: 'ar' | 'en'
  lines: import('../data/parties').CustomerStatementLine[]
  vouchers: import('../data/parties').CustomerVoucher[]
  lineTotals: { pieces: number; lengths: number; amount: number }
  labels: InvoiceExportLabels
}

function stripWhatsappLabels(labels: StatementExportLabels): AccountStatementLabels {
  const { whatsappIntro: _a, whatsappLines: _b, whatsappAmount: _c, ...rest } = labels
  return rest
}

function toAccountData(ctx: StatementPageContext) {
  return buildAccountStatementFromLines({
    ...ctx,
    labels: stripWhatsappLabels(ctx.labels),
    lines: ctx.lines,
  })
}

function toInvoiceData(ctx: InvoicePageContext) {
  return { ...ctx, labels: ctx.labels }
}

/** كشف حساب — التصدير الافتراضي */
export function exportStatementPdf(ctx: StatementPageContext) {
  openAccountStatementPdf(toAccountData(ctx), 'print')
}

export function exportStatementExcel(ctx: StatementPageContext) {
  downloadAccountStatementExcelFile(toAccountData(ctx))
}

export function getStatementPdfPreviewHtml(labels: StatementExportLabels, locale: 'ar' | 'en') {
  return getAccountStatementPdfPreviewHtml(stripWhatsappLabels(labels), locale)
}

export function getStatementExcelPreviewHtml(labels: StatementExportLabels, locale: 'ar' | 'en') {
  return getAccountStatementExcelPreviewHtml(stripWhatsappLabels(labels), locale)
}

/** كشف فاتورة — تفصيل الأصناف */
export function exportInvoiceStatementPdf(ctx: InvoicePageContext) {
  openInvoiceStatementPdf(toInvoiceData(ctx), 'print')
}

export function exportInvoiceStatementExcel(ctx: InvoicePageContext) {
  downloadInvoiceStatementExcelFile(toInvoiceData(ctx))
}

export function getInvoicePdfPreviewHtml(labels: InvoiceExportLabels, locale: 'ar' | 'en') {
  return getInvoiceStatementPdfPreviewHtml(labels, locale)
}

export function getInvoiceExcelPreviewHtml(labels: InvoiceExportLabels, locale: 'ar' | 'en') {
  return getInvoiceStatementExcelPreviewHtml(labels, locale)
}

export function printStatementA4() {
  window.print()
}

export function shareStatementWhatsapp(ctx: StatementPageContext) {
  const { party, partyName, dateFrom, dateTo, lineTotals, labels } = ctx
  const account = toAccountData(ctx)
  const message = [
    labels.whatsappIntro.replace('{party}', partyName),
    `${labels.period}: ${dateFrom} — ${dateTo}`,
    `${labels.kpiInvoices}: ${account.invoiceRows.length}`,
    `${labels.kpiAmount}: ${formatPartyMoney(lineTotals.amount, party.currency)}`,
    `${labels.receivables}: ${formatPartyMoney(party.balance, party.currency)}`,
  ].join('\n')

  const digits = party.phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  const url = digits.length >= 8 ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
