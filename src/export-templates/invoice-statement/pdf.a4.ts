import { formatPartyMoney } from '../../data/parties'
import type { CustomerStatementLine, CustomerVoucher } from '../../data/parties'
import { wrapA4Document } from '../shared/a4Document'
import { escapeHtml } from '../shared/html'
import { defaultCompanyInfo, type ExportLocale, type ExportMode } from '../shared/types'
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

export function renderInvoiceStatementPdfHtml(
  data: InvoiceStatementTemplateData,
  mode: ExportMode,
  options?: { embedded?: boolean },
) {
  const { party, partyName, dateFrom, dateTo, locale, lines, vouchers, lineTotals, labels, isSample } = data
  const company = defaultCompanyInfo
  const companyName = locale === 'ar' ? company.nameAr : company.nameEn
  const companyTagline = locale === 'ar' ? company.taglineAr : company.taglineEn
  const companyAddress = locale === 'ar' ? company.addressAr : company.addressEn
  const generatedAt = new Date().toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')

  const linesHtml = lines
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

  const vouchersHtml =
    vouchers.length > 0
      ? `
      <h2 class="section-title">${escapeHtml(labels.vouchersSheet)}</h2>
      <table class="data-table">
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
      : ''

  const sampleRibbon = isSample
    ? `<div style="margin-bottom:12px;padding:8px 12px;border-radius:6px;background:#fef3c7;border:1px solid #fbbf24;font-size:10px;color:#92400e;text-align:center;">⚠ ${escapeHtml(labels.sampleBadge)}</div>`
    : ''

  const bodyHtml = `
    ${sampleRibbon}
    <header class="doc-header">
      <div class="doc-header__brand">
        <strong>${escapeHtml(companyName)}</strong>
        <span>${escapeHtml(companyTagline)}</span>
      </div>
      <div class="doc-header__company-meta">
        <div>${escapeHtml(company.phone)}</div>
        <div>${escapeHtml(companyAddress)}</div>
      </div>
    </header>

    <h1 class="doc-title">${escapeHtml(labels.title)}</h1>

    <div class="doc-meta">
      <div class="doc-meta__item">
        <span>${escapeHtml(labels.party)}</span>
        <strong>${escapeHtml(partyName)}</strong>
        <small style="color:#94a3b8">${escapeHtml(party.id)}</small>
      </div>
      <div class="doc-meta__item">
        <span>${escapeHtml(labels.period)}</span>
        <strong>${dateFrom} — ${dateTo}</strong>
      </div>
      <div class="doc-meta__item doc-meta__item--accent">
        <span>${escapeHtml(labels.balance)}</span>
        <strong>${escapeHtml(formatPartyMoney(party.balance, party.currency))}</strong>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>${escapeHtml(labels.colGoodsType)}</th>
          <th>${escapeHtml(labels.colPieces)}</th>
          <th>${escapeHtml(labels.colLengths)}</th>
          <th>${escapeHtml(labels.colPrice)}</th>
          <th>${escapeHtml(labels.colLineTotal)}</th>
          <th>${escapeHtml(labels.colInvoiceNo)}</th>
          <th>${escapeHtml(labels.colDate)}</th>
          <th>${escapeHtml(labels.colNotes)}</th>
        </tr>
      </thead>
      <tbody>${linesHtml}</tbody>
      <tfoot>
        <tr>
          <td>${escapeHtml(labels.footerTotal)}</td>
          <td class="num">${lineTotals.pieces}</td>
          <td class="num">${lineTotals.lengths}</td>
          <td></td>
          <td class="num">${escapeHtml(formatPartyMoney(lineTotals.amount, party.currency))}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>

    ${vouchersHtml}

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
    </div>

    <footer class="doc-footer">
      <span>${escapeHtml(labels.generatedAt)}: ${generatedAt}</span>
      <span>${escapeHtml(companyName)} — ${escapeHtml(labels.title)}</span>
    </footer>
  `

  return wrapA4Document({
    title: `${labels.title} — ${partyName}`,
    locale,
    mode,
    bodyHtml,
    previewBanner: labels.previewBanner,
    printLabel: labels.print,
    closeLabel: labels.close,
    embedded: options?.embedded,
  })
}
