import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { DateInput } from '../../components/ui/DateInput'
import { useApp } from '../../context/AppProvider'
import { salesInvoices } from '../../data/invoices'
import { formatNumber } from '../../utils/invoiceGrouping'

type ReturnLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  rollCode: string
  colorAr: string
  colorEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: string
  unitPrice: number
}

const returnDemoLines: ReturnLine[] = [
  {
    id: 'R-1',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 2,
    totalLength: 840,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
  },
  {
    id: 'R-2',
    goodsTypeAr: 'قطن مصري',
    goodsTypeEn: 'Egyptian cotton',
    rollCode: 'CTN-100',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 1,
    totalLength: 410,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 11,
  },
]

const warehouses = [
  { id: 'main', ar: 'مستودع رئيسي', en: 'Main warehouse' },
  { id: 'aleppo', ar: 'فرع حلب', en: 'Aleppo branch' },
  { id: 'damascus', ar: 'فرع دمشق', en: 'Damascus branch' },
]

export function SalesReturnForm() {
  const { t, locale } = useApp()
  const prefix = 'invoices.salesReturnForm'
  const [lines, setLines] = useState(returnDemoLines)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [originalInvoiceId, setOriginalInvoiceId] = useState('')
  const [warehouseId, setWarehouseId] = useState('main')
  const [saved, setSaved] = useState(false)
  const today = '2026-06-17'

  const selectedOriginal = salesInvoices.find((invoice) => invoice.id === originalInvoiceId)

  const lineLabel = (line: ReturnLine, field: 'goods' | 'color' | 'unit') => {
    if (field === 'goods') return locale === 'ar' ? line.goodsTypeAr : line.goodsTypeEn
    if (field === 'color') return locale === 'ar' ? line.colorAr : line.colorEn
    return locale === 'ar' ? line.unitAr : line.unitEn
  }

  const lineTotal = (line: ReturnLine) => line.totalLength * line.unitPrice

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + lineTotal(line), 0),
    [lines],
  )

  const formatMoney = (value: number) =>
    `${value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })} $`

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }

  const handleSave = () => {
    if (!invoiceNo.trim() || !originalInvoiceId) return
    setSaved(true)
  }

  return (
    <>
      <PageHeader
        title={t(`${prefix}.title`)}
        subtitle={t(`${prefix}.subtitle`)}
        actions={
          <>
            <GlossButton
              variant="accent"
              onClick={handleSave}
              disabled={!invoiceNo.trim() || !originalInvoiceId}
            >
              {t(`${prefix}.save`)}
            </GlossButton>
            <GlossButton variant="ghost" disabled>
              {t(`${prefix}.approve`)}
            </GlossButton>
          </>
        }
      />

      <div className="workflow-banner workflow-banner--return">
        <div className="workflow-banner__title">{t(`${prefix}.bannerTitle`)}</div>
        <p className="workflow-banner__desc">{t(`${prefix}.bannerDesc`)}</p>
      </div>

      {saved && (
        <div className="workflow-success-banner">
          <div className="workflow-success-banner__text">
            <span>{t(`${prefix}.saved`).replace('{invoice}', invoiceNo.trim())}</span>
            <span className="workflow-success-banner__hint">{t(`${prefix}.savedHint`)}</span>
          </div>
        </div>
      )}

      <div className="invoice-form">
        <div className="card invoice-form__meta">
          <div className="invoice-form__meta-head">
            <span className="invoice-form__badge">↩️</span>
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
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('common.date')}</span>
              <DateInput defaultValue={today} />
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t(`${prefix}.originalInvoice`)}
              </span>
              <select
                className="form-input"
                value={originalInvoiceId}
                onChange={(event) => setOriginalInvoiceId(event.target.value)}
              >
                <option value="">{t(`${prefix}.selectOriginal`)}</option>
                {salesInvoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.id} — {locale === 'ar' ? invoice.partyAr : invoice.partyEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('common.customer')}</span>
              <input
                type="text"
                className="form-input"
                readOnly
                value={
                  selectedOriginal
                    ? locale === 'ar'
                      ? selectedOriginal.partyAr
                      : selectedOriginal.partyEn
                    : ''
                }
                placeholder={t(`${prefix}.customerAuto`)}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">
                {t('invoices.form.warehouse')}
              </span>
              <select
                className="form-input"
                value={warehouseId}
                onChange={(event) => setWarehouseId(event.target.value)}
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {locale === 'ar' ? warehouse.ar : warehouse.en}
                  </option>
                ))}
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
            <span className="card-toolbar__hint">{t(`${prefix}.linesHint`)}</span>
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
                    <td className="data-table__number">{formatNumber(line.totalLength)}</td>
                    <td>{lineLabel(line, 'unit')}</td>
                    <td className="data-table__number">{line.unitPrice}</td>
                    <td className="data-table__number">{formatMoney(lineTotal(line))}</td>
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
          <div className="invoice-summary__row">
            <span>{t('invoices.form.subtotal')}</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <div className="invoice-summary__row invoice-summary__row--total">
            <span>{t(`${prefix}.returnTotal`)}</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <div className="invoice-summary__meta">
            <span>{t('invoices.form.totalPieces')}: {lines.reduce((sum, line) => sum + line.pieces, 0)}</span>
            <span>{t('invoices.form.lineCount')}: {lines.length}</span>
          </div>
        </div>
      </div>
    </>
  )
}
