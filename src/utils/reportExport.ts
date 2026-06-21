import * as XLSX from 'xlsx'
import type { ReportModuleWorkspace } from '../data/reportsWorkspace'
import type { ReportFilters } from '../components/reports/ReportFilterBar'
import type { ReportMetric } from '../components/reports/ReportSummaryStrip'
import type { ReportLocale } from '../components/reports/reportLabels'
import { metricLabel, reportLabels } from '../components/reports/reportLabels'
import { buildReportPrintBodyHtml } from '../components/reports/ReportPrintLayout'
import { wrapA4Document } from '../export-templates/shared/a4Document'
import { openExportWindow } from '../export-templates/shared/openExportWindow'
import { sanitizeExportFileName } from '../export-templates/shared/fileNames'

type ReportExportContext = {
  locale: ReportLocale
  title: string
  sectionName: string
  description: string
  module: ReportModuleWorkspace
  filters: ReportFilters
  metrics: ReportMetric[]
}

function buildReportDocument(ctx: ReportExportContext, mode: 'preview' | 'print') {
  return wrapA4Document({
    title: ctx.title,
    locale: ctx.locale,
    mode,
    bodyHtml: buildReportPrintBodyHtml(ctx),
    previewBanner: ctx.locale === 'ar' ? 'معاينة تقرير' : 'Report preview',
    printLabel: reportLabels[ctx.locale].print,
    closeLabel: ctx.locale === 'ar' ? 'إغلاق' : 'Close',
  })
}

export function printReport(ctx: ReportExportContext) {
  openExportWindow(buildReportDocument(ctx, 'print'), ctx.title)
}

export function exportReportPdf(ctx: ReportExportContext) {
  openExportWindow(buildReportDocument(ctx, 'preview'), `${ctx.title} PDF`)
}

export function exportReportExcel(ctx: ReportExportContext) {
  const headerRows = [
    ['ALamal-AB ERP'],
    [ctx.title],
    [`${reportLabels[ctx.locale].period}: ${[ctx.filters.fromDate, ctx.filters.toDate].filter(Boolean).join(' - ')}`],
    [],
    [reportLabels[ctx.locale].summary],
    ...ctx.metrics.map((metric) => [metricLabel(ctx.locale, metric.key), metric.value]),
    [],
  ]

  const rows = ctx.module.rows.map((row) => [
    row.ref,
    row.subject[ctx.locale],
    row.period,
    row.value,
    row.owner[ctx.locale],
    row.status[ctx.locale],
  ])

  const sheet = XLSX.utils.aoa_to_sheet([
    ...headerRows,
    [
      ctx.locale === 'ar' ? 'المرجع' : 'Reference',
      ctx.locale === 'ar' ? 'التقرير' : 'Report',
      ctx.locale === 'ar' ? 'الفترة' : 'Period',
      ctx.locale === 'ar' ? 'القيمة' : 'Value',
      ctx.locale === 'ar' ? 'المسؤول' : 'Owner',
      ctx.locale === 'ar' ? 'الحالة' : 'Status',
    ],
    ...rows,
  ])
  sheet['!cols'] = [{ wch: 16 }, { wch: 32 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 16 }]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Report')
  XLSX.writeFile(workbook, `${sanitizeExportFileName(ctx.title)}.xlsx`)
}
