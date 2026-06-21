import type { ReactNode } from 'react'
import { PageHeader } from '../ui/PageHeader'
import { GlossButton } from '../ui/GlossButton'
import { reportLabels, type ReportLocale } from './reportLabels'

type ReportTaskShellProps = {
  locale: ReportLocale
  title: string
  sectionName: string
  description: string
  onBack: () => void
  filters: ReactNode
  actions: ReactNode
  summary?: ReactNode
  children: ReactNode
}

export function ReportTaskShell({
  locale,
  title,
  sectionName,
  description,
  onBack,
  filters,
  actions,
  summary,
  children,
}: ReportTaskShellProps) {
  return (
    <div className="report-task-shell">
      <PageHeader
        title={title}
        subtitle={`${sectionName} - ${description}`}
        actions={
          <GlossButton variant="ghost" onClick={onBack}>
            {reportLabels[locale].back}
          </GlossButton>
        }
      />

      <div className="report-task-shell__workspace">
        {filters}
        {actions}
        {summary}
        <main className="report-task-shell__result">{children}</main>
      </div>
    </div>
  )
}
