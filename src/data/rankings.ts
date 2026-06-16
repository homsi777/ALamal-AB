export type CustomerRanking = {
  id: string
  nameAr: string
  nameEn: string
  invoices: number
  amount: number
  percent: number
}

export type FabricRanking = {
  id: string
  code: string
  nameAr: string
  nameEn: string
  meters: number
  amount: number
  percent: number
}

export const topCustomers: CustomerRanking[] = [
  { id: 'c1', nameAr: 'محل الأناقة', nameEn: 'Al-Anaqa Store', invoices: 42, amount: 48200, percent: 18.5 },
  { id: 'c2', nameAr: 'مؤسسة النور', nameEn: 'Al-Noor Co.', invoices: 38, amount: 41500, percent: 16.0 },
  { id: 'c3', nameAr: 'خياطة الرافدين', nameEn: 'Al-Rafidain Tailoring', invoices: 31, amount: 35800, percent: 13.8 },
  { id: 'c4', nameAr: 'بوتيك ليلى', nameEn: 'Layla Boutique', invoices: 28, amount: 29400, percent: 11.3 },
  { id: 'c5', nameAr: 'دار الأزياء', nameEn: 'Fashion House', invoices: 22, amount: 22100, percent: 8.5 },
]

export const leastCustomers: CustomerRanking[] = [
  { id: 'c6', nameAr: 'محل الزهرة', nameEn: 'Al-Zahra Shop', invoices: 2, amount: 380, percent: 0.2 },
  { id: 'c7', nameAr: 'خياطة السلام', nameEn: 'Al-Salam Tailoring', invoices: 3, amount: 620, percent: 0.3 },
  { id: 'c8', nameAr: 'بوتيك ريم', nameEn: 'Reem Boutique', invoices: 4, amount: 890, percent: 0.4 },
  { id: 'c9', nameAr: 'محل النجمة', nameEn: 'Al-Najma Shop', invoices: 5, amount: 1150, percent: 0.5 },
  { id: 'c10', nameAr: 'atelier مودرن', nameEn: 'Modern Atelier', invoices: 6, amount: 1480, percent: 0.6 },
]

export const topFabrics: FabricRanking[] = [
  { id: 'f1', code: 'FB-001', nameAr: 'قطن مصري — أبيض', nameEn: 'Egyptian cotton — white', meters: 3200, amount: 28400, percent: 22.0 },
  { id: 'f2', code: 'FB-003', nameAr: 'شيفون — وردي', nameEn: 'Chiffon — pink', meters: 2450, amount: 22100, percent: 17.1 },
  { id: 'f3', code: 'FB-005', nameAr: 'كتان — بيج', nameEn: 'Linen — beige', meters: 1980, amount: 18600, percent: 14.4 },
  { id: 'f4', code: 'FB-002', nameAr: 'حرير طبيعي — ذهبي', nameEn: 'Natural silk — gold', meters: 620, amount: 15200, percent: 11.8 },
  { id: 'f5', code: 'FB-006', nameAr: 'ساتان — كحلي', nameEn: 'Satin — navy', meters: 1540, amount: 12800, percent: 9.9 },
]

export const leastFabrics: FabricRanking[] = [
  { id: 'f6', code: 'FB-004', nameAr: 'دانتيل — أسود', nameEn: 'Lace — black', meters: 45, amount: 920, percent: 0.7 },
  { id: 'f7', code: 'FB-009', nameAr: 'مخمل — بوردو', nameEn: 'Velvet — burgundy', meters: 68, amount: 1340, percent: 1.0 },
  { id: 'f8', code: 'FB-011', nameAr: 'تُل — أبيض', nameEn: 'Tulle — white', meters: 92, amount: 1580, percent: 1.2 },
  { id: 'f9', code: 'FB-013', nameAr: 'جاكار — فضي', nameEn: 'Jacquard — silver', meters: 110, amount: 1890, percent: 1.5 },
  { id: 'f10', code: 'FB-015', nameAr: 'أورگانza — ذهبي', nameEn: 'Organza — gold', meters: 125, amount: 2100, percent: 1.6 },
]

export function formatMoney(amount: number, locale: 'ar' | 'en'): string {
  return `${amount.toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')} $`
}

export function formatMeters(meters: number, locale: 'ar' | 'en'): string {
  const formatted = meters.toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US')
  return locale === 'ar' ? `${formatted} م` : `${formatted} m`
}

export function formatPercent(percent: number, locale: 'ar' | 'en'): string {
  const formatted = percent.toLocaleString(locale === 'ar' ? 'ar-SY' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return locale === 'ar' ? `%${formatted}` : `${formatted}%`
}
