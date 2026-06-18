/**
 * قالب كشف حساب عميل — تخطيط ثابت (PDF / Excel)
 * يطابق واجهة PartyAccountStatementPage: ملخص مالي صفّان × 5، فواتير + سندات مدمجة، تمييز المطابقة.
 */
import { formatPartyMoney } from '../../data/parties'
import type { CustomerVoucher, PartyRecord } from '../../data/parties'
import { escapeHtml } from '../shared/html'
import type { ExportLocale } from '../shared/types'
import {
  accountVoucherNote,
  accountVoucherTypeLabel,
  getVouchersForInvoice,
} from './aggregate'
import type {
  AccountInvoiceRow,
  AccountStatementLabels,
  AccountStatementReconcileMark,
  AccountStatementTemplateData,
} from './types'

type SummarySlice = Pick<
  AccountStatementTemplateData,
  'party' | 'financial' | 'invoiceRows' | 'rowTotals' | 'labels' | 'reconcile'
>

function money(party: PartyRecord, amount: number) {
  return formatPartyMoney(amount, party.currency)
}

function summaryCells(ctx: SummarySlice) {
  const { party, financial, invoiceRows, rowTotals, labels } = ctx
  return {
    row1: [
      { label: labels.openingBalance, value: money(party, financial.openingBalance) },
      { label: labels.invoicesTotal, value: money(party, financial.invoicesTotal) },
      { label: labels.receiptsTotal, value: money(party, financial.receiptsTotal) },
      { label: labels.paymentsTotal, value: money(party, financial.paymentsTotal) },
      { label: labels.receivables, value: money(party, financial.closingBalance), accent: true },
    ],
    row2: [
      { label: labels.closingBalance, value: money(party, financial.closingBalance), accent: true },
      { label: labels.kpiInvoices, value: String(invoiceRows.length), tone: 'info' },
      { label: labels.kpiPieces, value: String(rowTotals.pieces), tone: 'warning' },
      { label: labels.kpiLengths, value: String(rowTotals.lengths), tone: 'success' },
      { label: labels.kpiAmount, value: money(party, rowTotals.amount), tone: 'gold' },
    ],
  }
}

export function buildFinancialSummaryPdfHtml(ctx: SummarySlice): string {
  const { labels, reconcile } = ctx
  const { row1, row2 } = summaryCells(ctx)

  const cellHtml = (
    label: string,
    value: string,
    extraClass = '',
  ) => `
      <div class="doc-summary__cell ${extraClass}">
        <span>${escapeHtml(label)}</span>
        <strong>${value.includes('<') ? value : escapeHtml(value)}</strong>
      </div>`

  const mapCell = (cell: { label: string; value: string; accent?: boolean; tone?: string }) => {
    const modifier = cell.accent
      ? 'doc-summary__cell--accent'
      : cell.tone
        ? `doc-summary__cell--${cell.tone}`
        : ''
    return cellHtml(cell.label, cell.value, modifier)
  }

  const reconcileBanner =
    reconcile?.date && reconcile.invoiceNo && labels.reconcileDateLabel
      ? `<div class="doc-reconcile-banner">${escapeHtml(labels.reconcileDateLabel)}: <strong>${escapeHtml(reconcile.date)}</strong></div>`
      : ''

  return `
    <div class="doc-financial">
      <div class="doc-financial__title">${escapeHtml(labels.financialSummary)}</div>
      ${reconcileBanner}
      <div class="doc-summary-grid">
        ${row1.map(mapCell).join('')}
        ${row2.map(mapCell).join('')}
      </div>
    </div>`
}

export function buildFinancialSummaryExcelRows(ctx: SummarySlice): (string | number)[][] {
  const { labels, reconcile } = ctx
  const { row1, row2 } = summaryCells(ctx)

  const labelRow = (cells: { label: string }[]) => cells.map((cell) => cell.label)
  const valueRow = (cells: { value: string }[]) => cells.map((cell) => cell.value)

  const rows: (string | number)[][] = [[labels.financialSummary], labelRow(row1), valueRow(row1)]

  if (reconcile?.date && reconcile.invoiceNo && labels.reconcileDateLabel) {
    rows.push([`${labels.reconcileDateLabel}: ${reconcile.date}`])
  }

  rows.push(labelRow(row2), valueRow(row2), [])
  return rows
}

function rowGoods(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.goodsSummaryAr : row.goodsSummaryEn
}

function rowUnit(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.unitAr : row.unitEn
}

function rowNotes(row: AccountInvoiceRow, locale: ExportLocale) {
  return locale === 'ar' ? row.notesAr : row.notesEn
}

export function renderAccountInvoiceTablePdfHtml(
  data: Pick<
    AccountStatementTemplateData,
    'party' | 'locale' | 'invoiceRows' | 'vouchers' | 'labels' | 'reconcile'
  >,
): string {
  const { party, locale, invoiceRows, vouchers, labels, reconcile } = data
  const reconcileInvoiceNo = reconcile?.invoiceNo ?? null

  return invoiceRows
    .map((row) => {
      const isReconcile = reconcileInvoiceNo !== null && row.invoiceNo === reconcileInvoiceNo
      const rowClass = isReconcile ? ' class="row--reconcile"' : ''
      const linkedVouchers = getVouchersForInvoice(vouchers, row.invoiceNo)

      const invoiceRow = `
      <tr${rowClass}>
        <td>${escapeHtml(rowGoods(row, locale))}</td>
        <td class="num">${row.pieces}</td>
        <td class="num">${row.totalLength} ${escapeHtml(rowUnit(row, locale))}</td>
        <td class="num">${row.avgUnitPrice}</td>
        <td class="num"><strong>${escapeHtml(money(party, row.invoiceTotal))}</strong></td>
        <td><span class="invoice-no">${escapeHtml(row.invoiceNo)}</span></td>
        <td>${row.date}</td>
        <td>${escapeHtml(rowNotes(row, locale))}</td>
      </tr>`

      const voucherRows = linkedVouchers
        .map((voucher) => renderVoucherRowPdf(voucher, party, locale, labels))
        .join('')

      return invoiceRow + voucherRows
    })
    .join('')
}

function renderVoucherRowPdf(
  voucher: CustomerVoucher,
  party: PartyRecord,
  locale: ExportLocale,
  labels: AccountStatementLabels,
) {
  const useReturnInvoiceNo = Boolean(labels.returnVoucher)
  const typeLabel = accountVoucherTypeLabel(voucher, labels)
  const note = accountVoucherNote(voucher, locale, useReturnInvoiceNo)
  const badgeClass = voucher.type === 'receipt' ? 'badge--success' : 'badge--warning'
  const amountClass = voucher.type === 'receipt' ? 'amount--receipt' : 'amount--payment'

  return `
      <tr class="voucher-row">
        <td><span class="badge ${badgeClass}">${escapeHtml(typeLabel)}</span></td>
        <td class="num muted">—</td>
        <td class="num muted">—</td>
        <td class="num muted">—</td>
        <td class="num ${amountClass}"><strong>${escapeHtml(money(party, voucher.amount))}</strong></td>
        <td><span class="invoice-no">${escapeHtml(voucher.ref)}</span></td>
        <td>${voucher.date}</td>
        <td>${escapeHtml(note)}</td>
      </tr>`
}

export function buildAccountInvoiceExcelRows(
  data: Pick<AccountStatementTemplateData, 'locale' | 'invoiceRows' | 'vouchers' | 'labels' | 'reconcile'>,
): (string | number)[][] {
  const { locale, invoiceRows, vouchers, labels, reconcile } = data
  const reconcileInvoiceNo = reconcile?.invoiceNo ?? null
  const useReturnInvoiceNo = Boolean(labels.returnVoucher)

  return invoiceRows.flatMap((row) => {
    const prefix = reconcileInvoiceNo && row.invoiceNo === reconcileInvoiceNo ? '◆ ' : ''
    const invoiceRow: (string | number)[] = [
      `${prefix}${rowGoods(row, locale)}`,
      row.pieces,
      `${row.totalLength} ${rowUnit(row, locale)}`,
      row.avgUnitPrice,
      row.invoiceTotal,
      row.invoiceNo,
      row.date,
      rowNotes(row, locale),
    ]

    const voucherRows = getVouchersForInvoice(vouchers, row.invoiceNo).map((voucher) => [
      accountVoucherTypeLabel(voucher, labels),
      '',
      '',
      '',
      voucher.amount,
      voucher.ref,
      voucher.date,
      accountVoucherNote(voucher, locale, useReturnInvoiceNo),
    ])

    return [invoiceRow, ...voucherRows]
  })
}

export function resolveReconcileMark(
  markedDate: string | null | undefined,
  targetInvoiceNo: string | null | undefined,
): AccountStatementReconcileMark | undefined {
  if (!markedDate || !targetInvoiceNo) return undefined
  return { date: markedDate, invoiceNo: targetInvoiceNo }
}
