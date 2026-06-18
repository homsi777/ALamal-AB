/**
 * قوالب التصدير والطباعة — نقطة الدخول المركزية
 *
 *   invoice-statement/  → كشف فاتورة (سطر لكل صنف/بند)
 *   account-statement/  → كشف حساب (سطر لكل فاتورة + ملخص مالي)
 */
export * from './invoice-statement'
export * from './account-statement'
export { defaultCompanyInfo } from './shared/types'
export type { CompanyInfo, ExportLocale, ExportMode } from './shared/types'
