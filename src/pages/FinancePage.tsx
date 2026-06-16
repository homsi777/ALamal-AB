import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { StatCard } from '../components/ui/StatCard'
import { useApp } from '../context/AppProvider'

export function FinancePage() {
  const { t } = useApp()

  const sections = [
    { icon: '💚', title: t('finance.sections.receipts.title'), desc: t('finance.sections.receipts.desc') },
    { icon: '💳', title: t('finance.sections.payments.title'), desc: t('finance.sections.payments.desc') },
    { icon: '🏦', title: t('finance.sections.bank.title'), desc: t('finance.sections.bank.desc') },
    { icon: '📋', title: t('finance.sections.statement.title'), desc: t('finance.sections.statement.desc') },
  ]

  return (
    <>
      <PageHeader
        title={t('finance.title')}
        subtitle={t('finance.subtitle')}
        actions={
          <>
            <GlossButton variant="receipt" size="lg">{t('finance.receipt')}</GlossButton>
            <GlossButton variant="payment" size="lg">{t('finance.payment')}</GlossButton>
          </>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title={t('finance.cashBalance')} value="18,320 $" delta={t('finance.cashDelta')} trend="up" />
        <StatCard title={t('finance.bankBalance')} value="96,500 $" delta={t('finance.bankDelta')} trend="up" />
        <StatCard title={t('finance.receivables')} value="24,800 $" delta={t('finance.receivablesDelta')} trend="down" />
        <StatCard title={t('finance.payables')} value="11,700 $" delta={t('finance.payablesDelta')} trend="down" />
      </div>

      <div className="section-grid">
        {sections.map((item) => (
          <div key={item.title} className="section-link-card">
            <span className="section-link-card__icon">{item.icon}</span>
            <span className="section-link-card__title">{item.title}</span>
            <span className="section-link-card__desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </>
  )
}
