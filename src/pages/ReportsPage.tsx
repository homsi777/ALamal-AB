import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { useApp } from '../context/AppProvider'

export function ReportsPage() {
  const { t } = useApp()

  const items = [
    { icon: '📈', title: t('reports.items.sales.title'), desc: t('reports.items.sales.desc') },
    { icon: '📦', title: t('reports.items.inventory.title'), desc: t('reports.items.inventory.desc') },
    { icon: '💵', title: t('reports.items.profit.title'), desc: t('reports.items.profit.desc') },
    { icon: '🇨🇳', title: t('reports.items.import.title'), desc: t('reports.items.import.desc') },
    { icon: '👥', title: t('reports.items.statement.title'), desc: t('reports.items.statement.desc') },
    { icon: '🧾', title: t('reports.items.invoices.title'), desc: t('reports.items.invoices.desc') },
  ]

  return (
    <>
      <PageHeader
        title={t('reports.title')}
        subtitle={t('reports.subtitle')}
        actions={<GlossButton variant="ghost">{t('common.export')}</GlossButton>}
      />

      <div className="section-grid">
        {items.map((item) => (
          <div key={item.title} className="section-link-card">
            <span className="section-link-card__icon">{item.icon}</span>
            <span className="section-link-card__title">{item.title}</span>
            <span className="section-link-card__desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </>
  )
}
