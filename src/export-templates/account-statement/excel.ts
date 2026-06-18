import * as XLSX from 'xlsx'
import type { CustomerVoucher } from '../../data/parties'
import { formatPartyMoney } from '../../data/parties'
import { wrapExcelPreviewDocument } from '../shared/a4Document'
import { sanitizeExportFileName } from '../shared/fileNames'
import { defaultCompanyInfo, type ExportLocale } from '../shared/types'
import type { AccountInvoiceRow, AccountStatementTemplateData } from './types'

function rowGoods(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.goodsSummaryAr : row.goodsSummaryEn
}

function rowUnit(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.unitAr : row.unitEn
}

function rowNotes(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.notesAr : row.notesEn
}

function voucherNotes(voucher: CustomerVoucher, locale: ExportLocale) {
  return locale === 'ar' ? voucher.noteAr : voucher.noteEn
}

export function buildAccountStatementWorkbook(data: AccountStatementTemplateData) {
  const { party, partyName, dateFrom, dateTo, locale, invoiceRows, vouchers, financial, rowTotals, labels, isSample } =
    data
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
    [],
    [labels.financialSummary],
    [`${labels.openingBalance}: ${formatPartyMoney(financial.openingBalance, party.currency)}`],
    [`${labels.invoicesTotal}: ${formatPartyMoney(financial.invoicesTotal, party.currency)}`],
    [`${labels.receiptsTotal}: ${formatPartyMoney(financial.receiptsTotal, party.currency)}`],
    [`${labels.paymentsTotal}: ${formatPartyMoney(financial.paymentsTotal, party.currency)}`],
    [`${labels.receivables}: ${formatPartyMoney(financial.closingBalance, party.currency)}`],
    [`${labels.creditLimit}: ${formatPartyMoney(financial.creditLimit, party.currency)}`],
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

  const invoiceSheetRows = invoiceRows.map((row) => [
    rowGoods(row, locale),
    row.pieces,
    `${row.totalLength} ${rowUnit(row, locale)}`,
    row.avgUnitPrice,
    row.invoiceTotal,
    row.invoiceNo,
    row.date,
    rowNotes(row, locale),
  ])

  invoiceSheetRows.push([
    labels.footerTotal,
    rowTotals.pieces,
    rowTotals.lengths,
    '',
    rowTotals.amount,
    '',
    '',
    '',
  ])

  const linesSheet = XLSX.utils.aoa_to_sheet([...headerRows, columnHeaders, ...invoiceSheetRows])
  linesSheet['!cols'] = [
    { wch: 30 },
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
    const vouchersSheet = XLSX.utils.aoa_to_sheet([[labels.vouchersSheet], [], voucherHeaders, ...voucherRows])
    vouchersSheet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 32 }]
    XLSX.utils.book_append_sheet(workbook, vouchersSheet, labels.vouchersSheet.slice(0, 31))
  }

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
