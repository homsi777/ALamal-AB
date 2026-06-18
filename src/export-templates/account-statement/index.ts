import {
  aggregateLinesByInvoice,
  buildAccountFinancialSummary,
  sumAccountInvoiceRows,
} from './aggregate'
import { downloadAccountStatementExcel, renderAccountStatementExcelPreviewHtml } from './excel'
import { renderAccountStatementPdfHtml } from './pdf.a4'
import { getAccountStatementSampleData } from './sampleData'
import type { AccountStatementLabels, AccountStatementTemplateData } from './types'
import type { CustomerStatementLine } from '../../data/parties'
import type { ExportMode } from '../shared/types'
import { openExportWindow } from '../shared/openExportWindow'

export type { AccountStatementLabels, AccountStatementTemplateData } from './types'
export { getAccountStatementSampleData } from './sampleData'
export {
  aggregateLinesByInvoice,
  buildAccountFinancialSummary,
  sumAccountInvoiceRows,
} from './aggregate'

export function openAccountStatementPdf(data: AccountStatementTemplateData, mode: ExportMode) {
  const html = renderAccountStatementPdfHtml(data, mode)
  openExportWindow(html, `${data.labels.title} — ${data.partyName}`)
}

export function openAccountStatementExcelPreview(data: AccountStatementTemplateData) {
  const html = renderAccountStatementExcelPreviewHtml(data)
  openExportWindow(html, `${data.labels.title} — Excel`)
}

export function getAccountStatementPdfPreviewHtml(
  labels: AccountStatementLabels,
  locale: AccountStatementTemplateData['locale'],
) {
  return renderAccountStatementPdfHtml(getAccountStatementSampleData(locale, labels), 'preview', { embedded: true })
}

export function getAccountStatementExcelPreviewHtml(
  labels: AccountStatementLabels,
  locale: AccountStatementTemplateData['locale'],
) {
  return renderAccountStatementExcelPreviewHtml(getAccountStatementSampleData(locale, labels), { embedded: true })
}

export function downloadAccountStatementExcelFile(data: AccountStatementTemplateData) {
  downloadAccountStatementExcel(data)
}

export function buildAccountStatementFromLines(
  input: Omit<AccountStatementTemplateData, 'invoiceRows' | 'financial' | 'rowTotals'> & {
    lines: CustomerStatementLine[]
  },
): AccountStatementTemplateData {
  const { lines, ...rest } = input
  const invoiceRows = aggregateLinesByInvoice(lines, rest.locale)
  const rowTotals = sumAccountInvoiceRows(invoiceRows)
  const financial = buildAccountFinancialSummary(rest.party, rest.vouchers, rowTotals.amount)
  return { ...rest, invoiceRows, rowTotals, financial }
}
