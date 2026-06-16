import { Fragment, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { RowActions } from '../../components/ui/RowActions'
import {
  activeFiscalYear,
  getEntryTotals,
  getOpeningStockTotals,
  openingStockEntries,
  type OpeningStockEntry,
  type OpeningStockLine,
} from '../../data/openingStock'
import { useApp } from '../../context/AppProvider'

type StatusFilter = 'all' | 'draft' | 'posted'

export function OpeningStockPage() {
  const { t, locale } = useApp()
  const [entries, setEntries] = useState<OpeningStockEntry[]>(openingStockEntries)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(openingStockEntries[0]?.id ?? null)

  const formatStatValue = (value: number) =>
    value.toLocaleString('en-US', { useGrouping: false })

  const formatTotalLength = (value: number) => {
    if (value === 0) return '—'
    return formatStatValue(value)
  }

  const warehouseLabel = (entry: OpeningStockEntry) =>
    locale === 'ar' ? entry.warehouseAr : entry.warehouseEn

  const goodsLabel = (line: OpeningStockLine) =>
    locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn

  const unitLabel = (line: OpeningStockLine) =>
    locale === 'ar' ? line.unitAr : line.unitEn

  const toggleDisable = (id: string, disabled: boolean) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, disabled } : entry)))
  }

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredEntries = entries.filter((entry) => {
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false
    if (!normalizedQuery) return true

    const haystack = [
      entry.entryNo,
      entry.date,
      String(entry.fiscalYear),
      entry.warehouseAr,
      entry.warehouseEn,
      entry.status,
      ...entry.lines.flatMap((line) => [
        line.goodsTypeAr,
        line.goodsTypeEn,
        line.lot,
        line.unitAr,
        line.unitEn,
        String(line.pieces),
        String(line.totalLength),
      ]),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const totals = getOpeningStockTotals(entries)
  const draftCount = entries.filter((entry) => !entry.disabled && entry.status === 'draft').length

  const statusMap = {
    posted: { text: t('inventory.openingStock.statusPosted'), variant: 'success' as const },
    draft: { text: t('inventory.openingStock.statusDraft'), variant: 'warning' as const },
  }

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: t('inventory.openingStock.filterAll') },
    { id: 'posted', label: t('inventory.openingStock.filterPosted') },
    { id: 'draft', label: t('inventory.openingStock.filterDraft') },
  ]

  return (
    <>
      <PageHeader
        title={t('inventory.openingStock.title')}
        subtitle={t('inventory.openingStock.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('inventory.openingStock.new')}</GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('inventory.openingStock.searchPlaceholder')}
                aria-label={t('inventory.openingStock.searchPlaceholder')}
              />
            </div>
          </>
        }
      />

      <div className="fiscal-banner">
        <div className="fiscal-banner__main">
          <span className="fiscal-banner__icon" aria-hidden="true">
            📅
          </span>
          <div>
            <div className="fiscal-banner__label">{t('inventory.openingStock.fiscalYear')}</div>
            <div className="fiscal-banner__value">
              {activeFiscalYear} — {t('inventory.openingStock.fiscalYearActive')}
            </div>
          </div>
        </div>
        <div className="fiscal-banner__meta">
          <span>{t('inventory.openingStock.postedEntries')}: {totals.entries}</span>
          <span>{t('inventory.openingStock.draftEntries')}: {draftCount}</span>
        </div>
      </div>

      <div className="stat-grid stat-grid--4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="card__title">{t('inventory.openingStock.sumLengthMeter')}</div>
          <div className="card__value">{formatStatValue(totals.lengthMeter)}</div>
        </div>
        <div className="card">
          <div className="card__title">{t('inventory.openingStock.sumLengthYard')}</div>
          <div className="card__value">{formatStatValue(totals.lengthYard)}</div>
        </div>
        <div className="card">
          <div className="card__title">{t('inventory.openingStock.sumPieces')}</div>
          <div className="card__value">{formatStatValue(totals.pieces)}</div>
        </div>
        <div className="card">
          <div className="card__title">{t('inventory.openingStock.sumItems')}</div>
          <div className="card__value">{formatStatValue(totals.items)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="filter-chips" role="tablist" aria-label={t('inventory.openingStock.filterLabel')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === filter.id}
                className={`filter-chip ${statusFilter === filter.id ? 'filter-chip--active' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="card-toolbar__hint">{t('inventory.openingStock.expandHint')}</span>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--actions data-table--expandable">
            <thead>
              <tr>
                <th>{t('inventory.openingStock.colEntryNo')}</th>
                <th>{t('common.date')}</th>
                <th>{t('inventory.openingStock.colWarehouse')}</th>
                <th>{t('inventory.openingStock.colItems')}</th>
                <th>{t('inventory.openingStock.colPieces')}</th>
                <th>{t('inventory.openingStock.colLengthMeter')}</th>
                <th>{t('inventory.openingStock.colLengthYard')}</th>
                <th>{t('common.status')}</th>
                <th>{t('inventory.openingStock.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const entryTotals = getEntryTotals(entry.lines)
                const status = statusMap[entry.status]
                const isExpanded = expandedId === entry.id

                return (
                  <Fragment key={entry.id}>
                    <tr
                      className={`${entry.disabled ? 'data-table__row--disabled' : ''} ${isExpanded ? 'data-table__row--expanded' : ''}`}
                    >
                      <td>
                        <button
                          type="button"
                          className="data-table__expand-btn"
                          aria-expanded={isExpanded}
                          aria-label={t('inventory.openingStock.toggleDetails')}
                          onClick={() => toggleExpanded(entry.id)}
                        >
                          <span className={`data-table__chevron ${isExpanded ? 'data-table__chevron--open' : ''}`}>
                            ▾
                          </span>
                          <span className="entry-no">{entry.entryNo}</span>
                        </button>
                      </td>
                      <td>{entry.date}</td>
                      <td>{warehouseLabel(entry)}</td>
                      <td className="data-table__number">{entryTotals.items}</td>
                      <td className="data-table__number">{entryTotals.pieces}</td>
                      <td className="data-table__number">{formatTotalLength(entryTotals.lengthMeter)}</td>
                      <td className="data-table__number">{formatTotalLength(entryTotals.lengthYard)}</td>
                      <td>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </td>
                      <td>
                        <RowActions
                          disabled={entry.disabled}
                          editLabel={t('inventory.openingStock.actionEdit')}
                          disableLabel={t('inventory.openingStock.actionDisable')}
                          enableLabel={t('inventory.openingStock.actionEnable')}
                          onEdit={() => undefined}
                          onDisable={() => toggleDisable(entry.id, true)}
                          onEnable={() => toggleDisable(entry.id, false)}
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="data-table__detail-row">
                        <td colSpan={9}>
                          <div className="opening-stock-detail">
                            <div className="opening-stock-detail__head">
                              <span>{t('inventory.openingStock.linesTitle')}</span>
                              <span className="opening-stock-detail__year">
                                {t('inventory.openingStock.fiscalYearShort')}: {entry.fiscalYear}
                              </span>
                            </div>
                            <table className="data-table data-table--nested">
                              <thead>
                                <tr>
                                  <th>{t('inventory.openingStock.colGoodsType')}</th>
                                  <th>{t('inventory.openingStock.colPieces')}</th>
                                  <th>{t('inventory.openingStock.colLengths')}</th>
                                  <th>{t('inventory.openingStock.colUnit')}</th>
                                  <th>{t('inventory.openingStock.colLot')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.lines.map((line) => (
                                  <tr key={line.id}>
                                    <td>{goodsLabel(line)}</td>
                                    <td className="data-table__number">{line.pieces}</td>
                                    <td className="data-table__number">{formatTotalLength(line.totalLength)}</td>
                                    <td>{unitLabel(line)}</td>
                                    <td>
                                      <span className="lot-badge">{line.lot}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filteredEntries.map((entry) => {
            const entryTotals = getEntryTotals(entry.lines)
            const status = statusMap[entry.status]
            const isExpanded = expandedId === entry.id

            return (
              <div
                key={entry.id}
                className={`mobile-list__item ${entry.disabled ? 'mobile-list__item--disabled' : ''}`}
              >
                <button
                  type="button"
                  className="mobile-list__expand-trigger"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(entry.id)}
                >
                  <div className="mobile-list__row">
                    <span className="entry-no">{entry.entryNo}</span>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('common.date')}</span>
                    <span className="mobile-list__value">{entry.date}</span>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.openingStock.colWarehouse')}</span>
                    <span className="mobile-list__value">{warehouseLabel(entry)}</span>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.openingStock.colPieces')}</span>
                    <span className="mobile-list__value">{entryTotals.pieces}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="opening-stock-detail opening-stock-detail--mobile">
                    {entry.lines.map((line) => (
                      <div key={line.id} className="opening-stock-detail__line">
                        <div className="mobile-list__row">
                          <span className="mobile-list__value">{goodsLabel(line)}</span>
                          <span className="lot-badge">{line.lot}</span>
                        </div>
                        <div className="mobile-list__row">
                          <span className="mobile-list__label">{t('inventory.openingStock.colPieces')}</span>
                          <span className="mobile-list__value">{line.pieces}</span>
                        </div>
                        <div className="mobile-list__row">
                          <span className="mobile-list__label">{t('inventory.openingStock.colLengths')}</span>
                          <span className="mobile-list__value">
                            {formatTotalLength(line.totalLength)} {unitLabel(line)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <RowActions
                  disabled={entry.disabled}
                  editLabel={t('inventory.openingStock.actionEdit')}
                  disableLabel={t('inventory.openingStock.actionDisable')}
                  enableLabel={t('inventory.openingStock.actionEnable')}
                  onEdit={() => undefined}
                  onDisable={() => toggleDisable(entry.id, true)}
                  onEnable={() => toggleDisable(entry.id, false)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
