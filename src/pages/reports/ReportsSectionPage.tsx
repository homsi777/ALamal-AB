import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { REPORTS_SECTIONS, type ReportModuleItem, type ReportsSectionId } from '../../data/reportsSections'
import { StatCard } from '../../components/ui/StatCard'
import { REPORTS_WORKSPACE, reportModuleIdFromTitleKey, type ReportText } from '../../data/reportsWorkspace'
import { useApp } from '../../context/AppProvider'

type ReportsSectionPageProps = {
  sectionId: ReportsSectionId
}

type ReportModuleCardsProps = {
  sectionId: ReportsSectionId
  modules: ReportModuleItem[]
}

function ReportModuleCards({ sectionId, modules }: ReportModuleCardsProps) {
  const { t } = useApp()

  return (
    <div className="section-grid">
      {modules.map((module) => (
        <Link
          key={module.titleKey}
          to={`/reports/${sectionId}/${reportModuleIdFromTitleKey(module.titleKey)}`}
          className="section-link-card report-module-card"
        >
          <span className="section-link-card__icon">{module.icon}</span>
          <span className="section-link-card__title">{t(module.titleKey)}</span>
          <span className="section-link-card__desc">{t(module.descKey)}</span>
        </Link>
      ))}
    </div>
  )
}

export function ReportsSectionPage({ sectionId }: ReportsSectionPageProps) {
  const { locale, t } = useApp()
  const section = REPORTS_SECTIONS[sectionId]
  const workspace = REPORTS_WORKSPACE[sectionId]
  const text = (value: ReportText) => value[locale]

  return (
    <>
      <PageHeader
        title={t(section.titleKey)}
        subtitle={t(section.subtitleKey)}
        actions={
          <>
            <GlossButton variant="ghost">{t('common.export')}</GlossButton>
            <GlossButton variant="ghost">{t('common.comingSoon')}</GlossButton>
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
              <ReportModuleCards sectionId={sectionId} modules={group.modules} />
            </section>
          ))}
        </div>
      ) : (
        <ReportModuleCards sectionId={sectionId} modules={section.modules ?? []} />
      )}
    </>
  )
}
