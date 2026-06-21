import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/ui/StatCard'
import { FINANCE_SECTIONS, type FinanceSectionId } from '../../data/financeSections'
import { FINANCE_WORKSPACE, type FinanceText } from '../../data/financeWorkspace'
import { getFinanceTaskRoute } from '../../data/financeTaskWorkspace'
import { useApp } from '../../context/AppProvider'

type FinanceSectionPageProps = {
  sectionId: FinanceSectionId
}

export function FinanceSectionPage({ sectionId }: FinanceSectionPageProps) {
  const { locale, t } = useApp()
  const section = FINANCE_SECTIONS[sectionId]
  const workspace = FINANCE_WORKSPACE[sectionId]
  const text = (value: FinanceText) => value[locale]

  return (
    <>
      <PageHeader
        title={t(section.titleKey)}
        subtitle={t(section.subtitleKey)}
        actions={<span className="finance-task-shell__backend-badge">{locale === 'ar' ? 'اختر مهمة للعمل' : 'Choose a task'}</span>}
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
          <Link
            key={module.titleKey}
            to={`/finance/${sectionId}/${getFinanceTaskRoute(sectionId, module.titleKey)}`}
            className="section-link-card finance-module-card"
          >
            <span className="section-link-card__icon">{module.icon}</span>
            <span className="section-link-card__title">{t(module.titleKey)}</span>
            <span className="section-link-card__desc">{t(module.descKey)}</span>
            <span className="finance-module-card__open">{locale === 'ar' ? 'فتح شاشة العمل' : 'Open workspace'}</span>
          </Link>
        ))}
      </div>

      <div className="card finance-workspace__panel">
        <div className="finance-workspace__panel-head">
          <div>
            <h2 className="finance-workspace__panel-title">{locale === 'ar' ? 'مسار عمل القسم' : 'Section workflow'}</h2>
            <p className="finance-workspace__panel-summary">
              {locale === 'ar'
                ? 'هذه الصفحة تعرض ملخص القسم فقط. افتح أي مهمة للوصول إلى شاشة تشغيل مستقلة فيها فلاتر وإجراءات وسجل تدقيق.'
                : 'This page is a section catalog. Open a task to work in an independent finance workspace with filters, actions, and audit trail.'}
            </p>
          </div>
          <div className="finance-workspace__workflow" aria-label={t(section.titleKey)}>
            {workspace.workflow.map((step, index) => (
              <span key={text(step)} className="finance-workspace__workflow-step">
                <span className="finance-workspace__workflow-index">{index + 1}</span>
                {text(step)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
