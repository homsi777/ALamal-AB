import { useMemo, useRef, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { GlossButton } from '../components/ui/GlossButton'
import {
  chinaContainers,
  chinaImportTemplates,
  chinaSuppliers,
  mockMultiFabricRows,
  mockSingleFabricRows,
  type ChinaBolt,
  type ChinaContainer,
  type ChinaCustomerDistribution,
  type ChinaImportRow,
  type ChinaImportStatus,
} from '../data/chinaOrdersMockData'

type ImportMode = 'single' | 'multi' | 'manual'

const statusMeta: Record<ChinaImportStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  draft: { label: 'مسودة', variant: 'neutral' },
  shipping: { label: 'قيد الشحن', variant: 'info' },
  arrived: { label: 'وصلت', variant: 'warning' },
  approved: { label: 'معتمدة', variant: 'success' },
  archived: { label: 'مؤرشفة', variant: 'neutral' },
}

const distributionStatus: Record<ChinaCustomerDistribution['status'], { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }> = {
  reserved: { label: 'محجوز', variant: 'warning' },
  sold: { label: 'مباع', variant: 'info' },
  delivered: { label: 'تم التسليم', variant: 'success' },
  preparing: { label: 'قيد التجهيز', variant: 'neutral' },
}

const importModeLabels: Record<ImportMode, { title: string; example: string; desc: string }> = {
  single: {
    title: 'استيراد ملف نوع قماش واحد',
    example: 'COLOMBIA.xls',
    desc: 'مناسب عندما يكون الملف كله لكود واحد مع ألوان وأثواب متعددة.',
  },
  multi: {
    title: 'استيراد ملف يحتوي عدة أنواع أقمشة',
    example: 'DPL.xls',
    desc: 'مناسب لملفات المورد التي تحتوي أكثر من كود ولون ضمن نفس الحاوية.',
  },
  manual: {
    title: 'إدخال يدوي شبيه بإكسل',
    example: 'مفضل حاليًا',
    desc: 'يفتح شبكة قابلة للمراجعة والتعديل بدون قراءة ملف حقيقية.',
  },
}

function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('ar-SY', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)
}

function totals(bolts: ChinaBolt[]) {
  return {
    bolts: bolts.length,
    length: bolts.reduce((sum, bolt) => sum + bolt.lengthMeter, 0),
    weight: bolts.reduce((sum, bolt) => sum + bolt.weightKg, 0),
    codes: new Set(bolts.map((bolt) => bolt.fabricCode)).size,
    colors: new Set(bolts.map((bolt) => bolt.color)).size,
  }
}

function groupBolts(bolts: ChinaBolt[]) {
  const map = new Map<string, ChinaBolt[]>()
  bolts.forEach((bolt) => {
    const key = `${bolt.fabricCode}-${bolt.color}`
    map.set(key, [...(map.get(key) ?? []), bolt])
  })

  return Array.from(map.values()).map((items) => {
    const sum = totals(items)
    return {
      fabricCode: items[0].fabricCode,
      fabricName: items[0].fabricName,
      color: items[0].color,
      bolts: sum.bolts,
      length: sum.length,
      weight: sum.weight,
      avgLength: sum.length / sum.bolts,
      avgWeight: sum.weight / sum.bolts,
      notes: items.some((item) => item.note) ? 'يوجد ملاحظات على بعض الأثواب' : 'جاهز للمراجعة',
    }
  })
}

function summarizeRows(rows: ChinaImportRow[]) {
  const validRows = rows.filter((row) => row.fabricCode && row.color && row.lengthMeter && row.weightKg)
  const length = rows.reduce((sum, row) => sum + (row.lengthMeter ?? 0), 0)
  const weight = rows.reduce((sum, row) => sum + (row.weightKg ?? 0), 0)

  return {
    rows: rows.length,
    validRows: validRows.length,
    length,
    weight,
    codes: new Set(rows.filter((row) => row.fabricCode).map((row) => row.fabricCode)).size,
    colors: new Set(rows.filter((row) => row.color).map((row) => row.color)).size,
  }
}

function groupRows(rows: ChinaImportRow[]) {
  const map = new Map<string, ChinaImportRow[]>()
  rows.forEach((row) => {
    const key = `${row.fabricCode || 'بدون كود'}-${row.color || 'بدون لون'}`
    map.set(key, [...(map.get(key) ?? []), row])
  })

  return Array.from(map.values()).map((items) => ({
    fabricCode: items[0].fabricCode || 'بدون كود',
    fabricName: items[0].fabricName || 'غير محدد',
    color: items[0].color || 'بدون لون',
    rows: items.length,
    length: items.reduce((sum, item) => sum + (item.lengthMeter ?? 0), 0),
    weight: items.reduce((sum, item) => sum + (item.weightKg ?? 0), 0),
  }))
}

function getTopBy<T>(items: T[], getKey: (item: T) => string, getValue: (item: T) => number) {
  const map = new Map<string, number>()
  items.forEach((item) => {
    const key = getKey(item)
    map.set(key, (map.get(key) ?? 0) + getValue(item))
  })
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0] ?? ['-', 0]
}

function IconButton({ children, onClick, title }: { children: string; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      className="china-icon-button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      title={title}
    >
      {children}
    </button>
  )
}

function InventoryHierarchyCard() {
  return (
    <div className="china-hierarchy-card">
      <div>
        <span>التسلسل المستقبلي للمخزون</span>
        <strong>فئة القماش → الكود → اللون → التوب الفردي</strong>
      </div>
      <div className="china-hierarchy-card__flow">
        <span>أقمشة مستوردة</span>
        <span>COLOMBIA</span>
        <span>أحمر</span>
        <span>توب رقم COL-RED-001</span>
      </div>
    </div>
  )
}

function ChinaOrdersHeader({ onImport }: { onImport: () => void }) {
  return (
    <section className="china-hero">
      <div>
        <span className="china-eyebrow">China Import Containers</span>
        <h1>طلبات الصين</h1>
        <p>إدارة حاويات الأقمشة المستوردة من الصين من مرحلة ملف المورد حتى مراجعة الأثواب والألوان والحجوزات.</p>
      </div>
      <div className="china-hero__actions">
        <GlossButton variant="accent" onClick={onImport}>استيراد حاوية جديدة</GlossButton>
        <span>واجهة تجريبية أمامية فقط، بدون ربط قاعدة بيانات.</span>
      </div>
    </section>
  )
}

function ChinaOrdersKpiCards({ containers }: { containers: ChinaContainer[] }) {
  const allBolts = containers.flatMap((container) => container.bolts)
  const allTotals = totals(allBolts)
  const linkedCustomers = new Set(containers.flatMap((container) => container.distributions.map((item) => item.customerName))).size
  const arrived = containers.filter((container) => container.status === 'arrived' || container.status === 'approved').length
  const shipping = containers.filter((container) => container.status === 'shipping').length

  const cards = [
    ['إجمالي الحاويات', containers.length],
    ['الحاويات الواصلة', arrived],
    ['الحاويات بالطريق', shipping],
    ['إجمالي الأثواب', allTotals.bolts],
    ['إجمالي الأطوال بالمتر', `${formatNumber(allTotals.length)} م`],
    ['إجمالي الوزن بالكغ', `${formatNumber(allTotals.weight, 1)} كغ`],
    ['عدد الموردين', new Set(containers.map((container) => container.supplierId)).size],
    ['عملاء مرتبطون بالحجوزات', linkedCustomers],
  ]

  return (
    <section className="china-kpi-grid">
      {cards.map(([label, value]) => (
        <div key={label} className="china-kpi-card">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}

function ChinaOrdersFilters({
  search,
  status,
  supplier,
  month,
  onSearch,
  onStatus,
  onSupplier,
  onMonth,
  onReset,
}: {
  search: string
  status: string
  supplier: string
  month: string
  onSearch: (value: string) => void
  onStatus: (value: string) => void
  onSupplier: (value: string) => void
  onMonth: (value: string) => void
  onReset: () => void
}) {
  return (
    <section className="china-filters">
      <label>
        بحث
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="رقم حاوية، مورد، كود، لون، عميل..."
        />
      </label>
      <label>
        الحالة
        <select value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="all">الكل</option>
          <option value="draft">مسودة</option>
          <option value="shipping">قيد الشحن</option>
          <option value="arrived">وصلت</option>
          <option value="approved">معتمدة</option>
          <option value="archived">مؤرشفة</option>
        </select>
      </label>
      <label>
        المورد
        <select value={supplier} onChange={(event) => onSupplier(event.target.value)}>
          <option value="all">كل الموردين</option>
          {chinaSuppliers.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
      <label>
        شهر الوصول
        <input type="month" value={month} onChange={(event) => onMonth(event.target.value)} />
      </label>
      <button type="button" className="china-reset-btn" onClick={onReset}>تصفير الفلاتر</button>
    </section>
  )
}

function ChinaContainersTable({
  containers,
  onSelect,
  onReview,
  onArchive,
  onDelete,
}: {
  containers: ChinaContainer[]
  onSelect: (container: ChinaContainer) => void
  onReview: (container: ChinaContainer) => void
  onArchive: (container: ChinaContainer) => void
  onDelete: (container: ChinaContainer) => void
}) {
  return (
    <section className="china-panel">
      <div className="china-panel__header">
        <div>
          <h2>سجل الحاويات المستوردة</h2>
          <p>اضغط على أي صف لعرض التفاصيل والكميات المرتبطة بالعملاء.</p>
        </div>
        <Badge variant="info">{containers.length} حاويات معروضة</Badge>
      </div>

      <div className="table-wrap china-table-wrap">
        <table className="data-table china-table">
          <thead>
            <tr>
              <th>رقم الحاوية</th>
              <th>المورد</th>
              <th>تاريخ الشحن</th>
              <th>الوصول المتوقع</th>
              <th>الحالة</th>
              <th>الأكواد</th>
              <th>الألوان</th>
              <th>الأثواب</th>
              <th>الأطوال</th>
              <th>الوزن</th>
              <th>الهالك</th>
              <th>العملاء</th>
              <th>آخر تحديث</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((container) => {
              const sum = totals(container.bolts)
              const meta = statusMeta[container.status]
              return (
                <tr key={container.id} className="china-table__row" onClick={() => onSelect(container)}>
                  <td><strong>{container.containerNo}</strong><small>{container.orderNo}</small></td>
                  <td>{container.supplierName}</td>
                  <td>{container.shipDate}</td>
                  <td>{container.expectedArrival}</td>
                  <td><Badge variant={meta.variant}>{meta.label}</Badge></td>
                  <td>{sum.codes}</td>
                  <td>{sum.colors}</td>
                  <td>{formatNumber(sum.bolts)}</td>
                  <td>{formatNumber(sum.length)} م</td>
                  <td>{formatNumber(sum.weight, 1)} كغ</td>
                  <td>{container.wastePercent}%</td>
                  <td>{container.distributions.length}</td>
                  <td>{container.lastUpdate}</td>
                  <td>
                    <div className="china-row-actions">
                      <IconButton title="عرض التفاصيل" onClick={() => onSelect(container)}>عرض</IconButton>
                      <IconButton title="مراجعة الاستيراد" onClick={() => onReview(container)}>مراجعة</IconButton>
                      <IconButton title="أرشفة أو استعادة" onClick={() => onArchive(container)}>
                        {container.status === 'archived' ? 'استعادة' : 'أرشفة'}
                      </IconButton>
                      <IconButton title="حذف تجريبي" onClick={() => onDelete(container)}>حذف</IconButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ChinaCustomerDistributionTable({ rows }: { rows: ChinaCustomerDistribution[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table china-table">
        <thead>
          <tr>
            <th>اسم العميل</th>
            <th>المدينة</th>
            <th>كود القماش</th>
            <th>اللون</th>
            <th>عدد الأثواب</th>
            <th>إجمالي الطول</th>
            <th>الحالة</th>
            <th>تاريخ الحركة</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const meta = distributionStatus[row.status]
            return (
              <tr key={row.id}>
                <td>{row.customerName}</td>
                <td>{row.city}</td>
                <td>{row.fabricCode}</td>
                <td>{row.color}</td>
                <td>{row.bolts}</td>
                <td>{formatNumber(row.lengthMeter)} م</td>
                <td><Badge variant={meta.variant}>{meta.label}</Badge></td>
                <td>{row.movementDate}</td>
                <td>{row.notes}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ChinaContainerDetailsModal({
  container,
  onClose,
  onReview,
}: {
  container: ChinaContainer
  onClose: () => void
  onReview: () => void
}) {
  const sum = totals(container.bolts)
  const grouped = groupBolts(container.bolts)
  const rawWeight = sum.weight
  const netWeight = rawWeight * (1 - container.wastePercent / 100)
  const topCode = getTopBy(container.bolts, (bolt) => bolt.fabricCode, (bolt) => bolt.lengthMeter)
  const topColor = getTopBy(container.bolts, (bolt) => bolt.color, (bolt) => bolt.lengthMeter)
  const topCustomer = getTopBy(container.distributions, (row) => row.customerName, (row) => row.bolts)
  const distributedBolts = container.distributions.reduce((acc, row) => acc + row.bolts, 0)
  const remaining = Math.max(sum.bolts - distributedBolts, 0)
  const distributionRate = sum.bolts > 0 ? (distributedBolts / sum.bolts) * 100 : 0
  const meta = statusMeta[container.status]

  return (
    <div className="china-modal" role="dialog" aria-modal="true">
      <button type="button" className="china-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="china-modal__panel china-modal__panel--large">
        <header className="china-modal__header">
          <div>
            <span className="china-eyebrow">تفاصيل الحاوية</span>
            <h2>{container.containerNo}</h2>
            <p>{container.supplierName} · {container.orderNo}</p>
          </div>
          <button type="button" className="china-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="china-modal__body">
          <section className="china-summary-grid">
            {[
              ['الحالة', <Badge key="status" variant={meta.variant}>{meta.label}</Badge>],
              ['تاريخ الشحن', container.shipDate],
              ['الوصول المتوقع', container.expectedArrival],
              ['نسبة الهالك', `${container.wastePercent}%`],
              ['إجمالي الأثواب', formatNumber(sum.bolts)],
              ['إجمالي الأطوال', `${formatNumber(sum.length)} م`],
              ['الوزن الخام', `${formatNumber(rawWeight, 1)} كغ`],
              ['الوزن الصافي بعد الهالك', `${formatNumber(netWeight, 1)} كغ`],
              ['عدد الأكواد', sum.codes],
              ['عدد الألوان', sum.colors],
              ['العملاء المرتبطون', container.distributions.length],
            ].map(([label, value]) => (
              <div key={String(label)} className="china-summary-item">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>

          <section className="china-quick-grid">
            <div><span>أكثر كود مستورد</span><strong>{topCode[0]}</strong></div>
            <div><span>أكثر لون كمية</span><strong>{topColor[0]}</strong></div>
            <div><span>أكبر عميل بالأثواب</span><strong>{topCustomer[0]}</strong></div>
            <div><span>كمية غير موزعة</span><strong>{formatNumber(remaining)} توب</strong></div>
            <div><span>نسبة التوزيع</span><strong>{formatNumber(distributionRate, 1)}%</strong></div>
          </section>

          <InventoryHierarchyCard />

          <section className="china-modal-section">
            <h3>تفصيل الأقمشة حسب الكود واللون</h3>
            <div className="table-wrap">
              <table className="data-table china-table">
                <thead>
                  <tr>
                    <th>كود القماش</th>
                    <th>نوع القماش</th>
                    <th>اللون</th>
                    <th>الأثواب</th>
                    <th>مجموع الأطوال</th>
                    <th>مجموع الوزن</th>
                    <th>متوسط طول التوب</th>
                    <th>متوسط وزن التوب</th>
                    <th>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map((row) => (
                    <tr key={`${row.fabricCode}-${row.color}`}>
                      <td>{row.fabricCode}</td>
                      <td>{row.fabricName}</td>
                      <td>{row.color}</td>
                      <td>{row.bolts}</td>
                      <td>{formatNumber(row.length)} م</td>
                      <td>{formatNumber(row.weight, 1)} كغ</td>
                      <td>{formatNumber(row.avgLength, 1)} م</td>
                      <td>{formatNumber(row.avgWeight, 1)} كغ</td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="china-modal-section">
            <h3>توزيع العملاء والحجوزات</h3>
            <ChinaCustomerDistributionTable rows={container.distributions} />
          </section>
        </div>

        <footer className="china-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إغلاق</GlossButton>
          <GlossButton variant="accent" onClick={onReview}>فتح مراجعة الاستيراد</GlossButton>
        </footer>
      </div>
    </div>
  )
}

function ChinaImportStartModal({
  selectedMode,
  onMode,
  onClose,
  onConfirm,
}: {
  selectedMode: ImportMode
  onMode: (mode: ImportMode) => void
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="china-modal" role="dialog" aria-modal="true">
      <button type="button" className="china-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="china-modal__panel china-modal__panel--start">
        <header className="china-modal__header">
          <div>
            <span className="china-eyebrow">بدء الاستيراد</span>
            <h2>استيراد حاوية جديدة</h2>
            <p>اختر طريقة إدخال بيانات الحاوية.</p>
          </div>
          <button type="button" className="china-modal__close" onClick={onClose}>×</button>
        </header>
        <div className="china-import-options">
          {(Object.keys(importModeLabels) as ImportMode[]).map((mode) => {
            const item = importModeLabels[mode]
            return (
              <button
                key={mode}
                type="button"
                className={`china-import-option ${selectedMode === mode ? 'china-import-option--active' : ''}`}
                onClick={() => onMode(mode)}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
                <em>{item.example}</em>
              </button>
            )
          })}
        </div>
        <footer className="china-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إلغاء</GlossButton>
          <GlossButton variant="accent" onClick={onConfirm}>موافق</GlossButton>
        </footer>
      </div>
    </div>
  )
}

function ChinaImportGrid({
  rows,
  onRows,
}: {
  rows: ChinaImportRow[]
  onRows: (rows: ChinaImportRow[]) => void
}) {
  function updateRow(id: string, patch: Partial<ChinaImportRow>) {
    onRows(rows.map((row) => {
      if (row.id !== id) return row
      const updated = { ...row, ...patch }
      return {
        ...updated,
        status: !updated.fabricCode || !updated.color || !updated.lengthMeter || !updated.weightKg ? 'error' : updated.note ? 'warning' : 'valid',
      }
    }))
  }

  function addRow() {
    onRows([
      ...rows,
      {
        id: `manual-${Date.now()}`,
        boltNo: `NEW-${String(rows.length + 1).padStart(3, '0')}`,
        fabricCode: '',
        fabricName: '',
        color: '',
        note: '',
        status: 'error',
      },
    ])
  }

  function duplicateRow(row: ChinaImportRow) {
    onRows([...rows, { ...row, id: `${row.id}-copy-${Date.now()}`, boltNo: `${row.boltNo}-نسخة` }])
  }

  function deleteRow(id: string) {
    onRows(rows.filter((row) => row.id !== id))
  }

  return (
    <section className="china-modal-section">
      <div className="china-section-heading">
        <div>
          <h3>شبكة الإدخال المشابهة لإكسل</h3>
          <p>الصفوف قابلة للتعديل بصريًا في الواجهة فقط، والتحقق الحالي تجريبي.</p>
        </div>
        <button type="button" className="china-secondary-btn" onClick={addRow}>إضافة صف</button>
      </div>
      <div className="table-wrap">
        <table className="data-table china-table china-import-grid">
          <thead>
            <tr>
              <th>رقم التوب</th>
              <th>كود القماش</th>
              <th>نوع القماش</th>
              <th>اللون</th>
              <th>الطول بالمتر</th>
              <th>الوزن بالكغ</th>
              <th>ملاحظة</th>
              <th>حالة الصف</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><input value={row.boltNo} onChange={(event) => updateRow(row.id, { boltNo: event.target.value })} /></td>
                <td><input value={row.fabricCode} onChange={(event) => updateRow(row.id, { fabricCode: event.target.value })} /></td>
                <td><input value={row.fabricName} onChange={(event) => updateRow(row.id, { fabricName: event.target.value })} /></td>
                <td><input value={row.color} onChange={(event) => updateRow(row.id, { color: event.target.value })} /></td>
                <td><input type="number" value={row.lengthMeter ?? ''} onChange={(event) => updateRow(row.id, { lengthMeter: event.target.value ? Number(event.target.value) : undefined })} /></td>
                <td><input type="number" value={row.weightKg ?? ''} onChange={(event) => updateRow(row.id, { weightKg: event.target.value ? Number(event.target.value) : undefined })} /></td>
                <td><input value={row.note} onChange={(event) => updateRow(row.id, { note: event.target.value })} /></td>
                <td>
                  {row.status === 'valid' && <Badge variant="success">جاهز</Badge>}
                  {row.status === 'warning' && <Badge variant="warning">تنبيه</Badge>}
                  {row.status === 'error' && <Badge variant="danger">ناقص</Badge>}
                </td>
                <td>
                  <div className="china-row-actions">
                    <IconButton title="تكرار الصف" onClick={() => duplicateRow(row)}>تكرار</IconButton>
                    <IconButton title="حذف الصف" onClick={() => deleteRow(row.id)}>حذف</IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ChinaImportSummary({ rows, wastePercent }: { rows: ChinaImportRow[]; wastePercent: number }) {
  const summary = summarizeRows(rows)
  const netWeight = summary.weight * (1 - wastePercent / 100)
  const cards = [
    ['عدد الأثواب', summary.rows],
    ['إجمالي الأطوال', `${formatNumber(summary.length)} م`],
    ['الوزن الخام', `${formatNumber(summary.weight, 1)} كغ`],
    ['نسبة الهالك', `${wastePercent}%`],
    ['الوزن الصافي بعد الهالك', `${formatNumber(netWeight, 1)} كغ`],
    ['عدد الأكواد', summary.codes],
    ['عدد الألوان', summary.colors],
  ]

  return (
    <section className="china-import-summary">
      {cards.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}

function ChinaImportWorkspaceModal({
  mode,
  initialRows,
  onClose,
  onApprove,
}: {
  mode: ImportMode
  initialRows: ChinaImportRow[]
  onClose: () => void
  onApprove: (rows: ChinaImportRow[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ChinaImportRow[]>(initialRows)
  const [fileName, setFileName] = useState(mode === 'single' ? 'COLOMBIA.xls' : mode === 'multi' ? 'DPL.xls' : '')
  const [supplierId, setSupplierId] = useState(chinaSuppliers[0].id)
  const [containerNo, setContainerNo] = useState('CNTR-MOCK-2026')
  const [orderNo, setOrderNo] = useState('CN-2026-NEW')
  const [shipDate, setShipDate] = useState('2026-06-22')
  const [arrivalDate, setArrivalDate] = useState('2026-07-22')
  const [wastePercent, setWastePercent] = useState(1.8)
  const selectedSupplier = chinaSuppliers.find((item) => item.id === supplierId) ?? chinaSuppliers[0]
  const template = chinaImportTemplates.find((item) => item.supplierId === supplierId) ?? chinaImportTemplates[0]
  const grouped = groupRows(rows)
  const summary = summarizeRows(rows)
  const warnings = [
    grouped.some((row) => grouped.filter((item) => item.fabricCode === row.fabricCode).length > 1) && 'ألوان مكررة ضمن نفس الكود تحتاج مراجعة تسميات.',
    rows.some((row) => !row.weightKg) && 'توجد أثواب بدون وزن.',
    rows.some((row) => !row.lengthMeter) && 'توجد أثواب بدون طول.',
    'أكواد جديدة سيتم إنشاؤها في المخزون مستقبلًا بعد الربط.',
    'أكواد موجودة سيتم إضافة الأثواب تحتها مستقبلًا بعد الربط.',
  ].filter((warning): warning is string => Boolean(warning))

  function loadMockRows(nextFileName?: string) {
    setRows(mode === 'single' ? mockSingleFabricRows : mockMultiFabricRows)
    setFileName(nextFileName || (mode === 'single' ? 'COLOMBIA.xls' : 'DPL.xls'))
  }

  return (
    <div className="china-modal" role="dialog" aria-modal="true">
      <button type="button" className="china-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="china-modal__panel china-modal__panel--workspace">
        <header className="china-modal__header">
          <div>
            <span className="china-eyebrow">مراجعة استيراد تجريبية</span>
            <h2>{importModeLabels[mode].title}</h2>
            <p>هذه شاشة محاكاة أمامية فقط ولا تقوم بقراءة Excel أو الترحيل إلى قاعدة بيانات.</p>
          </div>
          <button type="button" className="china-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="china-modal__body china-workspace">
          <section className="china-form-panel">
            <div className="china-section-heading">
              <div>
                <h3>بيانات الحاوية</h3>
                <p>حقول تعريفية لتجهيز رحلة الربط المستقبلية.</p>
              </div>
              <Badge variant="neutral">{selectedSupplier.templateName}</Badge>
            </div>
            <div className="china-form-grid">
              <label>رقم الحاوية<input value={containerNo} onChange={(event) => setContainerNo(event.target.value)} /></label>
              <label>المورد<select value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>{chinaSuppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label>رقم الطلب<input value={orderNo} onChange={(event) => setOrderNo(event.target.value)} /></label>
              <label>تاريخ الشحن<input type="date" value={shipDate} onChange={(event) => setShipDate(event.target.value)} /></label>
              <label>الوصول المتوقع<input type="date" value={arrivalDate} onChange={(event) => setArrivalDate(event.target.value)} /></label>
              <label>نسبة الهالك المتفق عليها<input type="number" value={wastePercent} onChange={(event) => setWastePercent(Number(event.target.value))} /></label>
              <label className="china-form-grid__wide">ملاحظات<textarea defaultValue="مراجعة تجريبية للحاوية قبل اعتماد الربط الفعلي مع المخزون." /></label>
            </div>
          </section>

          <section className="china-workspace__split">
            <div className="china-template-card">
              <h3>قالب المورد المرتبط</h3>
              <strong>{template.name}</strong>
              <ul>
                {template.columns.map((column) => (
                  <li key={column.column}><span>Column {column.column}</span>{column.label}</li>
                ))}
              </ul>
              <button type="button" className="china-secondary-btn">تعديل قالب المورد</button>
            </div>

            <div className="china-upload-card" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                hidden
                onChange={(event) => loadMockRows(event.target.files?.[0]?.name)}
              />
              <span>رفع ملف Excel تجريبي</span>
              <strong>{fileName || 'اختر ملف Excel'}</strong>
              <p>اضغط هنا لتعبئة الشبكة ببيانات وهمية. لا توجد قراءة فعلية للملف في هذه المرحلة.</p>
              <button type="button" className="china-secondary-btn" onClick={(event) => { event.stopPropagation(); loadMockRows() }}>اختيار ملف Excel</button>
            </div>
          </section>

          <InventoryHierarchyCard />
          <ChinaImportGrid rows={rows} onRows={setRows} />
          <ChinaImportSummary rows={rows} wastePercent={wastePercent} />

          <section className="china-modal-section">
            <div className="china-section-heading">
              <div>
                <h3>معاينة قبل الاعتماد</h3>
                <p>ملخص مجمع حسب الكود واللون مع تنبيهات مراجعة.</p>
              </div>
              <Badge variant={summary.validRows === summary.rows ? 'success' : 'warning'}>
                {summary.validRows} من {summary.rows} صفوف جاهزة
              </Badge>
            </div>
            <div className="china-review-layout">
              <div className="table-wrap">
                <table className="data-table china-table">
                  <thead>
                    <tr>
                      <th>كود القماش</th>
                      <th>نوع القماش</th>
                      <th>اللون</th>
                      <th>الصفوف</th>
                      <th>الأطوال</th>
                      <th>الوزن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map((row) => (
                      <tr key={`${row.fabricCode}-${row.color}`}>
                        <td>{row.fabricCode}</td>
                        <td>{row.fabricName}</td>
                        <td>{row.color}</td>
                        <td>{row.rows}</td>
                        <td>{formatNumber(row.length)} م</td>
                        <td>{formatNumber(row.weight, 1)} كغ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="china-warning-list">
                {warnings.map((warning) => <div key={warning}>{warning}</div>)}
              </div>
            </div>
          </section>
        </div>

        <footer className="china-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إغلاق</GlossButton>
          <GlossButton variant="accent" onClick={() => onApprove(rows)}>اعتماد الحاوية وترحيلها للمخزون</GlossButton>
        </footer>
      </div>
    </div>
  )
}

export function ChinaOrdersPage() {
  const [containers, setContainers] = useState<ChinaContainer[]>(chinaContainers)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [month, setMonth] = useState('')
  const [selectedContainer, setSelectedContainer] = useState<ChinaContainer | null>(null)
  const [startOpen, setStartOpen] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>('manual')
  const [toast, setToast] = useState('')

  const filteredContainers = useMemo(() => {
    const text = search.trim().toLowerCase()
    return containers.filter((container) => {
      const searchPool = [
        container.containerNo,
        container.supplierName,
        container.orderNo,
        ...container.bolts.flatMap((bolt) => [bolt.fabricCode, bolt.color]),
        ...container.distributions.map((row) => row.customerName),
      ].join(' ').toLowerCase()

      const matchesSearch = !text || searchPool.includes(text)
      const matchesStatus = status === 'all' || container.status === status
      const matchesSupplier = supplier === 'all' || container.supplierId === supplier
      const matchesMonth = !month || container.expectedArrival.startsWith(month)

      return matchesSearch && matchesStatus && matchesSupplier && matchesMonth
    })
  }, [containers, month, search, status, supplier])

  function openWorkspace(mode = importMode) {
    setImportMode(mode)
    setStartOpen(false)
    setWorkspaceOpen(true)
  }

  function archiveContainer(container: ChinaContainer) {
    setContainers((items) => items.map((item) => (
      item.id === container.id
        ? { ...item, status: item.status === 'archived' ? 'draft' : 'archived', lastUpdate: 'تعديل محلي الآن' }
        : item
    )))
  }

  function approveMockImport(rows: ChinaImportRow[]) {
    setWorkspaceOpen(false)
    setToast('تم اعتماد الحاوية تجريبياً ضمن الواجهة فقط. سيتم ربطها بقاعدة البيانات لاحقاً.')
    const validRows = rows.filter((row) => row.fabricCode && row.color && row.lengthMeter && row.weightKg)
    if (validRows.length === 0) return

    const nextBolts: ChinaBolt[] = validRows.map((row, index) => ({
      id: `mock-${Date.now()}-${index}`,
      boltNo: row.boltNo,
      fabricCode: row.fabricCode,
      fabricName: row.fabricName || row.fabricCode,
      color: row.color,
      lengthMeter: row.lengthMeter ?? 0,
      weightKg: row.weightKg ?? 0,
      note: row.note,
    }))

    setContainers((items) => [
      {
        id: `mock-container-${Date.now()}`,
        containerNo: 'MOCK-APPROVED-01',
        supplierId: chinaSuppliers[0].id,
        supplierName: chinaSuppliers[0].name,
        orderNo: 'CN-MOCK-APPROVED',
        shipDate: '2026-06-22',
        expectedArrival: '2026-07-22',
        status: 'approved',
        wastePercent: 1.8,
        lastUpdate: 'تم الآن',
        notes: 'حاوية مضافة محلياً بعد اعتماد تجريبي.',
        bolts: nextBolts,
        distributions: [],
      },
      ...items,
    ])
  }

  const workspaceRows = importMode === 'single'
    ? mockSingleFabricRows
    : importMode === 'multi'
      ? mockMultiFabricRows
      : mockMultiFabricRows.slice(0, 8)

  return (
    <div className="china-page">
      <ChinaOrdersHeader onImport={() => setStartOpen(true)} />
      <ChinaOrdersKpiCards containers={containers} />
      <ChinaOrdersFilters
        search={search}
        status={status}
        supplier={supplier}
        month={month}
        onSearch={setSearch}
        onStatus={setStatus}
        onSupplier={setSupplier}
        onMonth={setMonth}
        onReset={() => {
          setSearch('')
          setStatus('all')
          setSupplier('all')
          setMonth('')
        }}
      />
      <ChinaContainersTable
        containers={filteredContainers}
        onSelect={setSelectedContainer}
        onReview={() => openWorkspace('manual')}
        onArchive={archiveContainer}
        onDelete={(container) => setContainers((items) => items.filter((item) => item.id !== container.id))}
      />

      {filteredContainers.length === 0 && (
        <div className="china-empty-state">لا توجد حاويات مطابقة للفلاتر الحالية.</div>
      )}

      {selectedContainer && (
        <ChinaContainerDetailsModal
          container={selectedContainer}
          onClose={() => setSelectedContainer(null)}
          onReview={() => {
            setSelectedContainer(null)
            openWorkspace('manual')
          }}
        />
      )}

      {startOpen && (
        <ChinaImportStartModal
          selectedMode={importMode}
          onMode={setImportMode}
          onClose={() => setStartOpen(false)}
          onConfirm={() => openWorkspace(importMode)}
        />
      )}

      {workspaceOpen && (
        <ChinaImportWorkspaceModal
          key={importMode}
          mode={importMode}
          initialRows={workspaceRows}
          onClose={() => setWorkspaceOpen(false)}
          onApprove={approveMockImport}
        />
      )}

      {toast && (
        <div className="china-toast" role="status">
          <span>{toast}</span>
          <button type="button" onClick={() => setToast('')}>×</button>
        </div>
      )}
    </div>
  )
}
