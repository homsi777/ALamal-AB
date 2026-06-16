import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { INVENTORY_SUB_ITEMS } from '../../data/inventoryNav'
import { useApp } from '../../context/AppProvider'

type InventoryNavDropdownProps = {
  icon: string
  labelKey: string
}

export function InventoryNavDropdown({ icon, labelKey }: InventoryNavDropdownProps) {
  const { t } = useApp()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const isActive = location.pathname.startsWith('/inventory')

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <div
      ref={wrapRef}
      className={`nav-dropdown ${open ? 'nav-dropdown--open' : ''} ${isActive ? 'nav-dropdown--active' : ''}`}
    >
      <button
        type="button"
        className={`app-nav__link nav-dropdown__trigger ${isActive ? 'app-nav__link--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{icon}</span>
        {t(labelKey)}
        <span className={`nav-dropdown__arrow ${open ? 'nav-dropdown__arrow--open' : ''}`}>▾</span>
      </button>

      <div className="nav-dropdown__menu" role="menu">
        {INVENTORY_SUB_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            role="menuitem"
            className={({ isActive: subActive }) =>
              `nav-dropdown__item ${subActive ? 'nav-dropdown__item--active' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            <span className="nav-dropdown__item-icon">{item.icon}</span>
            <span className="nav-dropdown__item-label">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
