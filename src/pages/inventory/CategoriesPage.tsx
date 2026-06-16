import { Fragment, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { RowActions } from '../../components/ui/RowActions'
import { categoryPath, groupCategoriesByRoll } from '../../data/categories'
import { useInventory } from '../../context/InventoryProvider'
import { useApp } from '../../context/AppProvider'

export function CategoriesPage() {
  const { t, locale } = useApp()
  const { categories, toggleCategoryDisabled } = useInventory()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>('كتان F12::F12')

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const rollGroups = groupCategoriesByRoll(categories)

  const filteredGroups = rollGroups.filter((group) => {
    if (!normalizedQuery) return true

    const haystack = [
      group.goodsTypeAr,
      group.goodsTypeEn,
      group.rollCode,
      ...group.colors.flatMap((color) => [
        color.colorAr,
        color.colorEn,
        color.colorCode,
      ]),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  const activeCategories = categories.filter((category) => !category.disabled)
  const activeRolls = rollGroups.filter((group) => group.colors.some((color) => !color.disabled)).length
  const maxColorsInRoll = rollGroups.reduce(
    (max, group) => Math.max(max, group.colors.filter((color) => !color.disabled).length),
    0,
  )

  const goodsLabel = (group: (typeof rollGroups)[number]) =>
    locale === 'ar' ? group.goodsTypeAr : group.goodsTypeEn

  const colorLabel = (color: (typeof categories)[number]) =>
    locale === 'ar' ? color.colorAr : color.colorEn

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const steps = [
    { id: 1, label: t('inventory.categories.stepGoodsType'), required: true, example: t('inventory.categories.exampleGoodsType') },
    { id: 2, label: t('inventory.categories.stepRollCode'), required: true, example: t('inventory.categories.exampleRollCode') },
    { id: 3, label: t('inventory.categories.stepColor'), required: true, example: t('inventory.categories.exampleColor') },
    { id: 4, label: t('inventory.categories.stepColorCode'), required: false, example: t('inventory.categories.exampleColorCode') },
  ]

  return (
    <>
      <PageHeader
        title={t('inventory.categories.title')}
        subtitle={t('inventory.categories.subtitle')}
        actions={
          <>
            <GlossButton variant="accent">{t('inventory.categories.addRoll')}</GlossButton>
            <GlossButton variant="ghost">{t('inventory.categories.addColor')}</GlossButton>
            <div className="page-header__search-group">
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('inventory.categories.searchPlaceholder')}
                aria-label={t('inventory.categories.searchPlaceholder')}
              />
            </div>
          </>
        }
      />

      <div className="classification-banner">
        <div className="classification-banner__title">{t('inventory.categories.ladderTitle')}</div>
        <p className="classification-banner__desc">{t('inventory.categories.ladderDesc')}</p>
        <div className="classification-ladder" aria-label={t('inventory.categories.ladderTitle')}>
          {steps.map((step, index) => (
            <div key={step.id} className="classification-ladder__group">
              <div className={`classification-step ${step.required ? 'classification-step--required' : 'classification-step--optional'}`}>
                <span className="classification-step__index">{step.id}</span>
                <span className="classification-step__label">{step.label}</span>
                <span className="classification-step__example">{step.example}</span>
                <span className="classification-step__badge">
                  {step.required ? t('inventory.categories.required') : t('inventory.categories.optionalField')}
                </span>
              </div>
              {index < steps.length - 1 && <span className="classification-ladder__arrow" aria-hidden="true">←</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="stat-grid stat-grid--3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card card--accent-neutral">
          <div className="card__title">{t('inventory.categories.totalRolls')}</div>
          <div className="card__value">{activeRolls}</div>
        </div>
        <div className="card card--accent-info">
          <div className="card__title">{t('inventory.categories.totalColors')}</div>
          <div className="card__value">{activeCategories.length}</div>
        </div>
        <div className="card card--accent-success">
          <div className="card__title">{t('inventory.categories.maxColorsExample')}</div>
          <div className="card__value">{maxColorsInRoll}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <span className="card-toolbar__hint">{t('inventory.categories.tableHint')}</span>
        </div>

        <div className="table-wrap">
          <table className="data-table data-table--actions data-table--expandable">
            <thead>
              <tr>
                <th>{t('inventory.categories.colGoodsType')}</th>
                <th>{t('inventory.categories.colRollCode')}</th>
                <th>{t('inventory.categories.colColorCount')}</th>
                <th>{t('inventory.categories.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => {
                const activeColors = group.colors.filter((color) => !color.disabled)
                const isExpanded = expandedId === group.id

                return (
                  <Fragment key={group.id}>
                    <tr className={isExpanded ? 'data-table__row--expanded' : ''}>
                      <td>{goodsLabel(group)}</td>
                      <td>
                        <button
                          type="button"
                          className="data-table__expand-btn"
                          aria-expanded={isExpanded}
                          aria-label={t('inventory.categories.toggleColors')}
                          onClick={() => toggleExpanded(group.id)}
                        >
                          <span className={`data-table__chevron ${isExpanded ? 'data-table__chevron--open' : ''}`}>
                            ▾
                          </span>
                          <span className="category-code">{group.rollCode}</span>
                        </button>
                      </td>
                      <td className="data-table__number">
                        <span className="color-count-badge">{activeColors.length}</span>
                      </td>
                      <td>
                        <GlossButton variant="ghost" size="sm">{t('inventory.categories.addColor')}</GlossButton>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="data-table__detail-row">
                        <td colSpan={4}>
                          <div className="category-colors-detail">
                            <div className="category-colors-detail__head">
                              <span>{t('inventory.categories.colorsTitle')}</span>
                              <span className="category-colors-detail__meta">
                                {goodsLabel(group)} · {group.rollCode}
                              </span>
                            </div>
                            <table className="data-table data-table--nested">
                              <thead>
                                <tr>
                                  <th>{t('inventory.categories.colColor')}</th>
                                  <th>{t('inventory.categories.colColorCode')}</th>
                                  <th>{t('inventory.categories.colPath')}</th>
                                  <th>{t('inventory.categories.colActions')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.colors.map((color) => (
                                  <tr key={color.id} className={color.disabled ? 'data-table__row--disabled' : ''}>
                                    <td>{colorLabel(color)}</td>
                                    <td>
                                      {color.colorCode.trim() ? (
                                        <span className="category-code category-code--soft">{color.colorCode}</span>
                                      ) : (
                                        <span className="category-empty">{t('inventory.categories.emptyColorCode')}</span>
                                      )}
                                    </td>
                                    <td>
                                      <span className="category-path">{categoryPath(color, locale)}</span>
                                    </td>
                                    <td>
                                      <RowActions
                                        disabled={color.disabled}
                                        editLabel={t('inventory.categories.actionEdit')}
                                        disableLabel={t('inventory.categories.actionDisable')}
                                        enableLabel={t('inventory.categories.actionEnable')}
                                        onEdit={() => undefined}
                                        onDisable={() => toggleCategoryDisabled(color.id, true)}
                                        onEnable={() => toggleCategoryDisabled(color.id, false)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filteredGroups.map((group) => {
            const activeColors = group.colors.filter((color) => !color.disabled)
            const isExpanded = expandedId === group.id

            return (
              <div key={group.id} className="mobile-list__item">
                <button
                  type="button"
                  className="mobile-list__expand-trigger"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(group.id)}
                >
                  <div className="mobile-list__row">
                    <span className="mobile-list__value">{goodsLabel(group)}</span>
                    <span className="category-code">{group.rollCode}</span>
                  </div>
                  <div className="mobile-list__row">
                    <span className="mobile-list__label">{t('inventory.categories.colColorCount')}</span>
                    <span className="color-count-badge">{activeColors.length}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="category-colors-detail category-colors-detail--mobile">
                    {group.colors.map((color) => (
                      <div key={color.id} className={`category-colors-detail__line ${color.disabled ? 'mobile-list__item--disabled' : ''}`}>
                        <div className="mobile-list__row">
                          <span className="mobile-list__value">{colorLabel(color)}</span>
                          <span className="category-code category-code--soft">
                            {color.colorCode.trim() || t('inventory.categories.emptyColorCode')}
                          </span>
                        </div>
                        <RowActions
                          disabled={color.disabled}
                          editLabel={t('inventory.categories.actionEdit')}
                          disableLabel={t('inventory.categories.actionDisable')}
                          enableLabel={t('inventory.categories.actionEnable')}
                          onEdit={() => undefined}
                          onDisable={() => toggleCategoryDisabled(color.id, true)}
                          onEnable={() => toggleCategoryDisabled(color.id, false)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
