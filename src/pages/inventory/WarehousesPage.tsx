import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { inventoryItems, statusLabel } from '../../data/mock'
import { useApp } from '../../context/AppProvider'

export function WarehousesPage() {
  const { t, locale } = useApp()

  return (
    <>
      <PageHeader
        title={t('inventory.warehouses.title')}
        subtitle={t('inventory.warehouses.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('inventory.addFabric')}</GlossButton>
            <GlossButton variant="ghost">{t('inventory.warehouses.addWarehouse')}</GlossButton>
          </>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card"><div className="card__title">{t('inventory.totalItems')}</div><div className="card__value">156</div></div>
        <div className="card"><div className="card__title">{t('inventory.warehouses.count')}</div><div className="card__value">3</div></div>
        <div className="card"><div className="card__title">{t('inventory.stockValue')}</div><div className="card__value">284K $</div></div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.code')}</th>
                <th>{t('common.name')}</th>
                <th>{t('common.color')}</th>
                <th>{t('common.qty')}</th>
                <th>{t('common.unit')}</th>
                <th>{t('inventory.warehouses.location')}</th>
                <th>{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => {
                const st = statusLabel(locale, item.status)
                return (
                  <tr key={item.code}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.color}</td>
                    <td>{item.qty}</td>
                    <td>{item.unit}</td>
                    <td>{t('inventory.warehouses.main')}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {inventoryItems.map((item) => {
            const st = statusLabel(locale, item.status)
            return (
              <div key={item.code} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{item.code}</span>
                  <Badge variant={st.variant}>{st.text}</Badge>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.name')}</span>
                  <span className="mobile-list__value">{item.name}</span>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.qty')}</span>
                  <span className="mobile-list__value">{item.qty} {item.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
