import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { REPORTS_SECTIONS, type ReportModuleItem, type ReportsSectionId } from '../../data/reportsSections'
import { useApp } from '../../context/AppProvider'

type ReportsSectionPageProps = {
  sectionId: ReportsSectionId
}

function ReportModuleCards({ modules }: { modules: ReportModuleItem[] }) {
  const { t } = useApp()

  return (
    <div className="section-grid">
      {modules.map((module) => (
        <div key={module.titleKey} className="section-link-card section-link-card--static">
          <span className="section-link-card__icon">{module.icon}</span>
          <span className="section-link-card__title">{t(module.titleKey)}</span>
          <span className="section-link-card__desc">{t(module.descKey)}</span>
        </div>
      ))}
    </div>
  )
}

export function ReportsSectionPage({ sectionId }: ReportsSectionPageProps) {
  const { t } = useApp()
  const section = REPORTS_SECTIONS[sectionId]

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

      {section.groups ? (
        <div className="reports-section__groups">
          {section.groups.map((group) => (
            <section key={group.titleKey} className="reports-section__group">
              <h3 className="reports-section__group-title">{t(group.titleKey)}</h3>
              <ReportModuleCards modules={group.modules} />
            </section>
          ))}
        </div>
      ) : (
        <ReportModuleCards modules={section.modules ?? []} />
      )}
    </>
  )
}
