import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { FinanceTaskDefinition } from '../../data/financeTaskWorkspace'
import type { FinanceText } from '../../data/financeWorkspace'
import { FinanceApprovalBadge } from './FinanceApprovalBadge'
import { text } from './financeLabels'

type FinanceTaskShellProps = {
  locale: 'ar' | 'en'
  sectionTitle: string
  taskTitle: string
  taskSummary: FinanceText
  sectionPath: string
  definition: FinanceTaskDefinition
  actionBar: ReactNode
  filters: ReactNode
  workflow: ReactNode
  children: ReactNode
  auditTrail: ReactNode
  notice?: string
}

export function FinanceTaskShell({
  locale,
  sectionTitle,
  taskTitle,
  taskSummary,
  sectionPath,
  definition,
  actionBar,
  filters,
  workflow,
  children,
  auditTrail,
  notice,
}: FinanceTaskShellProps) {
  return (
    <div className="finance-task-shell">
      <div className="finance-task-shell__header">
        <div className="finance-task-shell__title-area">
          <Link to={sectionPath} className="finance-task-shell__back">
            {locale === 'ar' ? 'رجوع' : 'Back'}
          </Link>
          <span className="finance-task-shell__section">{sectionTitle}</span>
          <h1>{taskTitle}</h1>
          <p>{text(taskSummary, locale)}</p>
        </div>
        <div className="finance-task-shell__status">
          <FinanceApprovalBadge status={definition.status} locale={locale} />
          <span className="finance-task-shell__backend-badge">
            {locale === 'ar' ? 'جاهز للربط الخلفي' : 'Backend-ready'}
          </span>
        </div>
      </div>

      <div className="finance-task-shell__actions">{actionBar}</div>
      {notice && <div className="finance-task-shell__notice">{notice}</div>}
      {filters}
      {workflow}

      <div className="finance-task-shell__body">
        <main className="finance-task-shell__main">
          <div className="finance-task-shell__metrics">
            {definition.metrics.map((metric) => (
              <div key={text(metric.label, locale)} className={`finance-task-metric finance-task-metric--${metric.tone ?? 'neutral'}`}>
                <span>{text(metric.label, locale)}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
          {children}
        </main>
        {auditTrail}
      </div>
    </div>
  )
}
