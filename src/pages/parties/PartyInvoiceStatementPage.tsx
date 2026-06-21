import { Fragment, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { DateInput } from '../../components/ui/DateInput'
import { formatPartyMoney } from '../../data/parties'
import { useApp } from '../../context/AppProvider'
import { formatNumber } from '../../utils/invoiceGrouping'
import { aggregateLinesByInvoice } from '../../export-templates'
import { PartyStatementServicesMenu } from './PartyStatementServicesMenu'
import { usePartyStatementPageData, type PartyStatementPageType } from './usePartyStatementPageData'

type PartyInvoiceStatementPageProps = {
  type: PartyStatementPageType
}

export function PartyInvoiceStatementPage({ type }: PartyInvoiceStatementPageProps) {
  const { t, locale } = useApp()
  const prefix = type === 'customer' ? 'parties.customerInvoiceStatement' : 'parties.supplierInvoiceStatement'
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
    lineTotals,
    isCustomer,
  } = usePartyStatementPageData(type, locale)

  const [expandedInvoiceNo, setExpandedInvoiceNo] = useState<string | null>(null)

  useEffect(() => {
    setExpandedInvoiceNo(null)
  }, [selectedPartyId, dateFrom, dateTo])

  const invoiceRows = useMemo(
    () => aggregateLinesByInvoice(statementLines, locale),
    [statementLines, locale],
  )

  const linesByInvoice = useMemo(() => {
    const map = new Map<string, typeof statementLines>()
    for (const line of statementLines) {
      const bucket = map.get(line.invoiceNo) ?? []
      bucket.push(line)
      map.set(line.invoiceNo, bucket)
    }
    return map
  }, [statementLines])

  const toggleInvoice = (invoiceNo: string) => {
    setExpandedInvoiceNo((current) => (current === invoiceNo ? null : invoiceNo))
  }

  if (!selectedParty) {
    return <PageHeader title={t(`${prefix}.title`)} subtitle={t(`${prefix}.empty`)} />
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
              variant="invoice"
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
              <span>{t(`${prefix}.kpiInvoices`)}</span>
              <strong>{invoiceRows.length}</strong>
            </div>
          </div>
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
            {t(`${prefix}.tableHint`).replace('{party}', partyName(selectedParty))}
          </span>
          <span className="card-toolbar__hint card-toolbar__hint--muted">
            {t(`${prefix}.expandHint`)}
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--statement data-table--invoice-expand">
            <thead>
              <tr>
                <th className="party-statement__col-expand" aria-hidden="true" />
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
                const isExpanded = expandedInvoiceNo === row.invoiceNo
                const details = linesByInvoice.get(row.invoiceNo) ?? []

                return (
                  <Fragment key={row.invoiceNo}>
                    <tr
                      className={`party-statement__invoice-row${isExpanded ? ' party-statement__invoice-row--expanded' : ''}`}
                      onClick={() => toggleInvoice(row.invoiceNo)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          toggleInvoice(row.invoiceNo)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`${row.invoiceNo} — ${t(`${prefix}.expandHint`)}`}
                    >
                      <td className="party-statement__col-expand" aria-hidden="true">
                        <span className={`party-statement__expand-icon${isExpanded ? ' party-statement__expand-icon--open' : ''}`}>
                          ▸
                        </span>
                      </td>
                      <td>
                        <strong>{locale === 'ar' ? row.goodsSummaryAr : row.goodsSummaryEn}</strong>
                        <span className="party-statement__invoice-badge">
                          {t(`${prefix}.invoiceSummary`).replace('{count}', String(row.lineCount))}
                        </span>
                      </td>
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

                    {isExpanded &&
                      details.map((line) => (
                        <tr key={line.id} className="party-statement__invoice-detail-row">
                          <td className="party-statement__col-expand" />
                          <td>
                            <span className="party-statement__detail-label">{t(`${prefix}.detailLine`)}</span>
                            {locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn}
                          </td>
                          <td className="data-table__number">{line.pieces}</td>
                          <td className="data-table__number">
                            {formatNumber(line.totalLength)} {locale === 'ar' ? line.unitAr : line.unitEn}
                          </td>
                          <td className="data-table__number">{line.unitPrice}</td>
                          <td className="data-table__number">
                            {formatPartyMoney(line.lineTotal, selectedParty.currency)}
                          </td>
                          <td><span className="invoice-no">{line.invoiceNo}</span></td>
                          <td>{line.date}</td>
                          <td>{locale === 'ar' ? line.notesAr : line.notesEn}</td>
                        </tr>
                      ))}
                  </Fragment>
                )
              })}
            </tbody>
            {statementLines.length > 0 && (
              <tfoot>
                <tr className="invoice-table__grand-total">
                  <td />
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
      </div>
    </>
  )
}
