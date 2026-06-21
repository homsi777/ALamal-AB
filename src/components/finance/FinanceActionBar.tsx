import { GlossButton } from '../ui/GlossButton'
import type { FinanceActionId } from '../../data/financeTaskWorkspace'
import type { FinanceText } from '../../data/financeWorkspace'
import { actionLabels, text } from './financeLabels'

type FinanceActionBarProps = {
  actions: FinanceActionId[]
  disabledActions?: Partial<Record<FinanceActionId, FinanceText>>
  locale: 'ar' | 'en'
  onAction: (action: FinanceActionId) => void
}

const primaryActions = new Set<FinanceActionId>(['new', 'saveDraft', 'approve', 'post', 'match', 'calculate'])

export function FinanceActionBar({ actions, disabledActions, locale, onAction }: FinanceActionBarProps) {
  return (
    <div className="finance-action-bar" aria-label={locale === 'ar' ? 'إجراءات مالية' : 'Finance actions'}>
      {actions.map((action) => {
        const disabledReason = disabledActions?.[action]
        return (
          <GlossButton
            key={action}
            variant={primaryActions.has(action) ? 'accent' : 'ghost'}
            disabled={Boolean(disabledReason)}
            onClick={() => onAction(action)}
          >
            {text(actionLabels[action], locale)}
            {disabledReason ? ` - ${text(disabledReason, locale)}` : ''}
          </GlossButton>
        )
      })}
    </div>
  )
}
