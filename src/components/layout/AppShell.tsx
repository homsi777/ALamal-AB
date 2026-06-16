import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { NAV_ITEMS } from '../../data/mock'
import { useApp } from '../../context/AppProvider'
import { useSalesWorkflow } from '../../context/SalesWorkflowProvider'
import { MobileDrawer } from './MobileDrawer'
import { HeaderActions } from './HeaderActions'
import { SubNavDropdown } from './SubNavDropdown'
import { INVENTORY_SUB_ITEMS } from '../../data/inventoryNav'
import { INVOICES_SUB_ITEMS } from '../../data/invoicesNav'

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useApp()
  const { awaitingCount } = useSalesWorkflow()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('header.openMenu')}
          >
            ☰
          </button>

          <NavLink to="/" className="app-brand">
            <div className="app-brand__logo">AB</div>
            <div className="app-brand__text">
              <span className="app-brand__name">Alama-AB</span>
              <span className="app-brand__tag">{t('brand.tag')}</span>
            </div>
          </NavLink>

          <nav className="app-nav" aria-label={t('header.mainNav')}>
            {NAV_ITEMS.map((item) => {
              if (item.id === 'inventory') {
                return (
                  <SubNavDropdown
                    key={item.id}
                    icon={item.icon}
                    labelKey={item.labelKey}
                    basePath="/inventory"
                    items={INVENTORY_SUB_ITEMS}
                  />
                )
              }

              if (item.id === 'invoices') {
                return (
                  <SubNavDropdown
                    key={item.id}
                    icon={item.icon}
                    labelKey={item.labelKey}
                    basePath="/invoices"
                    items={INVOICES_SUB_ITEMS}
                  />
                )
              }

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`
                  }
                >
                  <span>{item.icon}</span>
                  {t(item.labelKey)}
                  {item.id === 'delivery' && awaitingCount > 0 && (
                    <span className="nav-badge" title={t('delivery.navBadge')}>
                      {awaitingCount}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="app-header__actions">
            <HeaderActions />
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
