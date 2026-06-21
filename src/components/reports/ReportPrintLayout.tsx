import type { ReportFilters } from './ReportFilterBar'
import type { ReportMetric } from './ReportSummaryStrip'
import type { ReportLocale } from './reportLabels'
import { metricLabel, reportLabels } from './reportLabels'
import type { ReportModuleWorkspace } from '../../data/reportsWorkspace'
import { escapeHtml } from '../../export-templates/shared/html'

type BuildReportPrintBodyOptions = {
  locale: ReportLocale
  title: string
  sectionName: string
  description: string
  module: ReportModuleWorkspace
  filters: ReportFilters
  metrics: ReportMetric[]
}

export function buildReportPrintBodyHtml({
  locale,
  title,
  sectionName,
  description,
  module,
  filters,
  metrics,
}: BuildReportPrintBodyOptions) {
  const labels = reportLabels[locale]
  const period = [filters.fromDate, filters.toDate].filter(Boolean).join(' - ') || filters.taxPeriod || '---'
  const filterRows = Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key, value]) => `
      <div class="doc-meta__item">
        <span>${escapeHtml(key)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `)
    .join('')

  const metricBoxes = metrics.map((metric) => `
    <div class="kpi-box ${metric.tone === 'warning' ? 'kpi-box--gold' : ''}">
      <span>${escapeHtml(metricLabel(locale, metric.key))}</span>
      <strong>${escapeHtml(metric.value)}</strong>
    </div>
  `).join('')

  const rows = module.rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.ref)}</td>
      <td>${escapeHtml(row.subject[locale])}</td>
      <td>${escapeHtml(row.period)}</td>
      <td class="num">${escapeHtml(row.value)}</td>
      <td>${escapeHtml(row.owner[locale])}</td>
      <td>${escapeHtml(row.status[locale])}</td>
    </tr>
  `).join('')

  return `
    <header class="doc-header">
      <div class="doc-header__brand">
        <strong>ALamal-AB ERP</strong>
        <span>${escapeHtml(sectionName)}</span>
      </div>
      <div class="doc-header__company-meta">
        <div>${escapeHtml(labels.generatedAt)}: ${new Date().toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')}</div>
        <div>${escapeHtml(labels.period)}: ${escapeHtml(period)}</div>
      </div>
    </header>
    <h1 class="doc-title">${escapeHtml(title)}</h1>
    <p style="margin-bottom:12px;color:#64748b">${escapeHtml(description)}</p>
    <section class="doc-meta">
      ${filterRows || `<div class="doc-meta__item"><span>${escapeHtml(labels.settings)}</span><strong>---</strong></div>`}
    </section>
    <section class="kpi-row">${metricBoxes}</section>
    <h2 class="section-title">${escapeHtml(labels.result)}</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>${locale === 'ar' ? 'المرجع' : 'Reference'}</th>
          <th>${locale === 'ar' ? 'التقرير' : 'Report'}</th>
          <th>${locale === 'ar' ? 'الفترة' : 'Period'}</th>
          <th>${locale === 'ar' ? 'القيمة' : 'Value'}</th>
          <th>${locale === 'ar' ? 'المسؤول' : 'Owner'}</th>
          <th>${locale === 'ar' ? 'الحالة' : 'Status'}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <footer class="doc-footer">
      <span>ALamal-AB ERP</span>
      <span>${escapeHtml(title)}</span>
    </footer>
  `
}
