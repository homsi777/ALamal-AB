import { Fragment, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { RowActions } from '../../components/ui/RowActions'
import {
  activeFiscalYear,
  getEntryTotals,
  getOpeningStockQuality,
  getOpeningStockTotals,
  getOpeningStockWarehouses,
  openingStockEntries,
  type OpeningStockEntry,
  type OpeningStockLine,
} from '../../data/openingStock'
import { useApp } from '../../context/AppProvider'

type StatusFilter = 'all' | 'draft' | 'posted'

const reviewStatusMap = {
  approved: { text: 'معتمد ضبطًا', variant: 'success' as const },
  ready: { text: 'جاهز للمراجعة', variant: 'info' as const },
  needs_review: { text: 'يحتاج مراجعة', variant: 'warning' as const },
}

const qualityStatusMap = {
  valid: { text: 'صالح', variant: 'success' as const },
  warning: { text: 'تنبيه', variant: 'warning' as const },
  missing: { text: 'ناقص', variant: 'danger' as const },
}

function OpeningStockWorkspaceModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (entry: OpeningStockEntry) => void
}) {
  const [entryNo, setEntryNo] = useState(`OS-2026-${String(Date.now()).slice(-3)}`)
  const [warehouse, setWarehouse] = useState('مستودع رئيسي')
  const [source, setSource] = useState('إدخال يدوي من شاشة مواد أول مدة')
  const [responsible, setResponsible] = useState('لجنة الجرد')
  const [draftLines, setDraftLines] = useState<OpeningStockLine[]>([
    {
      id: 'NEW-L-001',
      goodsTypeAr: 'COLOMBIA — أحمر',
      goodsTypeEn: 'COLOMBIA — Red',
      categoryAr: 'أقمشة مستوردة',
      categoryEn: 'Imported fabrics',
      colorAr: 'أحمر',
      colorEn: 'Red',
      pieces: 10,
      totalLength: 520,
      unitAr: 'متر',
      unitEn: 'meter',
      lot: 'LOT-NEW-001',
      locationAr: 'A1 — رف 1',
      locationEn: 'A1 — Shelf 1',
      qualityStatus: 'valid',
      noteAr: 'صف تجريبي جاهز',
      noteEn: 'Ready mock row',
    },
    {
      id: 'NEW-L-002',
      goodsTypeAr: 'DPL — كحلي',
      goodsTypeEn: 'DPL — Navy',
      categoryAr: 'أقمشة مستوردة',
      categoryEn: 'Imported fabrics',
      colorAr: 'كحلي',
      colorEn: 'Navy',
      pieces: 8,
      totalLength: 430,
      unitAr: 'متر',
      unitEn: 'meter',
      lot: 'LOT-NEW-002',
      locationAr: 'A1 — رف 2',
      locationEn: 'A1 — Shelf 2',
      qualityStatus: 'warning',
      noteAr: 'يحتاج تدقيق موقع التخزين',
      noteEn: 'Storage location needs review',
    },
  ])

  const draftTotals = getEntryTotals(draftLines)
  const readyLines = draftLines.filter((line) => line.qualityStatus === 'valid').length

  function updateLine(id: string, patch: Partial<OpeningStockLine>) {
    setDraftLines((lines) => lines.map((line) => {
      if (line.id !== id) return line
      const next = { ...line, ...patch }
      return {
        ...next,
        qualityStatus: next.goodsTypeAr && next.colorAr && next.pieces > 0 && next.totalLength > 0 && next.lot
          ? next.qualityStatus === 'missing' ? 'warning' : next.qualityStatus
          : 'missing',
      }
    }))
  }

  function addLine() {
    setDraftLines((lines) => [
      ...lines,
      {
        id: `NEW-L-${Date.now()}`,
        goodsTypeAr: '',
        goodsTypeEn: '',
        categoryAr: 'أقمشة مستوردة',
        categoryEn: 'Imported fabrics',
        colorAr: '',
        colorEn: '',
        pieces: 0,
        totalLength: 0,
        unitAr: 'متر',
        unitEn: 'meter',
        lot: '',
        locationAr: '',
        locationEn: '',
        qualityStatus: 'missing',
        noteAr: 'صف جديد يحتاج استكمال',
        noteEn: 'New row needs completion',
      },
    ])
  }

  function createEntry(status: OpeningStockEntry['status']) {
    onCreate({
      id: `OS-LOCAL-${Date.now()}`,
      entryNo,
      date: '2026-06-22',
      fiscalYear: activeFiscalYear,
      warehouseAr: warehouse,
      warehouseEn: warehouse,
      sourceAr: source,
      sourceEn: source,
      responsibleAr: responsible,
      responsibleEn: responsible,
      attachmentName: 'mock-opening-stock.xlsx',
      reviewStatus: status === 'posted' ? 'approved' : 'ready',
      status,
      disabled: false,
      lines: draftLines,
    })
    onClose()
  }

  return (
    <div className="opening-stock-modal" role="dialog" aria-modal="true">
      <button type="button" className="opening-stock-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="opening-stock-modal__panel">
        <header className="opening-stock-modal__header">
          <div>
            <span className="opening-stock-modal__eyebrow">واجهة تجهيز افتتاحية</span>
            <h2>إدخال مواد أول مدة</h2>
            <p>إدخال تجريبي منظم للرصيد الافتتاحي قبل ربطه بقاعدة البيانات وسير اعتماد المخزون.</p>
          </div>
          <button type="button" className="opening-stock-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="opening-stock-modal__body">
          <section className="opening-stock-form-panel">
            <div className="opening-stock-section-head">
              <div>
                <h3>بيانات قيد أول مدة</h3>
                <p>هذه الحقول تجهز البنية المطلوبة لاحقًا: سنة مالية، مستودع، مصدر، مسؤول ومرفق.</p>
              </div>
              <Badge variant="info">محاكاة واجهة فقط</Badge>
            </div>
            <div className="opening-stock-form-grid">
              <label>رقم الإدخال<input value={entryNo} onChange={(event) => setEntryNo(event.target.value)} /></label>
              <label>السنة المالية<input value={activeFiscalYear} readOnly /></label>
              <label>المستودع<input value={warehouse} onChange={(event) => setWarehouse(event.target.value)} /></label>
              <label>المسؤول<input value={responsible} onChange={(event) => setResponsible(event.target.value)} /></label>
              <label className="opening-stock-form-grid__wide">مصدر الإدخال<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
            </div>
          </section>

          <section className="opening-stock-workflow">
            {[
              ['1', 'تجهيز القالب', 'تثبيت الأعمدة المطلوبة للصنف واللون واللوط والموقع.'],
              ['2', 'مراجعة الكميات', 'مطابقة الأثواب والأطوال مع جرد أول المدة.'],
              ['3', 'فحص الجودة', 'تحديد الصفوف الناقصة أو التي تحتاج تدقيق.'],
              ['4', 'الاعتماد', 'ترحيل تجريبي داخل الواجهة فقط في هذه المرحلة.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="opening-stock-workflow__step">
                <span>{step}</span>
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </section>

          <section className="opening-stock-form-panel">
            <div className="opening-stock-section-head">
              <div>
                <h3>شبكة المواد الافتتاحية</h3>
                <p>جدول شبيه بالإكسل للتحضير الأمامي، مع تحقق بصري من البيانات الأساسية.</p>
              </div>
              <button type="button" className="opening-stock-secondary-btn" onClick={addLine}>إضافة سطر</button>
            </div>
            <div className="table-wrap">
              <table className="data-table opening-stock-edit-table">
                <thead>
                  <tr>
                    <th>الصنف</th>
                    <th>التصنيف</th>
                    <th>اللون</th>
                    <th>الأثواب</th>
                    <th>الطول</th>
                    <th>الوحدة</th>
                    <th>اللوط</th>
                    <th>الموقع</th>
                    <th>الجودة</th>
                  </tr>
                </thead>
                <tbody>
                  {draftLines.map((line) => {
                    const quality = qualityStatusMap[line.qualityStatus]
                    return (
                      <tr key={line.id}>
                        <td><input value={line.goodsTypeAr} onChange={(event) => updateLine(line.id, { goodsTypeAr: event.target.value, goodsTypeEn: event.target.value })} /></td>
                        <td><input value={line.categoryAr} onChange={(event) => updateLine(line.id, { categoryAr: event.target.value, categoryEn: event.target.value })} /></td>
                        <td><input value={line.colorAr} onChange={(event) => updateLine(line.id, { colorAr: event.target.value, colorEn: event.target.value })} /></td>
                        <td><input type="number" value={line.pieces} onChange={(event) => updateLine(line.id, { pieces: Number(event.target.value) })} /></td>
                        <td><input type="number" value={line.totalLength} onChange={(event) => updateLine(line.id, { totalLength: Number(event.target.value) })} /></td>
                        <td>
                          <select value={line.unitEn} onChange={(event) => updateLine(line.id, { unitEn: event.target.value as 'meter' | 'yard', unitAr: event.target.value === 'meter' ? 'متر' : 'يارد' })}>
                            <option value="meter">متر</option>
                            <option value="yard">يارد</option>
                          </select>
                        </td>
                        <td><input value={line.lot} onChange={(event) => updateLine(line.id, { lot: event.target.value })} /></td>
                        <td><input value={line.locationAr} onChange={(event) => updateLine(line.id, { locationAr: event.target.value, locationEn: event.target.value })} /></td>
                        <td><Badge variant={quality.variant}>{quality.text}</Badge></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="opening-stock-review-grid">
            <div><span>عدد الأسطر</span><strong>{draftLines.length}</strong></div>
            <div><span>أسطر صالحة</span><strong>{readyLines}</strong></div>
            <div><span>إجمالي الأثواب</span><strong>{draftTotals.pieces}</strong></div>
            <div><span>أطوال متر</span><strong>{draftTotals.lengthMeter}</strong></div>
            <div><span>أطوال يارد</span><strong>{draftTotals.lengthYard}</strong></div>
          </section>
        </div>

        <footer className="opening-stock-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إغلاق</GlossButton>
          <GlossButton variant="ghost" onClick={() => createEntry('draft')}>حفظ كمسودة</GlossButton>
          <GlossButton variant="accent" onClick={() => createEntry('posted')}>اعتماد تجريبي</GlossButton>
        </footer>
      </div>
    </div>
  )
}

export function OpeningStockPage() {
  const { t, locale } = useApp()
  const [entries, setEntries] = useState<OpeningStockEntry[]>(openingStockEntries)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(openingStockEntries[0]?.id ?? null)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)

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
      entry.sourceAr,
      entry.sourceEn,
      entry.responsibleAr,
      entry.responsibleEn,
      entry.attachmentName,
      ...entry.lines.flatMap((line) => [
        line.goodsTypeAr,
        line.goodsTypeEn,
        line.categoryAr,
        line.categoryEn,
        line.colorAr,
        line.colorEn,
        line.lot,
        line.locationAr,
        line.locationEn,
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
  const quality = getOpeningStockQuality(entries)
  const warehouses = getOpeningStockWarehouses(entries)
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
            <GlossButton variant="accent" onClick={() => setWorkspaceOpen(true)}>{t('inventory.openingStock.new')}</GlossButton>
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

      <section className="opening-stock-readiness">
        <div className="opening-stock-readiness__intro">
          <span>جاهزية قسم مواد أول مدة</span>
          <strong>مصمم ليكون مصدر الرصيد الافتتاحي قبل أي حركة بيع أو شراء أو جرد لاحق.</strong>
        </div>
        <div className="opening-stock-readiness__steps">
          <span>قالب موحد</span>
          <span>تحقق سطور</span>
          <span>مراجعة مسؤول</span>
          <span>ترحيل للمخزون</span>
        </div>
      </section>

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
          <span>المستودعات: {warehouses.length}</span>
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

      <div className="opening-stock-quality-grid">
        <div className="opening-stock-quality-card opening-stock-quality-card--success">
          <span>إدخالات معتمدة ضبطًا</span>
          <strong>{quality.approved}</strong>
          <small>جاهزة للترحيل عند الربط</small>
        </div>
        <div className="opening-stock-quality-card opening-stock-quality-card--info">
          <span>جاهزة للمراجعة</span>
          <strong>{quality.ready}</strong>
          <small>مسودات مكتملة بنيويًا</small>
        </div>
        <div className="opening-stock-quality-card opening-stock-quality-card--warning">
          <span>تحتاج مراجعة</span>
          <strong>{quality.needsReview}</strong>
          <small>تحتاج استكمال مرفق أو لوط</small>
        </div>
        <div className="opening-stock-quality-card opening-stock-quality-card--neutral">
          <span>جودة الأسطر</span>
          <strong>{quality.validLines}/{quality.lines}</strong>
          <small>{quality.warningLines} تنبيه · {quality.missingLines} ناقص</small>
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
                <th>المصدر</th>
                <th>المسؤول</th>
                <th>{t('inventory.openingStock.colItems')}</th>
                <th>{t('inventory.openingStock.colPieces')}</th>
                <th>{t('inventory.openingStock.colLengthMeter')}</th>
                <th>{t('inventory.openingStock.colLengthYard')}</th>
                <th>{t('common.status')}</th>
                <th>المراجعة</th>
                <th>{t('inventory.openingStock.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const entryTotals = getEntryTotals(entry.lines)
                const status = statusMap[entry.status]
                const review = reviewStatusMap[entry.reviewStatus]
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
                      <td>{locale === 'ar' ? entry.sourceAr : entry.sourceEn}</td>
                      <td>{locale === 'ar' ? entry.responsibleAr : entry.responsibleEn}</td>
                      <td className="data-table__number">{entryTotals.items}</td>
                      <td className="data-table__number">{entryTotals.pieces}</td>
                      <td className="data-table__number">{formatTotalLength(entryTotals.lengthMeter)}</td>
                      <td className="data-table__number">{formatTotalLength(entryTotals.lengthYard)}</td>
                      <td>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </td>
                      <td>
                        <Badge variant={review.variant}>{review.text}</Badge>
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
                        <td colSpan={12}>
                          <div className="opening-stock-detail">
                            <div className="opening-stock-detail__head">
                              <span>{t('inventory.openingStock.linesTitle')} · {entry.attachmentName}</span>
                              <span className="opening-stock-detail__year">
                                {t('inventory.openingStock.fiscalYearShort')}: {entry.fiscalYear}
                              </span>
                            </div>
                            <div className="opening-stock-detail__meta-grid">
                              <div><span>مصدر الإدخال</span><strong>{locale === 'ar' ? entry.sourceAr : entry.sourceEn}</strong></div>
                              <div><span>المسؤول</span><strong>{locale === 'ar' ? entry.responsibleAr : entry.responsibleEn}</strong></div>
                              <div><span>المرفق</span><strong>{entry.attachmentName}</strong></div>
                              <div><span>حالة المراجعة</span><strong>{review.text}</strong></div>
                            </div>
                            <table className="data-table data-table--nested">
                              <thead>
                                <tr>
                                  <th>{t('inventory.openingStock.colGoodsType')}</th>
                                  <th>التصنيف</th>
                                  <th>اللون</th>
                                  <th>{t('inventory.openingStock.colPieces')}</th>
                                  <th>{t('inventory.openingStock.colLengths')}</th>
                                  <th>{t('inventory.openingStock.colUnit')}</th>
                                  <th>{t('inventory.openingStock.colLot')}</th>
                                  <th>الموقع</th>
                                  <th>الجودة</th>
                                  <th>ملاحظات</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.lines.map((line) => {
                                  const lineQuality = qualityStatusMap[line.qualityStatus]
                                  return (
                                    <tr key={line.id}>
                                      <td>{goodsLabel(line)}</td>
                                      <td>{locale === 'ar' ? line.categoryAr : line.categoryEn}</td>
                                      <td>{locale === 'ar' ? line.colorAr : line.colorEn}</td>
                                      <td className="data-table__number">{line.pieces}</td>
                                      <td className="data-table__number">{formatTotalLength(line.totalLength)}</td>
                                      <td>{unitLabel(line)}</td>
                                      <td>
                                        <span className="lot-badge">{line.lot}</span>
                                      </td>
                                      <td>{locale === 'ar' ? line.locationAr : line.locationEn}</td>
                                      <td><Badge variant={lineQuality.variant}>{lineQuality.text}</Badge></td>
                                      <td>{locale === 'ar' ? line.noteAr : line.noteEn}</td>
                                    </tr>
                                  )
                                })}
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
                    <span className="mobile-list__label">المصدر</span>
                    <span className="mobile-list__value">{locale === 'ar' ? entry.sourceAr : entry.sourceEn}</span>
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
                        <div className="mobile-list__row">
                          <span className="mobile-list__label">الموقع</span>
                          <span className="mobile-list__value">{locale === 'ar' ? line.locationAr : line.locationEn}</span>
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

      {workspaceOpen && (
        <OpeningStockWorkspaceModal
          onClose={() => setWorkspaceOpen(false)}
          onCreate={(entry) => {
            setEntries((current) => [entry, ...current])
            setExpandedId(entry.id)
          }}
        />
      )}
    </>
  )
}
