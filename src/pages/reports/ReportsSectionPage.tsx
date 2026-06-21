import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { REPORTS_SECTIONS, type ReportModuleItem, type ReportsSectionId } from '../../data/reportsSections'
import { Badge } from '../../components/ui/Badge'
import { StatCard } from '../../components/ui/StatCard'
import { REPORTS_WORKSPACE, type ReportModuleWorkspace, type ReportText } from '../../data/reportsWorkspace'
import { useApp } from '../../context/AppProvider'

type ReportsSectionPageProps = {
  sectionId: ReportsSectionId
}

type ReportModuleCardsProps = {
  modules: ReportModuleItem[]
  activeModuleKey?: string
  onSelectModule: (moduleTitleKey: string) => void
}

function ReportModuleCards({ modules, activeModuleKey, onSelectModule }: ReportModuleCardsProps) {
  const { t } = useApp()

  return (
    <div className="section-grid">
      {modules.map((module) => (
        <button
          key={module.titleKey}
          type="button"
          className={`section-link-card report-module-card ${
            activeModuleKey === module.titleKey ? 'report-module-card--active' : ''
          }`}
          onClick={() => onSelectModule(module.titleKey)}
        >
          <span className="section-link-card__icon">{module.icon}</span>
          <span className="section-link-card__title">{t(module.titleKey)}</span>
          <span className="section-link-card__desc">{t(module.descKey)}</span>
        </button>
      ))}
    </div>
  )
}

export function ReportsSectionPage({ sectionId }: ReportsSectionPageProps) {
  const { locale, t } = useApp()
  const section = REPORTS_SECTIONS[sectionId]
  const workspace = REPORTS_WORKSPACE[sectionId]
  const [activeModuleKey, setActiveModuleKey] = useState(workspace.modules[0]?.moduleTitleKey)
  const activeModule = useMemo(
    () => workspace.modules.find((module) => module.moduleTitleKey === activeModuleKey) ?? workspace.modules[0],
    [activeModuleKey, workspace.modules],
  )
  const text = (value: ReportText) => value[locale]

  useEffect(() => {
    setActiveModuleKey(workspace.modules[0]?.moduleTitleKey)
  }, [workspace.modules])

  return (
    <>
      <PageHeader
        title={t(section.titleKey)}
        subtitle={t(section.subtitleKey)}
        actions={
          <>
            <GlossButton variant="ghost">{t('common.export')}</GlossButton>
            <GlossButton variant="ghost">{activeModule ? text(activeModule.primaryAction) : t('common.comingSoon')}</GlossButton>
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

      {section.groups ? (
        <div className="reports-section__groups">
          {section.groups.map((group) => (
            <section key={group.titleKey} className="reports-section__group">
              <h3 className="reports-section__group-title">{t(group.titleKey)}</h3>
              <ReportModuleCards
                modules={group.modules}
                activeModuleKey={activeModule?.moduleTitleKey}
                onSelectModule={setActiveModuleKey}
              />
            </section>
          ))}
        </div>
      ) : (
        <ReportModuleCards
          modules={section.modules ?? []}
          activeModuleKey={activeModule?.moduleTitleKey}
          onSelectModule={setActiveModuleKey}
        />
      )}

      {activeModule && (
        <ReportModulePanel module={activeModule} workflow={workspace.workflow} text={text} title={t(activeModule.moduleTitleKey)} />
      )}
    </>
  )
}

type ReportModulePanelProps = {
  module: ReportModuleWorkspace
  workflow: ReportText[]
  text: (value: ReportText) => string
  title: string
}

function ReportModulePanel({ module, workflow, text, title }: ReportModulePanelProps) {
  return (
    <div className="card reports-workspace__panel">
      <div className="reports-workspace__panel-head">
        <div>
          <h2 className="reports-workspace__panel-title">{title}</h2>
          <p className="reports-workspace__panel-summary">{text(module.summary)}</p>
        </div>
        <div className="reports-workspace__workflow" aria-label={title}>
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
