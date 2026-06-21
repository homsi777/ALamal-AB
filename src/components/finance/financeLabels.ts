import type { FinanceActionId, FinanceFilterId, FinanceTaskStatus } from '../../data/financeTaskWorkspace'
import type { FinanceStatus, FinanceText } from '../../data/financeWorkspace'

export const actionLabels: Record<FinanceActionId, FinanceText> = {
  new: { ar: 'جديد', en: 'New' },
  saveDraft: { ar: 'حفظ مسودة', en: 'Save draft' },
  edit: { ar: 'تعديل', en: 'Edit' },
  approve: { ar: 'اعتماد', en: 'Approve' },
  post: { ar: 'ترحيل', en: 'Post' },
  unpost: { ar: 'إلغاء الترحيل', en: 'Unpost' },
  reverse: { ar: 'عكس القيد', en: 'Reverse' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  match: { ar: 'مطابقة', en: 'Match' },
  calculate: { ar: 'احتساب', en: 'Calculate' },
  closePeriod: { ar: 'إقفال', en: 'Close' },
  print: { ar: 'طباعة', en: 'Print' },
  pdf: { ar: 'PDF', en: 'PDF' },
  excel: { ar: 'Excel', en: 'Excel' },
  linkInvoice: { ar: 'ربط فاتورة', en: 'Link invoice' },
  archive: { ar: 'أرشفة', en: 'Archive' },
  importStatement: { ar: 'استيراد كشف', en: 'Import statement' },
  scheduleMaintenance: { ar: 'جدولة صيانة', en: 'Schedule maintenance' },
  disposeAsset: { ar: 'استبعاد أصل', en: 'Dispose asset' },
  createPaymentOrder: { ar: 'إنشاء أمر دفع', en: 'Create payment order' },
  allocateOverhead: { ar: 'توزيع غير المباشر', en: 'Allocate overhead' },
}

export const filterLabels: Record<FinanceFilterId, FinanceText> = {
  dateRange: { ar: 'الفترة', en: 'Date range' },
  account: { ar: 'الحساب', en: 'Account' },
  customer: { ar: 'العميل', en: 'Customer' },
  supplier: { ar: 'المورد', en: 'Supplier' },
  currency: { ar: 'العملة', en: 'Currency' },
  status: { ar: 'الحالة', en: 'Status' },
  branch: { ar: 'الفرع', en: 'Branch' },
  costCenter: { ar: 'مركز التكلفة', en: 'Cost center' },
  documentNo: { ar: 'رقم المستند', en: 'Document no.' },
  responsible: { ar: 'المسؤول', en: 'Responsible' },
  approvalStatus: { ar: 'حالة الاعتماد', en: 'Approval state' },
  postingStatus: { ar: 'حالة الترحيل', en: 'Posting state' },
  bankAccount: { ar: 'الحساب البنكي', en: 'Bank account' },
  taxPeriod: { ar: 'الفترة الضريبية', en: 'Tax period' },
  assetType: { ar: 'نوع الأصل', en: 'Asset type' },
  item: { ar: 'الصنف', en: 'Item' },
}

export const statusLabels: Record<FinanceTaskStatus, FinanceText> = {
  draft: { ar: 'مسودة', en: 'Draft' },
  pendingReview: { ar: 'قيد المراجعة', en: 'Pending review' },
  approved: { ar: 'معتمد', en: 'Approved' },
  posted: { ar: 'مرحّل', en: 'Posted' },
  reversed: { ar: 'معكوس', en: 'Reversed' },
  cancelled: { ar: 'ملغى', en: 'Cancelled' },
  matched: { ar: 'مطابق', en: 'Matched' },
  unmatched: { ar: 'غير مطابق', en: 'Unmatched' },
  paid: { ar: 'مدفوع', en: 'Paid' },
  partial: { ar: 'مدفوع جزئياً', en: 'Partially paid' },
  overdue: { ar: 'متأخر', en: 'Overdue' },
  closed: { ar: 'مغلق', en: 'Closed' },
}

export const statusVariant: Record<FinanceTaskStatus, FinanceStatus> = {
  draft: 'neutral',
  pendingReview: 'warning',
  approved: 'info',
  posted: 'success',
  reversed: 'danger',
  cancelled: 'danger',
  matched: 'success',
  unmatched: 'warning',
  paid: 'success',
  partial: 'warning',
  overdue: 'danger',
  closed: 'neutral',
}

export function text(value: FinanceText, locale: 'ar' | 'en') {
  return value[locale]
}
