import { translate, type Locale } from '../i18n/translations'

export type NavItem = {
  id: string
  path: string
  icon: string
  labelKey: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', path: '/', icon: '🏠', labelKey: 'nav.home' },
  { id: 'inventory', path: '/inventory', icon: '📦', labelKey: 'nav.inventory' },
  { id: 'invoices', path: '/invoices', icon: '🧾', labelKey: 'nav.invoices' },
  { id: 'parties', path: '/parties', icon: '👥', labelKey: 'nav.parties' },
  { id: 'finance', path: '/finance', icon: '💰', labelKey: 'nav.finance' },
  { id: 'delivery', path: '/delivery', icon: '🚚', labelKey: 'nav.delivery' },
  { id: 'china', path: '/china-orders', icon: '🇨🇳', labelKey: 'nav.china' },
  { id: 'reports', path: '/reports', icon: '📊', labelKey: 'nav.reports' },
  { id: 'settings', path: '/settings', icon: '⚙️', labelKey: 'nav.settings' },
]

export const recentInvoices = [
  { id: 'INV-1042', customer: 'محل الأناقة', amount: '3,200 $', status: 'paid', date: '2026-06-17' },
  { id: 'INV-1041', customer: 'خياطة الرافدين', amount: '1,850 $', status: 'partial', date: '2026-06-16' },
  { id: 'INV-1040', customer: 'مؤسسة النور', amount: '5,400 $', status: 'pending', date: '2026-06-16' },
  { id: 'INV-1039', customer: 'بوتيك ليلى', amount: '920 $', status: 'paid', date: '2026-06-15' },
]

export const inventoryItems = [
  { code: 'FB-001', name: 'قطن مصري — أبيض', color: 'أبيض', qty: 1250, unit: 'م', status: 'ok' },
  { code: 'FB-002', name: 'حرير طبيعي — ذهبي', color: 'ذهبي', qty: 85, unit: 'م', status: 'low' },
  { code: 'FB-003', name: 'شيفون — وردي', color: 'وردي', qty: 420, unit: 'م', status: 'ok' },
  { code: 'FB-004', name: 'دانتيل — أسود', color: 'أسود', qty: 0, unit: 'م', status: 'out' },
  { code: 'FB-005', name: 'كتان — بيج', color: 'بيج', qty: 680, unit: 'م', status: 'ok' },
]

export const chinaOrders = [
  { id: 'CN-2026-07', supplier: 'Guangzhou Textile Co.', items: 4, status: 'shipping', eta: '2026-07-05' },
  { id: 'CN-2026-06', supplier: 'Shaoxing Fabrics Ltd.', items: 2, status: 'production', eta: '2026-06-28' },
  { id: 'CN-2026-05', supplier: 'Hangzhou Silk Group', items: 6, status: 'customs', eta: '2026-06-20' },
]

export const deliveryOrders = [
  { id: 'DLV-301', customer: 'محل الأناقة', status: 'ready', address: 'دمشق — المزة' },
  { id: 'DLV-300', customer: 'خياطة الرافدين', status: 'transit', address: 'حلب — العزيزية' },
  { id: 'DLV-299', customer: 'بوتيك ليلى', status: 'preparing', address: 'دمشق — أبو رمانة' },
]

export const parties = [
  { name: 'محل الأناقة', type: 'customer', balance: '1,200 $', phone: '09xx xxx xxx' },
  { name: 'Guangzhou Textile Co.', type: 'supplier', balance: '-8,500 $', phone: '+86 xxx' },
  { name: 'خياطة الرافدين', type: 'customer', balance: '450 $', phone: '09xx xxx xxx' },
  { name: 'Shaoxing Fabrics Ltd.', type: 'supplier', balance: '-3,200 $', phone: '+86 xxx' },
]

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  paid: 'success',
  partial: 'warning',
  pending: 'danger',
  ok: 'success',
  low: 'warning',
  out: 'danger',
  shipping: 'info',
  production: 'warning',
  customs: 'info',
  ready: 'success',
  transit: 'info',
  preparing: 'warning',
  customer: 'info',
  supplier: 'neutral',
}

export function statusLabel(locale: Locale, status: string) {
  const variant = statusVariants[status] ?? 'neutral'
  const text = translate(locale, `status.${status}`)
  return { text: text === `status.${status}` ? status : text, variant }
}
