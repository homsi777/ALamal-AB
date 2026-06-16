import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { useApp } from '../../context/AppProvider'

export function OpeningStockPage() {
  const { t } = useApp()

  return (
    <>
      <PageHeader
        title={t('inventory.openingStock.title')}
        subtitle={t('inventory.openingStock.subtitle')}
        actions={<GlossButton variant="accent">{t('inventory.openingStock.new')}</GlossButton>}
      />

      <div className="section-grid">
        {[
          { icon: '📋', title: t('inventory.openingStock.batch2026'), desc: t('inventory.openingStock.batch2026Desc') },
          { icon: '📅', title: t('inventory.openingStock.fiscalYear'), desc: t('inventory.openingStock.fiscalYearDesc') },
          { icon: '🧵', title: t('inventory.openingStock.items'), desc: '156 ' + t('inventory.openingStock.itemUnit') },
        ].map((item) => (
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
