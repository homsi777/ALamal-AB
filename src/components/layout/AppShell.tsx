import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { NAV_ITEMS } from '../../data/mock'
import { useApp } from '../../context/AppProvider'
import { MobileDrawer } from './MobileDrawer'
import { HeaderActions } from './HeaderActions'
import { InventoryNavDropdown } from './InventoryNavDropdown'

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useApp()

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
            {NAV_ITEMS.map((item) =>
              item.id === 'inventory' ? (
                <InventoryNavDropdown key={item.id} icon={item.icon} labelKey={item.labelKey} />
              ) : (
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
                </NavLink>
              ),
            )}
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
