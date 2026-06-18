import { formatPartyMoney } from '../../data/parties'
import { wrapA4Document } from '../shared/a4Document'
import { escapeHtml } from '../shared/html'
import { defaultCompanyInfo, type ExportMode } from '../shared/types'
import {
  renderInvoiceKpiPdfHtml,
  renderInvoiceLinesPdfHtml,
  renderInvoiceVouchersPdfHtml,
} from './pdfLayout'
import type { InvoiceStatementTemplateData } from './types'

/** قالب PDF/طباعة A4 — كشف فاتورة (مرجع ثابت) */
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

  const sampleRibbon = isSample
    ? `<div class="sample-ribbon">⚠ ${escapeHtml(labels.sampleBadge)}</div>`
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

    <table class="data-table data-table--invoice">
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
      <tbody>${renderInvoiceLinesPdfHtml(lines, party, locale)}</tbody>
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

    ${renderInvoiceVouchersPdfHtml(vouchers, party, locale, labels)}

    ${renderInvoiceKpiPdfHtml(lines, lineTotals, party, labels)}

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
    extraStyles: `
      .sample-ribbon {
        margin-bottom: 12px;
        padding: 8px 12px;
        border-radius: 6px;
        background: #fef3c7;
        border: 1px solid #fbbf24;
        font-size: 10px;
        color: #92400e;
        text-align: center;
      }
    `,
  })
}
