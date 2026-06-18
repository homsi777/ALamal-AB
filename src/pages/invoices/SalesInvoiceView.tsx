import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { useApp } from '../../context/AppProvider'
import { useSalesWorkflow } from '../../context/SalesWorkflowProvider'
import {
  getLineTotalLength,
  isLineDetailed,
  type SalesWorkflowLine,
  type WorkflowStatus,
} from '../../data/salesWorkflow'
import { formatNumber, groupByMaterial, sumLengths, sumPieces } from '../../utils/invoiceGrouping'

const currencySymbols = { usd: '$', syp: 'ل.س', egp: 'ج.م' } as const

const workflowStatusBadge: Record<
  WorkflowStatus,
  { key: string; variant: 'warning' | 'info' | 'success' | 'neutral' }
> = {
  draft: { key: 'invoices.workflow.statusDraft', variant: 'neutral' },
  awaiting_detail: { key: 'invoices.workflow.statusAwaiting', variant: 'warning' },
  detailed: { key: 'invoices.workflow.statusDetailed', variant: 'info' },
  ready_delivery: { key: 'invoices.workflow.statusReady', variant: 'success' },
  delivered: { key: 'invoices.workflow.statusDelivered', variant: 'success' },
}

export function SalesInvoiceView() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const { t, locale } = useApp()
  const navigate = useNavigate()
  const { invoices, getInvoiceLines, approveInvoice } = useSalesWorkflow()

  const invoice = invoices.find((item) => item.id === workflowId)
  const lines = workflowId ? getInvoiceLines(workflowId) : []

  const lineLabel = (line: SalesWorkflowLine, field: 'goods' | 'color' | 'unit') => {
    if (field === 'goods') return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
    if (field === 'color') return locale === 'ar' ? line.colorAr : line.colorEn
    return locale === 'ar' ? line.unitAr : line.unitEn
  }

  const materialLabel = (goodsTypeAr: string, goodsTypeEn: string, rollCode: string) => {
    const goods = locale === 'ar' ? goodsTypeAr : goodsTypeEn
    return `${goods} (${rollCode})`
  }

  const isDetailed =
    invoice?.status === 'detailed' ||
    invoice?.status === 'ready_delivery' ||
    invoice?.status === 'delivered'

  const materialGroups = useMemo(() => groupByMaterial(lines), [lines])
  const grandTotalPieces = useMemo(() => sumPieces(lines), [lines])
  const grandTotalLengths = useMemo(
    () => lines.reduce((sum, line) => sum + (getLineTotalLength(line) ?? sumLengths(line.pieceLengths)), 0),
    [lines],
  )

  const currencySymbol = invoice ? currencySymbols[invoice.currency] : '$'

  const formatMoney = (value: number) =>
    `${value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })} ${currencySymbol}`

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const length = getLineTotalLength(line)
        return sum + (length !== null ? length * line.unitPrice : 0)
      }, 0),
    [lines],
  )

  const workflowSteps = useMemo(
    () => [
      t('invoices.form.workflowStepAccountant'),
      t('invoices.form.workflowStepWarehouse'),
      t('invoices.form.workflowStepApprove'),
      t('invoices.form.workflowStepDelivery'),
    ],
    [t],
  )

  const currentStepIndex = useMemo(() => {
    if (!invoice) return 0
    if (invoice.status === 'awaiting_detail') return 1
    if (invoice.status === 'detailed') return 2
    if (invoice.status === 'ready_delivery' || invoice.status === 'delivered') return 3
    return 0
  }, [invoice])

  if (!invoice) {
    return (
      <>
        <PageHeader title={t('invoices.workflow.notFoundTitle')} subtitle={t('invoices.workflow.notFoundSubtitle')} />
        <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
          <p>{t('invoices.workflow.notFoundDesc')}</p>
          <Link to="/invoices/sales/new">{t('invoices.salesList.new')}</Link>
        </div>
      </>
    )
  }

  const status = workflowStatusBadge[invoice.status]

  return (
    <>
      <PageHeader
        title={t('invoices.workflow.viewTitle').replace('{invoice}', invoice.invoiceNo)}
        subtitle={t('invoices.workflow.viewSubtitle')}
        actions={
          <>
            {invoice.status === 'awaiting_detail' && (
              <GlossButton variant="accent" onClick={() => navigate(`/delivery?focus=${invoice.id}`)}>
                {t('invoices.workflow.goToDetail')}
              </GlossButton>
            )}
            {invoice.status === 'detailed' && (
              <GlossButton variant="accent" onClick={() => approveInvoice(invoice.id)}>
                {t('invoices.salesForm.approve')}
              </GlossButton>
            )}
            {invoice.status === 'ready_delivery' && (
              <GlossButton variant="ghost" onClick={() => navigate(`/delivery?focus=done-${invoice.id}`)}>
                {t('invoices.workflow.issueDeliveryNote')}
              </GlossButton>
            )}
          </>
        }
      />

      <div className="workflow-banner workflow-banner--sales">
        <div className="workflow-banner__title">{t('invoices.form.workflowTitle')}</div>
        <p className="workflow-banner__desc">{t('invoices.workflow.linkedDesc')}</p>
        <div className="workflow-strip workflow-strip--inline">
          {workflowSteps.map((step, index) => (
            <div
              key={step}
              className={`workflow-strip__step ${
                index < currentStepIndex
                  ? 'workflow-strip__step--done'
                  : index === currentStepIndex
                    ? 'workflow-strip__step--current'
                    : ''
              }`}
            >
              <span className="workflow-strip__dot">{index + 1}</span>
              <span className="workflow-strip__label">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {invoice.status === 'awaiting_detail' && (
        <div className="workflow-info-banner workflow-info-banner--warning">
          <span>{t('invoices.workflow.awaitingDetailBanner')}</span>
          <Link to={`/delivery?focus=${invoice.id}`} className="workflow-info-banner__link">
            {t('invoices.workflow.openInDelivery')}
          </Link>
        </div>
      )}

      {isDetailed && invoice.status === 'detailed' && (
        <div className="workflow-success-banner">
          <span>{t('invoices.workflow.detailedBanner')}</span>
        </div>
      )}

      <div className="invoice-form">
        <div className="card invoice-form__meta">
          <div className="invoice-form__meta-head">
            <span className="invoice-form__badge">📤</span>
            <div>
              <div className="invoice-form__status">
                <Badge variant={status.variant}>{t(status.key)}</Badge>
              </div>
              <div className="invoice-form__hint">{t('invoices.workflow.linkedHint')}</div>
            </div>
          </div>

          <div className="invoice-form__grid invoice-form__grid--readonly">
            <div className="form-field">
              <span className="form-field__label">{t('invoices.form.invoiceNo')}</span>
              <div className="form-readonly">{invoice.invoiceNo}</div>
            </div>
            <div className="form-field">
              <span className="form-field__label">{t('common.date')}</span>
              <div className="form-readonly">{invoice.date}</div>
            </div>
            <div className="form-field">
              <span className="form-field__label">{t('invoices.form.selectCustomer')}</span>
              <div className="form-readonly">{locale === 'ar' ? invoice.customerAr : invoice.customerEn}</div>
            </div>
            <div className="form-field">
              <span className="form-field__label">{t('invoices.form.container')}</span>
              <div className="form-readonly">
                {locale === 'ar' ? invoice.containerLabelAr : invoice.containerLabelEn}
              </div>
            </div>
            <div className="form-field">
              <span className="form-field__label">{t('invoices.form.warehouse')}</span>
              <div className="form-readonly">{locale === 'ar' ? invoice.warehouseAr : invoice.warehouseEn}</div>
            </div>
            <div className="form-field">
              <span className="form-field__label">{t('invoices.form.currency')}</span>
              <div className="form-readonly">{currencySymbol}</div>
            </div>
          </div>
        </div>

        <div className="card invoice-form__lines">
          <div className="card-toolbar">
            <span className="card-toolbar__hint">
              {isDetailed ? t('invoices.workflow.linesHintDetailed') : t('invoices.salesForm.linesHintNoLengths')}
            </span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('invoices.form.colGoodsType')}</th>
                  <th>{t('invoices.form.colRollCode')}</th>
                  <th>{t('invoices.form.colColor')}</th>
                  <th>{t('invoices.form.colPieces')}</th>
                  <th>{t('invoices.form.colLength')}</th>
                  <th>{t('invoices.form.colUnit')}</th>
                  <th>{t('invoices.form.colUnitPrice')}</th>
                  {isDetailed && <th>{t('invoices.form.colLineTotal')}</th>}
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const lineLength = getLineTotalLength(line)
                  const partialLength = sumLengths(line.pieceLengths)

                  return (
                    <tr key={line.id}>
                      <td>{lineLabel(line, 'goods')}</td>
                      <td><span className="category-code">{line.rollCode}</span></td>
                      <td>{lineLabel(line, 'color')}</td>
                      <td className="data-table__number">{line.pieces}</td>
                      <td className="data-table__number">
                        {isLineDetailed(line) ? (
                          formatNumber(lineLength ?? 0)
                        ) : partialLength > 0 ? (
                          <span className="invoice-table__partial-length">
                            {formatNumber(partialLength)} ({t('invoices.workflow.partial')})
                          </span>
                        ) : (
                          <Badge variant="warning">{t('invoices.form.lengthAwaitingDetail')}</Badge>
                        )}
                      </td>
                      <td>{lineLabel(line, 'unit')}</td>
                      <td className="data-table__number">{line.unitPrice}</td>
                      {isDetailed && (
                        <td className="data-table__number">
                          {lineLength !== null ? formatMoney(lineLength * line.unitPrice) : '—'}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-form__summary card">
          <div className="invoice-summary__pieces">
            <div className="invoice-summary__pieces-title">{t('invoices.form.piecesSummaryTitle')}</div>
            <div className="invoice-summary__chips">
              {materialGroups.map((group) => (
                <div key={group.rollCode} className="invoice-summary__chip">
                  <span>
                    {t('invoices.form.materialSubtotal').replace(
                      '{material}',
                      materialLabel(group.goodsTypeAr, group.goodsTypeEn, group.rollCode),
                    )}
                  </span>
                  <strong>
                    {formatNumber(sumPieces(group.lines))} {t('invoices.form.piecesUnit')}
                  </strong>
                </div>
              ))}
              <div className="invoice-summary__chip invoice-summary__chip--total">
                <span>{t('invoices.form.grandTotalPieces')}</span>
                <strong>{formatNumber(grandTotalPieces)} {t('invoices.form.piecesUnit')}</strong>
              </div>
            </div>
          </div>

          {isDetailed && (
            <div className="invoice-summary__pieces invoice-summary__pieces--lengths">
              <div className="invoice-summary__pieces-title">{t('invoices.form.lengthsSummaryTitle')}</div>
              <div className="invoice-summary__chips">
                {materialGroups.map((group) => {
                  const groupLengths = group.lines.reduce(
                    (sum, line) => sum + (getLineTotalLength(line) ?? 0),
                    0,
                  )
                  const unit = lineLabel(group.lines[0], 'unit')

                  return (
                    <div key={group.rollCode} className="invoice-summary__chip invoice-summary__chip--length">
                      <span>
                        {t('invoices.form.materialSubtotal').replace(
                          '{material}',
                          materialLabel(group.goodsTypeAr, group.goodsTypeEn, group.rollCode),
                        )}
                      </span>
                      <strong>
                        {formatNumber(groupLengths)} {unit}
                      </strong>
                    </div>
                  )
                })}
                <div className="invoice-summary__chip invoice-summary__chip--length-total">
                  <span>{t('invoices.form.grandTotalLengths')}</span>
                  <strong>{formatNumber(grandTotalLengths)}</strong>
                </div>
              </div>
            </div>
          )}

          {isDetailed ? (
            <>
              <div className="invoice-summary__row">
                <span>{t('invoices.form.subtotal')}</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <div className="invoice-summary__row invoice-summary__row--total">
                <span>{t('invoices.form.total')}</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
            </>
          ) : (
            <p className="invoice-summary__pending-note">{t('invoices.form.totalsAwaitingDetailHint')}</p>
          )}

          <div className="invoice-summary__meta">
            <span>{t('invoices.form.lineCount')}: {lines.length}</span>
            <span>{t('invoices.workflow.linkedId')}: {invoice.id}</span>
          </div>
        </div>
      </div>
    </>
  )
}
