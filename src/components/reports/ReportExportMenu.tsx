import { GlossButton } from '../ui/GlossButton'
import { reportLabels, type ReportLocale } from './reportLabels'

type ReportExportMenuProps = {
  locale: ReportLocale
  disabled: boolean
  onPrint: () => void
  onPdf: () => void
  onExcel: () => void
}

export function ReportExportMenu({ locale, disabled, onPrint, onPdf, onExcel }: ReportExportMenuProps) {
  const labels = reportLabels[locale]

  return (
    <div className="report-export-menu">
      <GlossButton variant="ghost" onClick={onPrint} disabled={disabled}>{labels.print}</GlossButton>
      <GlossButton variant="ghost" onClick={onPdf} disabled={disabled}>{labels.pdf}</GlossButton>
      <GlossButton variant="ghost" onClick={onExcel} disabled={disabled}>{labels.excel}</GlossButton>
    </div>
  )
}
