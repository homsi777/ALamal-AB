import * as XLSX from 'xlsx'
import { formatPartyMoney } from '../../data/parties'
import { wrapExcelPreviewDocument } from '../shared/a4Document'
import { sanitizeExportFileName } from '../shared/fileNames'
import { defaultCompanyInfo } from '../shared/types'
import {
  buildAccountInvoiceExcelRows,
  buildFinancialSummaryExcelRows,
} from './layout'
import type { AccountStatementTemplateData } from './types'

/** قالب Excel — كشف حساب عميل (مرجع ثابت) */
export function buildAccountStatementWorkbook(data: AccountStatementTemplateData) {
  const {
    party,
    partyName,
    dateFrom,
    dateTo,
    locale,
    invoiceRows,
    vouchers,
    financial,
    rowTotals,
    labels,
    reconcile,
    isSample,
  } = data
  const company = defaultCompanyInfo
  const companyName = locale === 'ar' ? company.nameAr : company.nameEn
  const partyCity = locale === 'ar' ? party.cityAr : party.cityEn
  const partyAddress = locale === 'ar' ? party.addressAr : party.addressEn

  const headerRows: (string | number)[][] = [
    [companyName],
    [labels.title],
    isSample ? [labels.sampleBadge] : [],
    [`${labels.party}: ${partyName} (${party.id})`],
    [`${labels.phone}: ${party.phone}`],
    [`${labels.city}: ${partyCity}`],
    [`${labels.address}: ${partyAddress}`],
    [`${labels.period}: ${dateFrom} — ${dateTo}`],
    [`${labels.creditLimit}: ${formatPartyMoney(party.creditLimit, party.currency)}`],
    [],
  ].filter((row) => row.length > 0)

  const summaryRows = buildFinancialSummaryExcelRows({
    party,
    financial,
    invoiceRows,
    rowTotals,
    labels,
    reconcile,
  })

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

  const invoiceSheetRows = buildAccountInvoiceExcelRows({
    locale,
    invoiceRows,
    vouchers,
    labels,
    reconcile,
  })

  const linesSheet = XLSX.utils.aoa_to_sheet([
    ...headerRows,
    ...summaryRows,
    columnHeaders,
    ...invoiceSheetRows,
  ])
  linesSheet['!cols'] = [
    { wch: 32 },
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

  return workbook
}

export function renderAccountStatementExcelPreviewHtml(
  data: AccountStatementTemplateData,
  options?: { embedded?: boolean },
) {
  const workbook = buildAccountStatementWorkbook(data)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const tableHtml = XLSX.utils.sheet_to_html(firstSheet, { id: 'account-statement-excel-preview' })

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

export function downloadAccountStatementExcel(data: AccountStatementTemplateData) {
  const workbook = buildAccountStatementWorkbook(data)
  const fileName = `${sanitizeExportFileName(data.party.id)}-account-${data.dateFrom}-${data.dateTo}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
