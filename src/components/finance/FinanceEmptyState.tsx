type FinanceEmptyStateProps = {
  title: string
  description: string
}

export function FinanceEmptyState({ title, description }: FinanceEmptyStateProps) {
  return (
    <div className="finance-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
