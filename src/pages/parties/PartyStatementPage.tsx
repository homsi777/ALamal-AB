import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { DateInput } from '../../components/ui/DateInput'
import { Badge } from '../../components/ui/Badge'
import {
  customerStatements,
  formatPartyMoney,
  getCustomerStatementTotals,
  getCustomerReconciliation,
  getCustomerVouchers,
  getSupplierStatementTotals,
  getSupplierReconciliation,
  getSupplierVouchers,
  getPartiesByType,
  getPartyVoucherTotals,
  supplierStatementLines,
  type PartyRecord,
  type StatementEntryType,
} from '../../data/parties'
import { useApp } from '../../context/AppProvider'
import { formatNumber } from '../../utils/invoiceGrouping'
import { PartyStatementServicesMenu } from './PartyStatementServicesMenu'

type PartyStatementPageProps = {
  type: 'customer' | 'supplier'
}

function filterByDateRange<T extends { date: string }>(items: T[], dateFrom: string, dateTo: string) {
  return items.filter((item) => {
    if (dateFrom && item.date < dateFrom) return false
    if (dateTo && item.date > dateTo) return false
    return true
  })
}

export function PartyStatementPage({ type }: PartyStatementPageProps) {
  const { t, locale } = useApp()
  const [searchParams] = useSearchParams()
  const prefix = type === 'customer' ? 'parties.customerStatement' : 'parties.supplierStatement'
  const isCustomer = type === 'customer'

  const parties = getPartiesByType(type)

  const [selectedPartyId, setSelectedPartyId] = useState(
    searchParams.get('party') ?? parties[0]?.id ?? '',
  )
  const [dateFrom, setDateFrom] = useState('2026-06-01')
  const [dateTo, setDateTo] = useState('2026-06-17')

  const selectedParty = parties.find((party) => party.id === selectedPartyId) ?? parties[0]

  const partyName = (party: PartyRecord) => (locale === 'ar' ? party.nameAr : party.nameEn)

  const statementTypeMap: Record<StatementEntryType, { text: string; variant: 'info' | 'success' | 'warning' | 'neutral' }> = {
    opening: { text: t('parties.statementTypeOpening'), variant: 'neutral' },
    invoice: { text: t('parties.statementTypeInvoice'), variant: 'info' },
    receipt: { text: t('parties.statementTypeReceipt'), variant: 'success' },
    payment: { text: t('parties.statementTypePayment'), variant: 'warning' },
  }

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

  const voucherTotals = useMemo(
    () => getPartyVoucherTotals(vouchersInRange),
    [vouchersInRange],
  )

  const lastReconciliation = useMemo(
    () => (isCustomer ? getCustomerReconciliation : getSupplierReconciliation)(selectedPartyId),
    [isCustomer, selectedPartyId],
  )

  if (!selectedParty) {
    return (
      <PageHeader title={t(`${prefix}.title`)} subtitle={t(`${prefix}.empty`)} />
    )
  }

  return (
    <>
      <PageHeader title={t(`${prefix}.title`)} subtitle={t(`${prefix}.subtitle`)} />

      <div className="card party-statement__panel" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="party-statement__panel-section party-statement__panel-section--filters">
          <div className="party-statement__filter-grid">
            <label className="form-field form-field--compact">
              <span className="form-field__label form-field__label--required">
                {t(isCustomer ? 'invoices.form.selectCustomer' : 'invoices.form.selectSupplier')}
              </span>
              <select
                className="form-input"
                value={selectedPartyId}
                onChange={(event) => setSelectedPartyId(event.target.value)}
              >
                {parties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {partyName(party)} — {party.id}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field form-field--compact">
              <span className="form-field__label">{t(`${prefix}.dateFrom`)}</span>
              <DateInput value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            </label>

            <label className="form-field form-field--compact">
              <span className="form-field__label">{t(`${prefix}.dateTo`)}</span>
              <DateInput value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            </label>
          </div>

          <div className="party-statement__actions">
            <GlossButton variant="accent" onClick={() => window.print()}>
              {t(`${prefix}.print`)}
            </GlossButton>
            <PartyStatementServicesMenu
              party={selectedParty}
              partyName={partyName(selectedParty)}
              dateFrom={dateFrom}
              dateTo={dateTo}
              lines={statementLines}
              vouchers={vouchersInRange}
              lineTotals={lineTotals}
              statementPrefix={prefix}
            />
            <GlossButton variant="receipt">{t(`${prefix}.receiptVoucher`)}</GlossButton>
            <GlossButton variant="payment">{t(`${prefix}.paymentVoucher`)}</GlossButton>
          </div>
        </div>

        <div className="party-statement__panel-section party-statement__panel-section--meta">
          <div className="party-statement__meta-group">
            <div className="party-statement__meta-stat">
              <span>{t('common.phone')}</span>
              <strong>{selectedParty.phone}</strong>
            </div>
            <div className="party-statement__meta-stat">
              <span>{t('common.balance')}</span>
              <strong>{formatPartyMoney(selectedParty.balance, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__meta-stat">
              <span>{t('parties.colInvoices')}</span>
              <strong>{selectedParty.invoiceCount}</strong>
            </div>
          </div>

          {lastReconciliation && (
            <div className="party-statement__reconcile-group">
              <div className="party-statement__meta-stat">
                <span>{t(`${prefix}.reconcileDate`)}</span>
                <strong>{lastReconciliation.date}</strong>
              </div>
              <div className="party-statement__meta-stat">
                <span>{t(`${prefix}.reconcileInvoices`)}</span>
                <strong>{formatPartyMoney(lastReconciliation.invoicesTotal, selectedParty.currency)}</strong>
              </div>
              {lastReconciliation.receiptsTotal > 0 && (
                <div className="party-statement__meta-stat">
                  <span>{t(`${prefix}.reconcileReceipts`)}</span>
                  <strong>{formatPartyMoney(lastReconciliation.receiptsTotal, selectedParty.currency)}</strong>
                </div>
              )}
              {lastReconciliation.paymentsTotal > 0 && (
                <div className="party-statement__meta-stat party-statement__meta-stat--payment">
                  <span>{t(`${prefix}.reconcilePayments`)}</span>
                  <strong>{formatPartyMoney(lastReconciliation.paymentsTotal, selectedParty.currency)}</strong>
                </div>
              )}
              <div className="party-statement__meta-stat party-statement__meta-stat--accent">
                <span>{t(`${prefix}.reconcileBalance`)}</span>
                <strong>{formatPartyMoney(lastReconciliation.closingBalance, selectedParty.currency)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="party-statement__panel-section party-statement__panel-section--kpi">
          <div className="party-statement__kpi-cell party-statement__kpi-cell--info">
            <span>{t(`${prefix}.kpiLines`)}</span>
            <strong>{statementLines.length}</strong>
          </div>
          <div className="party-statement__kpi-cell party-statement__kpi-cell--warning">
            <span>{t(`${prefix}.kpiPieces`)}</span>
            <strong>{formatNumber(lineTotals.pieces)}</strong>
          </div>
          <div className="party-statement__kpi-cell party-statement__kpi-cell--success">
            <span>{t(`${prefix}.kpiLengths`)}</span>
            <strong>{formatNumber(lineTotals.lengths)}</strong>
          </div>
          <div className="party-statement__kpi-cell party-statement__kpi-cell--gold">
            <span>{t(`${prefix}.kpiAmount`)}</span>
            <strong>{formatPartyMoney(lineTotals.amount, selectedParty.currency)}</strong>
          </div>
        </div>
      </div>

      <div className="card" id="party-statement-print">
        <div className="card-toolbar">
          <span className="card-toolbar__hint">
            {t('parties.statementHint').replace('{party}', partyName(selectedParty))}
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--statement">
            <thead>
              <tr>
                <th>{t(`${prefix}.colGoodsType`)}</th>
                <th>{t(`${prefix}.colPieces`)}</th>
                <th>{t(`${prefix}.colLengths`)}</th>
                <th>{t(`${prefix}.colPrice`)}</th>
                <th>{t(`${prefix}.colLineTotal`)}</th>
                <th>{t(`${prefix}.colInvoiceNo`)}</th>
                <th>{t(`${prefix}.colDate`)}</th>
                <th>{t(`${prefix}.colNotes`)}</th>
              </tr>
            </thead>
            <tbody>
              {statementLines.map((line) => (
                <tr key={line.id}>
                  <td><strong>{locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn}</strong></td>
                  <td className="data-table__number">{line.pieces}</td>
                  <td className="data-table__number">
                    {formatNumber(line.totalLength)} {locale === 'ar' ? line.unitAr : line.unitEn}
                  </td>
                  <td className="data-table__number">{line.unitPrice}</td>
                  <td className="data-table__number">
                    <strong>{formatPartyMoney(line.lineTotal, selectedParty.currency)}</strong>
                  </td>
                  <td><span className="invoice-no">{line.invoiceNo}</span></td>
                  <td>{line.date}</td>
                  <td>{locale === 'ar' ? line.notesAr : line.notesEn}</td>
                </tr>
              ))}
            </tbody>
            {statementLines.length > 0 && (
              <tfoot>
                <tr className="invoice-table__grand-total">
                  <td><strong>{t(`${prefix}.footerTotal`)}</strong></td>
                  <td className="data-table__number"><strong>{formatNumber(lineTotals.pieces)}</strong></td>
                  <td className="data-table__number"><strong>{formatNumber(lineTotals.lengths)}</strong></td>
                  <td />
                  <td className="data-table__number">
                    <strong>{formatPartyMoney(lineTotals.amount, selectedParty.currency)}</strong>
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {vouchersInRange.length > 0 && (
          <div className="party-statement__vouchers">
            <h3 className="party-statement__vouchers-title">{t(`${prefix}.vouchersTitle`)}</h3>
            <div className="table-wrap">
              <table className="data-table data-table--statement data-table--vouchers">
                <thead>
                  <tr>
                    <th>{t(`${prefix}.colDate`)}</th>
                    <th>{t(`${prefix}.colVoucherType`)}</th>
                    <th>{t(`${prefix}.colVoucherRef`)}</th>
                    <th>{t(`${prefix}.colVoucherAmount`)}</th>
                    <th>{t(`${prefix}.colNotes`)}</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchersInRange.map((voucher) => {
                    const voucherType = statementTypeMap[voucher.type]
                    return (
                      <tr key={voucher.id}>
                        <td>{voucher.date}</td>
                        <td>
                          <Badge variant={voucherType.variant}>{voucherType.text}</Badge>
                        </td>
                        <td><span className="invoice-no">{voucher.ref}</span></td>
                        <td className="data-table__number">
                          <strong className={voucher.type === 'payment' ? 'party-statement__amount--payment' : 'party-statement__amount--receipt'}>
                            {formatPartyMoney(voucher.amount, selectedParty.currency)}
                          </strong>
                        </td>
                        <td>{locale === 'ar' ? voucher.noteAr : voucher.noteEn}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="invoice-table__grand-total">
                    <td colSpan={5}>
                      <strong>
                        {voucherTotals.receipts > 0 && (
                          <span>
                            {t(`${prefix}.voucherFooterReceipts`)}:{' '}
                            {formatPartyMoney(voucherTotals.receipts, selectedParty.currency)}
                          </span>
                        )}
                        {voucherTotals.receipts > 0 && voucherTotals.payments > 0 && ' · '}
                        {voucherTotals.payments > 0 && (
                          <span>
                            {t(`${prefix}.voucherFooterPayments`)}:{' '}
                            {formatPartyMoney(voucherTotals.payments, selectedParty.currency)}
                          </span>
                        )}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
