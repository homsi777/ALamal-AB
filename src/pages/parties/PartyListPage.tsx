import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import {
  formatPartyMoney,
  getPartiesByType,
  getPartyTotals,
  type PartyRecord,
  type PartyStatus,
} from '../../data/parties'
import { useApp } from '../../context/AppProvider'
import { useNavigate } from 'react-router-dom'

type PartyListPageProps = {
  type: 'customer' | 'supplier'
}

type StatusFilter = 'all' | PartyStatus

export function PartyListPage({ type }: PartyListPageProps) {
  const { t, locale } = useApp()
  const prefix = type === 'customer' ? 'parties.customersRegister' : 'parties.suppliersRegister'
  const formPath = type === 'customer' ? '/parties/customers' : '/parties/suppliers'
  const statementPath = type === 'customer' ? '/parties/customers/statement' : '/parties/suppliers/statement'
  const navigate = useNavigate()

  const [parties, setParties] = useState<PartyRecord[]>(getPartiesByType(type))
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const partyName = (party: PartyRecord) => (locale === 'ar' ? party.nameAr : party.nameEn)
  const partyCity = (party: PartyRecord) => (locale === 'ar' ? party.cityAr : party.cityEn)

  const statusMap: Record<PartyStatus, { text: string; variant: 'success' | 'neutral' }> = {
    active: { text: t('parties.statusActive'), variant: 'success' },
    inactive: { text: t('parties.statusInactive'), variant: 'neutral' },
  }

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: t('parties.filterAll') },
    { id: 'active', label: t('parties.statusActive') },
    { id: 'inactive', label: t('parties.statusInactive') },
  ]

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredParties = parties.filter((party) => {
    if (statusFilter !== 'all' && party.status !== statusFilter) return false
    if (!normalizedQuery) return true

    const haystack = [
      party.id,
      party.nameAr,
      party.nameEn,
      party.phone,
      party.cityAr,
      party.cityEn,
      String(party.balance),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const totals = useMemo(() => getPartyTotals(parties), [parties])

  const removeParty = (id: string) => {
    setParties((prev) => prev.filter((party) => party.id !== id))
  }

  return (
    <>
      <PageHeader
        title={t(`${prefix}.title`)}
        subtitle={t(`${prefix}.subtitle`)}
        actions={
          <>
            <GlossButton variant="accent" onClick={() => navigate(formPath)}>
              {t(`${prefix}.new`)}
            </GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t(`${prefix}.searchPlaceholder`)}
                aria-label={t(`${prefix}.searchPlaceholder`)}
              />
            </div>
          </>
        }
      />

      <div className="stat-grid stat-grid--4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card card--accent-info">
          <div className="card__title">{t(`${prefix}.kpiCount`)}</div>
          <div className="card__value">{totals.count}</div>
        </div>
        <div className="card card--accent-success">
          <div className="card__title">{t(`${prefix}.kpiActive`)}</div>
          <div className="card__value">{totals.active}</div>
        </div>
        <div className="card card--accent-warning">
          <div className="card__title">{t(`${prefix}.kpiWithBalance`)}</div>
          <div className="card__value">{totals.withBalance}</div>
        </div>
        <div className="card card--accent-gold">
          <div className="card__title">{t(`${prefix}.kpiBalance`)}</div>
          <div className="card__value card__value--sm">
            {formatPartyMoney(totals.totalBalance, 'usd')}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="filter-chips filter-chips--invoices" role="group" aria-label={t('parties.filterLabel')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`filter-chip filter-chip--invoices ${statusFilter === filter.id ? 'filter-chip--active' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="card-toolbar__hint">
            {t('parties.showing').replace('{count}', String(filteredParties.length))}
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('parties.colCode')}</th>
                <th>{t('common.name')}</th>
                <th>{t('parties.form.city')}</th>
                <th>{t('common.phone')}</th>
                <th>{t('common.balance')}</th>
                <th>{t('parties.colInvoices')}</th>
                <th>{t('common.status')}</th>
                <th>{t('parties.colLastActivity')}</th>
                <th>{t('parties.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.map((party) => {
                const st = statusMap[party.status]
                return (
                  <tr key={party.id}>
                    <td><span className="category-code">{party.id}</span></td>
                    <td><strong>{partyName(party)}</strong></td>
                    <td>{partyCity(party)}</td>
                    <td>{party.phone}</td>
                    <td className="data-table__number">{formatPartyMoney(party.balance, party.currency)}</td>
                    <td className="data-table__number">{party.invoiceCount}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{party.lastActivity}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="action-btn action-btn--edit"
                          title={t('parties.actionStatement')}
                          onClick={() => navigate(`${statementPath}?party=${party.id}`)}
                        >
                          📄
                        </button>
                        <button
                          type="button"
                          className="action-btn action-btn--edit"
                          title={t('parties.actionEdit')}
                          onClick={() => navigate(formPath)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="action-btn action-btn--disable"
                          title={t('parties.actionDelete')}
                          onClick={() => removeParty(party.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
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
