import type { FinanceFilterId } from '../../data/financeTaskWorkspace'
import { filterLabels, text } from './financeLabels'

type FinanceFilterBarProps = {
  filters: FinanceFilterId[]
  locale: 'ar' | 'en'
  values: Record<string, string>
  onChange: (id: FinanceFilterId, value: string) => void
}

const sampleValues: Partial<Record<FinanceFilterId, string[]>> = {
  account: ['الصندوق الرئيسي', 'ذمم الموردين', 'إيرادات المبيعات'],
  customer: ['مؤسسة النور', 'شركة الشام', 'عميل نقدي'],
  supplier: ['شركة الحرير الدولية', 'مكتب التخليص الجمركي', 'مورد أقمشة'],
  currency: ['USD', 'SYP', 'EUR'],
  status: ['الكل', 'مسودة', 'قيد المراجعة', 'معتمد', 'مرحّل'],
  branch: ['كل الفروع', 'دمشق', 'حلب'],
  costCenter: ['كل المراكز', 'المبيعات', 'المستودع', 'الإنتاج'],
  responsible: ['الكل', 'المحاسب العام', 'الخزينة', 'المدير المالي'],
  approvalStatus: ['الكل', 'مسودة', 'قيد المراجعة', 'معتمد'],
  postingStatus: ['الكل', 'غير مرحّل', 'مرحّل'],
  bankAccount: ['بنك الشام - USD', 'الصندوق الرئيسي', 'بنك التشغيل'],
  taxPeriod: ['حزيران 2026', 'أيار 2026', 'الربع الثاني 2026'],
  assetType: ['الكل', 'معدات', 'أثاث', 'أجهزة'],
  item: ['الكل', 'قطن مطبوع', 'حرير طبيعي', 'تشغيلة إنتاج'],
}

export function FinanceFilterBar({ filters, locale, values, onChange }: FinanceFilterBarProps) {
  if (!filters.length) return null

  return (
    <div className="finance-filter-bar">
      {filters.map((filter) => {
        const label = text(filterLabels[filter], locale)
        if (filter === 'dateRange') {
          return (
            <div key={filter} className="finance-filter-bar__group finance-filter-bar__group--range">
              <label>{label}</label>
              <div className="finance-filter-bar__range">
                <input
                  type="date"
                  value={values.fromDate ?? '2026-06-01'}
                  onChange={(event) => onChange('dateRange', event.target.value)}
                  aria-label={locale === 'ar' ? 'من تاريخ' : 'From date'}
                />
                <input
                  type="date"
                  value={values.toDate ?? '2026-06-21'}
                  onChange={(event) => onChange('dateRange', event.target.value)}
                  aria-label={locale === 'ar' ? 'إلى تاريخ' : 'To date'}
                />
              </div>
            </div>
          )
        }

        if (filter === 'documentNo') {
          return (
            <label key={filter} className="finance-filter-bar__group">
              <span>{label}</span>
              <input
                value={values[filter] ?? ''}
                onChange={(event) => onChange(filter, event.target.value)}
                placeholder={locale === 'ar' ? 'رقم المستند' : 'Document number'}
              />
            </label>
          )
        }

        return (
          <label key={filter} className="finance-filter-bar__group">
            <span>{label}</span>
            <select value={values[filter] ?? ''} onChange={(event) => onChange(filter, event.target.value)}>
              <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
              {(sampleValues[filter] ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )
      })}
    </div>
  )
}
