import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'

export type SubNavItem = {
  id: string
  path: string
  icon: string
  labelKey: string
  end?: boolean
}

type SubNavDropdownProps = {
  icon: ReactNode
  labelKey: string
  basePath: string
  items: SubNavItem[]
}

type MenuPosition = {
  top: number
  left: number
  right: number | null
  minWidth: number
}

export function SubNavDropdown({ icon, labelKey, basePath, items }: SubNavDropdownProps) {
  const { t } = useApp()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = location.pathname.startsWith(basePath)

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const isRtl = document.documentElement.dir === 'rtl'
    setMenuPos({
      top: rect.bottom + 6,
      left: isRtl ? 0 : rect.left,
      right: isRtl ? window.innerWidth - rect.right : null,
      minWidth: Math.max(rect.width, 240),
    })
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null)
      return
    }

    updateMenuPosition()

    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open, updateMenuPosition])

  useEffect(() => {
    if (!open) return

    function handleOutside(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleOutside)
    }, 0)

    document.addEventListener('keydown', handleEscape)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('click', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen((v) => !v)
  }

  const menu = open && menuPos
    ? createPortal(
        <div
          ref={menuRef}
          className="nav-dropdown__menu nav-dropdown__menu--portal nav-dropdown__menu--open"
          role="menu"
          style={{
            top: menuPos.top,
            left: menuPos.right === null ? menuPos.left : undefined,
            right: menuPos.right ?? undefined,
            minWidth: menuPos.minWidth,
          }}
        >
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.end}
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
        </div>,
        document.body,
      )
    : null

  return (
    <>
      <div className={`nav-dropdown ${open ? 'nav-dropdown--open' : ''} ${isActive ? 'nav-dropdown--active' : ''}`}>
        <button
          ref={triggerRef}
          type="button"
          className={`app-nav__link nav-dropdown__trigger ${isActive ? 'app-nav__link--active' : ''}`}
          onClick={toggleOpen}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {icon}
          {t(labelKey)}
          <span className={`nav-dropdown__arrow ${open ? 'nav-dropdown__arrow--open' : ''}`}>▾</span>
        </button>
      </div>
      {menu}
    </>
  )
}
