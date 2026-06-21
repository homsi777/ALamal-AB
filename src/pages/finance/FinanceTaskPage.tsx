import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FinanceActionBar } from '../../components/finance/FinanceActionBar'
import { FinanceAuditTrail } from '../../components/finance/FinanceAuditTrail'
import { FinanceFilterBar } from '../../components/finance/FinanceFilterBar'
import { FinanceResultRenderer } from '../../components/finance/FinanceResultRenderer'
import { FinanceTaskShell } from '../../components/finance/FinanceTaskShell'
import { FinanceWorkflowStrip } from '../../components/finance/FinanceWorkflowStrip'
import { actionLabels, text } from '../../components/finance/financeLabels'
import { useApp } from '../../context/AppProvider'
import { FINANCE_SECTIONS, type FinanceSectionId } from '../../data/financeSections'
import type { FinanceActionId, FinanceFilterId } from '../../data/financeTaskWorkspace'
import { findFinanceTask } from '../../data/financeTaskWorkspace'
import { exportFinanceExcel, exportFinancePdf, openFinancePrintPreview } from '../../utils/financeExport'

export function FinanceTaskPage() {
  const { locale, t } = useApp()
  const navigate = useNavigate()
  const params = useParams()
  const sectionId = params.sectionId as FinanceSectionId
  const taskId = params.taskId ?? ''
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string>()

  const section = FINANCE_SECTIONS[sectionId]
  const workspace = useMemo(() => {
    if (!section) return null
    return findFinanceTask(sectionId, taskId)
  }, [section, sectionId, taskId])

  if (!section) return <Navigate to="/finance/general-ledger" replace />
  if (!workspace) return <Navigate to={`/finance/${sectionId}`} replace />

  const handleAction = (action: FinanceActionId) => {
    if (action === 'print') {
      openFinancePrintPreview(workspace, locale, 'print')
      setNotice(locale === 'ar' ? 'تم فتح نافذة الطباعة للمستند المالي.' : 'Print window opened.')
      return
    }
    if (action === 'pdf') {
      exportFinancePdf(workspace, locale)
      setNotice(locale === 'ar' ? 'تم فتح معاينة PDF/طباعة موحدة للمستند.' : 'PDF/print preview opened.')
      return
    }
    if (action === 'excel') {
      exportFinanceExcel(workspace, locale)
      setNotice(locale === 'ar' ? 'تم تصدير بيانات المهمة إلى Excel.' : 'Excel export generated.')
      return
    }

    const label = text(actionLabels[action], locale)
    setNotice(
      locale === 'ar'
        ? `تم تجهيز إجراء "${label}" داخل الواجهة. التنفيذ الفعلي ينتظر ربط API المالي.`
        : `"${label}" is wired in the UI. Final execution awaits finance API integration.`,
    )
  }

  return (
    <FinanceTaskShell
      locale={locale}
      sectionTitle={t(section.titleKey)}
      taskTitle={t(workspace.module.moduleTitleKey)}
      taskSummary={workspace.module.summary}
      sectionPath={`/finance/${sectionId}`}
      definition={workspace.definition}
      notice={notice}
      actionBar={
        <FinanceActionBar
          actions={workspace.definition.actions}
          disabledActions={workspace.definition.disabledActions}
          locale={locale}
          onAction={handleAction}
        />
      }
      filters={
        <FinanceFilterBar
          filters={workspace.definition.filters}
          locale={locale}
          values={filters}
          onChange={(id: FinanceFilterId, value) => setFilters((current) => ({ ...current, [id]: value }))}
        />
      }
      workflow={<FinanceWorkflowStrip steps={workspace.definition.workflow} active={workspace.definition.status} locale={locale} />}
      auditTrail={<FinanceAuditTrail entries={workspace.definition.auditTrail} locale={locale} />}
    >
      <FinanceResultRenderer workspace={workspace} locale={locale} />
      <div className="finance-task-shell__footer-actions">
        <button type="button" className="finance-task-shell__link-button" onClick={() => navigate(`/finance/${sectionId}`)}>
          {locale === 'ar' ? 'العودة إلى مهام القسم' : 'Back to section tasks'}
        </button>
      </div>
    </FinanceTaskShell>
  )
}
