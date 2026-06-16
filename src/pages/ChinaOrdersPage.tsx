import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { chinaOrders, statusLabel } from '../data/mock'
import { useApp } from '../context/AppProvider'

export function ChinaOrdersPage() {
  const { t, locale } = useApp()

  return (
    <>
      <PageHeader
        title={t('china.title')}
        subtitle={t('china.subtitle')}
        actions={<GlossButton variant="accent">{t('china.newOrder')}</GlossButton>}
      />

      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card"><div className="card__title">{t('china.activeOrders')}</div><div className="card__value">7</div></div>
        <div className="card"><div className="card__title">{t('china.inShipping')}</div><div className="card__value">3</div></div>
        <div className="card"><div className="card__title">{t('china.ordersValue')}</div><div className="card__value">45K $</div></div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('china.orderNo')}</th>
                <th>{t('common.supplier')}</th>
                <th>{t('common.items')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.eta')}</th>
              </tr>
            </thead>
            <tbody>
              {chinaOrders.map((o) => {
                const st = statusLabel(locale, o.status)
                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.supplier}</td>
                    <td>{o.items}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{o.eta}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {chinaOrders.map((o) => {
            const st = statusLabel(locale, o.status)
            return (
              <div key={o.id} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="mobile-list__value">{o.id}</span>
                  <Badge variant={st.variant}>{st.text}</Badge>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.supplier')}</span>
                  <span className="mobile-list__value">{o.supplier}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.eta')}</span>
                  <span className="mobile-list__value">{o.eta}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
