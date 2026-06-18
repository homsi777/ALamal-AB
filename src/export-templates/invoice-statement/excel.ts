import * as XLSX from 'xlsx'
import type { CustomerStatementLine, CustomerVoucher } from '../../data/parties'
import { formatPartyMoney } from '../../data/parties'
import { wrapExcelPreviewDocument } from '../shared/a4Document'
import { sanitizeExportFileName } from '../shared/fileNames'
import { defaultCompanyInfo, type ExportLocale } from '../shared/types'
import type { InvoiceStatementTemplateData } from './types'

function lineGoods(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
}

function lineUnit(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.unitAr : line.unitEn
}

function lineNotes(line: CustomerStatementLine, locale: ExportLocale) {
  return locale === 'ar' ? line.notesAr : line.notesEn
}

function voucherNotes(voucher: CustomerVoucher, locale: ExportLocale) {
  return locale === 'ar' ? voucher.noteAr : voucher.noteEn
}

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

  const lineRows = lines.map((line) => [
    lineGoods(line, locale),
    line.pieces,
    `${line.totalLength} ${lineUnit(line, locale)}`,
    line.unitPrice,
    line.lineTotal,
    line.invoiceNo,
    line.date,
    lineNotes(line, locale),
  ])

  lineRows.push([
    labels.footerTotal,
    lineTotals.pieces,
    lineTotals.lengths,
    '',
    lineTotals.amount,
    '',
    '',
    '',
  ])

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
    const voucherRows = vouchers.map((voucher) => [
      voucher.date,
      voucher.type === 'receipt' ? labels.receipt : labels.payment,
      voucher.ref,
      voucher.amount,
      voucherNotes(voucher, locale),
    ])
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
