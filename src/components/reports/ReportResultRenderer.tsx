import type { ReportLayoutType, ReportModuleWorkspace, ReportRow } from '../../data/reportsWorkspace'
import { reportLabels, type ReportLocale } from './reportLabels'

type ReportResultRendererProps = {
  locale: ReportLocale
  layout: ReportLayoutType
  module: ReportModuleWorkspace
}

function amountAt(rows: ReportRow[], index: number, fallback: string) {
  return rows[index]?.value ?? fallback
}

export function ReportResultRenderer({ locale, layout, module }: ReportResultRendererProps) {
  if (layout === 'financial-statement') {
    return <FinancialStatementLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'statement') {
    return <StatementLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'aging') {
    return <AgingLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'budget') {
    return <BudgetLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'treasury') {
    return <TreasuryLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'fixed-assets') {
    return <FixedAssetsLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'tax') {
    return <TaxLayout locale={locale} rows={module.rows} />
  }
  if (layout === 'cost') {
    return <CostLayout locale={locale} rows={module.rows} />
  }
  return <BiLayout locale={locale} rows={module.rows} />
}

function FinancialStatementLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-result report-result--statement-form">
      <div className="report-result__section">
        <h3>{isAr ? 'الأصول' : 'Assets'}</h3>
        <ReportLine label={rows[0]?.subject[locale] ?? ''} value={amountAt(rows, 0, '$128,400')} />
        <ReportLine label={isAr ? 'أصول غير متداولة' : 'Non-current assets'} value="$58,100" />
        <ReportLine label={isAr ? 'إجمالي الأصول' : 'Total assets'} value="$186,500" strong />
      </div>
      <div className="report-result__section">
        <h3>{isAr ? 'الخصوم وحقوق الملكية' : 'Liabilities and equity'}</h3>
        <ReportLine label={rows[1]?.subject[locale] ?? ''} value={amountAt(rows, 1, '$42,750')} />
        <ReportLine label={rows[2]?.subject[locale] ?? ''} value="$143,750" />
        <ReportLine label={isAr ? 'إجمالي الخصوم وحقوق الملكية' : 'Total liabilities and equity'} value="$186,500" strong />
      </div>
    </section>
  )
}

function StatementLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-result">
      <div className="report-statement-ledger">
        <div className="report-statement-ledger__opening">
          <span>{isAr ? 'الرصيد الافتتاحي' : 'Opening balance'}</span>
          <strong>$12,500</strong>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? 'التاريخ' : 'Date'}</th>
              <th>{isAr ? 'البيان' : 'Description'}</th>
              <th>{isAr ? 'مدين' : 'Debit'}</th>
              <th>{isAr ? 'دائن' : 'Credit'}</th>
              <th>{isAr ? 'الرصيد' : 'Balance'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.ref}>
                <td>{row.period}</td>
                <td>{row.subject[locale]}</td>
                <td className="data-table__number">{index % 2 === 0 ? row.value : '-'}</td>
                <td className="data-table__number">{index % 2 === 1 ? row.value : '-'}</td>
                <td className="data-table__number">${18_000 + index * 2400}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="report-statement-ledger__closing">
          <span>{isAr ? 'الرصيد الختامي' : 'Closing balance'}</span>
          <strong>$24,800</strong>
        </div>
      </div>
    </section>
  )
}

function AgingLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  return (
    <section className="report-aging-grid">
      {rows.map((row, index) => (
        <div key={row.ref} className={`report-aging-grid__bucket report-aging-grid__bucket--${index}`}>
          <span>{row.subject[locale]}</span>
          <strong>{row.value}</strong>
          <small>{row.status[locale]}</small>
        </div>
      ))}
    </section>
  )
}

function BudgetLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-variance-list">
      {rows.map((row, index) => (
        <div key={row.ref} className="report-variance-list__row">
          <div>
            <strong>{row.subject[locale]}</strong>
            <span>{row.owner[locale]}</span>
          </div>
          <span>{isAr ? 'المخطط' : 'Planned'}: $42,000</span>
          <span>{isAr ? 'الفعلي' : 'Actual'}: {row.value}</span>
          <span className={index === 1 ? 'report-value--danger' : 'report-value--success'}>
            {index === 1 ? '+6.4%' : '+9.1%'}
          </span>
        </div>
      ))}
    </section>
  )
}

function TreasuryLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-treasury-flow">
      <div className="report-treasury-flow__main">
        <span>{isAr ? 'صافي التدفق' : 'Net flow'}</span>
        <strong>$18,900</strong>
      </div>
      {rows.map((row) => (
        <div key={row.ref} className="report-treasury-flow__item">
          <span>{row.subject[locale]}</span>
          <strong>{row.value}</strong>
          <small>{row.status[locale]}</small>
        </div>
      ))}
    </section>
  )
}

function FixedAssetsLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-result">
      <table className="data-table">
        <thead>
          <tr>
            <th>{isAr ? 'كود الأصل' : 'Asset code'}</th>
            <th>{isAr ? 'الأصل' : 'Asset'}</th>
            <th>{isAr ? 'الموقع' : 'Location'}</th>
            <th>{isAr ? 'تكلفة الاقتناء' : 'Cost'}</th>
            <th>{isAr ? 'إهلاك متراكم' : 'Accum. dep.'}</th>
            <th>{isAr ? 'القيمة الدفترية' : 'Book value'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.ref}>
              <td><span className="entry-no">{row.ref}</span></td>
              <td>{row.subject[locale]}</td>
              <td>{row.owner[locale]}</td>
              <td className="data-table__number">{row.value}</td>
              <td className="data-table__number">${2_400 + index * 700}</td>
              <td className="data-table__number">${16_300 - index * 1100}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function TaxLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const labels = reportLabels[locale]
  return (
    <section className="report-tax-layout">
      <div className="report-tax-layout__net">
        <span>{labels.metrics.taxDue}</span>
        <strong>$4,380</strong>
      </div>
      {rows.map((row) => (
        <div key={row.ref} className="report-tax-layout__line">
          <span>{row.subject[locale]}</span>
          <strong>{row.value}</strong>
          <small>{row.status[locale]}</small>
        </div>
      ))}
    </section>
  )
}

function CostLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  const isAr = locale === 'ar'
  return (
    <section className="report-cost-layout">
      {rows.map((row, index) => (
        <div key={row.ref} className="report-cost-layout__row">
          <strong>{row.subject[locale]}</strong>
          <span>{isAr ? 'الإيراد' : 'Revenue'}: {row.value}</span>
          <span>{isAr ? 'التكلفة' : 'Cost'}: ${18_000 + index * 3300}</span>
          <span className={index === 1 ? 'report-value--danger' : 'report-value--success'}>
            {isAr ? 'الهامش' : 'Margin'}: {index === 1 ? '14.2%' : '31.8%'}
          </span>
        </div>
      ))}
    </section>
  )
}

function BiLayout({ locale, rows }: { locale: ReportLocale; rows: ReportRow[] }) {
  return (
    <section className="report-bi-board">
      {rows.map((row, index) => (
        <div key={row.ref} className="report-bi-board__tile">
          <span>{row.subject[locale]}</span>
          <strong>{index === 0 ? '18' : index === 1 ? '+9.1%' : '4'}</strong>
          <small>{row.status[locale]}</small>
        </div>
      ))}
    </section>
  )
}

function ReportLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`report-result__line ${strong ? 'report-result__line--strong' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
