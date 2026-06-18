import { formatPartyMoney } from '../../data/parties'
import { wrapA4Document } from '../shared/a4Document'
import { escapeHtml } from '../shared/html'
import { defaultCompanyInfo, type ExportMode } from '../shared/types'
import {
  buildFinancialSummaryPdfHtml,
  renderAccountInvoiceTablePdfHtml,
} from './layout'
import type { AccountStatementTemplateData } from './types'

/** قالب PDF/طباعة A4 — كشف حساب عميل (مرجع ثابت) */
export function renderAccountStatementPdfHtml(
  data: AccountStatementTemplateData,
  mode: ExportMode,
  options?: { embedded?: boolean },
) {
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
  const companyTagline = locale === 'ar' ? company.taglineAr : company.taglineEn
  const companyAddress = locale === 'ar' ? company.addressAr : company.addressEn
  const partyCity = locale === 'ar' ? party.cityAr : party.cityEn
  const partyAddress = locale === 'ar' ? party.addressAr : party.addressEn
  const generatedAt = new Date().toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')

  const summaryCtx = { party, financial, invoiceRows, rowTotals, labels, reconcile }
  const tableCtx = { party, locale, invoiceRows, vouchers, labels, reconcile }

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

    <div class="doc-party-card">
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.party)}</span>
        <strong>${escapeHtml(partyName)}</strong>
        <small class="muted">${escapeHtml(party.id)}</small>
      </div>
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.phone)}</span>
        <strong>${escapeHtml(party.phone)}</strong>
      </div>
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.city)}</span>
        <strong>${escapeHtml(partyCity)}</strong>
      </div>
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.address)}</span>
        <strong>${escapeHtml(partyAddress)}</strong>
      </div>
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.period)}</span>
        <strong>${dateFrom} — ${dateTo}</strong>
      </div>
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.creditLimit)}</span>
        <strong>${escapeHtml(formatPartyMoney(party.creditLimit, party.currency))}</strong>
      </div>
    </div>

    ${buildFinancialSummaryPdfHtml(summaryCtx)}

    <table class="data-table data-table--account">
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
      <tbody>${renderAccountInvoiceTablePdfHtml(tableCtx)}</tbody>
    </table>

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
    extraStyles: getAccountStatementPdfStyles(),
  })
}

function getAccountStatementPdfStyles() {
  return `
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
    .muted { color: #94a3b8; }
    .doc-summary-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 6px;
    }
    .doc-summary__cell {
      padding: 7px 8px;
      border-radius: 5px;
      background: #fff;
      border: 1px solid rgba(184, 134, 11, 0.15);
      min-width: 0;
    }
    .doc-summary__cell span {
      display: block;
      font-size: 7.5px;
      color: #64748b;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .doc-summary__cell strong {
      display: block;
      font-size: 10px;
      color: #0f172a;
      line-height: 1.25;
      word-break: break-word;
    }
    .doc-summary__cell--accent {
      border-color: rgba(184, 134, 11, 0.4);
      background: rgba(184, 134, 11, 0.1);
    }
    .doc-summary__cell--accent strong { color: #b8860b; }
    .doc-summary__cell--info {
      border-color: rgba(59, 130, 246, 0.25);
      background: rgba(59, 130, 246, 0.05);
    }
    .doc-summary__cell--warning {
      border-color: rgba(245, 158, 11, 0.25);
      background: rgba(245, 158, 11, 0.05);
    }
    .doc-summary__cell--success {
      border-color: rgba(34, 197, 94, 0.25);
      background: rgba(34, 197, 94, 0.05);
    }
    .doc-summary__cell--gold {
      border-color: rgba(184, 134, 11, 0.35);
      background: rgba(184, 134, 11, 0.08);
    }
    .doc-summary__cell--gold strong { color: #b8860b; }
    .doc-reconcile-banner {
      margin-bottom: 8px;
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 9px;
      color: #991b1b;
      background: rgba(153, 27, 27, 0.12);
      border: 1px solid rgba(127, 29, 29, 0.35);
    }
    .data-table--account .voucher-row td {
      background: rgba(148, 163, 184, 0.08);
      border-top-style: dashed;
      font-size: 9px;
    }
    .data-table--account .row--reconcile td {
      background: rgba(153, 27, 27, 0.28) !important;
      border-color: rgba(127, 29, 29, 0.55);
    }
    .data-table--account .row--reconcile strong { color: #991b1b; }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 8px;
      font-weight: 700;
    }
    .badge--success { background: rgba(34, 197, 94, 0.15); color: #15803d; }
    .badge--warning { background: rgba(245, 158, 11, 0.15); color: #b45309; }
    .invoice-no { font-family: ui-monospace, monospace; font-size: 9px; color: #475569; }
    .amount--receipt strong { color: #15803d; }
    .amount--payment strong { color: #991b1b; }
    @media print {
      .doc-summary-grid { gap: 4px; }
      .doc-summary__cell { padding: 5px 6px; }
    }
  `
}
