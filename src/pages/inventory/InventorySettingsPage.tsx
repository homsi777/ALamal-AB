import { PageHeader } from '../../components/ui/PageHeader'
import { useApp } from '../../context/AppProvider'

export function InventorySettingsPage() {
  const { t } = useApp()

  const items = [
    { icon: '📏', title: t('inventory.settings.units'), desc: t('inventory.settings.unitsDesc') },
    { icon: '🧵', title: t('inventory.settings.fabricTypes'), desc: t('inventory.settings.fabricTypesDesc') },
    { icon: '🏭', title: t('inventory.settings.warehouses'), desc: t('inventory.settings.warehousesDesc') },
    { icon: '🔔', title: t('inventory.settings.alerts'), desc: t('inventory.settings.alertsDesc') },
    { icon: '📊', title: t('inventory.settings.valuation'), desc: t('inventory.settings.valuationDesc') },
  ]

  return (
    <>
      <PageHeader
        title={t('inventory.settings.title')}
        subtitle={t('inventory.settings.subtitle')}
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
