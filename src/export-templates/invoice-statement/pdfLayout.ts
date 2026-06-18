/**
 * قالب PDF/طباعة — كشف فاتورة (تفصيل أصناف) — مرجع ثابت
 */
import { formatPartyMoney } from '../../data/parties'
import type { CustomerStatementLine, CustomerVoucher } from '../../data/parties'
import { escapeHtml } from '../shared/html'
import type { ExportLocale } from '../shared/types'
import { lineGoods, lineNotes, lineUnit, voucherNotes } from './layout'
import type { InvoiceStatementLabels } from './types'

export function renderInvoiceLinesPdfHtml(
  lines: CustomerStatementLine[],
  party: { currency: import('../../data/parties').PartyRecord['currency'] },
  locale: ExportLocale,
) {
  return lines
    .map(
      (line) => `
      <tr>
        <td>${escapeHtml(lineGoods(line, locale))}</td>
        <td class="num">${line.pieces}</td>
        <td class="num">${line.totalLength} ${escapeHtml(lineUnit(line, locale))}</td>
        <td class="num">${line.unitPrice}</td>
        <td class="num"><strong>${escapeHtml(formatPartyMoney(line.lineTotal, party.currency))}</strong></td>
        <td>${escapeHtml(line.invoiceNo)}</td>
        <td>${line.date}</td>
        <td>${escapeHtml(lineNotes(line, locale))}</td>
      </tr>`,
    )
    .join('')
}

export function renderInvoiceVouchersPdfHtml(
  vouchers: CustomerVoucher[],
  party: { currency: import('../../data/parties').PartyRecord['currency'] },
  locale: ExportLocale,
  labels: InvoiceStatementLabels,
) {
  if (vouchers.length === 0) return ''

  return `
      <h2 class="section-title">${escapeHtml(labels.vouchersSheet)}</h2>
      <table class="data-table data-table--invoice-vouchers">
        <thead>
          <tr>
            <th>${escapeHtml(labels.colDate)}</th>
            <th>${escapeHtml(labels.colVoucherType)}</th>
            <th>${escapeHtml(labels.colVoucherRef)}</th>
            <th>${escapeHtml(labels.colVoucherAmount)}</th>
            <th>${escapeHtml(labels.colNotes)}</th>
          </tr>
        </thead>
        <tbody>
          ${vouchers
            .map(
              (voucher) => `
            <tr>
              <td>${voucher.date}</td>
              <td>${voucher.type === 'receipt' ? escapeHtml(labels.receipt) : escapeHtml(labels.payment)}</td>
              <td>${escapeHtml(voucher.ref)}</td>
              <td class="num"><strong>${escapeHtml(formatPartyMoney(voucher.amount, party.currency))}</strong></td>
              <td>${escapeHtml(voucherNotes(voucher, locale))}</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table>`
}

export function renderInvoiceKpiPdfHtml(
  lines: CustomerStatementLine[],
  lineTotals: { pieces: number; lengths: number; amount: number },
  party: { currency: import('../../data/parties').PartyRecord['currency'] },
  labels: InvoiceStatementLabels,
) {
  return `
    <div class="kpi-row">
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiLines)}</span>
        <strong>${lines.length}</strong>
      </div>
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiPieces)}</span>
        <strong>${lineTotals.pieces}</strong>
      </div>
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiLengths)}</span>
        <strong>${lineTotals.lengths}</strong>
      </div>
      <div class="kpi-box kpi-box--gold">
        <span>${escapeHtml(labels.kpiAmount)}</span>
        <strong>${escapeHtml(formatPartyMoney(lineTotals.amount, party.currency))}</strong>
      </div>
    </div>`
}
