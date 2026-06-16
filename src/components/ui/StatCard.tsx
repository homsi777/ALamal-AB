type StatCardProps = {
  title: string
  value: string
  delta?: string
  trend?: 'up' | 'down'
}

export function StatCard({ title, value, delta, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
      <div className="card__value">{value}</div>
      {delta && (
        <div className={`card__delta card__delta--${trend ?? 'up'}`}>{delta}</div>
      )}
    </div>
  )
}
