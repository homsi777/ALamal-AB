import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { useApp } from '../../context/AppProvider'
import { useSalesWorkflow } from '../../context/SalesWorkflowProvider'

type InvoiceLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  rollCode: string
  colorAr: string
  colorEn: string
  pieces: number
  totalLength?: number
  unitAr: string
  unitEn: string
  unitPrice: number
}

type PaymentType = 'cash' | 'credit'
type CurrencyCode = 'usd' | 'syp' | 'egp'

type InvoiceFormProps = {
  mode: 'sales' | 'purchase'
}

const salesDemoLines: InvoiceLine[] = [
  {
    id: 'L-1',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 10,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
  },
  {
    id: 'L-2',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'بيج',
    colorEn: 'Beige',
    pieces: 4,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
  },
]

const purchaseDemoLines: InvoiceLine[] = [
  {
    id: 'L-1',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 6,
    totalLength: 4200,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
  },
  {
    id: 'L-2',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'بيج',
    colorEn: 'Beige',
    pieces: 4,
    totalLength: 2800,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
  },
]

const customers = [
  { id: '1', ar: 'محل الأناقة', en: 'Al-Anaqa Store' },
  { id: '2', ar: 'خياطة الرافدين', en: 'Al-Rafidain Tailoring' },
  { id: '3', ar: 'مؤسسة النور', en: 'Al-Noor Co.' },
]

const containers = [
  { id: 'CONT-2026-A1', labelAr: 'حاوية CN-2026-A1', labelEn: 'Container CN-2026-A1' },
  { id: 'CONT-2026-B2', labelAr: 'حاوية CN-2026-B2', labelEn: 'Container CN-2026-B2' },
  { id: 'CONT-2026-C3', labelAr: 'حاوية CN-2026-C3', labelEn: 'Container CN-2026-C3' },
]

const warehouses = [
  { id: 'main', ar: 'مستودع رئيسي', en: 'Main warehouse' },
  { id: 'aleppo', ar: 'فرع حلب', en: 'Aleppo branch' },
  { id: 'damascus', ar: 'فرع دمشق', en: 'Damascus branch' },
]

const currencySymbols: Record<CurrencyCode, string> = {
  usd: '$',
  syp: 'ل.س',
  egp: 'ج.م',
}

export function InvoiceForm({ mode }: InvoiceFormProps) {
  const { t, locale } = useApp()
  const { saveDraft } = useSalesWorkflow()
  const isSales = mode === 'sales'
  const prefix = isSales ? 'invoices.salesForm' : 'invoices.purchaseForm'
  const [lines, setLines] = useState<InvoiceLine[]>(isSales ? salesDemoLines : purchaseDemoLines)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [containerId, setContainerId] = useState('')
  const [warehouseId, setWarehouseId] = useState('main')
  const [paymentType, setPaymentType] = useState<PaymentType>('cash')
  const [creditAmount, setCreditAmount] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('usd')
  const [savedInvoiceNo, setSavedInvoiceNo] = useState<string | null>(null)

  const today = '2026-06-17'
  const currencySymbol = currencySymbols[currency]

  const lineLabel = (line: InvoiceLine, field: 'goods' | 'color' | 'unit') => {
    if (field === 'goods') return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
    if (field === 'color') return locale === 'ar' ? line.colorAr : line.colorEn
    return locale === 'ar' ? line.unitAr : line.unitEn
  }

  const lineTotal = (line: InvoiceLine) => {
    if (isSales || line.totalLength === undefined) return null
    return line.totalLength * line.unitPrice
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + (lineTotal(line) ?? 0), 0),
    [lines, isSales],
  )
  const discount = 0
  const total = subtotal - discount
  const hasPurchaseTotals = !isSales

  const formatMoney = (value: number) =>
    `${value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })} ${currencySymbol}`

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }

  const containerLabel = (container: (typeof containers)[number]) =>
    locale === 'ar' ? container.labelAr : container.labelEn

  const warehouseLabel = (warehouse: (typeof warehouses)[number]) =>
    locale === 'ar' ? warehouse.ar : warehouse.en

  const handleSaveDraft = () => {
    if (!isSales || !invoiceNo.trim() || !customerId || !containerId) return

    const customer = customers.find((item) => item.id === customerId)
    const container = containers.find((item) => item.id === containerId)
    const warehouse = warehouses.find((item) => item.id === warehouseId)
    if (!customer || !container || !warehouse) return

    saveDraft({
      invoiceNo: invoiceNo.trim(),
      customerAr: customer.ar,
      customerEn: customer.en,
      containerId: container.id,
      containerLabelAr: container.labelAr,
      containerLabelEn: container.labelEn,
      warehouseAr: warehouse.ar,
      warehouseEn: warehouse.en,
      date: today,
      currency,
      lines: lines.map((line) => ({
        goodsTypeAr: line.goodsTypeAr,
        goodsTypeEn: line.goodsTypeEn,
        rollCode: line.rollCode,
        colorAr: line.colorAr,
        colorEn: line.colorEn,
        pieces: line.pieces,
        unitAr: line.unitAr,
        unitEn: line.unitEn,
        unitPrice: line.unitPrice,
      })),
    })

    setSavedInvoiceNo(invoiceNo.trim())
  }

  const workflowSteps = useMemo(
    () => [
      t('invoices.form.workflowStepAccountant'),
      t('invoices.form.workflowStepWarehouse'),
      t('invoices.form.workflowStepApprove'),
      t('invoices.form.workflowStepDelivery'),
    ],
    [t],
  )

  return (
    <>
      <PageHeader
        title={t(`${prefix}.title`)}
        subtitle={t(`${prefix}.subtitle`)}
        actions={
          <>
            <GlossButton
              variant={isSales ? 'accent' : 'ghost'}
              onClick={isSales ? handleSaveDraft : undefined}
              disabled={isSales && (!invoiceNo.trim() || !customerId || !containerId)}
            >
              {isSales ? t('invoices.salesForm.saveDraftSend') : t(`${prefix}.saveDraft`)}
            </GlossButton>
            <GlossButton variant="accent" disabled={isSales}>
              {t(`${prefix}.approve`)}
            </GlossButton>
          </>
        }
      />

      {isSales && (
        <div className="workflow-banner workflow-banner--sales">
          <div className="workflow-banner__title">{t('invoices.form.workflowTitle')}</div>
          <p className="workflow-banner__desc">{t('invoices.form.workflowDesc')}</p>
          <div className="workflow-strip workflow-strip--inline" aria-label={t('invoices.form.workflowTitle')}>
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className={`workflow-strip__step ${index === 0 ? 'workflow-strip__step--current' : 'workflow-strip__step--done'}`}
              >
                <span className="workflow-strip__dot">{index + 1}</span>
                <span className="workflow-strip__label">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedInvoiceNo && (
        <div className="workflow-success-banner">
          <span>{t('invoices.salesForm.draftSaved').replace('{invoice}', savedInvoiceNo)}</span>
          <Link to="/delivery" className="workflow-success-banner__link">
            {t('invoices.salesForm.goToDelivery')}
          </Link>
        </div>
      )}

      <div className="invoice-form">
        <div className="card invoice-form__meta">
          <div className="invoice-form__meta-head">
            <span className="invoice-form__badge">{mode === 'sales' ? '📤' : '📥'}</span>
            <div>
              <div className="invoice-form__status">{t(`${prefix}.statusDraft`)}</div>
              <div className="invoice-form__hint">{t('invoices.form.headerHint')}</div>
            </div>
          </div>

          <div className="invoice-form__grid">
            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.invoiceNo')}
              </span>
              <input
                type="text"
                className="form-input"
                value={invoiceNo}
                onChange={(event) => setInvoiceNo(event.target.value)}
                placeholder={t('invoices.form.invoiceNoPlaceholder')}
                required
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('common.date')}</span>
              <input type="date" className="form-input" defaultValue={today} />
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {isSales ? t('invoices.form.selectCustomer') : t('invoices.form.selectSupplier')}
              </span>
              <select
                className="form-input"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
              >
                <option value="">{t(`${prefix}.selectParty`)}</option>
                {isSales ? (
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {locale === 'ar' ? customer.ar : customer.en}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="1">Guangzhou Textile Co.</option>
                    <option value="2">Shaoxing Fabrics Ltd.</option>
                    <option value="3">مصنع الأقمشة السوري</option>
                  </>
                )}
              </select>
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.container')}
              </span>
              <select
                className="form-input"
                value={containerId}
                onChange={(event) => setContainerId(event.target.value)}
              >
                <option value="">{t('invoices.form.selectContainer')}</option>
                {containers.map((container) => (
                  <option key={container.id} value={container.id}>
                    {containerLabel(container)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.warehouse')}
              </span>
              <select
                className="form-input"
                value={warehouseId}
                onChange={(event) => setWarehouseId(event.target.value)}
                required
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouseLabel(warehouse)}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.paymentType')}
              </span>
              <div className="payment-type-toggle" role="radiogroup" aria-label={t('invoices.form.paymentType')}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentType === 'cash'}
                  className={`payment-type-toggle__btn ${paymentType === 'cash' ? 'payment-type-toggle__btn--active' : ''}`}
                  onClick={() => setPaymentType('cash')}
                >
                  {t('invoices.form.paymentCash')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentType === 'credit'}
                  className={`payment-type-toggle__btn ${paymentType === 'credit' ? 'payment-type-toggle__btn--active' : ''}`}
                  onClick={() => setPaymentType('credit')}
                >
                  {t('invoices.form.paymentCredit')}
                </button>
              </div>
            </div>

            {paymentType === 'credit' && (
              <label className="form-field">
                <span className="form-field__label form-field__label--required">
                  {t('invoices.form.creditAmount')}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={creditAmount}
                  onChange={(event) => setCreditAmount(event.target.value)}
                  placeholder={t('invoices.form.creditAmountPlaceholder')}
                />
              </label>
            )}

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.currency')}
              </span>
              <select
                className="form-input"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              >
                <option value="usd">{t('invoices.form.currencyUsd')}</option>
                <option value="syp">{t('invoices.form.currencySyp')}</option>
                <option value="egp">{t('invoices.form.currencyEgp')}</option>
              </select>
            </label>

            <label className="form-field form-field--wide">
              <span className="form-field__label">{t('invoices.form.notes')}</span>
              <input type="text" className="form-input" placeholder={t(`${prefix}.notesPlaceholder`)} />
            </label>
          </div>
        </div>

        <div className="card invoice-form__lines">
          <div className="card-toolbar">
            <span className="card-toolbar__hint">
              {isSales ? t('invoices.salesForm.linesHintNoLengths') : t(`${prefix}.linesHint`)}
            </span>
            <GlossButton variant="ghost" size="sm">{t(`${prefix}.addLine`)}</GlossButton>
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
                  <th>{t('invoices.form.colLineTotal')}</th>
                  <th>{t('invoices.form.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>{lineLabel(line, 'goods')}</td>
                    <td><span className="category-code">{line.rollCode}</span></td>
                    <td>{lineLabel(line, 'color')}</td>
                    <td className="data-table__number">{line.pieces}</td>
                    <td className="data-table__number">
                      {isSales ? (
                        <Badge variant="warning">{t('invoices.form.lengthAwaitingDetail')}</Badge>
                      ) : (
                        line.totalLength
                      )}
                    </td>
                    <td>{lineLabel(line, 'unit')}</td>
                    <td className="data-table__number">{line.unitPrice}</td>
                    <td className="data-table__number">
                      {lineTotal(line) === null ? '—' : formatMoney(lineTotal(line)!)}
                    </td>
                    <td>
                      <button type="button" className="action-btn action-btn--disable" onClick={() => removeLine(line.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-form__summary card">
          {paymentType === 'credit' && creditAmount && (
            <div className="invoice-summary__row">
              <span>{t('invoices.form.creditAmount')}</span>
              <strong>{Number(creditAmount).toLocaleString('en-US')} {currencySymbol}</strong>
            </div>
          )}
          {hasPurchaseTotals ? (
            <>
              <div className="invoice-summary__row">
                <span>{t('invoices.form.subtotal')}</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <div className="invoice-summary__row">
                <span>{t('invoices.form.discount')}</span>
                <strong>{formatMoney(discount)}</strong>
              </div>
              <div className="invoice-summary__row invoice-summary__row--total">
                <span>{t('invoices.form.total')}</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </>
          ) : (
            <div className="invoice-summary__pending">
              <Badge variant="warning">{t('invoices.form.totalsAwaitingDetail')}</Badge>
              <p>{t('invoices.form.totalsAwaitingDetailHint')}</p>
            </div>
          )}
          <div className="invoice-summary__meta">
            <span>{t('invoices.form.totalPieces')}: {lines.reduce((s, l) => s + l.pieces, 0)}</span>
            <span>{t('invoices.form.lineCount')}: {lines.length}</span>
            <span>{t('invoices.form.paymentType')}: {paymentType === 'cash' ? t('invoices.form.paymentCash') : t('invoices.form.paymentCredit')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
