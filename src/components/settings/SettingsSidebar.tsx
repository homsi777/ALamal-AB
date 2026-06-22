import type { SettingsGroupId, SettingsLocale, SettingsSection, SettingsSectionId } from '../../data/settingsWorkspace'
import { SETTINGS_GROUPS, settingsText } from '../../data/settingsWorkspace'

type SettingsSidebarProps = {
  sections: SettingsSection[]
  activeId: SettingsSectionId
  locale: SettingsLocale
  onSelect: (id: SettingsSectionId) => void
}

export function SettingsSidebar({ sections, activeId, locale, onSelect }: SettingsSidebarProps) {
  const groups = Array.from(new Set(sections.map((section) => section.group))) as SettingsGroupId[]

  return (
    <aside className="settings-sidebar">
      {groups.map((group) => (
        <div key={group} className="settings-sidebar__group">
          <h3>{settingsText(SETTINGS_GROUPS[group], locale)}</h3>
          {sections.filter((section) => section.group === group).map((section) => (
            <button
              key={section.id}
              type="button"
              className={`settings-sidebar__item ${section.id === activeId ? 'settings-sidebar__item--active' : ''}`}
              onClick={() => onSelect(section.id)}
            >
              <span className="settings-sidebar__icon">{section.icon}</span>
              <span>
                <strong>{settingsText(section.title, locale)}</strong>
                <small>{settingsText(section.description, locale)}</small>
              </span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
