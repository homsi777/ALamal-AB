type DiffBadgeProps = {
  value: number | null
  pendingLabel?: string
}

export function DiffBadge({ value, pendingLabel = '—' }: DiffBadgeProps) {
  if (value === null) {
    return <span className="diff-badge diff-badge--pending">{pendingLabel}</span>
  }

  if (value === 0) {
    return <span className="diff-badge diff-badge--zero">0</span>
  }

  const sign = value > 0 ? '+' : ''
  const variant = value > 0 ? 'up' : 'down'

  return (
    <span className={`diff-badge diff-badge--${variant}`}>
      {sign}
      {value}
    </span>
  )
}
