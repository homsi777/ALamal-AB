type SettingsSearchProps = {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function SettingsSearch({ value, placeholder, onChange }: SettingsSearchProps) {
  return (
    <label className="settings-search">
      <span>{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  )
}
