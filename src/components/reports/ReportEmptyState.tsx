import { reportLabels, type ReportLocale } from './reportLabels'

export function ReportEmptyState({ locale }: { locale: ReportLocale }) {
  const labels = reportLabels[locale]

  return (
    <section className="report-empty-state">
      <div className="report-empty-state__mark">↻</div>
      <div>
        <h2>{labels.emptyTitle}</h2>
        <p>{labels.emptyBody}</p>
      </div>
    </section>
  )
}
