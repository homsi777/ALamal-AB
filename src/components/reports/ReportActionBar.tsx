import { GlossButton } from '../ui/GlossButton'
import { reportLabels, type ReportLocale } from './reportLabels'
import { ReportExportMenu } from './ReportExportMenu'

type ReportActionBarProps = {
  locale: ReportLocale
  isApplied: boolean
  onApply: () => void
  onClear: () => void
  onPrint: () => void
  onPdf: () => void
  onExcel: () => void
}

export function ReportActionBar({
  locale,
  isApplied,
  onApply,
  onClear,
  onPrint,
  onPdf,
  onExcel,
}: ReportActionBarProps) {
  const labels = reportLabels[locale]

  return (
    <div className="report-action-bar">
      <div className="report-action-bar__primary">
        <GlossButton variant="accent" onClick={onApply}>{isApplied ? labels.refresh : labels.apply}</GlossButton>
        <GlossButton variant="ghost" onClick={onClear}>{labels.clear}</GlossButton>
      </div>
      <ReportExportMenu locale={locale} disabled={!isApplied} onPrint={onPrint} onPdf={onPdf} onExcel={onExcel} />
    </div>
  )
}
