import { GlossButton } from '../ui/GlossButton'

type SettingsDangerZoneProps = {
  title: string
  description: string
  actionLabel: string
  disabledReason?: string
  onAction: () => void
}

export function SettingsDangerZone({ title, description, actionLabel, disabledReason, onAction }: SettingsDangerZoneProps) {
  return (
    <div className="settings-danger-zone">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
        {disabledReason && <span>{disabledReason}</span>}
      </div>
      <GlossButton variant="ghost" disabled={Boolean(disabledReason)} onClick={onAction}>
        {actionLabel}
      </GlossButton>
    </div>
  )
}
