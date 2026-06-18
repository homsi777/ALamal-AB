import { Fragment, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { DateInput } from '../../components/ui/DateInput'
import { Badge } from '../../components/ui/Badge'
import { formatPartyMoney } from '../../data/parties'
import { useApp } from '../../context/AppProvider'
import { formatNumber } from '../../utils/invoiceGrouping'
import { PartyStatementServicesMenu } from './PartyStatementServicesMenu'
import { usePartyStatementPageData, type PartyStatementPageType } from './usePartyStatementPageData'
import {
  accountVoucherNote,
  accountVoucherTypeLabel,
  getVouchersForInvoice,
} from '../../export-templates'
import { findLastInvoiceNoByDate } from '../../utils/reconcileHighlight'
import type { CustomerVoucher } from '../../data/parties'

type PartyAccountStatementPageProps = {
  type: PartyStatementPageType
}

export function PartyAccountStatementPage({ type }: PartyAccountStatementPageProps) {
  const { t, locale } = useApp()
  const prefix = type === 'customer' ? 'parties.customerAccountStatement' : 'parties.supplierAccountStatement'
  const {
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
    invoiceRows,
    invoiceTotals,
    financial,
    lastReconciliation,
    isCustomer,
  } = usePartyStatementPageData(type, locale)

  const [reconcileInputDate, setReconcileInputDate] = useState(dateTo)
  const [reconcileMarkedDate, setReconcileMarkedDate] = useState<string | null>(null)

  useEffect(() => {
    setReconcileInputDate(dateTo)
    setReconcileMarkedDate(null)
  }, [selectedPartyId, dateTo])

  useEffect(() => {
    setReconcileMarkedDate(null)
  }, [dateFrom])

  const reconcileTargetInvoiceNo = useMemo(
    () => (reconcileMarkedDate ? findLastInvoiceNoByDate(invoiceRows, reconcileMarkedDate) : null),
    [invoiceRows, reconcileMarkedDate],
  )

  const voucherLabels = {
    receipt: t('parties.statementTypeReceipt'),
    payment: t('parties.statementTypePayment'),
    returnVoucher: isCustomer ? t('parties.statementTypeReturn') : undefined,
  }

  const voucherTypeBadge = (voucher: CustomerVoucher) => ({
    text: accountVoucherTypeLabel(voucher, voucherLabels),
    variant: (voucher.type === 'receipt' ? 'success' : 'warning') as 'success' | 'warning',
    amountClass:
      voucher.type === 'receipt'
        ? 'party-statement__amount--receipt'
        : 'party-statement__amount--payment',
  })

  if (!selectedParty || !financial) {
    return <PageHeader title={t(`${prefix}.title`)} subtitle={t(`${prefix}.empty`)} />
  }

  const handleReconcile = () => {
    setReconcileMarkedDate(reconcileInputDate)
  }

  const partyCity = locale === 'ar' ? selectedParty.cityAr : selectedParty.cityEn
  const partyAddress = locale === 'ar' ? selectedParty.addressAr : selectedParty.addressEn

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

            {isCustomer && (
              <label className="form-field form-field--compact">
                <span className="form-field__label">{t(`${prefix}.reconcileDateLabel`)}</span>
                <DateInput
                  value={reconcileInputDate}
                  onChange={(event) => setReconcileInputDate(event.target.value)}
                />
              </label>
            )}
          </div>

          <div className="party-statement__actions">
            {isCustomer && (
              <GlossButton variant="accent" onClick={handleReconcile}>
                {t(`${prefix}.reconcile`)}
              </GlossButton>
            )}
            <GlossButton variant={isCustomer ? 'ghost' : 'accent'} onClick={() => window.print()}>
              {t(`${prefix}.print`)}
            </GlossButton>
            <PartyStatementServicesMenu
              variant="account"
              party={selectedParty}
              partyName={partyName(selectedParty)}
              dateFrom={dateFrom}
              dateTo={dateTo}
              lines={statementLines}
              vouchers={vouchersInRange}
              lineTotals={invoiceTotals}
              statementPrefix={prefix}
              reconcileMarkedDate={reconcileMarkedDate}
              reconcileTargetInvoiceNo={reconcileTargetInvoiceNo}
            />
            <GlossButton variant="receipt">{t(`${prefix}.receiptVoucher`)}</GlossButton>
            <GlossButton variant="payment">
              {t(isCustomer ? `${prefix}.returnVoucher` : `${prefix}.paymentVoucher`)}
            </GlossButton>
          </div>
        </div>

        <div className="party-statement__panel-section party-statement__panel-section--meta">
          <div className="party-statement__meta-group">
            <div className="party-statement__meta-stat">
              <span>{t('common.phone')}</span>
              <strong>{selectedParty.phone}</strong>
            </div>
            <div className="party-statement__meta-stat">
              <span>{t(`${prefix}.city`)}</span>
              <strong>{partyCity}</strong>
            </div>
            <div className="party-statement__meta-stat">
              <span>{t('common.address')}</span>
              <strong>{partyAddress}</strong>
            </div>
            <div className="party-statement__meta-stat">
              <span>{t(`${prefix}.creditLimit`)}</span>
              <strong>{formatPartyMoney(selectedParty.creditLimit, selectedParty.currency)}</strong>
            </div>
          </div>

          {lastReconciliation && (
            <div className="party-statement__reconcile-group">
              <div className="party-statement__meta-stat">
                <span>{t(`${prefix}.reconcileDate`)}</span>
                <strong>{lastReconciliation.date}</strong>
              </div>
              <div className="party-statement__meta-stat party-statement__meta-stat--accent">
                <span>{t(`${prefix}.reconcileBalance`)}</span>
                <strong>{formatPartyMoney(lastReconciliation.closingBalance, selectedParty.currency)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="party-statement__panel-section party-statement__panel-section--financial">
          <h3 className="party-statement__financial-title">{t(`${prefix}.financialSummary`)}</h3>
          <div className="party-statement__summary-grid">
            <div className="party-statement__financial-cell">
              <span>{t(`${prefix}.openingBalance`)}</span>
              <strong>{formatPartyMoney(financial.openingBalance, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell">
              <span>{t(`${prefix}.invoicesTotal`)}</span>
              <strong>{formatPartyMoney(financial.invoicesTotal, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell">
              <span>{t(`${prefix}.receiptsTotal`)}</span>
              <strong>{formatPartyMoney(financial.receiptsTotal, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell">
              <span>{t(`${prefix}.paymentsTotal`)}</span>
              <strong>{formatPartyMoney(financial.paymentsTotal, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--accent">
              <span>{t(`${prefix}.receivables`)}</span>
              <strong>{formatPartyMoney(financial.closingBalance, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--accent">
              <span>{t(`${prefix}.closingBalance`)}</span>
              <strong>{formatPartyMoney(financial.closingBalance, selectedParty.currency)}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--info">
              <span>{t(`${prefix}.kpiInvoices`)}</span>
              <strong>{invoiceRows.length}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--warning">
              <span>{t(`${prefix}.kpiPieces`)}</span>
              <strong>{formatNumber(invoiceTotals.pieces)}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--success">
              <span>{t(`${prefix}.kpiLengths`)}</span>
              <strong>{formatNumber(invoiceTotals.lengths)}</strong>
            </div>
            <div className="party-statement__financial-cell party-statement__financial-cell--gold">
              <span>{t(`${prefix}.kpiAmount`)}</span>
              <strong>{formatPartyMoney(invoiceTotals.amount, selectedParty.currency)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card" id="party-statement-print">
        <div className="card-toolbar">
          <span className="card-toolbar__hint">
            {t(`${prefix}.tableHint`).replace('{party}', partyName(selectedParty))}
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
              {invoiceRows.map((row) => {
                const linkedVouchers = getVouchersForInvoice(vouchersInRange, row.invoiceNo)
                const isReconcileRow = isCustomer && row.invoiceNo === reconcileTargetInvoiceNo
                return (
                  <Fragment key={row.invoiceNo}>
                    <tr className={isReconcileRow ? 'party-statement__row--reconcile' : undefined}>
                      <td><strong>{locale === 'ar' ? row.goodsSummaryAr : row.goodsSummaryEn}</strong></td>
                      <td className="data-table__number">{row.pieces}</td>
                      <td className="data-table__number">
                        {formatNumber(row.totalLength)} {locale === 'ar' ? row.unitAr : row.unitEn}
                      </td>
                      <td className="data-table__number">{row.avgUnitPrice}</td>
                      <td className="data-table__number">
                        <strong>{formatPartyMoney(row.invoiceTotal, selectedParty.currency)}</strong>
                      </td>
                      <td><span className="invoice-no">{row.invoiceNo}</span></td>
                      <td>{row.date}</td>
                      <td>{locale === 'ar' ? row.notesAr : row.notesEn}</td>
                    </tr>
                    {linkedVouchers.map((voucher) => {
                      const badge = voucherTypeBadge(voucher)
                      return (
                        <tr key={voucher.id} className="party-statement__voucher-row">
                          <td>
                            <Badge variant={badge.variant}>{badge.text}</Badge>
                          </td>
                          <td className="data-table__number party-statement__voucher-empty">—</td>
                          <td className="data-table__number party-statement__voucher-empty">—</td>
                          <td className="data-table__number party-statement__voucher-empty">—</td>
                          <td className="data-table__number">
                            <strong className={badge.amountClass}>
                              {formatPartyMoney(voucher.amount, selectedParty.currency)}
                            </strong>
                          </td>
                          <td><span className="invoice-no">{voucher.ref}</span></td>
                          <td>{voucher.date}</td>
                          <td>{accountVoucherNote(voucher, locale, isCustomer)}</td>
                        </tr>
                      )
                    })}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
