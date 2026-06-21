import { GlossButton } from '../ui/GlossButton'
import type { FinanceActionId } from '../../data/financeTaskWorkspace'
import { actionLabels, text } from './financeLabels'

type FinanceExportMenuProps = {
  locale: 'ar' | 'en'
  onAction: (action: FinanceActionId) => void
}

export function FinanceExportMenu({ locale, onAction }: FinanceExportMenuProps) {
  return (
    <div className="finance-export-menu" aria-label={locale === 'ar' ? 'تصدير' : 'Export'}>
      {(['print', 'pdf', 'excel'] as FinanceActionId[]).map((action) => (
        <GlossButton key={action} variant="ghost" size="sm" onClick={() => onAction(action)}>
          {text(actionLabels[action], locale)}
        </GlossButton>
      ))}
    </div>
  )
}
