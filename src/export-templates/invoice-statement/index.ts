import type { ExportMode } from '../shared/types'
import { openExportWindow } from '../shared/openExportWindow'
import { downloadInvoiceStatementExcel, renderInvoiceStatementExcelPreviewHtml } from './excel'
import { renderInvoiceStatementPdfHtml } from './pdf.a4'
import { getInvoiceStatementSampleData } from './sampleData'
import type { InvoiceStatementLabels, InvoiceStatementTemplateData } from './types'

export type { InvoiceStatementLabels, InvoiceStatementTemplateData } from './types'
export { getInvoiceStatementSampleData } from './sampleData'

export function openInvoiceStatementPdf(data: InvoiceStatementTemplateData, mode: ExportMode) {
  const html = renderInvoiceStatementPdfHtml(data, mode)
  openExportWindow(html, `${data.labels.title} — ${data.partyName}`)
}

export function openInvoiceStatementExcelPreview(data: InvoiceStatementTemplateData) {
  const html = renderInvoiceStatementExcelPreviewHtml(data)
  openExportWindow(html, `${data.labels.title} — Excel`)
}

export function getInvoiceStatementPdfPreviewHtml(
  labels: InvoiceStatementLabels,
  locale: InvoiceStatementTemplateData['locale'],
) {
  return renderInvoiceStatementPdfHtml(getInvoiceStatementSampleData(locale, labels), 'preview', { embedded: true })
}

export function getInvoiceStatementExcelPreviewHtml(
  labels: InvoiceStatementLabels,
  locale: InvoiceStatementTemplateData['locale'],
) {
  return renderInvoiceStatementExcelPreviewHtml(getInvoiceStatementSampleData(locale, labels), { embedded: true })
}

export function downloadInvoiceStatementExcelFile(data: InvoiceStatementTemplateData) {
  downloadInvoiceStatementExcel(data)
}
