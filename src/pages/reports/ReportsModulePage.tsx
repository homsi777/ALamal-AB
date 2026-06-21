import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { StatCard } from '../../components/ui/StatCard'
import { REPORTS_SECTIONS, type ReportsSectionId } from '../../data/reportsSections'
import {
  findReportModule,
  REPORTS_WORKSPACE,
  type ReportModuleWorkspace,
  type ReportText,
} from '../../data/reportsWorkspace'
import { useApp } from '../../context/AppProvider'

const REPORT_SECTION_IDS = Object.keys(REPORTS_SECTIONS) as ReportsSectionId[]

function isReportsSectionId(value: string | undefined): value is ReportsSectionId {
  return !!value && REPORT_SECTION_IDS.includes(value as ReportsSectionId)
}

export function ReportsModulePage() {
  const { sectionId, moduleId } = useParams()
  const navigate = useNavigate()
  const { locale, t } = useApp()

  if (!isReportsSectionId(sectionId)) {
    return <Navigate to="/reports/financial-statements" replace />
  }

  const section = REPORTS_SECTIONS[sectionId]
  const workspace = REPORTS_WORKSPACE[sectionId]
  const module = moduleId ? findReportModule(sectionId, moduleId) : undefined
  const text = (value: ReportText) => value[locale]

  if (!module) {
    return <Navigate to={`/reports/${sectionId}`} replace />
  }

  return (
    <>
      <PageHeader
        title={t(module.moduleTitleKey)}
        subtitle={`${t(section.titleKey)} - ${text(module.summary)}`}
        actions={
          <>
            <GlossButton variant="ghost" onClick={() => navigate(`/reports/${sectionId}`)}>
              {text({ ar: 'رجوع', en: 'Back' })}
            </GlossButton>
            <GlossButton variant="ghost">{text(module.primaryAction)}</GlossButton>
            <GlossButton variant="ghost">{t('common.export')}</GlossButton>
          </>
        }
      />

      <div className="stat-grid stat-grid--4 reports-workspace__stats">
        {workspace.stats.map((stat) => (
          <StatCard
            key={text(stat.label)}
            title={text(stat.label)}
            value={stat.value}
            delta={text(stat.delta)}
            trend={stat.trend}
          />
        ))}
      </div>

      <ReportTaskPanel module={module} workflow={workspace.workflow} text={text} />
    </>
  )
}

type ReportTaskPanelProps = {
  module: ReportModuleWorkspace
  workflow: ReportText[]
  text: (value: ReportText) => string
}

function ReportTaskPanel({ module, workflow, text }: ReportTaskPanelProps) {
  return (
    <div className="card reports-workspace__panel">
      <div className="reports-workspace__panel-head">
        <div>
          <h2 className="reports-workspace__panel-title">{text(module.primaryAction)}</h2>
          <p className="reports-workspace__panel-summary">{text(module.summary)}</p>
        </div>
        <div className="reports-workspace__workflow" aria-label={text(module.primaryAction)}>
          {workflow.map((step, index) => (
            <span key={text(step)} className="reports-workspace__workflow-step">
              <span className="reports-workspace__workflow-index">{index + 1}</span>
              {text(step)}
            </span>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table reports-workspace__table">
          <thead>
            <tr>
              <th>{text({ ar: 'المرجع', en: 'Reference' })}</th>
              <th>{text({ ar: 'التقرير', en: 'Report' })}</th>
              <th>{text({ ar: 'الفترة', en: 'Period' })}</th>
              <th>{text({ ar: 'القيمة', en: 'Value' })}</th>
              <th>{text({ ar: 'المسؤول', en: 'Owner' })}</th>
              <th>{text({ ar: 'الحالة', en: 'Status' })}</th>
            </tr>
          </thead>
          <tbody>
            {module.rows.map((row) => (
              <tr key={row.ref}>
                <td><span className="entry-no">{row.ref}</span></td>
                <td>{text(row.subject)}</td>
                <td>{row.period}</td>
                <td className="data-table__number">{row.value}</td>
                <td>{text(row.owner)}</td>
                <td><Badge variant={row.variant}>{text(row.status)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-list">
        {module.rows.map((row) => (
          <div key={row.ref} className="mobile-list__item">
            <div className="mobile-list__row">
              <span className="entry-no">{row.ref}</span>
              <Badge variant={row.variant}>{text(row.status)}</Badge>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'التقرير', en: 'Report' })}</span>
              <span className="mobile-list__value">{text(row.subject)}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'الفترة', en: 'Period' })}</span>
              <span className="mobile-list__value">{row.period}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'القيمة', en: 'Value' })}</span>
              <span className="mobile-list__value">{row.value}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'المسؤول', en: 'Owner' })}</span>
              <span className="mobile-list__value">{text(row.owner)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
