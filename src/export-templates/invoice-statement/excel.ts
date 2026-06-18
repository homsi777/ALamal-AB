import * as XLSX from 'xlsx'
import { formatPartyMoney } from '../../data/parties'
import { wrapExcelPreviewDocument } from '../shared/a4Document'
import { sanitizeExportFileName } from '../shared/fileNames'
import { defaultCompanyInfo } from '../shared/types'
import {
  buildInvoiceLineExcelRows,
  buildInvoiceVoucherExcelRows,
} from './layout'
import type { InvoiceStatementTemplateData } from './types'

/** قالب Excel — كشف فاتورة (مرجع ثابت) */
export function buildInvoiceStatementWorkbook(data: InvoiceStatementTemplateData) {
  const { party, partyName, dateFrom, dateTo, locale, lines, vouchers, lineTotals, labels, isSample } = data
  const company = defaultCompanyInfo
  const companyName = locale === 'ar' ? company.nameAr : company.nameEn

  const headerRows: (string | number)[][] = [
    [companyName],
    [labels.title],
    isSample ? [labels.sampleBadge] : [],
    [`${labels.party}: ${partyName} (${party.id})`],
    [`${labels.period}: ${dateFrom} — ${dateTo}`],
    [`${labels.balance}: ${formatPartyMoney(party.balance, party.currency)}`],
    [],
  ].filter((row) => row.length > 0)

  const columnHeaders = [
    labels.colGoodsType,
    labels.colPieces,
    labels.colLengths,
    labels.colPrice,
    labels.colLineTotal,
    labels.colInvoiceNo,
    labels.colDate,
    labels.colNotes,
  ]

  const lineRows = buildInvoiceLineExcelRows(lines, locale, lineTotals, labels)

  const linesSheet = XLSX.utils.aoa_to_sheet([...headerRows, columnHeaders, ...lineRows])
  linesSheet['!cols'] = [
    { wch: 28 },
    { wch: 8 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 32 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, linesSheet, labels.linesSheet.slice(0, 31))

  if (vouchers.length > 0) {
    const voucherHeaders = [
      labels.colDate,
      labels.colVoucherType,
      labels.colVoucherRef,
      labels.colVoucherAmount,
      labels.colNotes,
    ]
    const voucherRows = buildInvoiceVoucherExcelRows(vouchers, locale, labels)
    const vouchersSheet = XLSX.utils.aoa_to_sheet([...headerRows.slice(0, 3), [], voucherHeaders, ...voucherRows])
    vouchersSheet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 32 }]
    XLSX.utils.book_append_sheet(workbook, vouchersSheet, labels.vouchersSheet.slice(0, 31))
  }

  return workbook
}

export function renderInvoiceStatementExcelPreviewHtml(
  data: InvoiceStatementTemplateData,
  options?: { embedded?: boolean },
) {
  const workbook = buildInvoiceStatementWorkbook(data)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const tableHtml = XLSX.utils.sheet_to_html(firstSheet, { id: 'invoice-statement-excel-preview' })

  return wrapExcelPreviewDocument({
    title: `${data.labels.title} — Excel`,
    locale: data.locale,
    bodyHtml: tableHtml,
    previewBanner: data.labels.previewExcelBanner,
    printLabel: data.labels.print,
    closeLabel: data.labels.close,
    embedded: options?.embedded,
  })
}

export function downloadInvoiceStatementExcel(data: InvoiceStatementTemplateData) {
  const workbook = buildInvoiceStatementWorkbook(data)
  const fileName = `${sanitizeExportFileName(data.party.id)}-invoice-${data.dateFrom}-${data.dateTo}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
