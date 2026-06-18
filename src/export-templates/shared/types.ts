export type ExportLocale = 'ar' | 'en'

/** preview = عرض بدون طباعة تلقائية | print = فتح نافذة الطباعة | download = حفظ ملف */
export type ExportMode = 'preview' | 'print' | 'download'

export type CompanyInfo = {
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
  phone: string
  addressAr: string
  addressEn: string
}

export const defaultCompanyInfo: CompanyInfo = {
  nameAr: 'الأمل',
  nameEn: 'Al-Amal',
  taglineAr: 'ERP — الأقمشة',
  taglineEn: 'ERP — Fabrics',
  phone: '+963 11 000 0000',
  addressAr: 'دمشق — سوريا',
  addressEn: 'Damascus — Syria',
}
