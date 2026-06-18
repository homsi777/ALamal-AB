import type { CustomerStatementLine, CustomerVoucher, PartyRecord } from '../../data/parties'
import type { ExportLocale } from '../shared/types'
import type { AccountFinancialSummary, AccountInvoiceRow } from './types'

export function aggregateLinesByInvoice(
  lines: CustomerStatementLine[],
  locale: ExportLocale,
): AccountInvoiceRow[] {
  const groups = new Map<string, CustomerStatementLine[]>()

  for (const line of lines) {
    const bucket = groups.get(line.invoiceNo) ?? []
    bucket.push(line)
    groups.set(line.invoiceNo, bucket)
  }

  return Array.from(groups.entries())
    .map(([invoiceNo, group]) => {
      const pieces = group.reduce((sum, line) => sum + line.pieces, 0)
      const totalLength = group.reduce((sum, line) => sum + line.totalLength, 0)
      const invoiceTotal = group.reduce((sum, line) => sum + line.lineTotal, 0)
      const avgUnitPrice = totalLength > 0 ? Math.round((invoiceTotal / totalLength) * 100) / 100 : 0
      const goodsTypes = [...new Set(group.map((line) => (locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn)))]
      const goodsSummaryAr =
        goodsTypes.length <= 2
          ? group.map((line) => line.goodsTypeAr).filter((v, i, a) => a.indexOf(v) === i).join(' + ')
          : `${goodsTypes.length} أصناف`
      const goodsSummaryEn =
        goodsTypes.length <= 2
          ? group.map((line) => line.goodsTypeEn).filter((v, i, a) => a.indexOf(v) === i).join(' + ')
          : `${goodsTypes.length} items`
      const primaryUnit = group[0]
      const notesAr = [...new Set(group.map((line) => line.notesAr).filter(Boolean))].join(' · ')
      const notesEn = [...new Set(group.map((line) => line.notesEn).filter(Boolean))].join(' · ')

      return {
        invoiceNo,
        date: group[0].date,
        goodsSummaryAr,
        goodsSummaryEn,
        pieces,
        totalLength,
        unitAr: primaryUnit.unitAr,
        unitEn: primaryUnit.unitEn,
        avgUnitPrice,
        invoiceTotal,
        notesAr,
        notesEn,
        lineCount: group.length,
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.invoiceNo.localeCompare(b.invoiceNo))
}

export function buildAccountFinancialSummary(
  party: PartyRecord,
  vouchers: CustomerVoucher[],
  invoicesTotal: number,
): AccountFinancialSummary {
  const receiptsTotal = vouchers
    .filter((voucher) => voucher.type === 'receipt')
    .reduce((sum, voucher) => sum + voucher.amount, 0)
  const paymentsTotal = vouchers
    .filter((voucher) => voucher.type === 'payment')
    .reduce((sum, voucher) => sum + voucher.amount, 0)
  const closingBalance = party.balance
  const openingBalance = closingBalance - invoicesTotal + receiptsTotal - paymentsTotal

  return {
    openingBalance,
    invoicesTotal,
    receiptsTotal,
    paymentsTotal,
    closingBalance,
    creditLimit: party.creditLimit,
  }
}

export function sumAccountInvoiceRows(rows: AccountInvoiceRow[]) {
  return {
    pieces: rows.reduce((sum, row) => sum + row.pieces, 0),
    lengths: rows.reduce((sum, row) => sum + row.totalLength, 0),
    amount: rows.reduce((sum, row) => sum + row.invoiceTotal, 0),
  }
}

export function getVouchersForInvoice(vouchers: CustomerVoucher[], invoiceNo: string) {
  return vouchers.filter((voucher) => voucher.invoiceNo === invoiceNo)
}

type VoucherLabelSet = { receipt: string; payment: string; returnVoucher?: string }

export function accountVoucherTypeLabel(voucher: CustomerVoucher, labels: VoucherLabelSet) {
  if (voucher.type === 'payment' && labels.returnVoucher) {
    return labels.returnVoucher
  }
  return voucher.type === 'receipt' ? labels.receipt : labels.payment
}

export function accountVoucherNote(
  voucher: CustomerVoucher,
  locale: ExportLocale,
  useReturnInvoiceNo: boolean,
) {
  if (useReturnInvoiceNo && voucher.type === 'payment' && voucher.invoiceNo) {
    return voucher.invoiceNo
  }
  return locale === 'ar' ? voucher.noteAr : voucher.noteEn
}
