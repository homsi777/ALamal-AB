import type { FinanceTaskWorkspace } from '../../data/financeTaskWorkspace'
import { text } from './financeLabels'

type FinanceDocumentPrintLayoutProps = {
  workspace: FinanceTaskWorkspace
  locale: 'ar' | 'en'
}

export function FinanceDocumentPrintLayout({ workspace, locale }: FinanceDocumentPrintLayoutProps) {
  const { definition, module } = workspace

  return (
    <div className="finance-print-preview">
      <header>
        <strong>ALamal-AB ERP</strong>
        <span>{text(definition.printTitle, locale)}</span>
      </header>
      <section>
        <div>{locale === 'ar' ? 'المستند' : 'Document'}: {definition.id}</div>
        <div>{locale === 'ar' ? 'التاريخ' : 'Date'}: 2026-06-21</div>
        <div>{locale === 'ar' ? 'الحالة' : 'Status'}: {definition.status}</div>
      </section>
      <p>{text(module.summary, locale)}</p>
    </div>
  )
}
