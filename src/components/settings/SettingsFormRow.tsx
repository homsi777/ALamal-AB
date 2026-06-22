import type { SettingsField, SettingsLocale } from '../../data/settingsWorkspace'
import { settingsText } from '../../data/settingsWorkspace'
import { SettingsToggle } from './SettingsToggle'

type SettingsFormRowProps = {
  sectionId: string
  field: SettingsField
  locale: SettingsLocale
  value: string | boolean
  error?: string
  onChange: (key: string, value: string | boolean) => void
}

export function SettingsFormRow({ sectionId, field, locale, value, error, onChange }: SettingsFormRowProps) {
  const key = `${sectionId}.${field.id}`
  const label = settingsText(field.label, locale)

  return (
    <label className="settings-form-row">
      <span className="settings-form-row__label">
        {label}
        {field.required && <strong>*</strong>}
      </span>
      {renderInput()}
      {field.helper && <span className="settings-form-row__helper">{settingsText(field.helper, locale)}</span>}
      {field.warning && <span className="settings-form-row__warning">{settingsText(field.warning, locale)}</span>}
      {error && <span className="settings-form-row__error">{error}</span>}
    </label>
  )

  function renderInput() {
    if (field.type === 'toggle') {
      return <SettingsToggle checked={Boolean(value)} onChange={(checked) => onChange(key, checked)} />
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={String(value ?? '')}
          onChange={(event) => onChange(key, event.target.value)}
          rows={3}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select value={String(value ?? '')} onChange={(event) => onChange(key, event.target.value)}>
          {field.options?.map((option) => (
            <option key={settingsText(option, locale)} value={settingsText(option, locale)}>
              {settingsText(option, locale)}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type}
        value={String(value ?? '')}
        onChange={(event) => onChange(key, event.target.value)}
      />
    )
  }
}
