import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../data/mock'
import { INVENTORY_SUB_ITEMS } from '../../data/inventoryNav'
import { INVOICES_SUB_ITEMS } from '../../data/invoicesNav'
import { useApp } from '../../context/AppProvider'
import type { SubNavItem } from './SubNavDropdown'

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
}

function DrawerSubmenu({
  item,
  subItems,
  isSectionActive,
  onClose,
}: {
  item: (typeof NAV_ITEMS)[number]
  subItems: SubNavItem[]
  isSectionActive: boolean
  onClose: () => void
}) {
  const { t } = useApp()
  const [open, setOpen] = useState(isSectionActive)

  return (
    <div className={`drawer-submenu ${open ? 'drawer-submenu--open' : ''}`}>
      <button
        type="button"
        className={`mobile-drawer__link mobile-drawer__link--parent ${isSectionActive ? 'mobile-drawer__link--active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
      >
        <span className="mobile-drawer__icon">{item.icon}</span>
        {t(item.labelKey)}
        <span className={`drawer-submenu__arrow ${open ? 'drawer-submenu__arrow--open' : ''}`}>▾</span>
      </button>
      <div className="drawer-submenu__panel">
        <div className="drawer-submenu__inner">
          {subItems.map((sub) => (
            <NavLink
              key={sub.id}
              to={sub.path}
              end={sub.end}
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

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { t } = useApp()
  const location = useLocation()
  const inventoryActive = location.pathname.startsWith('/inventory')
  const invoicesActive = location.pathname.startsWith('/invoices')

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
                <DrawerSubmenu
                  key={item.id}
                  item={item}
                  subItems={INVENTORY_SUB_ITEMS}
                  isSectionActive={inventoryActive}
                  onClose={onClose}
                />
              )
            }

            if (item.id === 'invoices') {
              return (
                <DrawerSubmenu
                  key={item.id}
                  item={item}
                  subItems={INVOICES_SUB_ITEMS}
                  isSectionActive={invoicesActive}
                  onClose={onClose}
                />
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
