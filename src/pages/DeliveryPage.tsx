import { Fragment, useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { getLineTotalLength, getPendingPiecesCount, type SalesWorkflowInvoice, type SalesWorkflowLine } from '../data/salesWorkflow'
import { useSalesWorkflow } from '../context/SalesWorkflowProvider'
import { useApp } from '../context/AppProvider'

export function DeliveryPage() {
  const { t, locale } = useApp()
  const { invoices, getInvoiceLines, updateLinePieceLengths, saveAllLineDetailing, markReadyForDelivery, awaitingCount } =
    useSalesWorkflow()
  const [expandedId, setExpandedId] = useState<string | null>(
    invoices.find((inv) => inv.status === 'awaiting_detail')?.id ?? null,
  )
  const [draftLengths, setDraftLengths] = useState<Record<string, (number | null)[]>>({})

  const awaiting = invoices.filter((inv) => inv.status === 'awaiting_detail')
  const detailed = invoices.filter((inv) => inv.status === 'detailed' || inv.status === 'ready_delivery')

  const statusMap = {
    awaiting_detail: { text: t('delivery.statusAwaitingDetail'), variant: 'warning' as const },
    detailed: { text: t('delivery.statusDetailed'), variant: 'info' as const },
    ready_delivery: { text: t('delivery.statusReady'), variant: 'success' as const },
    delivered: { text: t('delivery.statusDelivered'), variant: 'success' as const },
    draft: { text: t('delivery.statusDraft'), variant: 'neutral' as const },
  }

  const label = (invoice: SalesWorkflowInvoice, field: 'customer' | 'container' | 'warehouse') => {
    if (field === 'customer') return locale === 'ar' ? invoice.customerAr : invoice.customerEn
    if (field === 'container') return locale === 'ar' ? invoice.containerLabelAr : invoice.containerLabelEn
    return locale === 'ar' ? invoice.warehouseAr : invoice.warehouseEn
  }

  const lineLabel = (line: SalesWorkflowLine, field: 'goods' | 'color' | 'unit') => {
    if (field === 'goods') return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
    if (field === 'color') return locale === 'ar' ? line.colorAr : line.colorEn
    return locale === 'ar' ? line.unitAr : line.unitEn
  }

  const getDraftForLine = (line: SalesWorkflowLine) =>
    draftLengths[line.id] ?? line.pieceLengths

  const updateDraftLength = (line: SalesWorkflowLine, index: number, value: string) => {
    const next = [...getDraftForLine(line)]
    next[index] = value === '' ? null : Number(value)
    setDraftLengths((prev) => ({ ...prev, [line.id]: next }))
  }

  const saveLineDetailing = (line: SalesWorkflowLine) => {
    updateLinePieceLengths(line.id, getDraftForLine(line))
  }

  const saveAllDetailing = (invoiceId: string) => {
    const invoiceLines = getInvoiceLines(invoiceId)
    saveAllLineDetailing(
      invoiceId,
      invoiceLines.map((line) => ({
        lineId: line.id,
        pieceLengths: getDraftForLine(line),
      })),
    )
    setDraftLengths((prev) => {
      const next = { ...prev }
      invoiceLines.forEach((line) => {
        delete next[line.id]
      })
      return next
    })
  }

  const workflowSteps = useMemo(
    () => [
      t('delivery.stepAccountant'),
      t('delivery.stepWarehouse'),
      t('delivery.stepAccountantApprove'),
      t('delivery.stepDriver'),
    ],
    [t],
  )

  return (
    <>
      <PageHeader
        title={t('delivery.title')}
        subtitle={t('delivery.subtitle')}
      />

      <div className="workflow-banner workflow-banner--delivery">
        <div className="workflow-banner__title">{t('delivery.flowTitle')}</div>
        <p className="workflow-banner__desc">{t('delivery.flowDesc')}</p>
        <div className="workflow-strip workflow-strip--inline" aria-label={t('delivery.flowTitle')}>
          {workflowSteps.map((step, index) => (
            <div key={step} className="workflow-strip__step workflow-strip__step--done">
              <span className="workflow-strip__dot">{index + 1}</span>
              <span className="workflow-strip__label">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-grid stat-grid--3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card card--accent-warning">
          <div className="card__title">{t('delivery.kpiAwaiting')}</div>
          <div className="card__value">{awaitingCount}</div>
        </div>
        <div className="card card--accent-info">
          <div className="card__title">{t('delivery.kpiDetailed')}</div>
          <div className="card__value">{detailed.filter((i) => i.status === 'detailed').length}</div>
        </div>
        <div className="card card--accent-success">
          <div className="card__title">{t('delivery.kpiReady')}</div>
          <div className="card__value">{detailed.filter((i) => i.status === 'ready_delivery').length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-toolbar">
          <span className="card-toolbar__hint">{t('delivery.awaitingHint')}</span>
        </div>

        {awaiting.length === 0 ? (
          <p className="delivery-empty">{t('delivery.noAwaiting')}</p>
        ) : (
          <div className="delivery-alerts">
            {awaiting.map((invoice) => {
              const invoiceLines = getInvoiceLines(invoice.id)
              const pendingPieces = getPendingPiecesCount(invoiceLines)
              const isExpanded = expandedId === invoice.id

              return (
                <div key={invoice.id} className={`delivery-alert ${isExpanded ? 'delivery-alert--open' : ''}`}>
                  <button
                    type="button"
                    className="delivery-alert__trigger"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedId(isExpanded ? null : invoice.id)}
                  >
                    <span className="delivery-alert__icon">🔔</span>
                    <div className="delivery-alert__content">
                      <div className="delivery-alert__title">
                        {t('delivery.alertTitle').replace('{invoice}', invoice.invoiceNo)}
                      </div>
                      <div className="delivery-alert__desc">
                        {t('delivery.alertDesc')
                          .replace('{pieces}', String(pendingPieces))
                          .replace('{container}', label(invoice, 'container'))}
                      </div>
                    </div>
                    <Badge variant="warning">{t('delivery.statusAwaitingDetail')}</Badge>
                  </button>

                  {isExpanded && (
                    <div className="delivery-detail">
                      <div className="delivery-detail__meta">
                        <span>{t('common.customer')}: {label(invoice, 'customer')}</span>
                        <span>{t('invoices.form.warehouse')}: {label(invoice, 'warehouse')}</span>
                        <span>{t('common.date')}: {invoice.date}</span>
                      </div>

                      {invoiceLines.map((line) => {
                        const draft = getDraftForLine(line)
                        const filled = draft.filter((v) => v !== null && v > 0).length

                        return (
                          <div key={line.id} className="delivery-detail__line card">
                            <div className="delivery-detail__line-head">
                              <div>
                                <strong>{lineLabel(line, 'goods')}</strong>
                                <span className="category-code">{line.rollCode}</span>
                                <span> — {lineLabel(line, 'color')}</span>
                              </div>
                              <span className="delivery-detail__progress">
                                {filled}/{line.pieces} {t('delivery.piecesDetailed')}
                              </span>
                            </div>

                            <p className="delivery-detail__instruction">{t('delivery.detailInstruction')}</p>

                            <div className="piece-length-grid">
                              {Array.from({ length: line.pieces }, (_, index) => (
                                <label key={index} className="piece-length-field">
                                  <span className="piece-length-field__label">
                                    {t('delivery.pieceNo').replace('{n}', String(index + 1))}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    className="form-input"
                                    value={draft[index] ?? ''}
                                    onChange={(event) => updateDraftLength(line, index, event.target.value)}
                                    placeholder={t('delivery.lengthPlaceholder')}
                                  />
                                  <span className="piece-length-field__unit">{lineLabel(line, 'unit')}</span>
                                </label>
                              ))}
                            </div>

                            <div className="delivery-detail__line-actions">
                              <GlossButton variant="ghost" size="sm" onClick={() => saveLineDetailing(line)}>
                                {t('delivery.saveLine')}
                              </GlossButton>
                            </div>
                          </div>
                        )
                      })}

                      <div className="delivery-detail__actions">
                        <GlossButton variant="accent" onClick={() => saveAllDetailing(invoice.id)}>
                          {t('delivery.saveAndComplete')}
                        </GlossButton>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-toolbar">
          <span className="card-toolbar__hint">{t('delivery.completedHint')}</span>
        </div>
        <div className="table-wrap">
          <table className="data-table data-table--expandable">
            <thead>
              <tr>
                <th>{t('delivery.number')}</th>
                <th>{t('common.customer')}</th>
                <th>{t('invoices.form.container')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
                <th>{t('delivery.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {detailed.map((invoice) => {
                const st = statusMap[invoice.status]
                const invoiceLines = getInvoiceLines(invoice.id)
                const isExpanded = expandedId === `done-${invoice.id}`

                return (
                  <Fragment key={invoice.id}>
                    <tr className={isExpanded ? 'data-table__row--expanded' : ''}>
                      <td><span className="invoice-no">{invoice.invoiceNo}</span></td>
                      <td>{label(invoice, 'customer')}</td>
                      <td>{label(invoice, 'container')}</td>
                      <td><Badge variant={st.variant}>{st.text}</Badge></td>
                      <td>{invoice.date}</td>
                      <td>
                        {invoice.status === 'detailed' && (
                          <GlossButton variant="accent" size="sm" onClick={() => markReadyForDelivery(invoice.id)}>
                            {t('delivery.issueDeliveryNote')}
                          </GlossButton>
                        )}
                        {invoice.status === 'ready_delivery' && (
                          <button
                            type="button"
                            className="action-btn action-btn--edit"
                            onClick={() => setExpandedId(isExpanded ? null : `done-${invoice.id}`)}
                          >
                            👁
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="data-table__detail-row">
                        <td colSpan={6}>
                          <table className="data-table data-table--nested">
                            <thead>
                              <tr>
                                <th>{t('invoices.form.colGoodsType')}</th>
                                <th>{t('invoices.form.colColor')}</th>
                                <th>{t('invoices.form.colPieces')}</th>
                                <th>{t('invoices.form.colLength')}</th>
                                <th>{t('delivery.colPieceLengths')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceLines.map((line) => (
                                <tr key={line.id}>
                                  <td>{lineLabel(line, 'goods')}</td>
                                  <td>{lineLabel(line, 'color')}</td>
                                  <td>{line.pieces}</td>
                                  <td className="data-table__number">{getLineTotalLength(line) ?? '—'}</td>
                                  <td className="data-table__number">
                                    {line.pieceLengths.filter(Boolean).join(' + ') || '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
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
