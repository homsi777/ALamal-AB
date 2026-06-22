import { Badge } from '../ui/Badge'
import { GlossButton } from '../ui/GlossButton'
import type { SettingsLocale, SettingsSection } from '../../data/settingsWorkspace'
import { settingsText } from '../../data/settingsWorkspace'

type SettingsSectionHeaderProps = {
  section: SettingsSection
  locale: SettingsLocale
  dirty: boolean
  onSave: () => void
  onReset: () => void
  onExport: () => void
}

const statusVariant = {
  ready: 'info',
  configured: 'success',
  'needs-review': 'warning',
  danger: 'danger',
} as const

export function SettingsSectionHeader({ section, locale, dirty, onSave, onReset, onExport }: SettingsSectionHeaderProps) {
  const statusLabel = {
    ready: locale === 'ar' ? 'جاهز' : 'Ready',
    configured: locale === 'ar' ? 'مضبوط' : 'Configured',
    'needs-review': locale === 'ar' ? 'يحتاج مراجعة' : 'Needs review',
    danger: locale === 'ar' ? 'حساس' : 'Sensitive',
  }[section.status]

  return (
    <header className="settings-section-header">
      <div>
        <div className="settings-section-header__meta">
          <Badge variant={statusVariant[section.status]}>{statusLabel}</Badge>
          {section.affectsSystemBehavior && (
            <span className="settings-section-header__impact">
              {locale === 'ar' ? 'يؤثر على سلوك النظام' : 'Affects system behavior'}
            </span>
          )}
        </div>
        <h2>{settingsText(section.title, locale)}</h2>
        <p>{settingsText(section.description, locale)}</p>
      </div>
      <div className="settings-section-header__actions">
        {dirty && <span className="settings-section-header__dirty">{locale === 'ar' ? 'توجد تغييرات غير محفوظة' : 'Unsaved changes'}</span>}
        <GlossButton variant="ghost" onClick={onExport}>{locale === 'ar' ? 'تصدير الإعدادات' : 'Export settings'}</GlossButton>
        <GlossButton variant="ghost" disabled={!dirty} onClick={onReset}>{locale === 'ar' ? 'إعادة تعيين' : 'Reset'}</GlossButton>
        <GlossButton variant="accent" disabled={!dirty} onClick={onSave}>{locale === 'ar' ? 'حفظ التغييرات' : 'Save changes'}</GlossButton>
      </div>
    </header>
  )
}
