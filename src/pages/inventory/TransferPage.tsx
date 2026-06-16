import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { useApp } from '../../context/AppProvider'

const transfers = [
  { id: 'TR-102', from: 'مستودع رئيسي', to: 'مستودع فرع حلب', items: 4, status: 'completed', date: '2026-06-16' },
  { id: 'TR-101', from: 'مستودع رئيسي', to: 'مستودع فرع دمشق', items: 2, status: 'pending', date: '2026-06-17' },
  { id: 'TR-100', from: 'مستودع فرع حلب', to: 'مستودع رئيسي', items: 1, status: 'transit', date: '2026-06-15' },
]

export function TransferPage() {
  const { t } = useApp()

  const statusMap: Record<string, { text: string; variant: 'success' | 'warning' | 'info' }> = {
    completed: { text: t('inventory.transfer.statusCompleted'), variant: 'success' },
    pending: { text: t('inventory.transfer.statusPending'), variant: 'warning' },
    transit: { text: t('inventory.transfer.statusTransit'), variant: 'info' },
  }

  return (
    <>
      <PageHeader
        title={t('inventory.transfer.title')}
        subtitle={t('inventory.transfer.subtitle')}
        actions={<GlossButton variant="accent">{t('inventory.transfer.new')}</GlossButton>}
      />

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('inventory.transfer.number')}</th>
                <th>{t('inventory.transfer.from')}</th>
                <th>{t('inventory.transfer.to')}</th>
                <th>{t('common.items')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((tr) => {
                const st = statusMap[tr.status]
                return (
                  <tr key={tr.id}>
                    <td>{tr.id}</td>
                    <td>{tr.from}</td>
                    <td>{tr.to}</td>
                    <td>{tr.items}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{tr.date}</td>
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
