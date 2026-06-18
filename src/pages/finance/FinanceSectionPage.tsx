import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { FINANCE_SECTIONS, type FinanceSectionId } from '../../data/financeSections'
import { useApp } from '../../context/AppProvider'

type FinanceSectionPageProps = {
  sectionId: FinanceSectionId
}

export function FinanceSectionPage({ sectionId }: FinanceSectionPageProps) {
  const { t } = useApp()
  const section = FINANCE_SECTIONS[sectionId]

  return (
    <>
      <PageHeader
        title={t(section.titleKey)}
        subtitle={t(section.subtitleKey)}
        actions={<GlossButton variant="ghost">{t('common.comingSoon')}</GlossButton>}
      />

      <div className="section-grid">
        {section.modules.map((module) => (
          <div key={module.titleKey} className="section-link-card section-link-card--static">
            <span className="section-link-card__icon">{module.icon}</span>
            <span className="section-link-card__title">{t(module.titleKey)}</span>
            <span className="section-link-card__desc">{t(module.descKey)}</span>
          </div>
        ))}
      </div>
    </>
  )
}
