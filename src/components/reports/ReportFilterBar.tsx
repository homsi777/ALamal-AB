import type { ReportFilterType } from '../../data/reportsWorkspace'
import { filterLabel, reportLabels, type ReportLocale } from './reportLabels'

export type ReportFilters = Record<string, string>

type ReportFilterBarProps = {
  locale: ReportLocale
  filters: ReportFilterType[]
  values: ReportFilters
  onChange: (key: string, value: string) => void
}

const optionSets: Partial<Record<ReportFilterType, { ar: string; en: string; value: string }[]>> = {
  account: [
    { ar: 'الصندوق الرئيسي', en: 'Main cash account', value: 'cash-main' },
    { ar: 'ذمم العملاء', en: 'Customer receivables', value: 'ar-control' },
    { ar: 'ذمم الموردين', en: 'Supplier payables', value: 'ap-control' },
  ],
  customer: [
    { ar: 'مؤسسة النور', en: 'Al Noor Trading', value: 'c-alnoor' },
    { ar: 'شركة الشام', en: 'Al Sham Co.', value: 'c-sham' },
    { ar: 'معرض الأمل', en: 'Al Amal showroom', value: 'c-amal' },
  ],
  supplier: [
    { ar: 'شركة الحرير الدولية', en: 'International Silk Co.', value: 's-silk' },
    { ar: 'مورد القطن', en: 'Cotton supplier', value: 's-cotton' },
    { ar: 'خدمات الشحن', en: 'Shipping services', value: 's-ship' },
  ],
  currency: [
    { ar: 'دولار', en: 'USD', value: 'USD' },
    { ar: 'ليرة سورية', en: 'SYP', value: 'SYP' },
    { ar: 'جنيه', en: 'EGP', value: 'EGP' },
  ],
  branch: [
    { ar: 'الإدارة', en: 'HQ', value: 'hq' },
    { ar: 'فرع دمشق', en: 'Damascus branch', value: 'damascus' },
    { ar: 'فرع حلب', en: 'Aleppo branch', value: 'aleppo' },
  ],
  costCenter: [
    { ar: 'المبيعات', en: 'Sales', value: 'sales' },
    { ar: 'المستودع', en: 'Warehouse', value: 'warehouse' },
    { ar: 'الإدارة', en: 'Administration', value: 'admin' },
  ],
  status: [
    { ar: 'الكل', en: 'All', value: 'all' },
    { ar: 'جاهز', en: 'Ready', value: 'ready' },
    { ar: 'قيد المراجعة', en: 'In review', value: 'review' },
    { ar: 'غير مطابق', en: 'Unmatched', value: 'unmatched' },
  ],
  taxPeriod: [
    { ar: 'حزيران 2026', en: 'June 2026', value: '2026-06' },
    { ar: 'الربع الثاني 2026', en: 'Q2 2026', value: '2026-Q2' },
  ],
  bankAccount: [
    { ar: 'البنك الرئيسي', en: 'Main bank', value: 'main-bank' },
    { ar: 'صندوق الإدارة', en: 'HQ cash box', value: 'hq-box' },
    { ar: 'صندوق المعرض', en: 'Showroom box', value: 'showroom-box' },
  ],
  assetType: [
    { ar: 'معدات', en: 'Equipment', value: 'equipment' },
    { ar: 'أثاث', en: 'Furniture', value: 'furniture' },
    { ar: 'أجهزة بيع', en: 'Sales devices', value: 'sales-devices' },
  ],
  item: [
    { ar: 'حرير طبيعي', en: 'Natural silk', value: 'silk' },
    { ar: 'قطن مطبوع', en: 'Printed cotton', value: 'cotton' },
    { ar: 'شيفون', en: 'Chiffon', value: 'chiffon' },
  ],
  comparisonPeriod: [
    { ar: 'الشهر السابق', en: 'Previous month', value: 'prev-month' },
    { ar: 'الربع السابق', en: 'Previous quarter', value: 'prev-quarter' },
    { ar: 'السنة السابقة', en: 'Previous year', value: 'prev-year' },
  ],
  groupBy: [
    { ar: 'الحساب', en: 'Account', value: 'account' },
    { ar: 'الشهر', en: 'Month', value: 'month' },
    { ar: 'مركز التكلفة', en: 'Cost center', value: 'cost-center' },
  ],
}

export function ReportFilterBar({ locale, filters, values, onChange }: ReportFilterBarProps) {
  const labels = reportLabels[locale]
  const showDateRange = filters.includes('dateRange')

  return (
    <section className="report-filter-bar" aria-label={labels.settings}>
      <div className="report-filter-bar__title">{labels.settings}</div>
      <div className="report-filter-bar__grid">
        {showDateRange && (
          <>
            <label className="report-field">
              <span>{labels.filter.fromDate}</span>
              <input type="date" value={values.fromDate ?? ''} onChange={(event) => onChange('fromDate', event.target.value)} />
            </label>
            <label className="report-field">
              <span>{labels.filter.toDate}</span>
              <input type="date" value={values.toDate ?? ''} onChange={(event) => onChange('toDate', event.target.value)} />
            </label>
          </>
        )}
        {filters.filter((filter) => filter !== 'dateRange').map((filter) => (
          <label key={filter} className="report-field">
            <span>{filterLabel(locale, filter)}</span>
            <select value={values[filter] ?? ''} onChange={(event) => onChange(filter, event.target.value)}>
              <option value="">{labels.selectPlaceholder}</option>
              {(optionSets[filter] ?? []).map((option) => (
                <option key={option.value} value={option.value}>{option[locale]}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  )
}
