import type { FinanceTaskStatus } from '../../data/financeTaskWorkspace'
import { statusLabels, text } from './financeLabels'

type FinanceWorkflowStripProps = {
  steps: FinanceTaskStatus[]
  active: FinanceTaskStatus
  locale: 'ar' | 'en'
}

export function FinanceWorkflowStrip({ steps, active, locale }: FinanceWorkflowStripProps) {
  const activeIndex = Math.max(0, steps.indexOf(active))

  return (
    <div className="finance-task-workflow" aria-label={locale === 'ar' ? 'مسار العمل' : 'Workflow'}>
      {steps.map((step, index) => (
        <div
          key={step}
          className={`finance-task-workflow__step ${
            index <= activeIndex ? 'finance-task-workflow__step--done' : ''
          } ${step === active ? 'finance-task-workflow__step--active' : ''}`}
        >
          <span className="finance-task-workflow__dot">{index + 1}</span>
          <span>{text(statusLabels[step], locale)}</span>
        </div>
      ))}
    </div>
  )
}
