import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { RowActions } from '../../components/ui/RowActions'
import { useInventory } from '../../context/InventoryProvider'
import { getWarehouseTotals, type WarehouseStockRow } from '../../data/warehouseStock'
import { useApp } from '../../context/AppProvider'

export function WarehousesPage() {
  const { t, locale } = useApp()
  const { warehouseRows: rows, toggleWarehouseDisabled } = useInventory()
  const [searchQuery, setSearchQuery] = useState('')

  const label = (row: WarehouseStockRow, field: 'goodsType' | 'location' | 'unit') => {
    if (field === 'goodsType') return locale === 'ar' ? row.goodsTypeAr : row.goodsTypeEn
    if (field === 'location') return locale === 'ar' ? row.locationAr : row.locationEn
    return locale === 'ar' ? row.unitAr : row.unitEn
  }

  const formatStatValue = (value: number) =>
    value.toLocaleString('en-US', { useGrouping: false })

  const formatTotalLength = (value: number) => {
    if (value === 0) return '—'
    return formatStatValue(value)
  }

  const toggleDisable = (id: string, disabled: boolean) => {
    toggleWarehouseDisabled(id, disabled)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredRows = rows.filter((row) => {
    if (!normalizedQuery) return true

    const haystack = [
      row.goodsTypeAr,
      row.goodsTypeEn,
      row.lot,
      row.locationAr,
      row.locationEn,
      row.unitAr,
      row.unitEn,
      String(row.totalLength),
      String(row.pieces),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const totals = getWarehouseTotals(rows)

  return (
    <>
      <PageHeader
        title={t('inventory.warehouses.title')}
        subtitle={t('inventory.warehouses.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('inventory.warehouses.addItem')}</GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('inventory.warehouses.searchPlaceholder')}
                aria-label={t('inventory.warehouses.searchPlaceholder')}
              />
              <GlossButton variant="ghost">{t('inventory.warehouses.addWarehouse')}</GlossButton>
            </div>
          </>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="card__title">{t('inventory.warehouses.sumLengthMeter')}</div>
          <div className="card__value">{formatStatValue(totals.lengthMeter)}</div>
        </div>
        <div className="card">
          <div className="card__title">{t('inventory.warehouses.sumLengthYard')}</div>
          <div className="card__value">{formatStatValue(totals.lengthYard)}</div>
        </div>
        <div className="card">
          <div className="card__title">{t('inventory.warehouses.sumPieces')}</div>
          <div className="card__value">{formatStatValue(totals.pieces)}</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table data-table--actions">
            <thead>
              <tr>
                <th>{t('inventory.warehouses.colGoodsType')}</th>
                <th>{t('inventory.warehouses.colPieces')}</th>
                <th>{t('inventory.warehouses.colLengths')}</th>
                <th>{t('inventory.warehouses.colUnit')}</th>
                <th>{t('inventory.warehouses.colLot')}</th>
                <th>{t('inventory.warehouses.colLocation')}</th>
                <th>{t('inventory.warehouses.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={row.disabled ? 'data-table__row--disabled' : ''}>
                  <td>{label(row, 'goodsType')}</td>
                  <td>{row.pieces}</td>
                  <td className="data-table__number">{formatTotalLength(row.totalLength)}</td>
                  <td>{label(row, 'unit')}</td>
                  <td><span className="lot-badge">{row.lot}</span></td>
                  <td>{label(row, 'location')}</td>
                  <td>
                    <RowActions
                      disabled={row.disabled}
                      editLabel={t('inventory.warehouses.actionEdit')}
                      disableLabel={t('inventory.warehouses.actionDisable')}
                      enableLabel={t('inventory.warehouses.actionEnable')}
                      onEdit={() => undefined}
                      onDisable={() => toggleDisable(row.id, true)}
                      onEnable={() => toggleDisable(row.id, false)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className={`mobile-list__item ${row.disabled ? 'mobile-list__item--disabled' : ''}`}
            >
              <div className="mobile-list__row">
                <span className="mobile-list__value">{label(row, 'goodsType')}</span>
                <span className="lot-badge">{row.lot}</span>
              </div>
              <div className="mobile-list__row">
                <span className="mobile-list__label">{t('inventory.warehouses.colPieces')}</span>
                <span className="mobile-list__value">{row.pieces}</span>
              </div>
              <div className="mobile-list__row">
                <span className="mobile-list__label">{t('inventory.warehouses.colLengths')}</span>
                <span className="mobile-list__value">{formatTotalLength(row.totalLength)}</span>
              </div>
              <div className="mobile-list__row">
                <span className="mobile-list__label">{t('inventory.warehouses.colUnit')}</span>
                <span className="mobile-list__value">{label(row, 'unit')}</span>
              </div>
              <div className="mobile-list__row">
                <span className="mobile-list__label">{t('inventory.warehouses.colLocation')}</span>
                <span className="mobile-list__value">{label(row, 'location')}</span>
              </div>
              <RowActions
                disabled={row.disabled}
                editLabel={t('inventory.warehouses.actionEdit')}
                disableLabel={t('inventory.warehouses.actionDisable')}
                enableLabel={t('inventory.warehouses.actionEnable')}
                onEdit={() => undefined}
                onDisable={() => toggleDisable(row.id, true)}
                onEnable={() => toggleDisable(row.id, false)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
