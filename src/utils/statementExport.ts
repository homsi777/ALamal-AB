import * as XLSX from 'xlsx'
import type { CustomerStatementLine, CustomerVoucher, PartyRecord } from '../data/parties'
import { formatPartyMoney } from '../data/parties'

export type StatementExportLabels = {
  title: string
  party: string
  period: string
  balance: string
  linesSheet: string
  vouchersSheet: string
  colGoodsType: string
  colPieces: string
  colLengths: string
  colPrice: string
  colLineTotal: string
  colInvoiceNo: string
  colDate: string
  colNotes: string
  colVoucherType: string
  colVoucherRef: string
  colVoucherAmount: string
  footerTotal: string
  receipt: string
  payment: string
  whatsappIntro: string
  whatsappLines: string
  whatsappAmount: string
}

type StatementExportContext = {
  party: PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  locale: 'ar' | 'en'
  lines: CustomerStatementLine[]
  vouchers: CustomerVoucher[]
  lineTotals: { pieces: number; lengths: number; amount: number }
  labels: StatementExportLabels
}

function lineGoods(line: CustomerStatementLine, locale: 'ar' | 'en') {
  return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
}

function lineUnit(line: CustomerStatementLine, locale: 'ar' | 'en') {
  return locale === 'ar' ? line.unitAr : line.unitEn
}

function lineNotes(line: CustomerStatementLine, locale: 'ar' | 'en') {
  return locale === 'ar' ? line.notesAr : line.notesEn
}

function voucherNotes(voucher: CustomerVoucher, locale: 'ar' | 'en') {
  return locale === 'ar' ? voucher.noteAr : voucher.noteEn
}

function sanitizeFileName(value: string) {
  return value.replace(/[^\w\u0600-\u06FF-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export function exportStatementExcel(ctx: StatementExportContext) {
  const { party, dateFrom, dateTo, locale, lines, vouchers, lineTotals, labels } = ctx

  const linesRows = lines.map((line) => ({
    [labels.colGoodsType]: lineGoods(line, locale),
    [labels.colPieces]: line.pieces,
    [labels.colLengths]: `${line.totalLength} ${lineUnit(line, locale)}`,
    [labels.colPrice]: line.unitPrice,
    [labels.colLineTotal]: line.lineTotal,
    [labels.colInvoiceNo]: line.invoiceNo,
    [labels.colDate]: line.date,
    [labels.colNotes]: lineNotes(line, locale),
  }))

  linesRows.push({
    [labels.colGoodsType]: labels.footerTotal,
    [labels.colPieces]: lineTotals.pieces,
    [labels.colLengths]: String(lineTotals.lengths),
    [labels.colPrice]: '',
    [labels.colLineTotal]: lineTotals.amount,
    [labels.colInvoiceNo]: '',
    [labels.colDate]: '',
    [labels.colNotes]: '',
  })

  const workbook = XLSX.utils.book_new()
  const linesSheet = XLSX.utils.json_to_sheet(linesRows)
  XLSX.utils.book_append_sheet(workbook, linesSheet, labels.linesSheet)

  if (vouchers.length > 0) {
    const voucherRows = vouchers.map((voucher) => ({
      [labels.colDate]: voucher.date,
      [labels.colVoucherType]: voucher.type === 'receipt' ? labels.receipt : labels.payment,
      [labels.colVoucherRef]: voucher.ref,
      [labels.colVoucherAmount]: voucher.amount,
      [labels.colNotes]: voucherNotes(voucher, locale),
    }))
    const vouchersSheet = XLSX.utils.json_to_sheet(voucherRows)
    XLSX.utils.book_append_sheet(workbook, vouchersSheet, labels.vouchersSheet)
  }

  const fileName = `${sanitizeFileName(party.id)}-${dateFrom}-${dateTo}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

function buildPrintableHtml(ctx: StatementExportContext) {
  const { party, partyName, dateFrom, dateTo, locale, lines, vouchers, lineTotals, labels } = ctx
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const lang = locale === 'ar' ? 'ar' : 'en'

  const linesHtml = lines
    .map(
      (line) => `
      <tr>
        <td>${lineGoods(line, locale)}</td>
        <td>${line.pieces}</td>
        <td>${line.totalLength} ${lineUnit(line, locale)}</td>
        <td>${line.unitPrice}</td>
        <td>${formatPartyMoney(line.lineTotal, party.currency)}</td>
        <td>${line.invoiceNo}</td>
        <td>${line.date}</td>
        <td>${lineNotes(line, locale)}</td>
      </tr>`,
    )
    .join('')

  const vouchersHtml =
    vouchers.length > 0
      ? `
      <h2>${labels.vouchersSheet}</h2>
      <table>
        <thead>
          <tr>
            <th>${labels.colDate}</th>
            <th>${labels.colVoucherType}</th>
            <th>${labels.colVoucherRef}</th>
            <th>${labels.colVoucherAmount}</th>
            <th>${labels.colNotes}</th>
          </tr>
        </thead>
        <tbody>
          ${vouchers
            .map(
              (voucher) => `
            <tr>
              <td>${voucher.date}</td>
              <td>${voucher.type === 'receipt' ? labels.receipt : labels.payment}</td>
              <td>${voucher.ref}</td>
              <td>${formatPartyMoney(voucher.amount, party.currency)}</td>
              <td>${voucherNotes(voucher, locale)}</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table>`
      : ''

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${labels.title} — ${partyName}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Cairo', 'Tajawal', sans-serif;
      margin: 0;
      padding: 24px;
      color: #0f172a;
      font-size: 12px;
      line-height: 1.45;
    }
    h1 { margin: 0 0 8px; font-size: 20px; }
    .meta { margin-bottom: 20px; color: #475569; }
    .meta p { margin: 4px 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: start;
    }
    th {
      background: #f1f5f9;
      font-weight: 700;
    }
    tfoot td { font-weight: 700; background: #fffbeb; }
    h2 { font-size: 14px; margin: 24px 0 12px; }
    @page { size: A4; margin: 14mm; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <h1>${labels.title}</h1>
  <div class="meta">
    <p><strong>${labels.party}:</strong> ${partyName} (${party.id})</p>
    <p><strong>${labels.period}:</strong> ${dateFrom} — ${dateTo}</p>
    <p><strong>${labels.balance}:</strong> ${formatPartyMoney(party.balance, party.currency)}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>${labels.colGoodsType}</th>
        <th>${labels.colPieces}</th>
        <th>${labels.colLengths}</th>
        <th>${labels.colPrice}</th>
        <th>${labels.colLineTotal}</th>
        <th>${labels.colInvoiceNo}</th>
        <th>${labels.colDate}</th>
        <th>${labels.colNotes}</th>
      </tr>
    </thead>
    <tbody>${linesHtml}</tbody>
    <tfoot>
      <tr>
        <td>${labels.footerTotal}</td>
        <td>${lineTotals.pieces}</td>
        <td>${lineTotals.lengths}</td>
        <td></td>
        <td>${formatPartyMoney(lineTotals.amount, party.currency)}</td>
        <td colspan="3"></td>
      </tr>
    </tfoot>
  </table>
  ${vouchersHtml}
  <script>
    window.addEventListener('load', function () {
      window.focus();
      window.print();
    });
  </script>
</body>
</html>`
}

export function exportStatementPdf(ctx: StatementExportContext) {
  const html = buildPrintableHtml(ctx)
  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) return
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

export function printStatementA4() {
  window.print()
}

export function shareStatementWhatsapp(ctx: StatementExportContext) {
  const { party, partyName, dateFrom, dateTo, lineTotals, labels } = ctx
  const message = [
    labels.whatsappIntro.replace('{party}', partyName),
    `${labels.period}: ${dateFrom} — ${dateTo}`,
    `${labels.whatsappLines}: ${ctx.lines.length}`,
    `${labels.whatsappAmount}: ${formatPartyMoney(lineTotals.amount, party.currency)}`,
    `${labels.balance}: ${formatPartyMoney(party.balance, party.currency)}`,
  ].join('\n')

  const digits = party.phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  const url = digits.length >= 8 ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
