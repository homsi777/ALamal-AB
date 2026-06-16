import { PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../context/AppProvider'

export function SettingsPage() {
  const { t } = useApp()

  const items = [
    { icon: '🏢', title: t('settings.items.company.title'), desc: t('settings.items.company.desc') },
    { icon: '👤', title: t('settings.items.users.title'), desc: t('settings.items.users.desc') },
    { icon: '📏', title: t('settings.items.units.title'), desc: t('settings.items.units.desc') },
    { icon: '🧵', title: t('settings.items.fabricTypes.title'), desc: t('settings.items.fabricTypes.desc') },
    { icon: '🖨️', title: t('settings.items.templates.title'), desc: t('settings.items.templates.desc') },
    { icon: '🔒', title: t('settings.items.security.title'), desc: t('settings.items.security.desc') },
  ]

  return (
    <>
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
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
