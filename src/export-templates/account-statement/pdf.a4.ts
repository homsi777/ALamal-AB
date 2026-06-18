import { formatPartyMoney } from '../../data/parties'
import type { CustomerVoucher } from '../../data/parties'
import { wrapA4Document } from '../shared/a4Document'
import { escapeHtml } from '../shared/html'
import { defaultCompanyInfo, type ExportLocale, type ExportMode } from '../shared/types'
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
    isSample,
  } = data
  const company = defaultCompanyInfo
  const companyName = locale === 'ar' ? company.nameAr : company.nameEn
  const companyTagline = locale === 'ar' ? company.taglineAr : company.taglineEn
  const companyAddress = locale === 'ar' ? company.addressAr : company.addressEn
  const partyCity = locale === 'ar' ? party.cityAr : party.cityEn
  const partyAddress = locale === 'ar' ? party.addressAr : party.addressEn
  const generatedAt = new Date().toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')

  const rowsHtml = invoiceRows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(rowGoods(row, locale))}</td>
        <td class="num">${row.pieces}</td>
        <td class="num">${row.totalLength} ${escapeHtml(rowUnit(row, locale))}</td>
        <td class="num">${row.avgUnitPrice}</td>
        <td class="num"><strong>${escapeHtml(formatPartyMoney(row.invoiceTotal, party.currency))}</strong></td>
        <td><span class="invoice-no">${escapeHtml(row.invoiceNo)}</span></td>
        <td>${row.date}</td>
        <td>${escapeHtml(rowNotes(row, locale))}</td>
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

    <div class="doc-party-card">
      <div class="doc-party-card__item">
        <span>${escapeHtml(labels.party)}</span>
        <strong>${escapeHtml(partyName)}</strong>
        <small style="color:#94a3b8">${escapeHtml(party.id)}</small>
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

    <div class="doc-financial">
      <div class="doc-financial__title">${escapeHtml(labels.financialSummary)}</div>
      <div class="doc-financial__grid">
        <div class="doc-financial__item">
          <span>${escapeHtml(labels.openingBalance)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.openingBalance, party.currency))}</strong>
        </div>
        <div class="doc-financial__item">
          <span>${escapeHtml(labels.invoicesTotal)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.invoicesTotal, party.currency))}</strong>
        </div>
        <div class="doc-financial__item">
          <span>${escapeHtml(labels.receiptsTotal)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.receiptsTotal, party.currency))}</strong>
        </div>
        <div class="doc-financial__item">
          <span>${escapeHtml(labels.paymentsTotal)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.paymentsTotal, party.currency))}</strong>
        </div>
        <div class="doc-financial__item doc-financial__item--accent">
          <span>${escapeHtml(labels.receivables)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.closingBalance, party.currency))}</strong>
        </div>
        <div class="doc-financial__item doc-financial__item--accent">
          <span>${escapeHtml(labels.closingBalance)}</span>
          <strong>${escapeHtml(formatPartyMoney(financial.closingBalance, party.currency))}</strong>
        </div>
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
      <tbody>${rowsHtml}</tbody>
      <tfoot>
        <tr>
          <td>${escapeHtml(labels.footerTotal)}</td>
          <td class="num">${rowTotals.pieces}</td>
          <td class="num">${rowTotals.lengths}</td>
          <td></td>
          <td class="num">${escapeHtml(formatPartyMoney(rowTotals.amount, party.currency))}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>

    ${vouchersHtml}

    <div class="kpi-row">
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiInvoices)}</span>
        <strong>${invoiceRows.length}</strong>
      </div>
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiPieces)}</span>
        <strong>${rowTotals.pieces}</strong>
      </div>
      <div class="kpi-box">
        <span>${escapeHtml(labels.kpiLengths)}</span>
        <strong>${rowTotals.lengths}</strong>
      </div>
      <div class="kpi-box kpi-box--gold">
        <span>${escapeHtml(labels.kpiAmount)}</span>
        <strong>${escapeHtml(formatPartyMoney(rowTotals.amount, party.currency))}</strong>
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
