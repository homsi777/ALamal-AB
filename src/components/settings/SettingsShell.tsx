import type { ReactNode } from 'react'

type SettingsShellProps = {
  sidebar: ReactNode
  children: ReactNode
}

export function SettingsShell({ sidebar, children }: SettingsShellProps) {
  return (
    <div className="settings-shell">
      {sidebar}
      <main className="settings-shell__content">{children}</main>
    </div>
  )
}
