import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { REPORTS_SECTIONS, type ReportsSectionId } from '../../data/reportsSections'
import {
  findReportModule,
  getReportModuleMeta,
  type ReportText,
} from '../../data/reportsWorkspace'
import { ReportActionBar } from '../../components/reports/ReportActionBar'
import { ReportEmptyState } from '../../components/reports/ReportEmptyState'
import { ReportFilterBar, type ReportFilters } from '../../components/reports/ReportFilterBar'
import { ReportResultRenderer } from '../../components/reports/ReportResultRenderer'
import { ReportSummaryStrip, type ReportMetric } from '../../components/reports/ReportSummaryStrip'
import { ReportTaskShell } from '../../components/reports/ReportTaskShell'
import { exportReportExcel, exportReportPdf, printReport } from '../../utils/reportExport'
import { useApp } from '../../context/AppProvider'

const REPORT_SECTION_IDS = Object.keys(REPORTS_SECTIONS) as ReportsSectionId[]

function isReportsSectionId(value: string | undefined): value is ReportsSectionId {
  return !!value && REPORT_SECTION_IDS.includes(value as ReportsSectionId)
}

function defaultFilters(): ReportFilters {
  return {
    fromDate: '2026-06-01',
    toDate: '2026-06-21',
    currency: 'USD',
  }
}

function metricValue(metric: string, index: number) {
  const values: Record<string, string> = {
    totalAssets: '$186,500',
    totalLiabilities: '$42,750',
    netProfit: '$31,240',
    variance: '+8.2%',
    openingBalance: '$12,500',
    totalDebit: '$42,800',
    totalCredit: '$30,500',
    closingBalance: '$24,800',
    totalAmount: '$91,300',
    currentBucket: '$42,800',
    overdueBucket: '$16,400',
    riskCount: '5',
    actual: '$128,400',
    planned: '$118,000',
    varianceAmount: '$10,400',
    variancePercent: '+9.1%',
    cashIn: '$34,200',
    cashOut: '$15,300',
    netMovement: '$18,900',
    unmatched: '5',
    acquisitionCost: '$248,000',
    accumulatedDepreciation: '$34,000',
    bookValue: '$214,000',
    assetCount: '86',
    inputTax: '$3,940',
    outputTax: '$8,320',
    taxDue: '$4,380',
    complianceAlerts: '3',
    revenue: '$128,400',
    cost: '$46,200',
    grossMargin: '$31,240',
    marginPercent: '31.8%',
    kpiCount: '18',
    trend: '+9.1%',
    alerts: '4',
    scheduledExports: '9',
  }

  return values[metric] ?? (index === 0 ? '$128,400' : index === 1 ? '$42,750' : '18.6%')
}

function buildMetrics(metricKeys: string[]): ReportMetric[] {
  return metricKeys.map((key, index) => ({
    key,
    value: metricValue(key, index),
    tone: key.toLowerCase().includes('alert') || key.toLowerCase().includes('risk') || key === 'unmatched'
      ? 'warning'
      : key.toLowerCase().includes('margin') || key.toLowerCase().includes('profit') || key === 'netMovement'
        ? 'success'
        : 'neutral',
  }))
}

export function ReportsModulePage() {
  const { sectionId, moduleId } = useParams()
  const navigate = useNavigate()
  const { locale, t } = useApp()
  const [filters, setFilters] = useState<ReportFilters>(() => defaultFilters())
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters | null>(null)

  if (!isReportsSectionId(sectionId)) {
    return <Navigate to="/reports/financial-statements" replace />
  }

  const section = REPORTS_SECTIONS[sectionId]
  const module = moduleId ? findReportModule(sectionId, moduleId) : undefined
  const text = (value: ReportText) => value[locale]

  if (!module) {
    return <Navigate to={`/reports/${sectionId}`} replace />
  }

  const meta = getReportModuleMeta(sectionId, module)
  const metrics = buildMetrics(meta.summaryMetrics)
  const isApplied = !!appliedFilters

  const exportContext = {
    locale,
    title: t(module.moduleTitleKey),
    sectionName: t(section.titleKey),
    description: text(module.summary),
    module,
    filters: appliedFilters ?? filters,
    metrics,
  }

  return (
    <ReportTaskShell
      locale={locale}
      title={t(module.moduleTitleKey)}
      sectionName={t(section.titleKey)}
      description={text(module.summary)}
      onBack={() => navigate(`/reports/${sectionId}`)}
      filters={
        <ReportFilterBar
          locale={locale}
          filters={meta.filters}
          values={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        />
      }
      actions={
        <ReportActionBar
          locale={locale}
          isApplied={isApplied}
          onApply={() => setAppliedFilters(filters)}
          onClear={() => {
            setFilters(defaultFilters())
            setAppliedFilters(null)
          }}
          onPrint={() => printReport(exportContext)}
          onPdf={() => exportReportPdf(exportContext)}
          onExcel={() => exportReportExcel(exportContext)}
        />
      }
      summary={isApplied ? <ReportSummaryStrip locale={locale} metrics={metrics} /> : undefined}
    >
      {isApplied ? (
        <ReportResultRenderer locale={locale} layout={meta.resultLayout} module={module} />
      ) : (
        <ReportEmptyState locale={locale} />
      )}
    </ReportTaskShell>
  )
}
