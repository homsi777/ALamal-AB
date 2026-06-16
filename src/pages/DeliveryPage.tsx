import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { deliveryOrders, statusLabel } from '../data/mock'
import { useApp } from '../context/AppProvider'

export function DeliveryPage() {
  const { t, locale } = useApp()

  return (
    <>
      <PageHeader
        title={t('delivery.title')}
        subtitle={t('delivery.subtitle')}
        actions={<GlossButton variant="accent">{t('delivery.newOrder')}</GlossButton>}
      />

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('delivery.number')}</th>
                <th>{t('common.customer')}</th>
                <th>{t('common.address')}</th>
                <th>{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {deliveryOrders.map((d) => {
                const st = statusLabel(locale, d.status)
                return (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.customer}</td>
                    <td>{d.address}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {deliveryOrders.map((d) => {
            const st = statusLabel(locale, d.status)
            return (
              <div key={d.id} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="mobile-list__value">{d.id}</span>
                  <Badge variant={st.variant}>{st.text}</Badge>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.customer')}</span>
                  <span className="mobile-list__value">{d.customer}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.address')}</span>
                  <span className="mobile-list__value">{d.address}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
