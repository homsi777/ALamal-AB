import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { recentInvoices, statusLabel } from '../data/mock'
import { useApp } from '../context/AppProvider'

export function InvoicesPage() {
  const { t, locale } = useApp()

  const sections = [
    { title: t('invoices.sales'), count: 142, icon: '📤' },
    { title: t('invoices.purchases'), count: 89, icon: '📥' },
    { title: t('invoices.drafts'), count: 5, icon: '📝' },
  ]

  return (
    <>
      <PageHeader
        title={t('invoices.title')}
        subtitle={t('invoices.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('invoices.salesInvoice')}</GlossButton>
            <GlossButton variant="ghost">{t('invoices.purchaseInvoice')}</GlossButton>
          </>
        }
      />

      <div className="section-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {sections.map((s) => (
          <div key={s.title} className="section-link-card">
            <span className="section-link-card__icon">{s.icon}</span>
            <span className="section-link-card__title">{s.title}</span>
            <span className="section-link-card__desc">{s.count} {t('invoices.invoiceCount')}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>{t('invoices.recent')}</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('invoices.number')}</th>
                <th>{t('common.customer')}</th>
                <th>{t('common.amount')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => {
                const st = statusLabel(locale, inv.status)
                return (
                  <tr key={inv.id}>
                    <td>{inv.id}</td>
                    <td>{inv.customer}</td>
                    <td>{inv.amount}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{inv.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
