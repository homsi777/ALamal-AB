import type { ReactNode } from 'react'

type SettingsCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function SettingsCard({ title, description, action, children }: SettingsCardProps) {
  return (
    <section className="settings-card">
      <header className="settings-card__header">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
