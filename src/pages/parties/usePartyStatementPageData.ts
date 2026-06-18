import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  customerStatements,
  getCustomerReconciliation,
  getCustomerStatementTotals,
  getCustomerVouchers,
  getPartiesByType,
  getPartyVoucherTotals,
  getSupplierReconciliation,
  getSupplierStatementTotals,
  getSupplierVouchers,
  supplierStatementLines,
  type PartyRecord,
} from '../../data/parties'
import {
  aggregateLinesByInvoice,
  buildAccountFinancialSummary,
  sumAccountInvoiceRows,
} from '../../export-templates'

export type PartyStatementPageType = 'customer' | 'supplier'

function filterByDateRange<T extends { date: string }>(items: T[], dateFrom: string, dateTo: string) {
  return items.filter((item) => {
    if (dateFrom && item.date < dateFrom) return false
    if (dateTo && item.date > dateTo) return false
    return true
  })
}

export function usePartyStatementPageData(type: PartyStatementPageType, locale: 'ar' | 'en') {
  const [searchParams] = useSearchParams()
  const isCustomer = type === 'customer'
  const parties = getPartiesByType(type)

  const [selectedPartyId, setSelectedPartyId] = useState(
    searchParams.get('party') ?? parties[0]?.id ?? '',
  )
  const [dateFrom, setDateFrom] = useState('2026-06-01')
  const [dateTo, setDateTo] = useState('2026-06-17')

  const selectedParty = parties.find((party) => party.id === selectedPartyId) ?? parties[0]

  const partyName = (party: PartyRecord) => (locale === 'ar' ? party.nameAr : party.nameEn)

  const statementLines = useMemo(() => {
    const source = isCustomer ? customerStatements : supplierStatementLines
    return filterByDateRange(
      source.filter((line) => line.partyId === selectedParty?.id),
      dateFrom,
      dateTo,
    ).sort((a, b) => a.date.localeCompare(b.date) || a.invoiceNo.localeCompare(b.invoiceNo))
  }, [isCustomer, selectedParty?.id, dateFrom, dateTo])

  const vouchersInRange = useMemo(() => {
    const source = isCustomer
      ? getCustomerVouchers(selectedParty?.id ?? '')
      : getSupplierVouchers(selectedParty?.id ?? '')
    return filterByDateRange(source, dateFrom, dateTo).sort(
      (a, b) => a.date.localeCompare(b.date) || a.ref.localeCompare(b.ref),
    )
  }, [isCustomer, selectedParty?.id, dateFrom, dateTo])

  const lineTotals = useMemo(
    () => (isCustomer ? getCustomerStatementTotals : getSupplierStatementTotals)(statementLines),
    [isCustomer, statementLines],
  )

  const invoiceRows = useMemo(
    () => aggregateLinesByInvoice(statementLines, locale),
    [statementLines, locale],
  )

  const invoiceTotals = useMemo(() => sumAccountInvoiceRows(invoiceRows), [invoiceRows])

  const financial = useMemo(
    () =>
      selectedParty
        ? buildAccountFinancialSummary(selectedParty, vouchersInRange, invoiceTotals.amount)
        : null,
    [selectedParty, vouchersInRange, invoiceTotals.amount],
  )

  const voucherTotals = useMemo(
    () => getPartyVoucherTotals(vouchersInRange),
    [vouchersInRange],
  )

  const lastReconciliation = useMemo(
    () => (isCustomer ? getCustomerReconciliation : getSupplierReconciliation)(selectedPartyId),
    [isCustomer, selectedPartyId],
  )

  return {
    parties,
    selectedParty,
    selectedPartyId,
    setSelectedPartyId,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    partyName,
    statementLines,
    vouchersInRange,
    lineTotals,
    invoiceRows,
    invoiceTotals,
    financial,
    voucherTotals,
    lastReconciliation,
    isCustomer,
  }
}
