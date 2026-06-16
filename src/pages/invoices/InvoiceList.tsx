import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { RowActions } from '../../components/ui/RowActions'
import {
  formatMoney,
  getInvoiceTotals,
  purchaseInvoices,
  salesInvoices,
  type InvoiceRecord,
  type InvoiceStatus,
} from '../../data/invoices'
import { useApp } from '../../context/AppProvider'
import { useNavigate } from 'react-router-dom'

type InvoiceListProps = {
  mode: 'sales' | 'purchase'
}

type StatusFilter = 'all' | InvoiceStatus

export function InvoiceList({ mode }: InvoiceListProps) {
  const { t, locale } = useApp()
  const prefix = mode === 'sales' ? 'invoices.salesList' : 'invoices.purchaseList'
  const newPath = mode === 'sales' ? '/invoices/sales/new' : '/invoices/purchase/new'
  const navigate = useNavigate()

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(
    mode === 'sales' ? salesInvoices : purchaseInvoices,
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const partyLabel = (invoice: InvoiceRecord) =>
    locale === 'ar' ? invoice.partyAr : invoice.partyEn

  const warehouseLabel = (invoice: InvoiceRecord) => {
    if (!invoice.warehouseAr) return '—'
    return locale === 'ar' ? invoice.warehouseAr : invoice.warehouseEn
  }

  const toggleDisable = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  const statusMap: Record<InvoiceStatus, { text: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    draft: { text: t('invoices.statusDraft'), variant: 'neutral' },
    approved: { text: t('invoices.statusApproved'), variant: 'info' },
    paid: { text: t('invoices.statusPaid'), variant: 'success' },
    partial: { text: t('invoices.statusPartial'), variant: 'warning' },
    pending: { text: t('invoices.statusPending'), variant: 'danger' },
  }

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: t('invoices.filterAll') },
    { id: 'draft', label: t('invoices.statusDraft') },
    { id: 'approved', label: t('invoices.statusApproved') },
    { id: 'paid', label: t('invoices.statusPaid') },
    { id: 'partial', label: t('invoices.statusPartial') },
    { id: 'pending', label: t('invoices.statusPending') },
  ]

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false
    if (!normalizedQuery) return true

    const haystack = [
      invoice.id,
      invoice.partyAr,
      invoice.partyEn,
      invoice.warehouseAr ?? '',
      invoice.warehouseEn ?? '',
      invoice.status,
      String(invoice.amount),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const totals = getInvoiceTotals(invoices)

  return (
    <>
      <PageHeader
        title={t(`${prefix}.title`)}
        subtitle={t(`${prefix}.subtitle`)}
        actions={
          <>
            <GlossButton variant="accent" onClick={() => navigate(newPath)}>
              {t(`${prefix}.new`)}
            </GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t(`${prefix}.searchPlaceholder`)}
                aria-label={t(`${prefix}.searchPlaceholder`)}
              />
            </div>
          </>
        }
      />

      <div className="stat-grid stat-grid--4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card card--accent-neutral">
          <div className="card__title">{t(`${prefix}.kpiCount`)}</div>
          <div className="card__value">{totals.count}</div>
        </div>
        <div className="card card--accent-info">
          <div className="card__title">{t(`${prefix}.kpiAmount`)}</div>
          <div className="card__value">{formatMoney(totals.amount, '$')}</div>
        </div>
        <div className="card card--accent-success">
          <div className="card__title">{t(`${prefix}.kpiPaid`)}</div>
          <div className="card__value">{totals.paid}</div>
        </div>
        <div className="card card--accent-warning">
          <div className="card__title">{t(`${prefix}.kpiUnpaid`)}</div>
          <div className="card__value">{totals.unpaid}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="filter-chips filter-chips--invoices" role="tablist" aria-label={t('invoices.filterLabel')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === filter.id}
                className={`filter-chip ${statusFilter === filter.id ? 'filter-chip--active filter-chip--invoices' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--actions">
            <thead>
              <tr>
                <th>{t('invoices.number')}</th>
                <th>{mode === 'sales' ? t('common.customer') : t('common.supplier')}</th>
                <th>{t('invoices.form.warehouse')}</th>
                <th>{t('invoices.form.colPieces')}</th>
                <th>{t('common.amount')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
                <th>{t('invoices.form.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const status = statusMap[invoice.status]
                return (
                  <tr key={invoice.id}>
                    <td><span className="invoice-no">{invoice.id}</span></td>
                    <td>{partyLabel(invoice)}</td>
                    <td>{warehouseLabel(invoice)}</td>
                    <td className="data-table__number">{invoice.pieces}</td>
                    <td className="data-table__number">{formatMoney(invoice.amount, invoice.currency)}</td>
                    <td><Badge variant={status.variant}>{status.text}</Badge></td>
                    <td>{invoice.date}</td>
                    <td>
                      <RowActions
                        disabled={false}
                        editLabel={t('invoices.actionEdit')}
                        disableLabel={t('invoices.actionDelete')}
                        enableLabel={t('invoices.actionRestore')}
                        onEdit={() => undefined}
                        onDisable={() => toggleDisable(invoice.id)}
                        onEnable={() => undefined}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filteredInvoices.map((invoice) => {
            const status = statusMap[invoice.status]
            return (
              <div key={invoice.id} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="invoice-no">{invoice.id}</span>
                  <Badge variant={status.variant}>{status.text}</Badge>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">
                    {mode === 'sales' ? t('common.customer') : t('common.supplier')}
                  </span>
                  <span className="mobile-list__value">{partyLabel(invoice)}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.amount')}</span>
                  <span className="mobile-list__value">{formatMoney(invoice.amount, invoice.currency)}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.date')}</span>
                  <span className="mobile-list__value">{invoice.date}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
