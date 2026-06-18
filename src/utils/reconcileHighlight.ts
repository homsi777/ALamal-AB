import type { AccountInvoiceRow } from '../export-templates/account-statement/types'

/** آخر فاتورة في الجدول بتاريخ المطابقة المحدد */
export function findLastInvoiceNoByDate(rows: AccountInvoiceRow[], date: string): string | null {
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].date === date) return rows[index].invoiceNo
  }
  return null
}
