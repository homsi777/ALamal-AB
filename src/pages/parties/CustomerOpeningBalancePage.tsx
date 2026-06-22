import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import {
  customerOpeningBalances,
  getCustomerOpeningBalanceRows,
  getCustomerOpeningBalanceTotals,
  type CustomerOpeningBalanceDirection,
  type CustomerOpeningBalanceEntry,
  type CustomerOpeningBalanceStatus,
} from '../../data/customerOpeningBalances'
import { customers, formatPartyMoney } from '../../data/parties'

type StatusFilter = 'all' | CustomerOpeningBalanceStatus

const statusMap: Record<CustomerOpeningBalanceStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }> = {
  draft: { label: 'مسودة', variant: 'neutral' },
  ready: { label: 'جاهز للاعتماد', variant: 'info' },
  posted: { label: 'مرحّل افتتاحياً', variant: 'success' },
  needs_review: { label: 'يحتاج مراجعة', variant: 'warning' },
}

const directionMap: Record<CustomerOpeningBalanceDirection, { label: string; className: string }> = {
  debit: { label: 'مدين على العميل', className: 'customer-opening__amount--debit' },
  credit: { label: 'دائن للعميل', className: 'customer-opening__amount--credit' },
  zero: { label: 'بدون رصيد', className: 'customer-opening__amount--zero' },
}

function CustomerOpeningBalanceModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (entry: CustomerOpeningBalanceEntry) => void
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '')
  const [direction, setDirection] = useState<CustomerOpeningBalanceDirection>('debit')
  const [amount, setAmount] = useState(0)
  const [source, setSource] = useState('مطابقة كشف حساب سابق')
  const [reference, setReference] = useState(`OB-${String(Date.now()).slice(-5)}`)
  const [reviewer, setReviewer] = useState('المحاسب المسؤول')
  const selectedCustomer = customers.find((customer) => customer.id === customerId) ?? customers[0]

  function createEntry(status: CustomerOpeningBalanceStatus) {
    if (!selectedCustomer) return
    onCreate({
      id: `COB-LOCAL-${Date.now()}`,
      customerId,
      fiscalYear: 2026,
      openingDate: '2026-01-01',
      direction,
      amount: direction === 'zero' ? 0 : amount,
      currency: selectedCustomer.currency,
      source,
      reference,
      reviewer,
      status,
      note: status === 'posted'
        ? 'تم اعتماد الرصيد الافتتاحي تجريبياً داخل الواجهة فقط.'
        : 'مسودة رصيد افتتاحي بانتظار المراجعة.',
    })
    onClose()
  }

  return (
    <div className="customer-opening-modal" role="dialog" aria-modal="true">
      <button type="button" className="customer-opening-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="customer-opening-modal__panel">
        <header className="customer-opening-modal__header">
          <div>
            <span className="customer-opening-modal__eyebrow">رصيد افتتاحي للعميل</span>
            <h2>عميل أول مدة</h2>
            <p>إدخال رصيد العميل في بداية السنة المالية قبل الفواتير والسندات اللاحقة.</p>
          </div>
          <button type="button" className="customer-opening-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="customer-opening-modal__body">
          <section className="customer-opening-form">
            <div className="customer-opening-section-head">
              <div>
                <h3>بيانات الرصيد</h3>
                <p>هذه واجهة تحضيرية فقط، وسيتم ربطها لاحقاً بقيود الافتتاح وكشف الحساب.</p>
              </div>
              <Badge variant="info">Frontend mock</Badge>
            </div>

            <div className="customer-opening-form__grid">
              <label>
                العميل
                <select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.nameAr}</option>
                  ))}
                </select>
              </label>
              <label>
                نوع الرصيد
                <select value={direction} onChange={(event) => setDirection(event.target.value as CustomerOpeningBalanceDirection)}>
                  <option value="debit">مدين على العميل</option>
                  <option value="credit">دائن للعميل</option>
                  <option value="zero">بدون رصيد</option>
                </select>
              </label>
              <label>
                المبلغ
                <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} disabled={direction === 'zero'} />
              </label>
              <label>
                المرجع
                <input value={reference} onChange={(event) => setReference(event.target.value)} />
              </label>
              <label>
                المسؤول
                <input value={reviewer} onChange={(event) => setReviewer(event.target.value)} />
              </label>
              <label className="customer-opening-form__wide">
                مصدر الرصيد
                <input value={source} onChange={(event) => setSource(event.target.value)} />
              </label>
            </div>
          </section>

          <section className="customer-opening-preview">
            <div>
              <span>العميل</span>
              <strong>{selectedCustomer?.nameAr}</strong>
            </div>
            <div>
              <span>العملة</span>
              <strong>{selectedCustomer?.currency.toUpperCase()}</strong>
            </div>
            <div>
              <span>اتجاه الرصيد</span>
              <strong>{directionMap[direction].label}</strong>
            </div>
            <div>
              <span>القيمة الافتتاحية</span>
              <strong>{selectedCustomer ? formatPartyMoney(direction === 'zero' ? 0 : amount, selectedCustomer.currency) : '-'}</strong>
            </div>
          </section>
        </div>

        <footer className="customer-opening-modal__footer">
          <GlossButton variant="ghost" onClick={onClose}>إغلاق</GlossButton>
          <GlossButton variant="ghost" onClick={() => createEntry('draft')}>حفظ كمسودة</GlossButton>
          <GlossButton variant="accent" onClick={() => createEntry('posted')}>اعتماد تجريبي</GlossButton>
        </footer>
      </div>
    </div>
  )
}

export function CustomerOpeningBalancePage() {
  const [entries, setEntries] = useState<CustomerOpeningBalanceEntry[]>(customerOpeningBalances)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)

  const rows = useMemo(() => getCustomerOpeningBalanceRows(entries), [entries])
  const totals = useMemo(() => getCustomerOpeningBalanceTotals(entries), [entries])
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRows = rows.filter((row) => {
    if (statusFilter !== 'all' && row.status !== statusFilter) return false
    if (!normalizedQuery) return true

    const haystack = [
      row.customerId,
      row.customer?.nameAr ?? '',
      row.customer?.nameEn ?? '',
      row.reference,
      row.source,
      row.reviewer,
      row.note,
      row.status,
      row.direction,
    ].join(' ').toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'posted', label: 'مرحّل' },
    { id: 'ready', label: 'جاهز' },
    { id: 'needs_review', label: 'يحتاج مراجعة' },
    { id: 'draft', label: 'مسودة' },
  ]

  return (
    <>
      <PageHeader
        title="عميل أول مدة"
        subtitle="إدارة أرصدة العملاء الافتتاحية في بداية السنة المالية قبل الفواتير والسندات."
        actions={
          <>
            <GlossButton variant="accent" onClick={() => setModalOpen(true)}>إضافة رصيد أول مدة</GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="بحث باسم العميل، المرجع، المصدر، المسؤول..."
              />
            </div>
          </>
        }
      />

      <section className="customer-opening-readiness">
        <div>
          <span>معمارية افتتاحية للعملاء</span>
          <strong>يفصل رصيد أول المدة عن الفواتير والتحصيلات، ويجهزه للظهور كسطر افتتاحي في كشف الحساب.</strong>
        </div>
        <div className="customer-opening-readiness__steps">
          <span>اختيار العميل</span>
          <span>مدين/دائن</span>
          <span>مراجعة مصدر</span>
          <span>ترحيل افتتاحي</span>
        </div>
      </section>

      <section className="customer-opening-kpis">
        <div><span>عدد الأرصدة</span><strong>{totals.count}</strong></div>
        <div><span>مرحّلة</span><strong>{totals.posted}</strong></div>
        <div><span>جاهزة</span><strong>{totals.ready}</strong></div>
        <div><span>تحتاج مراجعة</span><strong>{totals.needsReview}</strong></div>
        <div><span>إجمالي المدين</span><strong>{formatPartyMoney(totals.debit, 'usd')}</strong></div>
        <div><span>إجمالي الدائن</span><strong>{formatPartyMoney(totals.credit, 'usd')}</strong></div>
        <div><span>الصافي الافتتاحي</span><strong>{formatPartyMoney(totals.net, 'usd')}</strong></div>
      </section>

      <section className="card">
        <div className="card-toolbar">
          <div className="filter-chips" role="group" aria-label="تصفية رصيد أول مدة">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`filter-chip ${statusFilter === filter.id ? 'filter-chip--active' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="card-toolbar__hint">{filteredRows.length} سجل افتتاحي</span>
        </div>

        <div className="table-wrap">
          <table className="data-table customer-opening-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>تاريخ الافتتاح</th>
                <th>السنة</th>
                <th>نوع الرصيد</th>
                <th>المبلغ</th>
                <th>المصدر</th>
                <th>المرجع</th>
                <th>المسؤول</th>
                <th>الحالة</th>
                <th>ملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const status = statusMap[row.status]
                const direction = directionMap[row.direction]
                return (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.customer?.nameAr ?? row.customerId}</strong>
                      <small>{row.customerId}</small>
                    </td>
                    <td>{row.openingDate}</td>
                    <td>{row.fiscalYear}</td>
                    <td>{direction.label}</td>
                    <td className={`data-table__number ${direction.className}`}>
                      {formatPartyMoney(row.direction === 'credit' ? -row.amount : row.amount, row.currency)}
                    </td>
                    <td>{row.source}</td>
                    <td><span className="category-code">{row.reference}</span></td>
                    <td>{row.reviewer}</td>
                    <td><Badge variant={status.variant}>{status.label}</Badge></td>
                    <td>{row.note}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <CustomerOpeningBalanceModal
          onClose={() => setModalOpen(false)}
          onCreate={(entry) => setEntries((current) => [entry, ...current])}
        />
      )}
    </>
  )
}
