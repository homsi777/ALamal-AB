import { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppProvider'

export function HeaderActions() {
  const {
    theme,
    locale,
    toggleTheme,
    toggleLocale,
    t,
    notificationsOpen,
    setNotificationsOpen,
    unreadCount,
    markAllRead,
  } = useApp()

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notificationsOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationsOpen, setNotificationsOpen])

  const notifications = [
    { id: '1', key: 'notifications.lowStock', time: '10m' },
    { id: '2', key: 'notifications.overdue', time: '1h' },
    { id: '3', key: 'notifications.shipment', time: '3h' },
  ]

  return (
    <div className="header-actions">
      <button
        type="button"
        className="toolbar-btn"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? t('header.themeDark') : t('header.themeLight')}
        title={theme === 'light' ? t('header.themeDark') : t('header.themeLight')}
      >
        <span className="toolbar-btn__icon" aria-hidden>{theme === 'light' ? '🌙' : '☀️'}</span>
        <span className="toolbar-btn__label">
          {theme === 'light' ? t('header.themeDark') : t('header.themeLight')}
        </span>
      </button>

      <div className="notifications-wrap" ref={panelRef}>
        <button
          type="button"
          className={`toolbar-btn ${notificationsOpen ? 'toolbar-btn--active' : ''}`}
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          aria-label={t('header.notifications')}
          aria-expanded={notificationsOpen}
        >
          <span className="toolbar-btn__icon toolbar-btn__icon--bell" aria-hidden>🔔</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
          <span className="toolbar-btn__label">{t('header.notifications')}</span>
        </button>

        {notificationsOpen && (
          <div className="notifications-panel">
            <div className="notifications-panel__header">
              <strong>{t('header.notifications')}</strong>
              {unreadCount > 0 && (
                <button type="button" className="notifications-panel__mark" onClick={markAllRead}>
                  {t('header.markAllRead')}
                </button>
              )}
            </div>
            <div className="notifications-panel__list">
              {unreadCount === 0 ? (
                <p className="notifications-panel__empty">{t('header.noNotifications')}</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="notifications-panel__item">
                    <div className="notifications-panel__item-title">
                      {t(`${n.key}.title`)}
                    </div>
                    <div className="notifications-panel__item-body">
                      {t(`${n.key}.body`)}
                    </div>
                    <div className="notifications-panel__item-time">{n.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="toolbar-btn toolbar-btn--lang"
        onClick={toggleLocale}
        aria-label={t('header.language')}
        title={t('header.language')}
      >
        <span className="toolbar-btn__lang-code">
          {locale === 'ar' ? 'EN' : 'ع'}
        </span>
        <span className="toolbar-btn__label">
          {locale === 'ar' ? t('header.switchToEn') : t('header.switchToAr')}
        </span>
      </button>
    </div>
  )
}
