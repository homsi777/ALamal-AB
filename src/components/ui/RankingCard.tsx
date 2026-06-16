import { formatMoney, formatMeters, formatPercent } from '../../data/rankings'
import type { CustomerRanking, FabricRanking } from '../../data/rankings'
import type { Locale } from '../../i18n/translations'

type RankingCardProps = {
  id: string
  icon: string
  variant: 'top' | 'least'
  kind: 'customers' | 'fabrics'
  title: string
  period: string
  locale: Locale
  expanded: boolean
  onToggle: (id: string) => void
  viewDetailsLabel: string
  hideDetailsLabel: string
  labels: {
    invoices: string
    meters: string
    share: string
  }
  customers?: CustomerRanking[]
  fabrics?: FabricRanking[]
}

function rankName(locale: Locale, item: CustomerRanking | FabricRanking) {
  return locale === 'ar' ? item.nameAr : item.nameEn
}

export function RankingCard({
  id,
  icon,
  variant,
  kind,
  title,
  period,
  locale,
  expanded,
  onToggle,
  viewDetailsLabel,
  hideDetailsLabel,
  labels,
  customers,
  fabrics,
}: RankingCardProps) {
  const items = kind === 'customers' ? customers! : fabrics!
  const maxPercent = Math.max(...items.map((i) => i.percent), 1)
  const topItem = items[0]
  const topName = rankName(locale, topItem)

  const preview =
    kind === 'customers'
      ? `${formatMoney((topItem as CustomerRanking).amount, locale)} · ${formatPercent(topItem.percent, locale)}`
      : `${formatMeters((topItem as FabricRanking).meters, locale)} · ${formatPercent(topItem.percent, locale)}`

  return (
    <div
      className={`ranking-card ranking-card--${variant} ${expanded ? 'ranking-card--open' : ''}`}
    >
      <button
        type="button"
        className="ranking-card__trigger"
        onClick={() => onToggle(id)}
        aria-expanded={expanded}
      >
        <span className={`ranking-card__icon ranking-card__icon--${variant}`}>{icon}</span>

        <span className="ranking-card__trigger-text">
          <span className="ranking-card__title">{title}</span>
          {!expanded && (
            <>
              <span className="ranking-card__leader">{topName}</span>
              <span className="ranking-card__preview">{preview}</span>
            </>
          )}
        </span>

        <span className="ranking-card__trigger-end">
          <span className="ranking-card__period">{period}</span>
          <span className={`ranking-card__chevron ${expanded ? 'ranking-card__chevron--open' : ''}`}>
            ▾
          </span>
          <span className="ranking-card__hint">
            {expanded ? hideDetailsLabel : viewDetailsLabel}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="ranking-card__body">
          <ul className="ranking-list">
            {items.map((item, index) => {
              const isFabric = kind === 'fabrics'
              const fabric = isFabric ? (item as FabricRanking) : null
              const customer = !isFabric ? (item as CustomerRanking) : null

              return (
                <li key={item.id} className="ranking-item">
                  <div className="ranking-item__top">
                    <div className="ranking-item__identity">
                      <span className={`ranking-item__rank ranking-item__rank--${variant}`}>
                        {index + 1}
                      </span>
                      <div className="ranking-item__info">
                        <span className="ranking-item__name">{rankName(locale, item)}</span>
                        {fabric && <span className="ranking-item__meta">{fabric.code}</span>}
                      </div>
                    </div>
                    <div className="ranking-item__amount">
                      {formatMoney(item.amount, locale)}
                    </div>
                  </div>

                  <div className="ranking-item__stats">
                    {customer && (
                      <span>{customer.invoices} {labels.invoices}</span>
                    )}
                    {fabric && <span>{formatMeters(fabric.meters, locale)}</span>}
                    <span className="ranking-item__share">
                      {labels.share}: {formatPercent(item.percent, locale)}
                    </span>
                  </div>

                  <div className="ranking-bar">
                    <div
                      className={`ranking-bar__fill ranking-bar__fill--${variant}`}
                      style={{ width: `${(item.percent / maxPercent) * 100}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
