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
import {
  containerMovementLabel,
  containerStocktakeAudits,
  getContainerAuditTotals,
  type ContainerStocktakeAudit,
} from '../../data/containerStocktake'

type StatusFilter = 'all' | StocktakeStatus

function formatContainerNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('ar-SY', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)
}

function ContainerStocktakeModal({
  selectedAudit,
  onSelectAudit,
  onClose,
}: {
  selectedAudit: ContainerStocktakeAudit
  onSelectAudit: (auditId: string) => void
  onClose: () => void
}) {
  const totals = getContainerAuditTotals(selectedAudit)
  const container = selectedAudit.container
  const movementCounts = selectedAudit.movements.reduce<Record<string, number>>((counts, movement) => {
    counts[movement.type] = (counts[movement.type] ?? 0) + 1
    return counts
  }, {})

  return (
    <div className="container-stocktake-modal" role="dialog" aria-modal="true">
      <button type="button" className="container-stocktake-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="container-stocktake-modal__panel">
        <header className="container-stocktake-modal__header">
          <div>
            <span className="container-stocktake-modal__eyebrow">جرد حسب رقم الحاوية</span>
            <h2>جرد حاوية شامل</h2>
            <p>عرض كل الحركات الكمية المرتبطة بالحاوية من تاريخ الوصول حتى تاريخ الجرد.</p>
          </div>
          <button type="button" className="container-stocktake-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="container-stocktake-modal__body">
          <section className="container-stocktake-picker">
            <label>
              رقم الحاوية
              <select value={selectedAudit.container.id} onChange={(event) => onSelectAudit(event.target.value)}>
                {containerStocktakeAudits.map((audit) => (
                  <option key={audit.container.id} value={audit.container.id}>
                    {audit.container.containerNo} - {audit.container.supplierName}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span>المورد</span>
              <strong>{container.supplierName}</strong>
            </div>
            <div>
              <span>تاريخ الوصول</span>
              <strong>{container.expectedArrival}</strong>
            </div>
            <div>
              <span>تاريخ الجرد</span>
              <strong>{selectedAudit.stocktakeDate}</strong>
            </div>
          </section>

          <section className="container-stocktake-kpis">
            <div><span>الأثواب الواردة</span><strong>{formatContainerNumber(totals.arrivedBolts)}</strong></div>
            <div><span>الأطوال الواردة</span><strong>{formatContainerNumber(totals.arrivedLength)} م</strong></div>
            <div><span>الرصيد المتوقع</span><strong>{formatContainerNumber(totals.expectedBolts)} توب</strong></div>
            <div><span>الرصيد المعدود</span><strong>{formatContainerNumber(totals.countedBolts)} توب</strong></div>
            <div><span>فرق الأثواب</span><strong className={totals.varianceBolts === 0 ? '' : 'container-stocktake__variance'}>{formatContainerNumber(totals.varianceBolts)}</strong></div>
            <div><span>فرق الأطوال</span><strong className={Math.round(totals.varianceLength) === 0 ? '' : 'container-stocktake__variance'}>{formatContainerNumber(totals.varianceLength, 1)} م</strong></div>
          </section>

          <section className="container-stocktake-flow">
            {[
              ['وصول', movementCounts.arrival ?? 0],
              ['إدخال مستودع', movementCounts.warehouse_in ?? 0],
              ['بيع/تسليم', movementCounts.sale ?? 0],
              ['حجوزات', movementCounts.reservation ?? 0],
              ['إرجاع', movementCounts.return ?? 0],
              ['هالك', movementCounts.waste ?? 0],
              ['ذمم', movementCounts.customer_balance ?? 0],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>

          <section className="container-stocktake-section">
            <div className="container-stocktake-section__head">
              <div>
                <h3>مطابقة الرصيد حسب الكود واللون</h3>
                <p>الوارد مطروحًا منه البيع والهالك والمناقلات، مع إضافة الإرجاعات المسجلة.</p>
              </div>
              <Badge variant={totals.varianceBolts === 0 && Math.round(totals.varianceLength) === 0 ? 'success' : 'warning'}>
                {totals.varianceBolts === 0 && Math.round(totals.varianceLength) === 0 ? 'مطابق' : 'يوجد فرق'}
              </Badge>
            </div>
            <div className="table-wrap">
              <table className="data-table container-stocktake-table">
                <thead>
                  <tr>
                    <th>كود القماش</th>
                    <th>النوع</th>
                    <th>اللون</th>
                    <th>وارد</th>
                    <th>بيع/تسليم</th>
                    <th>حجز</th>
                    <th>إرجاع</th>
                    <th>هالك</th>
                    <th>مناقلة</th>
                    <th>متوقع</th>
                    <th>معدود</th>
                    <th>الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAudit.lines.map((line) => {
                    const variance = (line.countedBolts ?? 0) - line.expectedBolts
                    return (
                      <tr key={`${line.fabricCode}-${line.color}`}>
                        <td>{line.fabricCode}</td>
                        <td>{line.fabricName}</td>
                        <td>{line.color}</td>
                        <td>{line.arrivedBolts}</td>
                        <td>{line.soldBolts}</td>
                        <td>{line.reservedBolts}</td>
                        <td>{line.returnedBolts}</td>
                        <td>{line.wasteBolts}</td>
                        <td>{line.transferredBolts}</td>
                        <td>{line.expectedBolts}</td>
                        <td>{line.countedBolts ?? 'معلق'}</td>
                        <td>
                          <span className={variance === 0 ? 'container-stocktake__match' : 'container-stocktake__variance'}>
                            {formatContainerNumber(variance)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="container-stocktake-section">
            <div className="container-stocktake-section__head">
              <div>
                <h3>كل الحركات المرتبطة بالحاوية</h3>
                <p>سجل تشغيلي شامل: مستودع، عميل، بيع، إرجاع، هالك، وذمم كمية.</p>
              </div>
            </div>
            <div className="container-stocktake-timeline">
              {selectedAudit.movements.map((movement) => (
                <article key={movement.id} className={`container-stocktake-timeline__item container-stocktake-timeline__item--${movement.type}`}>
                  <div className="container-stocktake-timeline__date">{movement.date}</div>
                  <div className="container-stocktake-timeline__body">
                    <div className="container-stocktake-timeline__title">
                      <strong>{movement.title}</strong>
                      <span>{containerMovementLabel(movement.type)}</span>
                    </div>
                    <p>{movement.note}</p>
                    <div className="container-stocktake-timeline__meta">
                      <span>الطرف: {movement.party}</span>
                      <span>الموقع: {movement.warehouse}</span>
                      <span>{movement.fabricCode} / {movement.color}</span>
                      <span>{formatContainerNumber(movement.bolts)} توب</span>
                      <span>{formatContainerNumber(movement.lengthMeter)} م</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="container-stocktake-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إغلاق</GlossButton>
          <GlossButton variant="accent" onClick={onClose}>اعتماد مراجعة الجرد تجريبياً</GlossButton>
        </footer>
      </div>
    </div>
  )
}

export function StocktakePage() {
  const { t, locale } = useApp()
  const [sessions, setSessions] = useState<StocktakeSession[]>(stocktakeSessions)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(stocktakeSessions[0]?.id ?? null)
  const [containerStocktakeOpen, setContainerStocktakeOpen] = useState(false)
  const [selectedContainerAuditId, setSelectedContainerAuditId] = useState(containerStocktakeAudits[0]?.container.id ?? '')

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

  const selectedContainerAudit =
    containerStocktakeAudits.find((audit) => audit.container.id === selectedContainerAuditId) ?? containerStocktakeAudits[0]

  return (
    <>
      <PageHeader
        title={t('inventory.stocktake.title')}
        subtitle={t('inventory.stocktake.subtitle')}
        actions={
          <>
            <GlossButton variant="ghost" onClick={() => setContainerStocktakeOpen(true)}>جرد حاوية</GlossButton>
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

      {containerStocktakeOpen && selectedContainerAudit && (
        <ContainerStocktakeModal
          selectedAudit={selectedContainerAudit}
          onSelectAudit={setSelectedContainerAuditId}
          onClose={() => setContainerStocktakeOpen(false)}
        />
      )}
    </>
  )
}
