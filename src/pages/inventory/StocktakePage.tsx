import { Fragment, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { DiffBadge } from '../../components/ui/DiffBadge'
import { RowActions } from '../../components/ui/RowActions'
import {
  getLineDiff,
  getSessionDiscrepancies,
  getSessionProgress,
  getStocktakeAccuracy,
  getStocktakeTotals,
  stocktakeSessions,
  type StocktakeLine,
  type StocktakeSession,
  type StocktakeStatus,
} from '../../data/stocktake'
import { useApp } from '../../context/AppProvider'

type StatusFilter = 'all' | StocktakeStatus

export function StocktakePage() {
  const { t, locale } = useApp()
  const [sessions, setSessions] = useState<StocktakeSession[]>(stocktakeSessions)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(stocktakeSessions[0]?.id ?? null)

  const formatStatValue = (value: number) =>
    value.toLocaleString('en-US', { useGrouping: false })

  const formatTotalLength = (value: number | null) => {
    if (value === null) return '—'
    if (value === 0) return '0'
    return formatStatValue(value)
  }

  const warehouseLabel = (session: StocktakeSession) =>
    locale === 'ar' ? session.warehouseAr : session.warehouseEn

  const responsibleLabel = (session: StocktakeSession) =>
    locale === 'ar' ? session.responsibleAr : session.responsibleEn

  const goodsLabel = (line: StocktakeLine) =>
    locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn

  const locationLabel = (line: StocktakeLine) =>
    locale === 'ar' ? line.locationAr : line.locationEn

  const unitLabel = (line: StocktakeLine) =>
    locale === 'ar' ? line.unitAr : line.unitEn

  const toggleDisable = (id: string, disabled: boolean) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, disabled } : session)))
  }

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredSessions = sessions.filter((session) => {
    if (statusFilter !== 'all' && session.status !== statusFilter) return false
    if (!normalizedQuery) return true

    const haystack = [
      session.sessionNo,
      session.scheduledDate,
      session.validatedDate ?? '',
      session.warehouseAr,
      session.warehouseEn,
      session.responsibleAr,
      session.responsibleEn,
      session.status,
      ...session.lines.flatMap((line) => [
        line.goodsTypeAr,
        line.goodsTypeEn,
        line.lot,
        line.locationAr,
        line.locationEn,
        line.unitAr,
        line.unitEn,
      ]),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const totals = getStocktakeTotals(sessions)
  const accuracy = getStocktakeAccuracy(sessions)

  const statusMap = {
    draft: { text: t('inventory.stocktake.statusDraft'), variant: 'neutral' as const },
    in_progress: { text: t('inventory.stocktake.statusInProgress'), variant: 'info' as const },
    validated: { text: t('inventory.stocktake.statusValidated'), variant: 'success' as const },
    cancelled: { text: t('inventory.stocktake.statusCancelled'), variant: 'danger' as const },
  }

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: t('inventory.stocktake.filterAll') },
    { id: 'draft', label: t('inventory.stocktake.filterDraft') },
    { id: 'in_progress', label: t('inventory.stocktake.filterInProgress') },
    { id: 'validated', label: t('inventory.stocktake.filterValidated') },
    { id: 'cancelled', label: t('inventory.stocktake.filterCancelled') },
  ]

  const workflowSteps = [
    { id: 'draft', label: t('inventory.stocktake.statusDraft') },
    { id: 'in_progress', label: t('inventory.stocktake.statusInProgress') },
    { id: 'validated', label: t('inventory.stocktake.statusValidated') },
  ] as const

  const workflowIndex = (status: StocktakeStatus) => {
    if (status === 'cancelled') return -1
    return workflowSteps.findIndex((step) => step.id === status)
  }

  return (
    <>
      <PageHeader
        title={t('inventory.stocktake.title')}
        subtitle={t('inventory.stocktake.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('inventory.stocktake.new')}</GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('inventory.stocktake.searchPlaceholder')}
                aria-label={t('inventory.stocktake.searchPlaceholder')}
              />
            </div>
          </>
        }
      />

      <div className="stat-grid stat-grid--4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card card--accent-info">
          <div className="card__title">{t('inventory.stocktake.kpiInProgress')}</div>
          <div className="card__value">{formatStatValue(totals.inProgress)}</div>
        </div>
        <div className="card card--accent-success">
          <div className="card__title">{t('inventory.stocktake.kpiValidated')}</div>
          <div className="card__value">{formatStatValue(totals.validated)}</div>
        </div>
        <div className="card card--accent-warning">
          <div className="card__title">{t('inventory.stocktake.kpiDiscrepancies')}</div>
          <div className="card__value">{formatStatValue(totals.discrepancies)}</div>
        </div>
        <div className="card card--accent-neutral">
          <div className="card__title">{t('inventory.stocktake.kpiAccuracy')}</div>
          <div className="card__value">{accuracy}%</div>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="filter-chips filter-chips--stocktake" role="tablist" aria-label={t('inventory.stocktake.filterLabel')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === filter.id}
                className={`filter-chip ${statusFilter === filter.id ? 'filter-chip--active filter-chip--stocktake' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="card-toolbar__hint">{t('inventory.stocktake.expandHint')}</span>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--actions data-table--expandable">
            <thead>
              <tr>
                <th>{t('inventory.stocktake.colSessionNo')}</th>
                <th>{t('common.date')}</th>
                <th>{t('inventory.stocktake.colWarehouse')}</th>
                <th>{t('inventory.stocktake.colResponsible')}</th>
                <th>{t('inventory.stocktake.colProgress')}</th>
                <th>{t('inventory.stocktake.colDiscrepancies')}</th>
                <th>{t('common.status')}</th>
                <th>{t('inventory.stocktake.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const status = statusMap[session.status]
                const progress = getSessionProgress(session.lines)
                const discrepancies = getSessionDiscrepancies(session.lines)
                const isExpanded = expandedId === session.id
                const currentStep = workflowIndex(session.status)

                return (
                  <Fragment key={session.id}>
                    <tr
                      className={`${session.disabled ? 'data-table__row--disabled' : ''} ${isExpanded ? 'data-table__row--expanded' : ''}`}
                    >
                      <td>
                        <button
                          type="button"
                          className="data-table__expand-btn"
                          aria-expanded={isExpanded}
                          aria-label={t('inventory.stocktake.toggleDetails')}
                          onClick={() => toggleExpanded(session.id)}
                        >
                          <span className={`data-table__chevron ${isExpanded ? 'data-table__chevron--open' : ''}`}>
                            ▾
                          </span>
                          <span className="session-no">{session.sessionNo}</span>
                        </button>
                      </td>
                      <td>{session.scheduledDate}</td>
                      <td>{warehouseLabel(session)}</td>
                      <td>{responsibleLabel(session)}</td>
                      <td>
                        <div className="stocktake-progress">
                          <div className="stocktake-progress__bar" aria-hidden="true">
                            <span
                              className="stocktake-progress__fill"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                          <span className="stocktake-progress__label">
                            {progress.counted}/{progress.total}
                          </span>
                        </div>
                      </td>
                      <td className="data-table__number">
                        <span className={`discrepancy-count ${discrepancies > 0 ? 'discrepancy-count--alert' : ''}`}>
                          {discrepancies}
                        </span>
                      </td>
                      <td>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </td>
                      <td>
                        <RowActions
                          disabled={session.disabled}
                          editLabel={t('inventory.stocktake.actionEdit')}
                          disableLabel={t('inventory.stocktake.actionDisable')}
                          enableLabel={t('inventory.stocktake.actionEnable')}
                          onEdit={() => undefined}
                          onDisable={() => toggleDisable(session.id, true)}
                          onEnable={() => toggleDisable(session.id, false)}
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="data-table__detail-row">
                        <td colSpan={8}>
                          <div className="stocktake-detail">
                            <div className="stocktake-detail__head">
                              <div>
                                <div className="stocktake-detail__title">{t('inventory.stocktake.linesTitle')}</div>
                                {session.validatedDate && (
                                  <div className="stocktake-detail__meta">
                                    {t('inventory.stocktake.validatedOn')}: {session.validatedDate}
                                  </div>
                                )}
                              </div>

                              {session.status !== 'cancelled' && (
                                <div className="workflow-strip" aria-label={t('inventory.stocktake.workflowLabel')}>
                                  {workflowSteps.map((step, index) => (
                                    <div
                                      key={step.id}
                                      className={`workflow-strip__step ${
                                        index <= currentStep ? 'workflow-strip__step--done' : ''
                                      } ${index === currentStep ? 'workflow-strip__step--current' : ''}`}
                                    >
                                      <span className="workflow-strip__dot">{index + 1}</span>
                                      <span className="workflow-strip__label">{step.label}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {session.lines.length === 0 ? (
                              <p className="stocktake-detail__empty">{t('inventory.stocktake.noLines')}</p>
                            ) : (
                              <table className="data-table data-table--nested data-table--stocktake">
                                <thead>
                                  <tr>
                                    <th>{t('inventory.stocktake.colGoodsType')}</th>
                                    <th>{t('inventory.stocktake.colLot')}</th>
                                    <th>{t('inventory.stocktake.colLocation')}</th>
                                    <th>{t('inventory.stocktake.colSystemPieces')}</th>
                                    <th>{t('inventory.stocktake.colCountedPieces')}</th>
                                    <th>{t('inventory.stocktake.colDiffPieces')}</th>
                                    <th>{t('inventory.stocktake.colSystemLength')}</th>
                                    <th>{t('inventory.stocktake.colCountedLength')}</th>
                                    <th>{t('inventory.stocktake.colDiffLength')}</th>
                                    <th>{t('inventory.stocktake.colUnit')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {session.lines.map((line) => {
                                    const diffPieces = getLineDiff(line.countedPieces, line.systemPieces)
                                    const diffLength = getLineDiff(line.countedLength, line.systemLength)
                                    const lineState =
                                      diffPieces === null
                                        ? 'pending'
                                        : diffPieces === 0 && diffLength === 0
                                          ? 'matched'
                                          : 'mismatch'

                                    return (
                                      <tr key={line.id} className={`stocktake-line stocktake-line--${lineState}`}>
                                        <td>{goodsLabel(line)}</td>
                                        <td>
                                          <span className="lot-badge">{line.lot}</span>
                                        </td>
                                        <td>{locationLabel(line)}</td>
                                        <td className="data-table__number">{line.systemPieces}</td>
                                        <td className="data-table__number">{formatTotalLength(line.countedPieces)}</td>
                                        <td>
                                          <DiffBadge
                                            value={diffPieces}
                                            pendingLabel={t('inventory.stocktake.pending')}
                                          />
                                        </td>
                                        <td className="data-table__number">{formatTotalLength(line.systemLength)}</td>
                                        <td className="data-table__number">{formatTotalLength(line.countedLength)}</td>
                                        <td>
                                          <DiffBadge
                                            value={diffLength}
                                            pendingLabel={t('inventory.stocktake.pending')}
                                          />
                                        </td>
                                        <td>{unitLabel(line)}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            )}
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
          {filteredSessions.map((session) => {
            const status = statusMap[session.status]
            const progress = getSessionProgress(session.lines)
            const discrepancies = getSessionDiscrepancies(session.lines)
            const isExpanded = expandedId === session.id

            return (
              <div
                key={session.id}
                className={`mobile-list__item ${session.disabled ? 'mobile-list__item--disabled' : ''}`}
              >
                <button
                  type="button"
                  className="mobile-list__expand-trigger"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(session.id)}
                >
                  <div className="mobile-list__row">
                    <span className="session-no">{session.sessionNo}</span>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.stocktake.colWarehouse')}</span>
                    <span className="mobile-list__value">{warehouseLabel(session)}</span>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.stocktake.colResponsible')}</span>
                    <span className="mobile-list__value">{responsibleLabel(session)}</span>
                  </div>
                  <div className="stocktake-progress stocktake-progress--mobile">
                    <div className="stocktake-progress__bar" aria-hidden="true">
                      <span className="stocktake-progress__fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <span className="stocktake-progress__label">
                      {t('inventory.stocktake.colProgress')}: {progress.counted}/{progress.total}
                    </span>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.stocktake.colDiscrepancies')}</span>
                    <span className={`discrepancy-count ${discrepancies > 0 ? 'discrepancy-count--alert' : ''}`}>
                      {discrepancies}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="stocktake-detail stocktake-detail--mobile">
                    {session.lines.map((line) => {
                      const diffPieces = getLineDiff(line.countedPieces, line.systemPieces)
                      const diffLength = getLineDiff(line.countedLength, line.systemLength)

                      return (
                        <div key={line.id} className="stocktake-detail__line">
                          <div className="mobile-list__row">
                            <span className="mobile-list__value">{goodsLabel(line)}</span>
                            <span className="lot-badge">{line.lot}</span>
                          </div>
                          <div className="mobile-list__row">
                            <span className="mobile-list__label">{t('inventory.stocktake.colSystemPieces')}</span>
                            <span className="mobile-list__value">{line.systemPieces}</span>
                          </div>
                          <div className="mobile-list__row">
                            <span className="mobile-list__label">{t('inventory.stocktake.colCountedPieces')}</span>
                            <span className="mobile-list__value">{formatTotalLength(line.countedPieces)}</span>
                          </div>
                          <div className="mobile-list__row">
                            <span className="mobile-list__label">{t('inventory.stocktake.colDiffPieces')}</span>
                            <DiffBadge value={diffPieces} pendingLabel={t('inventory.stocktake.pending')} />
                          </div>
                          <div className="mobile-list__row">
                            <span className="mobile-list__label">{t('inventory.stocktake.colDiffLength')}</span>
                            <DiffBadge value={diffLength} pendingLabel={t('inventory.stocktake.pending')} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <RowActions
                  disabled={session.disabled}
                  editLabel={t('inventory.stocktake.actionEdit')}
                  disableLabel={t('inventory.stocktake.actionDisable')}
                  enableLabel={t('inventory.stocktake.actionEnable')}
                  onEdit={() => undefined}
                  onDisable={() => toggleDisable(session.id, true)}
                  onEnable={() => toggleDisable(session.id, false)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
