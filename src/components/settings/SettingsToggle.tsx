type SettingsToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsToggle({ checked, onChange }: SettingsToggleProps) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? 'settings-toggle--checked' : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span />
    </button>
  )
}
