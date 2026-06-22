import { GlossButton } from '../ui/GlossButton'
import type { SettingsLocale, SettingsTableColumn, SettingsTableRow, SettingsText } from '../../data/settingsWorkspace'
import { settingsText } from '../../data/settingsWorkspace'

type SettingsTableProps = {
  columns: SettingsTableColumn[]
  rows: SettingsTableRow[]
  locale: SettingsLocale
  actionLabel?: SettingsText
  onAction?: () => void
}

export function SettingsTable({ columns, rows, locale, actionLabel, onAction }: SettingsTableProps) {
  return (
    <div className="settings-table-block">
      {actionLabel && (
        <div className="settings-table-block__actions">
          <GlossButton variant="ghost" size="sm" onClick={onAction}>
            {settingsText(actionLabel, locale)}
          </GlossButton>
        </div>
      )}
      <div className="table-wrap">
        <table className="data-table settings-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{settingsText(column.label, locale)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
