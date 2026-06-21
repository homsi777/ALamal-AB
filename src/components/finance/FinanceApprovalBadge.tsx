import { Badge } from '../ui/Badge'
import type { FinanceTaskStatus } from '../../data/financeTaskWorkspace'
import { statusLabels, statusVariant, text } from './financeLabels'

type FinanceApprovalBadgeProps = {
  status: FinanceTaskStatus
  locale: 'ar' | 'en'
}

export function FinanceApprovalBadge({ status, locale }: FinanceApprovalBadgeProps) {
  return <Badge variant={statusVariant[status]}>{text(statusLabels[status], locale)}</Badge>
}
