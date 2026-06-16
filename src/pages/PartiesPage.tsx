import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { Badge } from '../components/ui/Badge'
import { parties, statusLabel } from '../data/mock'
import { useApp } from '../context/AppProvider'

export function PartiesPage() {
  const { t, locale } = useApp()

  return (
    <>
      <PageHeader
        title={t('parties.title')}
        subtitle={t('parties.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('parties.addCustomer')}</GlossButton>
            <GlossButton variant="ghost">{t('parties.addSupplier')}</GlossButton>
          </>
        }
      />

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('common.type')}</th>
                <th>{t('common.balance')}</th>
                <th>{t('common.phone')}</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((p) => {
                const st = statusLabel(locale, p.type)
                return (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{p.balance}</td>
                    <td>{p.phone}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {parties.map((p) => {
            const st = statusLabel(locale, p.type)
            return (
              <div key={p.name} className="mobile-list__item">
                <div className="mobile-list__row">
                  <span className="mobile-list__value">{p.name}</span>
                  <Badge variant={st.variant}>{st.text}</Badge>
                </div>
                <div className="mobile-list__row">
                  <span className="mobile-list__label">{t('common.balance')}</span>
                  <span className="mobile-list__value">{p.balance}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
