import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translate, type Locale, type Theme } from '../i18n/translations'

type AppContextValue = {
  theme: Theme
  locale: Locale
  toggleTheme: () => void
  toggleLocale: () => void
  t: (key: string) => string
  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
  unreadCount: number
  markAllRead: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function readStoredTheme(): Theme {
  const stored = localStorage.getItem('alama-theme')
  return stored === 'dark' ? 'dark' : 'light'
}

function readStoredLocale(): Locale {
  const stored = localStorage.getItem('alama-locale')
  return stored === 'en' ? 'en' : 'ar'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  const [locale, setLocale] = useState<Locale>(readStoredLocale)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    root.setAttribute('lang', locale)
    localStorage.setItem('alama-theme', theme)
    localStorage.setItem('alama-locale', locale)

    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'light' ? '#ffffff' : '#0f1419')
  }, [theme, locale])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  const t = useCallback((key: string) => translate(locale, key), [locale])

  const markAllRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      locale,
      toggleTheme,
      toggleLocale,
      t,
      notificationsOpen,
      setNotificationsOpen,
      unreadCount,
      markAllRead,
    }),
    [theme, locale, toggleTheme, toggleLocale, t, notificationsOpen, unreadCount, markAllRead],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
