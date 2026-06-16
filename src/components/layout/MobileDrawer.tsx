import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../data/mock'
import { INVENTORY_SUB_ITEMS } from '../../data/inventoryNav'
import { useApp } from '../../context/AppProvider'

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { t } = useApp()
  const location = useLocation()
  const inventoryActive = location.pathname.startsWith('/inventory')
  const [inventoryOpen, setInventoryOpen] = useState(inventoryActive)

  return (
    <>
      <div
        className={`drawer-overlay ${open ? 'drawer-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`mobile-drawer ${open ? 'mobile-drawer--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-drawer__header">
          <div className="app-brand">
            <div className="app-brand__logo">AB</div>
            <span className="app-brand__name">Alama-AB</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('header.closeMenu')}>
            ✕
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          {NAV_ITEMS.map((item) => {
            if (item.id === 'inventory') {
              return (
                <div key={item.id} className={`drawer-submenu ${inventoryOpen ? 'drawer-submenu--open' : ''}`}>
                  <button
                    type="button"
                    className={`mobile-drawer__link mobile-drawer__link--parent ${inventoryActive ? 'mobile-drawer__link--active' : ''}`}
                    onClick={() => setInventoryOpen((v) => !v)}
                    aria-expanded={inventoryOpen}
                  >
                    <span className="mobile-drawer__icon">{item.icon}</span>
                    {t(item.labelKey)}
                    <span className={`drawer-submenu__arrow ${inventoryOpen ? 'drawer-submenu__arrow--open' : ''}`}>▾</span>
                  </button>
                  <div className="drawer-submenu__panel">
                    <div className="drawer-submenu__inner">
                      {INVENTORY_SUB_ITEMS.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.path}
                          className={({ isActive }) =>
                            `mobile-drawer__link mobile-drawer__link--sub ${isActive ? 'mobile-drawer__link--active' : ''}`
                          }
                          onClick={onClose}
                        >
                          <span className="mobile-drawer__icon">{sub.icon}</span>
                          {t(sub.labelKey)}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
                }
                onClick={onClose}
              >
                <span className="mobile-drawer__icon">{item.icon}</span>
                {t(item.labelKey)}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
