import * as XLSX from 'xlsx'
import { wrapA4Document } from '../export-templates/shared/a4Document'
import { sanitizeExportFileName } from '../export-templates/shared/fileNames'
import { escapeHtml } from '../export-templates/shared/html'
import { openExportWindow } from '../export-templates/shared/openExportWindow'
import type { FinanceTaskWorkspace } from '../data/financeTaskWorkspace'
import { getFinanceExportRows } from '../components/finance/FinanceResultRenderer'
import { statusLabels, text } from '../components/finance/financeLabels'

type ExportLocale = 'ar' | 'en'

export function openFinancePrintPreview(workspace: FinanceTaskWorkspace, locale: ExportLocale, mode: 'preview' | 'print') {
  const title = text(workspace.definition.printTitle, locale)
  const bodyHtml = buildFinanceDocumentHtml(workspace, locale)
  const html = wrapA4Document({
    title,
    locale,
    mode,
    bodyHtml,
    previewBanner: locale === 'ar' ? 'معاينة مستند مالي' : 'Finance document preview',
    printLabel: locale === 'ar' ? 'طباعة' : 'Print',
    closeLabel: locale === 'ar' ? 'إغلاق' : 'Close',
    extraStyles: financePrintStyles,
  })

  openExportWindow(html, title)
}

export function exportFinancePdf(workspace: FinanceTaskWorkspace, locale: ExportLocale) {
  openFinancePrintPreview(workspace, locale, 'preview')
}

export function exportFinanceExcel(workspace: FinanceTaskWorkspace, locale: ExportLocale) {
  const rows = getFinanceExportRows(workspace)
  const sheet = XLSX.utils.json_to_sheet(rows)
  const book = XLSX.utils.book_new()
  const title = text(workspace.definition.printTitle, locale)
  XLSX.utils.book_append_sheet(book, sheet, sanitizeExportFileName(title).slice(0, 31) || 'Finance')
  XLSX.writeFile(book, `${sanitizeExportFileName(title)}.xlsx`)
}

function buildFinanceDocumentHtml(workspace: FinanceTaskWorkspace, locale: ExportLocale) {
  const title = text(workspace.definition.printTitle, locale)
  const summary = text(workspace.module.summary, locale)
  const rows = getFinanceExportRows(workspace) as Record<string, string>[]
  const headers = Object.keys(rows[0] ?? {})
  const status = text(statusLabels[workspace.definition.status], locale)

  return `
    <section class="finance-doc">
      <header class="finance-doc__header">
        <div>
          <p class="finance-doc__eyebrow">ALamal-AB ERP</p>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(summary)}</p>
        </div>
        <div class="finance-doc__meta">
          <span>${locale === 'ar' ? 'رقم المستند' : 'Document'}: ${escapeHtml(workspace.definition.id)}</span>
          <span>${locale === 'ar' ? 'التاريخ' : 'Date'}: 2026-06-21</span>
          <span>${locale === 'ar' ? 'الحالة' : 'Status'}: ${escapeHtml(status)}</span>
        </div>
      </header>

      <table class="finance-doc__table">
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(String(row[header] ?? ''))}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>

      <footer class="finance-doc__footer">
        <div>${locale === 'ar' ? 'إعداد' : 'Prepared by'}<strong>${locale === 'ar' ? 'المحاسب العام' : 'General accountant'}</strong></div>
        <div>${locale === 'ar' ? 'اعتماد' : 'Approved by'}<strong>${locale === 'ar' ? 'المدير المالي' : 'Finance manager'}</strong></div>
        <div>${locale === 'ar' ? 'ترحيل' : 'Posted by'}<strong>${locale === 'ar' ? 'حسب حالة المستند' : 'Per document state'}</strong></div>
      </footer>
    </section>
  `
}

const financePrintStyles = `
.finance-doc__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid #d7dce5;
}
.finance-doc__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}
.finance-doc h1 {
  margin: 0 0 8px;
  font-size: 24px;
}
.finance-doc p {
  margin: 0;
  color: #475569;
  line-height: 1.8;
}
.finance-doc__meta {
  display: grid;
  gap: 8px;
  min-width: 190px;
  font-size: 12px;
  color: #334155;
}
.finance-doc__table {
  width: 100%;
  margin-top: 22px;
  border-collapse: collapse;
  font-size: 12px;
}
.finance-doc__table th,
.finance-doc__table td {
  border: 1px solid #d7dce5;
  padding: 8px;
  text-align: start;
}
.finance-doc__table th {
  background: #f8fafc;
  font-weight: 800;
}
.finance-doc__footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 28px;
}
.finance-doc__footer div {
  min-height: 64px;
  border-top: 1px solid #94a3b8;
  padding-top: 8px;
  color: #64748b;
}
.finance-doc__footer strong {
  display: block;
  margin-top: 8px;
  color: #111827;
}
`
