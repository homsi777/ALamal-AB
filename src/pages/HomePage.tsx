import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { RankingCard } from '../components/ui/RankingCard'
import { recentInvoices, statusLabel } from '../data/mock'
import {
  topCustomers,
  leastCustomers,
  topFabrics,
  leastFabrics,
} from '../data/rankings'
import { useApp } from '../context/AppProvider'

export function HomePage() {
  const { t, locale } = useApp()
  const [openRanking, setOpenRanking] = useState<string | null>(null)

  const toggleRanking = (id: string) => {
    setOpenRanking((prev) => (prev === id ? null : id))
  }

  const stats = [
    { title: t('home.stats.todaySales'), value: '12,450 $', delta: t('home.deltas.salesUp'), trend: 'up' as const },
    { title: t('home.stats.pendingInvoices'), value: '23', delta: t('home.deltas.overdue'), trend: 'down' as const },
    { title: t('home.stats.inventoryValue'), value: '284,000 $', delta: t('home.deltas.inventoryUp'), trend: 'up' as const },
    { title: t('home.stats.chinaOrders'), value: '7', delta: t('home.deltas.shipping'), trend: 'up' as const },
  ]

  const shortcuts = [
    { to: '/inventory', icon: '📦', title: t('home.shortcuts.inventory.title'), desc: t('home.shortcuts.inventory.desc') },
    { to: '/china-orders', icon: '🇨🇳', title: t('home.shortcuts.china.title'), desc: t('home.shortcuts.china.desc') },
    { to: '/finance', icon: '💰', title: t('home.shortcuts.finance.title'), desc: t('home.shortcuts.finance.desc') },
    { to: '/reports', icon: '📊', title: t('home.shortcuts.reports.title'), desc: t('home.shortcuts.reports.desc') },
  ]

  const rankingLabels = {
    invoices: t('home.rankings.invoices'),
    meters: t('home.rankings.meters'),
    share: t('home.rankings.share'),
  }

  const rankingCards = [
    {
      id: 'top-customers',
      icon: '👥',
      variant: 'top' as const,
      kind: 'customers' as const,
      title: t('home.rankings.topCustomers'),
      data: topCustomers,
    },
    {
      id: 'top-fabrics',
      icon: '🧵',
      variant: 'top' as const,
      kind: 'fabrics' as const,
      title: t('home.rankings.topFabrics'),
      data: topFabrics,
    },
    {
      id: 'least-customers',
      icon: '📉',
      variant: 'least' as const,
      kind: 'customers' as const,
      title: t('home.rankings.leastCustomers'),
      data: leastCustomers,
    },
    {
      id: 'least-fabrics',
      icon: '📊',
      variant: 'least' as const,
      kind: 'fabrics' as const,
      title: t('home.rankings.leastFabrics'),
      data: leastFabrics,
    },
  ]

  return (
    <>
      <PageHeader
        title={t('home.title')}
        subtitle={t('home.subtitle')}
        actions={
          <>
            <GlossButton variant="receipt">{t('home.receipt')}</GlossButton>
            <GlossButton variant="payment">{t('home.payment')}</GlossButton>
            <GlossButton variant="accent">{t('home.newInvoice')}</GlossButton>
          </>
        }
      />

      <div className="alert-strip">
        <span className="alert-strip__dot" />
        <span>{t('common.demoBanner')}</span>
      </div>

      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="ranking-grid">
        {rankingCards.map((card) => (
          <RankingCard
            key={card.id}
            id={card.id}
            icon={card.icon}
            variant={card.variant}
            kind={card.kind}
            title={card.title}
            period={t('home.rankings.period')}
            locale={locale}
            expanded={openRanking === card.id}
            onToggle={toggleRanking}
            viewDetailsLabel={t('home.rankings.viewDetails')}
            hideDetailsLabel={t('home.rankings.hideDetails')}
            labels={rankingLabels}
            customers={card.kind === 'customers' ? card.data : undefined}
            fabrics={card.kind === 'fabrics' ? card.data : undefined}
          />
        ))}
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
          {t('home.recentInvoices')}
        </h2>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('home.invoiceNo')}</th>
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

        <div className="mobile-list">
          {recentInvoices.map((inv) => {
            const st = statusLabel(locale, inv.status)
            return (
              <div key={inv.id} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.invoice')}</span>
                  <span className="mobile-list__value">{inv.id}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.customer')}</span>
                  <span className="mobile-list__value">{inv.customer}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.amount')}</span>
                  <span className="mobile-list__value">{inv.amount}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.status')}</span>
                  <Badge variant={st.variant}>{st.text}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section-grid">
        {shortcuts.map((item) => (
          <Link key={item.to} to={item.to} className="section-link-card">
            <span className="section-link-card__icon">{item.icon}</span>
            <span className="section-link-card__title">{item.title}</span>
            <span className="section-link-card__desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
