import { metricLabel, reportLabels, type ReportLocale } from './reportLabels'

export type ReportMetric = {
  key: string
  value: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

type ReportSummaryStripProps = {
  locale: ReportLocale
  metrics: ReportMetric[]
}

export function ReportSummaryStrip({ locale, metrics }: ReportSummaryStripProps) {
  return (
    <section className="report-summary-strip" aria-label={reportLabels[locale].summary}>
      {metrics.map((metric) => (
        <div key={metric.key} className={`report-summary-strip__item report-summary-strip__item--${metric.tone ?? 'neutral'}`}>
          <span>{metricLabel(locale, metric.key)}</span>
          <strong>{metric.value}</strong>
        </div>
      ))}
    </section>
  )
}
