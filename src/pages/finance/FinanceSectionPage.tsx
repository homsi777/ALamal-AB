import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { StatCard } from '../../components/ui/StatCard'
import { FINANCE_SECTIONS, type FinanceSectionId } from '../../data/financeSections'
import { FINANCE_WORKSPACE, type FinanceModuleWorkspace, type FinanceText } from '../../data/financeWorkspace'
import { useApp } from '../../context/AppProvider'

type FinanceSectionPageProps = {
  sectionId: FinanceSectionId
}

export function FinanceSectionPage({ sectionId }: FinanceSectionPageProps) {
  const { locale, t } = useApp()
  const section = FINANCE_SECTIONS[sectionId]
  const workspace = FINANCE_WORKSPACE[sectionId]
  const [activeModuleKey, setActiveModuleKey] = useState(workspace.modules[0]?.moduleTitleKey)
  const activeModule = useMemo(
    () => workspace.modules.find((module) => module.moduleTitleKey === activeModuleKey) ?? workspace.modules[0],
    [activeModuleKey, workspace.modules],
  )
  const text = (value: FinanceText) => value[locale]

  useEffect(() => {
    setActiveModuleKey(workspace.modules[0]?.moduleTitleKey)
  }, [workspace.modules])

  return (
    <>
      <PageHeader
        title={t(section.titleKey)}
        subtitle={t(section.subtitleKey)}
        actions={<GlossButton variant="ghost">{activeModule ? text(activeModule.primaryAction) : t('common.comingSoon')}</GlossButton>}
      />

      <div className="stat-grid stat-grid--4 finance-workspace__stats">
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

      <div className="section-grid finance-workspace__module-grid">
        {section.modules.map((module) => (
          <button
            key={module.titleKey}
            type="button"
            className={`section-link-card finance-module-card ${
              activeModule?.moduleTitleKey === module.titleKey ? 'finance-module-card--active' : ''
            }`}
            onClick={() => setActiveModuleKey(module.titleKey)}
          >
            <span className="section-link-card__icon">{module.icon}</span>
            <span className="section-link-card__title">{t(module.titleKey)}</span>
            <span className="section-link-card__desc">{t(module.descKey)}</span>
          </button>
        ))}
      </div>

      {activeModule && (
        <FinanceModulePanel module={activeModule} workflow={workspace.workflow} text={text} title={t(activeModule.moduleTitleKey)} />
      )}
    </>
  )
}

type FinanceModulePanelProps = {
  module: FinanceModuleWorkspace
  workflow: FinanceText[]
  text: (value: FinanceText) => string
  title: string
}

function FinanceModulePanel({ module, workflow, text, title }: FinanceModulePanelProps) {
  return (
    <div className="card finance-workspace__panel">
      <div className="finance-workspace__panel-head">
        <div>
          <h2 className="finance-workspace__panel-title">{title}</h2>
          <p className="finance-workspace__panel-summary">{text(module.summary)}</p>
        </div>
        <div className="finance-workspace__workflow" aria-label={title}>
          {workflow.map((step, index) => (
            <span key={text(step)} className="finance-workspace__workflow-step">
              <span className="finance-workspace__workflow-index">{index + 1}</span>
              {text(step)}
            </span>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table finance-workspace__table">
          <thead>
            <tr>
              <th>{text({ ar: 'المرجع', en: 'Reference' })}</th>
              <th>{text({ ar: 'البند', en: 'Item' })}</th>
              <th>{text({ ar: 'المسؤول', en: 'Owner' })}</th>
              <th>{text({ ar: 'القيمة', en: 'Value' })}</th>
              <th>{text({ ar: 'التاريخ', en: 'Date' })}</th>
              <th>{text({ ar: 'الحالة', en: 'Status' })}</th>
            </tr>
          </thead>
          <tbody>
            {module.rows.map((row) => (
              <tr key={row.ref}>
                <td><span className="entry-no">{row.ref}</span></td>
                <td>{text(row.subject)}</td>
                <td>{text(row.owner)}</td>
                <td className="data-table__number">{row.amount}</td>
                <td>{row.date}</td>
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
              <span className="mobile-list__label">{text({ ar: 'البند', en: 'Item' })}</span>
              <span className="mobile-list__value">{text(row.subject)}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'المسؤول', en: 'Owner' })}</span>
              <span className="mobile-list__value">{text(row.owner)}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'القيمة', en: 'Value' })}</span>
              <span className="mobile-list__value">{row.amount}</span>
            </div>
            <div className="mobile-list__row">
              <span className="mobile-list__label">{text({ ar: 'التاريخ', en: 'Date' })}</span>
              <span className="mobile-list__value">{row.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
