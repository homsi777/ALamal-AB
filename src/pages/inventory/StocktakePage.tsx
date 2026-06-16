import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { useApp } from '../../context/AppProvider'

const sessions = [
  { id: 'ST-2026-03', warehouse: 'مستودع رئيسي', items: 156, diff: 2, status: 'open', date: '2026-06-17' },
  { id: 'ST-2026-02', warehouse: 'فرع حلب', items: 89, diff: 0, status: 'closed', date: '2026-06-01' },
  { id: 'ST-2026-01', warehouse: 'مستودع رئيسي', items: 150, diff: -3, status: 'closed', date: '2026-05-15' },
]

export function StocktakePage() {
  const { t } = useApp()

  const statusMap: Record<string, { text: string; variant: 'success' | 'warning' }> = {
    open: { text: t('inventory.stocktake.statusOpen'), variant: 'warning' },
    closed: { text: t('inventory.stocktake.statusClosed'), variant: 'success' },
  }

  return (
    <>
      <PageHeader
        title={t('inventory.stocktake.title')}
        subtitle={t('inventory.stocktake.subtitle')}
        actions={<GlossButton variant="accent">{t('inventory.stocktake.new')}</GlossButton>}
      />

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('inventory.stocktake.number')}</th>
                <th>{t('inventory.warehouses.single')}</th>
                <th>{t('common.items')}</th>
                <th>{t('inventory.stocktake.diff')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const st = statusMap[s.status]
                return (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.warehouse}</td>
                    <td>{s.items}</td>
                    <td>{s.diff}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{s.date}</td>
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
