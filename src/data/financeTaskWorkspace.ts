import type { FinanceSectionId } from './financeSections'
import { FINANCE_WORKSPACE, type FinanceModuleWorkspace, type FinanceStatus, type FinanceText } from './financeWorkspace'

export type FinanceActionId =
  | 'new'
  | 'saveDraft'
  | 'edit'
  | 'approve'
  | 'post'
  | 'unpost'
  | 'reverse'
  | 'cancel'
  | 'match'
  | 'calculate'
  | 'closePeriod'
  | 'print'
  | 'pdf'
  | 'excel'
  | 'linkInvoice'
  | 'archive'
  | 'importStatement'
  | 'scheduleMaintenance'
  | 'disposeAsset'
  | 'createPaymentOrder'
  | 'allocateOverhead'

export type FinanceFilterId =
  | 'dateRange'
  | 'account'
  | 'customer'
  | 'supplier'
  | 'currency'
  | 'status'
  | 'branch'
  | 'costCenter'
  | 'documentNo'
  | 'responsible'
  | 'approvalStatus'
  | 'postingStatus'
  | 'bankAccount'
  | 'taxPeriod'
  | 'assetType'
  | 'item'

export type FinanceLayoutType =
  | 'chart-of-accounts'
  | 'journal-entries'
  | 'trial-balance'
  | 'financial-statements'
  | 'supplier-invoices'
  | 'payment-orders'
  | 'purchase-matching'
  | 'payment-schedule'
  | 'customer-invoices'
  | 'receipts'
  | 'debt-aging'
  | 'customer-statements'
  | 'bank-balances'
  | 'bank-reconciliation'
  | 'cash-flow'
  | 'cashboxes'
  | 'assets-register'
  | 'depreciation'
  | 'asset-maintenance'
  | 'asset-disposal'
  | 'budget-setup'
  | 'budget-variance'
  | 'budget-analysis'
  | 'tax-period'
  | 'tax-returns'
  | 'tax-compliance'
  | 'production-cost'
  | 'profitability'
  | 'cogs'

export type FinanceTaskStatus =
  | 'draft'
  | 'pendingReview'
  | 'approved'
  | 'posted'
  | 'reversed'
  | 'cancelled'
  | 'matched'
  | 'unmatched'
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'closed'

export type FinanceAuditEntry = {
  label: FinanceText
  user: FinanceText
  at: string
  note: FinanceText
}

export type FinanceMetric = {
  label: FinanceText
  value: string
  tone?: FinanceStatus
}

export type FinanceTaskDefinition = {
  id: string
  sectionId: FinanceSectionId
  moduleTitleKey: string
  taskType: string
  layout: FinanceLayoutType
  status: FinanceTaskStatus
  actions: FinanceActionId[]
  disabledActions?: Partial<Record<FinanceActionId, FinanceText>>
  filters: FinanceFilterId[]
  workflow: FinanceTaskStatus[]
  metrics: FinanceMetric[]
  auditTrail: FinanceAuditEntry[]
  printTitle: FinanceText
}

export type FinanceTaskWorkspace = {
  sectionId: FinanceSectionId
  module: FinanceModuleWorkspace
  definition: FinanceTaskDefinition
}

const actionOwner = { ar: 'النظام المالي', en: 'Finance workspace' }

const defaultAudit: FinanceAuditEntry[] = [
  { label: { ar: 'إنشاء', en: 'Created' }, user: { ar: 'المحاسب العام', en: 'General accountant' }, at: '2026-06-21 09:10', note: { ar: 'تم إنشاء المسودة من شاشة المالية.', en: 'Draft created from finance workspace.' } },
  { label: { ar: 'مراجعة', en: 'Reviewed' }, user: { ar: 'المدير المالي', en: 'Finance manager' }, at: '2026-06-21 10:35', note: { ar: 'تمت مراجعة البيانات التجريبية وتجهيزها للاعتماد.', en: 'Mock data reviewed and ready for approval.' } },
]

const disabledBackendAction = { ar: 'بانتظار ربط الواجهة الخلفية، وتم تجهيز مكان الإجراء داخل الشاشة.', en: 'Waiting for backend integration; the UI hook is prepared.' }

const definitions: Record<string, FinanceTaskDefinition> = {
  'general-ledger:chart-of-accounts': {
    id: 'chart-of-accounts',
    sectionId: 'general-ledger',
    moduleTitleKey: 'finance.sections.generalLedger.modules.ledger.title',
    taskType: 'chart-of-accounts',
    layout: 'chart-of-accounts',
    status: 'approved',
    actions: ['new', 'edit', 'print', 'pdf', 'excel'],
    disabledActions: { edit: disabledBackendAction },
    filters: ['account', 'status', 'branch'],
    workflow: ['draft', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'حسابات نشطة', en: 'Active accounts' }, value: '142', tone: 'success' },
      { label: { ar: 'حسابات رئيسية', en: 'Control accounts' }, value: '8', tone: 'info' },
      { label: { ar: 'أرصدة تحتاج مراجعة', en: 'Balances to review' }, value: '6', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'شجرة الحسابات', en: 'Chart of Accounts' },
  },
  'general-ledger:journal-entries': {
    id: 'journal-entries',
    sectionId: 'general-ledger',
    moduleTitleKey: 'finance.sections.generalLedger.modules.journal.title',
    taskType: 'journal-entry',
    layout: 'journal-entries',
    status: 'pendingReview',
    actions: ['new', 'saveDraft', 'approve', 'post', 'reverse', 'print', 'pdf', 'excel'],
    disabledActions: { post: disabledBackendAction, reverse: disabledBackendAction },
    filters: ['dateRange', 'account', 'costCenter', 'documentNo', 'approvalStatus', 'postingStatus'],
    workflow: ['draft', 'pendingReview', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'إجمالي المدين', en: 'Total debit' }, value: '$4,250', tone: 'info' },
      { label: { ar: 'إجمالي الدائن', en: 'Total credit' }, value: '$4,250', tone: 'success' },
      { label: { ar: 'الفرق', en: 'Difference' }, value: '$0.00', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'قيد يومية', en: 'Journal Entry' },
  },
  'general-ledger:trial-balance': {
    id: 'trial-balance',
    sectionId: 'general-ledger',
    moduleTitleKey: 'finance.sections.generalLedger.modules.trialBalance.title',
    taskType: 'trial-balance',
    layout: 'trial-balance',
    status: 'matched',
    actions: ['calculate', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'account', 'branch', 'costCenter'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'إجمالي المدين', en: 'Debit total' }, value: '$186,500', tone: 'info' },
      { label: { ar: 'إجمالي الدائن', en: 'Credit total' }, value: '$186,500', tone: 'success' },
      { label: { ar: 'الفرق', en: 'Difference' }, value: '$0.00', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'ميزان المراجعة', en: 'Trial Balance' },
  },
  'general-ledger:financial-statements': {
    id: 'financial-statements',
    sectionId: 'general-ledger',
    moduleTitleKey: 'finance.sections.generalLedger.modules.financialStatements.title',
    taskType: 'financial-statements',
    layout: 'financial-statements',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'branch', 'approvalStatus'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'قوائم جاهزة', en: 'Ready statements' }, value: '3', tone: 'info' },
      { label: { ar: 'صافي الربح', en: 'Net profit' }, value: '$31,240', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تحضير القوائم المالية', en: 'Financial Statements Preparation' },
  },
  'payable:supplier-invoices': {
    id: 'supplier-invoices',
    sectionId: 'payable',
    moduleTitleKey: 'finance.sections.payable.modules.invoices.title',
    taskType: 'supplier-invoice',
    layout: 'supplier-invoices',
    status: 'pendingReview',
    actions: ['new', 'match', 'approve', 'createPaymentOrder', 'print', 'pdf', 'excel'],
    disabledActions: { createPaymentOrder: disabledBackendAction },
    filters: ['dateRange', 'supplier', 'currency', 'approvalStatus', 'status'],
    workflow: ['draft', 'matched', 'approved', 'partial', 'paid'],
    metrics: [
      { label: { ar: 'فواتير مفتوحة', en: 'Open invoices' }, value: '27', tone: 'warning' },
      { label: { ar: 'إجمالي مستحق', en: 'Total payable' }, value: '$64,900', tone: 'info' },
      { label: { ar: 'مطابقات شراء', en: 'PO matching' }, value: '92%', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'فاتورة مورد', en: 'Supplier Invoice' },
  },
  'payable:payment-orders': {
    id: 'payment-orders',
    sectionId: 'payable',
    moduleTitleKey: 'finance.sections.payable.modules.paymentOrders.title',
    taskType: 'payment-order',
    layout: 'payment-orders',
    status: 'approved',
    actions: ['new', 'approve', 'post', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'supplier', 'currency', 'approvalStatus', 'status'],
    workflow: ['draft', 'approved', 'posted', 'paid'],
    metrics: [
      { label: { ar: 'أوامر دفع', en: 'Payment orders' }, value: '11', tone: 'info' },
      { label: { ar: 'بانتظار توقيع', en: 'Awaiting signature' }, value: '4', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'أمر دفع', en: 'Payment Order' },
  },
  'payable:purchase-matching': {
    id: 'purchase-matching',
    sectionId: 'payable',
    moduleTitleKey: 'finance.sections.payable.modules.poMatching.title',
    taskType: 'purchase-matching',
    layout: 'purchase-matching',
    status: 'matched',
    actions: ['match', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'supplier', 'documentNo', 'status'],
    workflow: ['draft', 'matched', 'approved'],
    metrics: [
      { label: { ar: 'مطابق', en: 'Matched' }, value: '92%', tone: 'success' },
      { label: { ar: 'فروقات مفتوحة', en: 'Open variances' }, value: '3', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'مطابقة شراء', en: 'Purchase Matching' },
  },
  'payable:payment-schedule': {
    id: 'payment-schedule',
    sectionId: 'payable',
    moduleTitleKey: 'finance.sections.payable.modules.paymentSchedule.title',
    taskType: 'payment-schedule',
    layout: 'payment-schedule',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'supplier', 'currency', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'paid'],
    metrics: [
      { label: { ar: 'مستحق خلال 7 أيام', en: 'Due within 7 days' }, value: '$18,500', tone: 'warning' },
      { label: { ar: 'سيولة متاحة', en: 'Available liquidity' }, value: '$136,700', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'جدول المدفوعات', en: 'Payment Schedule' },
  },
  'receivable:customer-invoices': {
    id: 'customer-invoices',
    sectionId: 'receivable',
    moduleTitleKey: 'finance.sections.receivable.modules.invoices.title',
    taskType: 'customer-invoices',
    layout: 'customer-invoices',
    status: 'pendingReview',
    actions: ['new', 'approve', 'post', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'customer', 'currency', 'status', 'approvalStatus'],
    workflow: ['draft', 'approved', 'posted', 'partial', 'paid'],
    metrics: [
      { label: { ar: 'فواتير مفتوحة', en: 'Open invoices' }, value: '34', tone: 'warning' },
      { label: { ar: 'للتحصيل', en: 'To collect' }, value: '$91,300', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'فواتير العملاء', en: 'Customer Invoices' },
  },
  'receivable:receipts': {
    id: 'receipts',
    sectionId: 'receivable',
    moduleTitleKey: 'finance.sections.receivable.modules.collections.title',
    taskType: 'receipt',
    layout: 'receipts',
    status: 'posted',
    actions: ['new', 'linkInvoice', 'approve', 'post', 'print', 'pdf', 'excel'],
    disabledActions: { post: disabledBackendAction },
    filters: ['dateRange', 'customer', 'currency', 'bankAccount', 'documentNo', 'postingStatus'],
    workflow: ['draft', 'matched', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'تحصيلات اليوم', en: 'Today receipts' }, value: '$7,850', tone: 'success' },
      { label: { ar: 'سندات قبض', en: 'Receipts' }, value: '5', tone: 'info' },
      { label: { ar: 'رصيد متبق', en: 'Remaining balance' }, value: '$1,240', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'سند قبض', en: 'Receipt Voucher' },
  },
  'receivable:debt-aging': {
    id: 'debt-aging',
    sectionId: 'receivable',
    moduleTitleKey: 'finance.sections.receivable.modules.aging.title',
    taskType: 'debt-aging',
    layout: 'debt-aging',
    status: 'overdue',
    actions: ['calculate', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'customer', 'currency', 'responsible', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'متأخر', en: 'Overdue' }, value: '18%', tone: 'warning' },
      { label: { ar: 'أعلى شريحة', en: 'Largest bucket' }, value: '$42,800', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'إدارة الديون والمتأخرات', en: 'Debt and Overdue' },
  },
  'receivable:customer-statements': {
    id: 'customer-statements',
    sectionId: 'receivable',
    moduleTitleKey: 'finance.sections.receivable.modules.statements.title',
    taskType: 'customer-statements',
    layout: 'customer-statements',
    status: 'approved',
    actions: ['calculate', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'customer', 'currency', 'status'],
    workflow: ['draft', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'كشوف جاهزة', en: 'Ready statements' }, value: '16', tone: 'info' },
      { label: { ar: 'قيد الإرسال', en: 'To send' }, value: '4', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'كشوف حساب العملاء', en: 'Customer Statements' },
  },
  'treasury:bank-balances': {
    id: 'bank-balances',
    sectionId: 'treasury',
    moduleTitleKey: 'finance.sections.treasury.modules.banks.title',
    taskType: 'bank-balances',
    layout: 'bank-balances',
    status: 'approved',
    actions: ['new', 'edit', 'print', 'pdf', 'excel'],
    filters: ['bankAccount', 'currency', 'branch', 'status'],
    workflow: ['draft', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'رصيد البنوك', en: 'Bank balance' }, value: '$136,700', tone: 'success' },
      { label: { ar: 'حسابات', en: 'Accounts' }, value: '3', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'أرصدة البنوك والصناديق', en: 'Bank and Cash Balances' },
  },
  'treasury:bank-reconciliation': {
    id: 'bank-reconciliation',
    sectionId: 'treasury',
    moduleTitleKey: 'finance.sections.treasury.modules.reconciliation.title',
    taskType: 'bank-reconciliation',
    layout: 'bank-reconciliation',
    status: 'unmatched',
    actions: ['importStatement', 'match', 'approve', 'print', 'pdf', 'excel'],
    disabledActions: { importStatement: disabledBackendAction },
    filters: ['dateRange', 'bankAccount', 'currency', 'status'],
    workflow: ['draft', 'matched', 'pendingReview', 'approved'],
    metrics: [
      { label: { ar: 'مطابق', en: 'Matched' }, value: '18', tone: 'success' },
      { label: { ar: 'غير مطابق', en: 'Unmatched' }, value: '3', tone: 'warning' },
      { label: { ar: 'فرق المطابقة', en: 'Difference' }, value: '$410', tone: 'danger' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تقرير مطابقة بنكية', en: 'Bank Reconciliation' },
  },
  'treasury:cash-flow': {
    id: 'cash-flow',
    sectionId: 'treasury',
    moduleTitleKey: 'finance.sections.treasury.modules.cashFlow.title',
    taskType: 'cash-flow',
    layout: 'cash-flow',
    status: 'pendingReview',
    actions: ['calculate', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'currency', 'branch'],
    workflow: ['draft', 'pendingReview', 'approved'],
    metrics: [
      { label: { ar: 'توقع 7 أيام', en: '7-day forecast' }, value: '$18,900', tone: 'info' },
      { label: { ar: 'صافي اليوم', en: 'Today net' }, value: '+$1,200', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'التدفقات النقدية', en: 'Cash Flow' },
  },
  'treasury:cashboxes': {
    id: 'cashboxes',
    sectionId: 'treasury',
    moduleTitleKey: 'finance.sections.treasury.modules.cashBoxes.title',
    taskType: 'cashboxes',
    layout: 'cashboxes',
    status: 'pendingReview',
    actions: ['closePeriod', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'branch', 'responsible', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'رصيد الصناديق', en: 'Cash boxes' }, value: '$28,400', tone: 'success' },
      { label: { ar: 'إقفالات مفتوحة', en: 'Open closes' }, value: '2', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'إقفال صندوق', en: 'Cashbox Close' },
  },
  'fixed-assets:assets-register': {
    id: 'assets-register',
    sectionId: 'fixed-assets',
    moduleTitleKey: 'finance.sections.fixedAssets.modules.register.title',
    taskType: 'asset-register',
    layout: 'assets-register',
    status: 'approved',
    actions: ['new', 'calculate', 'scheduleMaintenance', 'disposeAsset', 'print', 'pdf', 'excel'],
    disabledActions: { disposeAsset: disabledBackendAction },
    filters: ['dateRange', 'assetType', 'branch', 'responsible', 'status'],
    workflow: ['draft', 'approved', 'posted', 'closed'],
    metrics: [
      { label: { ar: 'عدد الأصول', en: 'Assets count' }, value: '86', tone: 'info' },
      { label: { ar: 'القيمة الدفترية', en: 'Book value' }, value: '$214,000', tone: 'success' },
      { label: { ar: 'إهلاك شهري', en: 'Monthly depreciation' }, value: '$4,180', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'بطاقة أصل ثابت', en: 'Fixed Asset Card' },
  },
  'fixed-assets:depreciation': {
    id: 'depreciation',
    sectionId: 'fixed-assets',
    moduleTitleKey: 'finance.sections.fixedAssets.modules.depreciation.title',
    taskType: 'depreciation',
    layout: 'depreciation',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'post', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'assetType', 'branch', 'postingStatus'],
    workflow: ['draft', 'pendingReview', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'إهلاك جاهز', en: 'Ready depreciation' }, value: '$4,180', tone: 'info' },
      { label: { ar: 'قيود مقترحة', en: 'Suggested entries' }, value: '1', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تقرير الإهلاك', en: 'Depreciation Report' },
  },
  'fixed-assets:maintenance': {
    id: 'maintenance',
    sectionId: 'fixed-assets',
    moduleTitleKey: 'finance.sections.fixedAssets.modules.maintenance.title',
    taskType: 'asset-maintenance',
    layout: 'asset-maintenance',
    status: 'pendingReview',
    actions: ['scheduleMaintenance', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'assetType', 'responsible', 'status'],
    workflow: ['draft', 'pendingReview', 'approved'],
    metrics: [
      { label: { ar: 'صيانة قادمة', en: 'Upcoming maintenance' }, value: '7', tone: 'warning' },
      { label: { ar: 'تكلفة مقدرة', en: 'Estimated cost' }, value: '$500', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'الصيانة والتقييم', en: 'Maintenance and Valuation' },
  },
  'fixed-assets:disposal': {
    id: 'disposal',
    sectionId: 'fixed-assets',
    moduleTitleKey: 'finance.sections.fixedAssets.modules.disposal.title',
    taskType: 'asset-disposal',
    layout: 'asset-disposal',
    status: 'draft',
    actions: ['disposeAsset', 'approve', 'post', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'assetType', 'status'],
    workflow: ['draft', 'approved', 'posted', 'closed'],
    metrics: [
      { label: { ar: 'طلبات استبعاد', en: 'Disposals' }, value: '2', tone: 'warning' },
      { label: { ar: 'ربح/خسارة متوقع', en: 'Expected gain/loss' }, value: '$50', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'استبعاد أصل', en: 'Asset Disposal' },
  },
  'budgeting:budget-setup': {
    id: 'budget-setup',
    sectionId: 'budgeting',
    moduleTitleKey: 'finance.sections.budgeting.modules.planning.title',
    taskType: 'budget-setup',
    layout: 'budget-setup',
    status: 'draft',
    actions: ['new', 'saveDraft', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'costCenter', 'account', 'approvalStatus'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'موازنة السنة', en: 'Annual budget' }, value: '$1.2M', tone: 'info' },
      { label: { ar: 'مستخدم', en: 'Used' }, value: '72%', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'إعداد موازنة', en: 'Budget Setup' },
  },
  'budgeting:variance': {
    id: 'variance',
    sectionId: 'budgeting',
    moduleTitleKey: 'finance.sections.budgeting.modules.variance.title',
    taskType: 'budget-variance',
    layout: 'budget-variance',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'costCenter', 'account', 'status'],
    workflow: ['draft', 'pendingReview', 'approved'],
    metrics: [
      { label: { ar: 'انحراف مصاريف', en: 'Expense variance' }, value: '+6.4%', tone: 'warning' },
      { label: { ar: 'انحراف إيرادات', en: 'Revenue variance' }, value: '+9.1%', tone: 'success' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'مقارنة الفعلي بالمخطط', en: 'Actual vs Plan' },
  },
  'budgeting:analysis': {
    id: 'analysis',
    sectionId: 'budgeting',
    moduleTitleKey: 'finance.sections.budgeting.modules.analysis.title',
    taskType: 'budget-analysis',
    layout: 'budget-analysis',
    status: 'pendingReview',
    actions: ['new', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'costCenter', 'responsible', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'بنود تحتاج قرار', en: 'Decision items' }, value: '4', tone: 'warning' },
      { label: { ar: 'أثر متوقع', en: 'Expected impact' }, value: '$1,700', tone: 'info' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تحليل الانحرافات', en: 'Variance Analysis' },
  },
  'tax:tax-period': {
    id: 'tax-period',
    sectionId: 'tax',
    moduleTitleKey: 'finance.sections.tax.modules.calculation.title',
    taskType: 'tax-period',
    layout: 'tax-period',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'archive', 'print', 'pdf', 'excel'],
    disabledActions: { archive: disabledBackendAction },
    filters: ['taxPeriod', 'dateRange', 'status', 'approvalStatus'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'ضريبة مخرجات', en: 'Output tax' }, value: '$8,320', tone: 'info' },
      { label: { ar: 'ضريبة مدخلات', en: 'Input tax' }, value: '$3,940', tone: 'success' },
      { label: { ar: 'صافي مستحق', en: 'Net due' }, value: '$4,380', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'ملخص فترة ضريبية', en: 'Tax Period Summary' },
  },
  'tax:tax-returns': {
    id: 'tax-returns',
    sectionId: 'tax',
    moduleTitleKey: 'finance.sections.tax.modules.returns.title',
    taskType: 'tax-return',
    layout: 'tax-returns',
    status: 'draft',
    actions: ['calculate', 'approve', 'archive', 'print', 'pdf', 'excel'],
    filters: ['taxPeriod', 'dateRange', 'approvalStatus', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'إقرار حالي', en: 'Current return' }, value: '$4,380', tone: 'warning' },
      { label: { ar: 'حالة التقديم', en: 'Filing state' }, value: 'مسودة', tone: 'neutral' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'الإقرار الضريبي', en: 'Tax Return' },
  },
  'tax:compliance': {
    id: 'compliance',
    sectionId: 'tax',
    moduleTitleKey: 'finance.sections.tax.modules.compliance.title',
    taskType: 'tax-compliance',
    layout: 'tax-compliance',
    status: 'pendingReview',
    actions: ['approve', 'archive', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'responsible', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'closed'],
    metrics: [
      { label: { ar: 'تنبيهات امتثال', en: 'Compliance alerts' }, value: '3', tone: 'warning' },
      { label: { ar: 'مستندات ناقصة', en: 'Missing documents' }, value: '1', tone: 'danger' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تقارير الامتثال', en: 'Compliance Reports' },
  },
  'cost:production-cost': {
    id: 'production-cost',
    sectionId: 'cost',
    moduleTitleKey: 'finance.sections.cost.modules.production.title',
    taskType: 'production-cost',
    layout: 'production-cost',
    status: 'pendingReview',
    actions: ['calculate', 'allocateOverhead', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'item', 'costCenter', 'status'],
    workflow: ['draft', 'pendingReview', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'تكلفة إنتاج', en: 'Production cost' }, value: '$57,600', tone: 'info' },
      { label: { ar: 'مواد مباشرة', en: 'Direct materials' }, value: '$18,700', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تكلفة الإنتاج', en: 'Production Cost' },
  },
  'cost:profitability': {
    id: 'profitability',
    sectionId: 'cost',
    moduleTitleKey: 'finance.sections.cost.modules.profitability.title',
    taskType: 'profitability',
    layout: 'profitability',
    status: 'pendingReview',
    actions: ['calculate', 'approve', 'print', 'pdf', 'excel'],
    filters: ['dateRange', 'item', 'customer', 'costCenter'],
    workflow: ['draft', 'pendingReview', 'approved'],
    metrics: [
      { label: { ar: 'هامش إجمالي', en: 'Gross margin' }, value: '31.8%', tone: 'success' },
      { label: { ar: 'منتجات منخفضة الهامش', en: 'Low-margin items' }, value: '9', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'تحليل الربحية', en: 'Profitability Analysis' },
  },
  'cost:cogs': {
    id: 'cogs',
    sectionId: 'cost',
    moduleTitleKey: 'finance.sections.cost.modules.cogs.title',
    taskType: 'cogs',
    layout: 'cogs',
    status: 'pendingReview',
    actions: ['calculate', 'allocateOverhead', 'approve', 'print', 'pdf', 'excel'],
    disabledActions: { allocateOverhead: disabledBackendAction },
    filters: ['dateRange', 'item', 'customer', 'documentNo', 'costCenter'],
    workflow: ['draft', 'pendingReview', 'approved', 'posted'],
    metrics: [
      { label: { ar: 'تكلفة مبيعات', en: 'COGS' }, value: '$46,200', tone: 'info' },
      { label: { ar: 'إيرادات', en: 'Revenue' }, value: '$68,100', tone: 'success' },
      { label: { ar: 'هامش منخفض', en: 'Low margin' }, value: '14.2%', tone: 'warning' },
    ],
    auditTrail: defaultAudit,
    printTitle: { ar: 'ملخص تكلفة المبيعات', en: 'COGS Summary' },
  },
}

export function getFinanceTaskRoute(sectionId: FinanceSectionId, moduleTitleKey: string) {
  const entry = Object.values(definitions).find(
    (definition) => definition.sectionId === sectionId && definition.moduleTitleKey === moduleTitleKey,
  )
  return entry?.id ?? moduleTitleKey.split('.').at(-2)?.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`) ?? 'task'
}

export function getFinanceTaskDefinitions(sectionId: FinanceSectionId) {
  return Object.values(definitions).filter((definition) => definition.sectionId === sectionId)
}

export function findFinanceTask(sectionId: FinanceSectionId, taskId: string): FinanceTaskWorkspace | null {
  const definition = definitions[`${sectionId}:${taskId}`]
  if (!definition) return null

  const module = FINANCE_WORKSPACE[sectionId].modules.find((item) => item.moduleTitleKey === definition.moduleTitleKey)
  if (!module) return null

  return { sectionId, module, definition }
}

export function getFirstFinanceTask(sectionId: FinanceSectionId) {
  return getFinanceTaskDefinitions(sectionId)[0] ?? null
}

export const financeTaskActionOwner = actionOwner
