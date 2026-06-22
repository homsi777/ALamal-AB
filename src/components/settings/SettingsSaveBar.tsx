import { GlossButton } from '../ui/GlossButton'

type SettingsSaveBarProps = {
  dirty: boolean
  message?: string
  locale: 'ar' | 'en'
  onSave: () => void
  onReset: () => void
}

export function SettingsSaveBar({ dirty, message, locale, onSave, onReset }: SettingsSaveBarProps) {
  if (!dirty && !message) return null

  return (
    <div className="settings-save-bar">
      <span>{message ?? (locale === 'ar' ? 'توجد تغييرات غير محفوظة' : 'You have unsaved changes')}</span>
      <div>
        <GlossButton variant="ghost" size="sm" disabled={!dirty} onClick={onReset}>
          {locale === 'ar' ? 'إلغاء التغييرات' : 'Discard'}
        </GlossButton>
        <GlossButton variant="accent" size="sm" disabled={!dirty} onClick={onSave}>
          {locale === 'ar' ? 'حفظ' : 'Save'}
        </GlossButton>
      </div>
    </div>
  )
}
