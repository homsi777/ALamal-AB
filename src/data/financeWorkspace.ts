import type { FinanceSectionId } from './financeSections'

export type FinanceText = {
  ar: string
  en: string
}

export type FinanceStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export type FinanceStat = {
  label: FinanceText
  value: string
  delta: FinanceText
  trend: 'up' | 'down'
}

export type FinanceRow = {
  ref: string
  subject: FinanceText
  owner: FinanceText
  amount: string
  date: string
  status: FinanceText
  variant: FinanceStatus
}

export type FinanceModuleWorkspace = {
  moduleTitleKey: string
  summary: FinanceText
  primaryAction: FinanceText
  rows: FinanceRow[]
}

export type FinanceWorkspaceSection = {
  stats: FinanceStat[]
  workflow: FinanceText[]
  modules: FinanceModuleWorkspace[]
}

const approval: FinanceText = { ar: 'بانتظار الاعتماد', en: 'Waiting approval' }
const ready: FinanceText = { ar: 'جاهز للمراجعة', en: 'Ready for review' }
const posted: FinanceText = { ar: 'مرحّل', en: 'Posted' }
const matched: FinanceText = { ar: 'مطابق', en: 'Matched' }
const draft: FinanceText = { ar: 'مسودة', en: 'Draft' }

export const FINANCE_WORKSPACE: Record<FinanceSectionId, FinanceWorkspaceSection> = {
  'general-ledger': {
    stats: [
      { label: { ar: 'قيود اليوم', en: 'Today entries' }, value: '18', delta: { ar: '12 مرحّلة', en: '12 posted' }, trend: 'up' },
      { label: { ar: 'ميزان المراجعة', en: 'Trial balance' }, value: '0.00', delta: { ar: 'المدين يساوي الدائن', en: 'Debit equals credit' }, trend: 'up' },
      { label: { ar: 'حسابات نشطة', en: 'Active accounts' }, value: '142', delta: { ar: '8 حسابات رئيسية', en: '8 control accounts' }, trend: 'up' },
      { label: { ar: 'قيود تحتاج مراجعة', en: 'Entries to review' }, value: '6', delta: { ar: 'قبل الإقفال', en: 'Before close' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'إنشاء القيد', en: 'Create entry' },
      { ar: 'مراجعة التوازن', en: 'Validate balance' },
      { ar: 'اعتماد المحاسب', en: 'Accountant approval' },
      { ar: 'الترحيل إلى الأستاذ', en: 'Post to ledger' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.generalLedger.modules.ledger.title',
        summary: { ar: 'عرض شجرة الحسابات مع أرصدة افتتاحية وحركة الفترة ورصيد ختامي لكل حساب.', en: 'Chart of accounts with opening, period movement, and closing balance.' },
        primaryAction: { ar: 'فتح شجرة الحسابات', en: 'Open chart of accounts' },
        rows: [
          { ref: 'GL-1001', subject: { ar: 'الصندوق الرئيسي', en: 'Main cash account' }, owner: { ar: 'محاسب عام', en: 'General accountant' }, amount: '$24,800', date: '2026-06-21', status: posted, variant: 'success' },
          { ref: 'GL-2100', subject: { ar: 'ذمم الموردين', en: 'Supplier control' }, owner: { ar: 'محاسب مشتريات', en: 'AP accountant' }, amount: '$18,420', date: '2026-06-20', status: ready, variant: 'info' },
          { ref: 'GL-3100', subject: { ar: 'إيرادات المبيعات', en: 'Sales revenue' }, owner: { ar: 'محاسب مبيعات', en: 'AR accountant' }, amount: '$52,300', date: '2026-06-19', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.generalLedger.modules.journal.title',
        summary: { ar: 'قائمة قيود يومية قابلة للمراجعة والاعتماد قبل الترحيل النهائي.', en: 'Journal entry queue for review and approval before posting.' },
        primaryAction: { ar: 'قيد يومية جديد', en: 'New journal entry' },
        rows: [
          { ref: 'JV-2034', subject: { ar: 'قيد تسوية مصاريف شحن', en: 'Freight expense accrual' }, owner: { ar: 'رنا', en: 'Rana' }, amount: '$1,250', date: '2026-06-21', status: approval, variant: 'warning' },
          { ref: 'JV-2033', subject: { ar: 'إقفال صندوق فرع دمشق', en: 'Damascus branch cash close' }, owner: { ar: 'سامر', en: 'Samer' }, amount: '$3,780', date: '2026-06-21', status: posted, variant: 'success' },
          { ref: 'JV-2032', subject: { ar: 'فرق تقييم عملة', en: 'Currency valuation difference' }, owner: { ar: 'محاسب عام', en: 'General accountant' }, amount: '$430', date: '2026-06-20', status: draft, variant: 'neutral' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.generalLedger.modules.trialBalance.title',
        summary: { ar: 'ملخص ميزان مراجعة الفترة مع كشف أي فروقات قبل إقفال الشهر.', en: 'Period trial balance summary with variance checks before month close.' },
        primaryAction: { ar: 'تحديث الميزان', en: 'Refresh balance' },
        rows: [
          { ref: 'TB-06', subject: { ar: 'ميزان شهر حزيران', en: 'June trial balance' }, owner: { ar: 'المدير المالي', en: 'Finance manager' }, amount: '$0.00', date: '2026-06-21', status: matched, variant: 'success' },
          { ref: 'TB-05', subject: { ar: 'ميزان شهر أيار', en: 'May trial balance' }, owner: { ar: 'الأرشيف', en: 'Archive' }, amount: '$0.00', date: '2026-05-31', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.generalLedger.modules.financialStatements.title',
        summary: { ar: 'تحضير القوائم المالية من أرصدة الأستاذ بعد الاعتماد.', en: 'Prepare financial statements from approved ledger balances.' },
        primaryAction: { ar: 'تجهيز القوائم', en: 'Prepare statements' },
        rows: [
          { ref: 'FS-BS', subject: { ar: 'الميزانية العمومية', en: 'Balance sheet' }, owner: { ar: 'المدير المالي', en: 'Finance manager' }, amount: '$186,500', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'FS-PL', subject: { ar: 'قائمة الأرباح والخسائر', en: 'Profit and loss' }, owner: { ar: 'محاسب عام', en: 'General accountant' }, amount: '$31,240', date: '2026-06-21', status: ready, variant: 'info' },
        ],
      },
    ],
  },
  payable: {
    stats: [
      { label: { ar: 'فواتير مفتوحة', en: 'Open bills' }, value: '27', delta: { ar: '9 مستحقة هذا الأسبوع', en: '9 due this week' }, trend: 'down' },
      { label: { ar: 'إجمالي مستحق', en: 'Total payable' }, value: '$64,900', delta: { ar: '8 موردين', en: '8 suppliers' }, trend: 'down' },
      { label: { ar: 'أوامر دفع', en: 'Payment orders' }, value: '11', delta: { ar: '4 بانتظار توقيع', en: '4 awaiting signature' }, trend: 'up' },
      { label: { ar: 'مطابقات شراء', en: 'PO matches' }, value: '92%', delta: { ar: '3 فروقات مفتوحة', en: '3 open variances' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'استلام فاتورة المورد', en: 'Receive supplier bill' },
      { ar: 'مطابقة الشراء', en: 'Match purchase' },
      { ar: 'اعتماد أمر الدفع', en: 'Approve payment order' },
      { ar: 'تنفيذ السداد', en: 'Execute payment' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.payable.modules.invoices.title',
        summary: { ar: 'متابعة فواتير الموردين حسب تاريخ الاستحقاق وحالة الاعتماد.', en: 'Track supplier invoices by due date and approval state.' },
        primaryAction: { ar: 'فاتورة مورد جديدة', en: 'New supplier bill' },
        rows: [
          { ref: 'AP-778', subject: { ar: 'شركة الحرير الدولية', en: 'International Silk Co.' }, owner: { ar: 'مشتريات', en: 'Purchasing' }, amount: '$8,950', date: '2026-06-24', status: approval, variant: 'warning' },
          { ref: 'AP-777', subject: { ar: 'مكتب التخليص الجمركي', en: 'Customs broker' }, owner: { ar: 'لوجستيك', en: 'Logistics' }, amount: '$2,140', date: '2026-06-22', status: ready, variant: 'info' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.payable.modules.paymentOrders.title',
        summary: { ar: 'أوامر الدفع المرتبطة بفواتير معتمدة مع مسار توقيع واضح.', en: 'Payment orders tied to approved bills with a clear signing path.' },
        primaryAction: { ar: 'إنشاء أمر دفع', en: 'Create payment order' },
        rows: [
          { ref: 'PO-501', subject: { ar: 'دفعة مورد أقمشة', en: 'Fabric supplier payment' }, owner: { ar: 'المدير المالي', en: 'Finance manager' }, amount: '$12,000', date: '2026-06-21', status: approval, variant: 'warning' },
          { ref: 'PO-500', subject: { ar: 'دفعة خدمات شحن', en: 'Shipping service payment' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$3,600', date: '2026-06-20', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.payable.modules.poMatching.title',
        summary: { ar: 'مطابقة الفاتورة مع أمر الشراء والاستلام قبل إدخالها في الذمم.', en: 'Match bill with purchase order and receipt before AP posting.' },
        primaryAction: { ar: 'بدء مطابقة', en: 'Start matching' },
        rows: [
          { ref: 'MAT-88', subject: { ar: 'فاتورة أقمشة قطن', en: 'Cotton fabric bill' }, owner: { ar: 'أمين المستودع', en: 'Warehouse keeper' }, amount: '$7,320', date: '2026-06-21', status: matched, variant: 'success' },
          { ref: 'MAT-87', subject: { ar: 'فرق كمية مستلمة', en: 'Received quantity variance' }, owner: { ar: 'مشتريات', en: 'Purchasing' }, amount: '$410', date: '2026-06-20', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.payable.modules.paymentSchedule.title',
        summary: { ar: 'تقويم الاستحقاقات القادمة حسب الأولوية والسيولة المتاحة.', en: 'Upcoming due calendar by priority and available liquidity.' },
        primaryAction: { ar: 'عرض الجدول', en: 'View schedule' },
        rows: [
          { ref: 'DUE-24', subject: { ar: 'استحقاق خلال 3 أيام', en: 'Due in 3 days' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$18,500', date: '2026-06-24', status: ready, variant: 'info' },
          { ref: 'DUE-30', subject: { ar: 'استحقاق نهاية الشهر', en: 'Month-end due' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$26,200', date: '2026-06-30', status: draft, variant: 'neutral' },
        ],
      },
    ],
  },
  receivable: {
    stats: [
      { label: { ar: 'فواتير عملاء مفتوحة', en: 'Open customer invoices' }, value: '34', delta: { ar: '12 عميل', en: '12 customers' }, trend: 'up' },
      { label: { ar: 'مبالغ للتحصيل', en: 'To collect' }, value: '$91,300', delta: { ar: '18% متأخر', en: '18% overdue' }, trend: 'down' },
      { label: { ar: 'تحصيلات اليوم', en: 'Today collections' }, value: '$7,850', delta: { ar: '5 سندات قبض', en: '5 receipts' }, trend: 'up' },
      { label: { ar: 'مطابقات عملاء', en: 'Customer reconciliations' }, value: '16', delta: { ar: '4 قيد الإرسال', en: '4 to send' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'إصدار الفاتورة', en: 'Issue invoice' },
      { ar: 'متابعة الاستحقاق', en: 'Track due date' },
      { ar: 'تسجيل القبض', en: 'Record receipt' },
      { ar: 'مطابقة كشف الحساب', en: 'Reconcile statement' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.receivable.modules.invoices.title',
        summary: { ar: 'فواتير العملاء الآجلة والمبالغ المفتوحة حسب تاريخ الاستحقاق.', en: 'Credit customer invoices and open balances by due date.' },
        primaryAction: { ar: 'فتح فواتير العملاء', en: 'Open customer invoices' },
        rows: [
          { ref: 'AR-902', subject: { ar: 'مؤسسة النور', en: 'Al Noor Trading' }, owner: { ar: 'مبيعات', en: 'Sales' }, amount: '$11,400', date: '2026-06-25', status: ready, variant: 'info' },
          { ref: 'AR-901', subject: { ar: 'شركة الشام', en: 'Al Sham Co.' }, owner: { ar: 'محاسب مبيعات', en: 'AR accountant' }, amount: '$6,780', date: '2026-06-19', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.receivable.modules.collections.title',
        summary: { ar: 'سندات القبض والتحصيلات البنكية مع ربطها بالفواتير المفتوحة.', en: 'Receipts and bank collections linked to open invoices.' },
        primaryAction: { ar: 'سند قبض جديد', en: 'New receipt' },
        rows: [
          { ref: 'RC-442', subject: { ar: 'قبض نقدي من عميل', en: 'Cash receipt from customer' }, owner: { ar: 'الصندوق', en: 'Cashier' }, amount: '$2,500', date: '2026-06-21', status: posted, variant: 'success' },
          { ref: 'RC-441', subject: { ar: 'تحويل بنكي', en: 'Bank transfer' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$5,350', date: '2026-06-21', status: matched, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.receivable.modules.aging.title',
        summary: { ar: 'تقسيم الديون حسب عمر الاستحقاق مع أولوية متابعة التحصيل.', en: 'Aging buckets with prioritized collection follow-up.' },
        primaryAction: { ar: 'عرض أعمار الديون', en: 'View aging' },
        rows: [
          { ref: 'AGE-30', subject: { ar: '0 - 30 يوم', en: '0 - 30 days' }, owner: { ar: 'فريق التحصيل', en: 'Collections team' }, amount: '$42,800', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'AGE-60', subject: { ar: '31 - 60 يوم', en: '31 - 60 days' }, owner: { ar: 'فريق التحصيل', en: 'Collections team' }, amount: '$16,400', date: '2026-06-21', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.receivable.modules.statements.title',
        summary: { ar: 'كشوف حساب جاهزة للطباعة أو الإرسال مع ملخص مالي للعميل.', en: 'Customer statements ready for print or sending with financial summary.' },
        primaryAction: { ar: 'تجهيز كشف حساب', en: 'Prepare statement' },
        rows: [
          { ref: 'ST-118', subject: { ar: 'كشف مؤسسة النور', en: 'Al Noor statement' }, owner: { ar: 'محاسب مبيعات', en: 'AR accountant' }, amount: '$11,400', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'ST-117', subject: { ar: 'كشف شركة الشام', en: 'Al Sham statement' }, owner: { ar: 'محاسب مبيعات', en: 'AR accountant' }, amount: '$6,780', date: '2026-06-20', status: posted, variant: 'success' },
        ],
      },
    ],
  },
  treasury: {
    stats: [
      { label: { ar: 'رصيد الصناديق', en: 'Cash boxes' }, value: '$28,400', delta: { ar: '+1,200 اليوم', en: '+1,200 today' }, trend: 'up' },
      { label: { ar: 'رصيد البنوك', en: 'Bank balance' }, value: '$136,700', delta: { ar: '3 حسابات', en: '3 accounts' }, trend: 'up' },
      { label: { ar: 'تسويات مفتوحة', en: 'Open reconciliations' }, value: '5', delta: { ar: '2 تحتاج مراجعة', en: '2 need review' }, trend: 'down' },
      { label: { ar: 'تدفق 7 أيام', en: '7-day cash flow' }, value: '$18,900', delta: { ar: 'صافي موجب', en: 'Positive net' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'تسجيل الحركة', en: 'Record movement' },
      { ar: 'ربط الحساب', en: 'Assign account' },
      { ar: 'مطابقة البنك', en: 'Bank matching' },
      { ar: 'إقفال يومي', en: 'Daily close' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.treasury.modules.banks.title',
        summary: { ar: 'أرصدة الحسابات البنكية والصناديق مع آخر حركة لكل حساب.', en: 'Bank and cash balances with the latest movement per account.' },
        primaryAction: { ar: 'إدارة الحسابات', en: 'Manage accounts' },
        rows: [
          { ref: 'BNK-01', subject: { ar: 'بنك رئيسي USD', en: 'Main USD bank' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$82,300', date: '2026-06-21', status: matched, variant: 'success' },
          { ref: 'CSH-01', subject: { ar: 'صندوق الإدارة', en: 'HQ cash box' }, owner: { ar: 'الصندوق', en: 'Cashier' }, amount: '$12,600', date: '2026-06-21', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.treasury.modules.reconciliation.title',
        summary: { ar: 'مطابقة كشوف البنك مع حركات النظام وكشف الفروقات.', en: 'Match bank statements against system movements and expose differences.' },
        primaryAction: { ar: 'مطابقة جديدة', en: 'New reconciliation' },
        rows: [
          { ref: 'REC-62', subject: { ar: 'كشف بنك حزيران', en: 'June bank statement' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$0.00', date: '2026-06-21', status: matched, variant: 'success' },
          { ref: 'REC-61', subject: { ar: 'فرق تحويل وارد', en: 'Incoming transfer variance' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$85', date: '2026-06-20', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.treasury.modules.cashFlow.title',
        summary: { ar: 'توقع التدفقات الداخلة والخارجة للأسبوع القادم.', en: 'Forecast inflows and outflows for the coming week.' },
        primaryAction: { ar: 'عرض التوقع', en: 'View forecast' },
        rows: [
          { ref: 'CF-IN', subject: { ar: 'تحصيلات متوقعة', en: 'Expected collections' }, owner: { ar: 'التحصيل', en: 'Collections' }, amount: '$34,200', date: '2026-06-27', status: ready, variant: 'info' },
          { ref: 'CF-OUT', subject: { ar: 'مدفوعات مجدولة', en: 'Scheduled payments' }, owner: { ar: 'الخزينة', en: 'Treasury' }, amount: '$15,300', date: '2026-06-27', status: draft, variant: 'neutral' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.treasury.modules.cashBoxes.title',
        summary: { ar: 'إدارة الصناديق اليومية والعهد مع إقفال ومطابقة نهاية اليوم.', en: 'Daily cash drawers and petty cash with end-of-day close.' },
        primaryAction: { ar: 'إقفال صندوق', en: 'Close cash box' },
        rows: [
          { ref: 'BOX-01', subject: { ar: 'صندوق المعرض', en: 'Showroom cash box' }, owner: { ar: 'أمين الصندوق', en: 'Cashier' }, amount: '$8,400', date: '2026-06-21', status: approval, variant: 'warning' },
          { ref: 'BOX-02', subject: { ar: 'عهدة مشتريات صغيرة', en: 'Petty cash' }, owner: { ar: 'الإدارة', en: 'Admin' }, amount: '$1,200', date: '2026-06-21', status: posted, variant: 'success' },
        ],
      },
    ],
  },
  'fixed-assets': {
    stats: [
      { label: { ar: 'عدد الأصول', en: 'Assets count' }, value: '86', delta: { ar: '5 جديدة', en: '5 new' }, trend: 'up' },
      { label: { ar: 'القيمة الدفترية', en: 'Book value' }, value: '$214,000', delta: { ar: 'بعد الإهلاك', en: 'After depreciation' }, trend: 'down' },
      { label: { ar: 'إهلاك شهري', en: 'Monthly depreciation' }, value: '$4,180', delta: { ar: 'جاهز للقيد', en: 'Ready to post' }, trend: 'down' },
      { label: { ar: 'صيانة قادمة', en: 'Upcoming maintenance' }, value: '7', delta: { ar: 'خلال 30 يوم', en: 'Within 30 days' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'تسجيل الأصل', en: 'Register asset' },
      { ar: 'تحديد موقع ومسؤول', en: 'Assign location and owner' },
      { ar: 'احتساب الإهلاك', en: 'Calculate depreciation' },
      { ar: 'إقفال أو استبعاد', en: 'Close or dispose' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.fixedAssets.modules.register.title',
        summary: { ar: 'سجل الأصول مع الموقع والمسؤول والقيمة الدفترية الحالية.', en: 'Asset register with location, custodian, and current book value.' },
        primaryAction: { ar: 'إضافة أصل', en: 'Add asset' },
        rows: [
          { ref: 'FA-044', subject: { ar: 'رافعة مستودع', en: 'Warehouse forklift' }, owner: { ar: 'المستودع', en: 'Warehouse' }, amount: '$18,000', date: '2026-06-18', status: posted, variant: 'success' },
          { ref: 'FA-043', subject: { ar: 'طابعة فواتير', en: 'Invoice printer' }, owner: { ar: 'المبيعات', en: 'Sales' }, amount: '$620', date: '2026-06-15', status: ready, variant: 'info' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.fixedAssets.modules.depreciation.title',
        summary: { ar: 'جداول الإهلاك الشهرية وجاهزية قيود الإقفال.', en: 'Monthly depreciation schedules and closing entries readiness.' },
        primaryAction: { ar: 'احتساب الإهلاك', en: 'Calculate depreciation' },
        rows: [
          { ref: 'DEP-06', subject: { ar: 'إهلاك شهر حزيران', en: 'June depreciation' }, owner: { ar: 'محاسب أصول', en: 'Asset accountant' }, amount: '$4,180', date: '2026-06-30', status: ready, variant: 'info' },
          { ref: 'DEP-05', subject: { ar: 'إهلاك شهر أيار', en: 'May depreciation' }, owner: { ar: 'الأرشيف', en: 'Archive' }, amount: '$4,050', date: '2026-05-31', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.fixedAssets.modules.maintenance.title',
        summary: { ar: 'خطة الصيانة والتقييم الدوري للأصول ذات الاستخدام العالي.', en: 'Maintenance plan and periodic valuation for high-use assets.' },
        primaryAction: { ar: 'جدولة صيانة', en: 'Schedule maintenance' },
        rows: [
          { ref: 'MNT-17', subject: { ar: 'صيانة الرافعة', en: 'Forklift service' }, owner: { ar: 'المستودع', en: 'Warehouse' }, amount: '$320', date: '2026-06-28', status: ready, variant: 'info' },
          { ref: 'MNT-16', subject: { ar: 'فحص مولدة', en: 'Generator inspection' }, owner: { ar: 'الإدارة', en: 'Admin' }, amount: '$180', date: '2026-06-25', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.fixedAssets.modules.disposal.title',
        summary: { ar: 'تسجيل بيع أو إتلاف الأصل واحتساب ربح أو خسارة التخلص.', en: 'Record sale or retirement and calculate disposal gain or loss.' },
        primaryAction: { ar: 'استبعاد أصل', en: 'Dispose asset' },
        rows: [
          { ref: 'DIS-09', subject: { ar: 'استبعاد جهاز قديم', en: 'Retire old device' }, owner: { ar: 'الإدارة', en: 'Admin' }, amount: '$90', date: '2026-06-19', status: posted, variant: 'success' },
          { ref: 'DIS-10', subject: { ar: 'بيع مكتب مستعمل', en: 'Used desk sale' }, owner: { ar: 'محاسب أصول', en: 'Asset accountant' }, amount: '$140', date: '2026-06-24', status: draft, variant: 'neutral' },
        ],
      },
    ],
  },
  budgeting: {
    stats: [
      { label: { ar: 'موازنة السنة', en: 'Annual budget' }, value: '$1.2M', delta: { ar: '72% مستخدم', en: '72% used' }, trend: 'up' },
      { label: { ar: 'انحراف مصاريف', en: 'Expense variance' }, value: '+6.4%', delta: { ar: 'فوق المخطط', en: 'Above plan' }, trend: 'down' },
      { label: { ar: 'انحراف إيرادات', en: 'Revenue variance' }, value: '+9.1%', delta: { ar: 'أفضل من المخطط', en: 'Above plan' }, trend: 'up' },
      { label: { ar: 'بنود تحتاج قرار', en: 'Decision items' }, value: '4', delta: { ar: 'قبل نهاية الشهر', en: 'Before month-end' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'إعداد الخطة', en: 'Prepare plan' },
      { ar: 'توزيع البنود', en: 'Allocate lines' },
      { ar: 'مقارنة الفعلي', en: 'Compare actuals' },
      { ar: 'إجراء تصحيحي', en: 'Corrective action' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.budgeting.modules.planning.title',
        summary: { ar: 'إعداد موازنة سنوية وربع سنوية حسب القسم ومركز التكلفة.', en: 'Annual and quarterly planning by department and cost center.' },
        primaryAction: { ar: 'إعداد موازنة', en: 'Create budget' },
        rows: [
          { ref: 'BUD-2026', subject: { ar: 'موازنة التشغيل', en: 'Operating budget' }, owner: { ar: 'الإدارة', en: 'Management' }, amount: '$820,000', date: '2026-01-01', status: posted, variant: 'success' },
          { ref: 'BUD-Q3', subject: { ar: 'تحديث الربع الثالث', en: 'Q3 revision' }, owner: { ar: 'المدير المالي', en: 'Finance manager' }, amount: '$220,000', date: '2026-06-21', status: draft, variant: 'neutral' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.budgeting.modules.variance.title',
        summary: { ar: 'مقارنة الفعلي بالمخطط لكل بند مع نسب الانحراف.', en: 'Actual-vs-plan comparison for every budget line.' },
        primaryAction: { ar: 'تحليل الانحراف', en: 'Analyze variance' },
        rows: [
          { ref: 'VAR-SAL', subject: { ar: 'إيرادات المبيعات', en: 'Sales revenue' }, owner: { ar: 'المبيعات', en: 'Sales' }, amount: '+9.1%', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'VAR-EXP', subject: { ar: 'مصاريف تشغيل', en: 'Operating expenses' }, owner: { ar: 'الإدارة', en: 'Admin' }, amount: '+6.4%', date: '2026-06-21', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.budgeting.modules.analysis.title',
        summary: { ar: 'توصيات معالجة الانحرافات ومتابعة قرارات الإدارة.', en: 'Variance recommendations and management decision tracking.' },
        primaryAction: { ar: 'تسجيل توصية', en: 'Log recommendation' },
        rows: [
          { ref: 'ACT-12', subject: { ar: 'خفض مصروف شحن', en: 'Reduce freight spend' }, owner: { ar: 'لوجستيك', en: 'Logistics' }, amount: '$1,700', date: '2026-06-26', status: approval, variant: 'warning' },
          { ref: 'ACT-11', subject: { ar: 'زيادة سقف مشتريات', en: 'Raise purchase cap' }, owner: { ar: 'مشتريات', en: 'Purchasing' }, amount: '$6,000', date: '2026-06-23', status: ready, variant: 'info' },
        ],
      },
    ],
  },
  tax: {
    stats: [
      { label: { ar: 'ضريبة مخرجات', en: 'Output tax' }, value: '$8,320', delta: { ar: 'فواتير بيع', en: 'Sales invoices' }, trend: 'up' },
      { label: { ar: 'ضريبة مدخلات', en: 'Input tax' }, value: '$3,940', delta: { ar: 'فواتير شراء', en: 'Purchase bills' }, trend: 'up' },
      { label: { ar: 'صافي مستحق', en: 'Net tax due' }, value: '$4,380', delta: { ar: 'إقرار شهري', en: 'Monthly return' }, trend: 'down' },
      { label: { ar: 'تنبيهات امتثال', en: 'Compliance alerts' }, value: '3', delta: { ar: 'قبل التقديم', en: 'Before filing' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'تجميع الحركات', en: 'Collect transactions' },
      { ar: 'احتساب الضريبة', en: 'Calculate tax' },
      { ar: 'مراجعة الإقرار', en: 'Review return' },
      { ar: 'أرشفة المستندات', en: 'Archive records' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.tax.modules.calculation.title',
        summary: { ar: 'احتساب الضرائب من فواتير البيع والشراء والحركات اليدوية.', en: 'Calculate taxes from sales, purchase bills, and manual movements.' },
        primaryAction: { ar: 'احتساب الفترة', en: 'Calculate period' },
        rows: [
          { ref: 'TAX-OUT', subject: { ar: 'ضريبة مبيعات', en: 'Sales tax' }, owner: { ar: 'محاسب ضرائب', en: 'Tax accountant' }, amount: '$8,320', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'TAX-IN', subject: { ar: 'ضريبة مشتريات', en: 'Purchase tax' }, owner: { ar: 'محاسب ضرائب', en: 'Tax accountant' }, amount: '$3,940', date: '2026-06-21', status: matched, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.tax.modules.returns.title',
        summary: { ar: 'إعداد الإقرارات الدورية ومتابعة حالة التقديم.', en: 'Prepare periodic returns and track filing status.' },
        primaryAction: { ar: 'تجهيز الإقرار', en: 'Prepare return' },
        rows: [
          { ref: 'RET-06', subject: { ar: 'إقرار حزيران', en: 'June return' }, owner: { ar: 'محاسب ضرائب', en: 'Tax accountant' }, amount: '$4,380', date: '2026-06-30', status: draft, variant: 'neutral' },
          { ref: 'RET-05', subject: { ar: 'إقرار أيار', en: 'May return' }, owner: { ar: 'الأرشيف', en: 'Archive' }, amount: '$3,860', date: '2026-05-31', status: posted, variant: 'success' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.tax.modules.compliance.title',
        summary: { ar: 'سجل رقابي للمستندات المطلوبة والتنبيهات قبل المواعيد.', en: 'Compliance record for required documents and due-date alerts.' },
        primaryAction: { ar: 'مراجعة الامتثال', en: 'Review compliance' },
        rows: [
          { ref: 'CMP-22', subject: { ar: 'مستند ناقص لفاتورة شراء', en: 'Missing purchase document' }, owner: { ar: 'مشتريات', en: 'Purchasing' }, amount: '$0.00', date: '2026-06-23', status: approval, variant: 'warning' },
          { ref: 'CMP-21', subject: { ar: 'أرشفة إقرار سابق', en: 'Archive prior return' }, owner: { ar: 'محاسب ضرائب', en: 'Tax accountant' }, amount: '$0.00', date: '2026-06-20', status: posted, variant: 'success' },
        ],
      },
    ],
  },
  cost: {
    stats: [
      { label: { ar: 'تكلفة إنتاج', en: 'Production cost' }, value: '$57,600', delta: { ar: 'هذا الشهر', en: 'This month' }, trend: 'up' },
      { label: { ar: 'هامش إجمالي', en: 'Gross margin' }, value: '31.8%', delta: { ar: '+2.4%', en: '+2.4%' }, trend: 'up' },
      { label: { ar: 'تكلفة مبيعات', en: 'COGS' }, value: '$46,200', delta: { ar: 'مرتبطة بالمخزون', en: 'Linked to inventory' }, trend: 'down' },
      { label: { ar: 'منتجات للمراجعة', en: 'Items to review' }, value: '9', delta: { ar: 'هامش منخفض', en: 'Low margin' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'تجميع المواد', en: 'Collect materials' },
      { ar: 'تحميل الأجور', en: 'Apply labor' },
      { ar: 'توزيع غير المباشر', en: 'Allocate overhead' },
      { ar: 'تحليل الربحية', en: 'Analyze margin' },
    ],
    modules: [
      {
        moduleTitleKey: 'finance.sections.cost.modules.production.title',
        summary: { ar: 'تكلفة إنتاج الأصناف من المواد والأجور والتكاليف الصناعية.', en: 'Production item cost from materials, labor, and overhead.' },
        primaryAction: { ar: 'فتح تكلفة إنتاج', en: 'Open production cost' },
        rows: [
          { ref: 'CST-PRD', subject: { ar: 'تشغيلة قطن أبيض', en: 'White cotton batch' }, owner: { ar: 'الإنتاج', en: 'Production' }, amount: '$18,700', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'CST-LBR', subject: { ar: 'تحميل أجور مباشرة', en: 'Direct labor allocation' }, owner: { ar: 'التكاليف', en: 'Costing' }, amount: '$4,200', date: '2026-06-21', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.cost.modules.profitability.title',
        summary: { ar: 'تحليل ربحية الأصناف والعملاء مع إبراز الهوامش الضعيفة.', en: 'Product and customer profitability with low-margin highlights.' },
        primaryAction: { ar: 'تحليل الربحية', en: 'Analyze profitability' },
        rows: [
          { ref: 'MAR-01', subject: { ar: 'حرير طبيعي ذهبي', en: 'Natural silk gold' }, owner: { ar: 'المبيعات', en: 'Sales' }, amount: '38.5%', date: '2026-06-21', status: matched, variant: 'success' },
          { ref: 'MAR-02', subject: { ar: 'قطن مطبوع', en: 'Printed cotton' }, owner: { ar: 'التكاليف', en: 'Costing' }, amount: '14.2%', date: '2026-06-21', status: approval, variant: 'warning' },
        ],
      },
      {
        moduleTitleKey: 'finance.sections.cost.modules.cogs.title',
        summary: { ar: 'احتساب تكلفة المبيعات وربطها بحركات المخزون والفواتير.', en: 'COGS calculation linked to inventory movements and invoices.' },
        primaryAction: { ar: 'احتساب COGS', en: 'Calculate COGS' },
        rows: [
          { ref: 'COGS-06', subject: { ar: 'تكلفة مبيعات حزيران', en: 'June COGS' }, owner: { ar: 'محاسب تكاليف', en: 'Cost accountant' }, amount: '$46,200', date: '2026-06-21', status: ready, variant: 'info' },
          { ref: 'COGS-ADJ', subject: { ar: 'تسوية تكلفة مخزون', en: 'Inventory cost adjustment' }, owner: { ar: 'المستودع', en: 'Warehouse' }, amount: '$690', date: '2026-06-20', status: approval, variant: 'warning' },
        ],
      },
    ],
  },
}
