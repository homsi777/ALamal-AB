import type { FinanceAuditEntry } from '../../data/financeTaskWorkspace'
import { text } from './financeLabels'

type FinanceAuditTrailProps = {
  entries: FinanceAuditEntry[]
  locale: 'ar' | 'en'
}

export function FinanceAuditTrail({ entries, locale }: FinanceAuditTrailProps) {
  return (
    <aside className="finance-audit-trail">
      <h3>{locale === 'ar' ? 'سجل التدقيق' : 'Audit trail'}</h3>
      <div className="finance-audit-trail__list">
        {entries.map((entry) => (
          <div key={`${text(entry.label, locale)}-${entry.at}`} className="finance-audit-trail__item">
            <div className="finance-audit-trail__head">
              <strong>{text(entry.label, locale)}</strong>
              <span>{entry.at}</span>
            </div>
            <p>{text(entry.note, locale)}</p>
            <span className="finance-audit-trail__user">{text(entry.user, locale)}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
