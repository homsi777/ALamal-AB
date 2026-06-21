import type { ReportsSectionId } from './reportsSections'

export type ReportText = {
  ar: string
  en: string
}

export type ReportStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ReportFilterType =
  | 'dateRange'
  | 'account'
  | 'customer'
  | 'supplier'
  | 'currency'
  | 'branch'
  | 'costCenter'
  | 'status'
  | 'taxPeriod'
  | 'bankAccount'
  | 'assetType'
  | 'item'
  | 'comparisonPeriod'
  | 'groupBy'

export type ReportLayoutType =
  | 'financial-statement'
  | 'statement'
  | 'aging'
  | 'budget'
  | 'treasury'
  | 'fixed-assets'
  | 'tax'
  | 'cost'
  | 'bi'

export type ReportExportAction = 'print' | 'pdf' | 'excel'

export type ReportStat = {
  label: ReportText
  value: string
  delta: ReportText
  trend: 'up' | 'down'
}

export type ReportRow = {
  ref: string
  subject: ReportText
  period: string
  value: string
  owner: ReportText
  status: ReportText
  variant: ReportStatus
}

export type ReportModuleWorkspace = {
  moduleTitleKey: string
  summary: ReportText
  primaryAction: ReportText
  rows: ReportRow[]
  reportType?: string
  filters?: ReportFilterType[]
  summaryMetrics?: string[]
  resultLayout?: ReportLayoutType
  exportActions?: ReportExportAction[]
  printableTitle?: ReportText
  defaultDateBehavior?: 'current-month' | 'current-year' | 'today' | 'custom'
  comparisonSupport?: boolean
}

export type ReportsWorkspaceSection = {
  stats: ReportStat[]
  workflow: ReportText[]
  modules: ReportModuleWorkspace[]
}

export function reportModuleIdFromTitleKey(titleKey: string) {
  const moduleKey = titleKey.split('.modules.')[1]?.replace('.title', '') ?? titleKey
  return moduleKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

export function findReportModule(sectionId: ReportsSectionId, moduleId: string) {
  return REPORTS_WORKSPACE[sectionId].modules.find(
    (module) => reportModuleIdFromTitleKey(module.moduleTitleKey) === moduleId,
  )
}

export function getReportModuleMeta(sectionId: ReportsSectionId, module: ReportModuleWorkspace) {
  const id = reportModuleIdFromTitleKey(module.moduleTitleKey)
  const isStatement = id.includes('statement') || id === 'journal-detail' || id === 'trial-balance'
  const isAging = id.includes('aging') || id === 'payment-due' || id === 'overdue-risk'

  const layout: ReportLayoutType =
    sectionId === 'financial-statements'
      ? 'financial-statement'
      : sectionId === 'accounts' && isAging
        ? 'aging'
        : sectionId === 'accounts' && isStatement
          ? 'statement'
          : sectionId === 'budget-analysis'
            ? 'budget'
            : sectionId === 'treasury'
              ? 'treasury'
              : sectionId === 'fixed-assets'
                ? 'fixed-assets'
                : sectionId === 'tax'
                  ? 'tax'
                  : sectionId === 'cost'
                    ? 'cost'
                    : 'bi'

  const filters: ReportFilterType[] =
    module.filters ??
    (sectionId === 'financial-statements'
      ? ['dateRange', 'comparisonPeriod', 'currency', 'branch']
      : sectionId === 'accounts' && id.includes('customer')
        ? ['dateRange', 'customer', 'currency', 'status']
        : sectionId === 'accounts' && id.includes('supplier')
          ? ['dateRange', 'supplier', 'currency', 'status']
          : sectionId === 'accounts'
            ? ['dateRange', 'account', 'currency', 'costCenter', 'status']
            : sectionId === 'budget-analysis'
              ? ['dateRange', 'comparisonPeriod', 'costCenter', 'branch', 'groupBy']
              : sectionId === 'treasury'
                ? ['dateRange', 'bankAccount', 'currency', 'status']
                : sectionId === 'fixed-assets'
                  ? ['dateRange', 'assetType', 'branch', 'status']
                  : sectionId === 'tax'
                    ? ['taxPeriod', 'dateRange', 'status', 'currency']
                    : sectionId === 'cost'
                      ? ['dateRange', 'item', 'customer', 'costCenter', 'groupBy']
                      : ['dateRange', 'comparisonPeriod', 'branch', 'groupBy'])

  const summaryMetrics =
    module.summaryMetrics ??
    (layout === 'financial-statement'
      ? ['totalAssets', 'totalLiabilities', 'netProfit', 'variance']
      : layout === 'statement'
        ? ['openingBalance', 'totalDebit', 'totalCredit', 'closingBalance']
        : layout === 'aging'
          ? ['totalAmount', 'currentBucket', 'overdueBucket', 'riskCount']
          : layout === 'budget'
            ? ['actual', 'planned', 'varianceAmount', 'variancePercent']
            : layout === 'treasury'
              ? ['cashIn', 'cashOut', 'netMovement', 'unmatched']
              : layout === 'fixed-assets'
                ? ['acquisitionCost', 'accumulatedDepreciation', 'bookValue', 'assetCount']
                : layout === 'tax'
                  ? ['inputTax', 'outputTax', 'taxDue', 'complianceAlerts']
                  : layout === 'cost'
                    ? ['revenue', 'cost', 'grossMargin', 'marginPercent']
                    : ['kpiCount', 'trend', 'alerts', 'scheduledExports'])

  return {
    id,
    reportType: module.reportType ?? id,
    filters,
    summaryMetrics,
    resultLayout: module.resultLayout ?? layout,
    exportActions: module.exportActions ?? (['print', 'pdf', 'excel'] as ReportExportAction[]),
    printableTitle: module.printableTitle ?? module.primaryAction,
    defaultDateBehavior: module.defaultDateBehavior ?? 'current-month',
    comparisonSupport: module.comparisonSupport ?? filters.includes('comparisonPeriod'),
  }
}

const ready: ReportText = { ar: 'جاهز', en: 'Ready' }
const review: ReportText = { ar: 'قيد المراجعة', en: 'In review' }
const exported: ReportText = { ar: 'تم التصدير', en: 'Exported' }
const scheduled: ReportText = { ar: 'مجدول', en: 'Scheduled' }

function rows(prefix: string, subjects: ReportText[]): ReportRow[] {
  return subjects.map((subject, index) => ({
    ref: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    subject,
    period: index === 0 ? '2026-06' : index === 1 ? '2026-Q2' : '2026',
    value: index === 0 ? '$128,400' : index === 1 ? '$42,750' : '18.6%',
    owner: index === 0 ? { ar: 'المالية', en: 'Finance' } : index === 1 ? { ar: 'الإدارة', en: 'Management' } : { ar: 'المحاسبة', en: 'Accounting' },
    status: index === 0 ? ready : index === 1 ? review : exported,
    variant: index === 0 ? 'success' : index === 1 ? 'warning' : 'info',
  }))
}

export const REPORTS_WORKSPACE: Record<ReportsSectionId, ReportsWorkspaceSection> = {
  'financial-statements': {
    stats: [
      { label: { ar: 'قوائم جاهزة', en: 'Ready statements' }, value: '4', delta: { ar: 'شهر حزيران', en: 'June period' }, trend: 'up' },
      { label: { ar: 'صافي الربح', en: 'Net profit' }, value: '$31,240', delta: { ar: '+8.2%', en: '+8.2%' }, trend: 'up' },
      { label: { ar: 'أصول متداولة', en: 'Current assets' }, value: '$186,500', delta: { ar: 'بعد التسويات', en: 'After adjustments' }, trend: 'up' },
      { label: { ar: 'ملاحظات تدقيق', en: 'Audit notes' }, value: '3', delta: { ar: 'قيد المعالجة', en: 'In progress' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'تجميع الأرصدة', en: 'Collect balances' },
      { ar: 'تطبيق التسويات', en: 'Apply adjustments' },
      { ar: 'مراجعة الإدارة', en: 'Management review' },
      { ar: 'تصدير التقرير', en: 'Export report' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.financialStatements.modules.balanceSheet.title',
        summary: { ar: 'عرض الميزانية العمومية حسب الأصول والخصوم وحقوق الملكية مع أرصدة الفترة.', en: 'Balance sheet by assets, liabilities, and equity with period balances.' },
        primaryAction: { ar: 'فتح الميزانية', en: 'Open balance sheet' },
        rows: rows('BS', [
          { ar: 'الأصول المتداولة', en: 'Current assets' },
          { ar: 'الخصوم المتداولة', en: 'Current liabilities' },
          { ar: 'حقوق الملكية', en: 'Equity' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.financialStatements.modules.incomeStatement.title',
        summary: { ar: 'قائمة الدخل تعرض الإيرادات والتكلفة والمصاريف وصافي الربح.', en: 'Income statement covering revenue, cost, expenses, and net profit.' },
        primaryAction: { ar: 'فتح قائمة الدخل', en: 'Open income statement' },
        rows: rows('PL', [
          { ar: 'إيرادات المبيعات', en: 'Sales revenue' },
          { ar: 'تكلفة المبيعات', en: 'Cost of sales' },
          { ar: 'صافي الربح', en: 'Net profit' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.financialStatements.modules.cashFlow.title',
        summary: { ar: 'تدفقات تشغيلية واستثمارية وتمويلية مع صافي حركة النقد.', en: 'Operating, investing, and financing cash flow with net cash movement.' },
        primaryAction: { ar: 'فتح التدفقات', en: 'Open cash flow' },
        rows: rows('CF', [
          { ar: 'تدفقات تشغيلية', en: 'Operating cash flow' },
          { ar: 'تدفقات استثمارية', en: 'Investing cash flow' },
          { ar: 'صافي النقد', en: 'Net cash' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.financialStatements.modules.equityChanges.title',
        summary: { ar: 'تغيرات حقوق الملكية من الأرباح والتوزيعات والتسويات.', en: 'Equity movements from profit, distributions, and adjustments.' },
        primaryAction: { ar: 'فتح حقوق الملكية', en: 'Open equity report' },
        rows: rows('EQ', [
          { ar: 'رصيد أول المدة', en: 'Opening equity' },
          { ar: 'أرباح الفترة', en: 'Period profit' },
          { ar: 'رصيد آخر المدة', en: 'Closing equity' },
        ]),
      },
    ],
  },
  accounts: {
    stats: [
      { label: { ar: 'حسابات نشطة', en: 'Active accounts' }, value: '142', delta: { ar: 'ضمن الدليل', en: 'In chart' }, trend: 'up' },
      { label: { ar: 'كشوف جاهزة', en: 'Ready statements' }, value: '28', delta: { ar: 'عملاء وموردين', en: 'Customers and suppliers' }, trend: 'up' },
      { label: { ar: 'أرصدة متأخرة', en: 'Overdue balances' }, value: '$16,400', delta: { ar: '31 - 60 يوم', en: '31 - 60 days' }, trend: 'down' },
      { label: { ar: 'فروقات مراجعة', en: 'Review variances' }, value: '5', delta: { ar: 'قبل الإقفال', en: 'Before close' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'اختيار الحساب', en: 'Select account' },
      { ar: 'تحديد الفترة', en: 'Set period' },
      { ar: 'مراجعة الحركات', en: 'Review movements' },
      { ar: 'طباعة أو تصدير', en: 'Print or export' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.accounts.modules.accountStatement.title',
        summary: { ar: 'كشف حركة حساب محدد مع الرصيد الافتتاحي والختامي.', en: 'Account movement with opening and closing balances.' },
        primaryAction: { ar: 'فتح كشف حساب', en: 'Open account statement' },
        rows: rows('ACC', [
          { ar: 'الصندوق الرئيسي', en: 'Main cash account' },
          { ar: 'ذمم العملاء', en: 'Customer receivables' },
          { ar: 'ذمم الموردين', en: 'Supplier payables' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.journalDetail.title',
        summary: { ar: 'تفصيل قيود اليومية حسب الحساب والمستخدم ومركز التكلفة.', en: 'Journal detail by account, user, and cost center.' },
        primaryAction: { ar: 'عرض القيود', en: 'View entries' },
        rows: rows('JRN', [
          { ar: 'قيود مبيعات', en: 'Sales entries' },
          { ar: 'قيود مشتريات', en: 'Purchase entries' },
          { ar: 'قيود تسوية', en: 'Adjustment entries' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.trialBalance.title',
        summary: { ar: 'ميزان مراجعة مختصر وتفصيلي حسب الحسابات.', en: 'Summary and detailed trial balance by account.' },
        primaryAction: { ar: 'عرض الميزان', en: 'View balance' },
        rows: rows('TRB', [
          { ar: 'إجمالي مدين', en: 'Total debit' },
          { ar: 'إجمالي دائن', en: 'Total credit' },
          { ar: 'فرق الميزان', en: 'Balance difference' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.arAging.title',
        summary: { ar: 'أعمار الديون المدينة حسب العميل وفترة التأخير.', en: 'Receivable aging by customer and overdue bucket.' },
        primaryAction: { ar: 'فتح أعمار العملاء', en: 'Open AR aging' },
        rows: rows('ARA', [
          { ar: '0 - 30 يوم', en: '0 - 30 days' },
          { ar: '31 - 60 يوم', en: '31 - 60 days' },
          { ar: 'أكثر من 60 يوم', en: 'Over 60 days' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.customerStatement.title',
        summary: { ar: 'كشف حساب عميل جاهز للطباعة والإرسال.', en: 'Customer statement ready for print and sending.' },
        primaryAction: { ar: 'كشف عميل', en: 'Customer statement' },
        rows: rows('CST', [
          { ar: 'مؤسسة النور', en: 'Al Noor Trading' },
          { ar: 'شركة الشام', en: 'Al Sham Co.' },
          { ar: 'معرض الأمل', en: 'Al Amal showroom' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.overdueRisk.title',
        summary: { ar: 'تحليل مخاطر التأخير حسب العميل والقيمة وأيام الاستحقاق.', en: 'Overdue risk by customer, amount, and due days.' },
        primaryAction: { ar: 'تحليل المخاطر', en: 'Analyze risk' },
        rows: rows('RSK', [
          { ar: 'عملاء عالي المخاطر', en: 'High-risk customers' },
          { ar: 'تعهدات تحصيل', en: 'Collection promises' },
          { ar: 'متابعة قانونية', en: 'Legal follow-up' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.apAging.title',
        summary: { ar: 'أعمار الذمم الدائنة حسب المورد وتاريخ الاستحقاق.', en: 'Payable aging by supplier and due date.' },
        primaryAction: { ar: 'فتح أعمار الموردين', en: 'Open AP aging' },
        rows: rows('APA', [
          { ar: 'مستحق هذا الأسبوع', en: 'Due this week' },
          { ar: 'مستحق هذا الشهر', en: 'Due this month' },
          { ar: 'متأخر السداد', en: 'Overdue payable' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.supplierStatement.title',
        summary: { ar: 'كشف حساب مورد مع الفواتير والمدفوعات والرصيد النهائي.', en: 'Supplier statement with bills, payments, and closing balance.' },
        primaryAction: { ar: 'كشف مورد', en: 'Supplier statement' },
        rows: rows('SUP', [
          { ar: 'شركة الحرير الدولية', en: 'International Silk Co.' },
          { ar: 'مورد القطن', en: 'Cotton supplier' },
          { ar: 'خدمات الشحن', en: 'Shipping services' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.accounts.modules.paymentDue.title',
        summary: { ar: 'جدول المدفوعات المستحقة حسب الأولوية والسيولة.', en: 'Due payment schedule by priority and liquidity.' },
        primaryAction: { ar: 'جدول الدفع', en: 'Payment schedule' },
        rows: rows('PAY', [
          { ar: 'دفعات عاجلة', en: 'Urgent payments' },
          { ar: 'دفعات مجدولة', en: 'Scheduled payments' },
          { ar: 'دفعات مؤجلة', en: 'Deferred payments' },
        ]),
      },
    ],
  },
  'budget-analysis': {
    stats: [
      { label: { ar: 'نسبة استخدام الموازنة', en: 'Budget usage' }, value: '72%', delta: { ar: 'حتى اليوم', en: 'To date' }, trend: 'up' },
      { label: { ar: 'انحراف إيرادات', en: 'Revenue variance' }, value: '+9.1%', delta: { ar: 'أفضل من المخطط', en: 'Above plan' }, trend: 'up' },
      { label: { ar: 'انحراف مصاريف', en: 'Expense variance' }, value: '+6.4%', delta: { ar: 'فوق المخطط', en: 'Above plan' }, trend: 'down' },
      { label: { ar: 'مراكز تكلفة', en: 'Cost centers' }, value: '12', delta: { ar: 'نشطة', en: 'Active' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'تحميل الموازنة', en: 'Load budget' },
      { ar: 'جلب الفعلي', en: 'Pull actuals' },
      { ar: 'احتساب الانحراف', en: 'Calculate variance' },
      { ar: 'توصية إجراء', en: 'Recommend action' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.budgetAnalysis.modules.actualVsPlan.title',
        summary: { ar: 'مقارنة الفعلي بالمخطط حسب البند والفترة.', en: 'Actual vs planned by line and period.' },
        primaryAction: { ar: 'مقارنة الفعلي', en: 'Compare actuals' },
        rows: rows('BUD', [
          { ar: 'المبيعات', en: 'Sales' },
          { ar: 'المصاريف التشغيلية', en: 'Operating expenses' },
          { ar: 'المشتريات', en: 'Purchasing' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.budgetAnalysis.modules.variance.title',
        summary: { ar: 'تحليل الانحرافات الكبيرة وأسبابها.', en: 'Analysis of major variances and root causes.' },
        primaryAction: { ar: 'تحليل الانحراف', en: 'Analyze variance' },
        rows: rows('VAR', [
          { ar: 'انحراف سعر', en: 'Price variance' },
          { ar: 'انحراف كمية', en: 'Quantity variance' },
          { ar: 'انحراف توقيت', en: 'Timing variance' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.budgetAnalysis.modules.costCenters.title',
        summary: { ar: 'أداء مراكز التكلفة مقارنة بالموازنة المعتمدة.', en: 'Cost center performance against approved budget.' },
        primaryAction: { ar: 'مراكز التكلفة', en: 'Cost centers' },
        rows: rows('CTR', [
          { ar: 'المستودع', en: 'Warehouse' },
          { ar: 'المبيعات', en: 'Sales' },
          { ar: 'الإدارة', en: 'Administration' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.budgetAnalysis.modules.profitability.title',
        summary: { ar: 'ربحية الأقسام والمنتجات والعملاء مقابل الموازنة.', en: 'Department, product, and customer profitability vs budget.' },
        primaryAction: { ar: 'عرض الربحية', en: 'View profitability' },
        rows: rows('PRF', [
          { ar: 'ربحية الأصناف', en: 'Item profitability' },
          { ar: 'ربحية العملاء', en: 'Customer profitability' },
          { ar: 'ربحية الفروع', en: 'Branch profitability' },
        ]),
      },
    ],
  },
  treasury: {
    stats: [
      { label: { ar: 'أرصدة نقدية', en: 'Cash balances' }, value: '$165,100', delta: { ar: 'بنوك وصناديق', en: 'Banks and boxes' }, trend: 'up' },
      { label: { ar: 'مطابقات مفتوحة', en: 'Open reconciliations' }, value: '5', delta: { ar: '2 حرجة', en: '2 critical' }, trend: 'down' },
      { label: { ar: 'تدفق يومي', en: 'Daily flow' }, value: '$7,850', delta: { ar: 'صافي وارد', en: 'Net inflow' }, trend: 'up' },
      { label: { ar: 'توقع أسبوعي', en: 'Weekly forecast' }, value: '$18,900', delta: { ar: 'صافي موجب', en: 'Positive net' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'قراءة الأرصدة', en: 'Read balances' },
      { ar: 'مطابقة الحركات', en: 'Match movements' },
      { ar: 'تحليل التدفق', en: 'Analyze flow' },
      { ar: 'اعتماد التقرير', en: 'Approve report' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.treasury.modules.bankBalances.title',
        summary: { ar: 'تقرير أرصدة البنوك والصناديق حسب الحساب والعملة.', en: 'Bank and cash balances by account and currency.' },
        primaryAction: { ar: 'عرض الأرصدة', en: 'View balances' },
        rows: rows('BNK', [
          { ar: 'البنك الرئيسي', en: 'Main bank' },
          { ar: 'صندوق الإدارة', en: 'HQ cash box' },
          { ar: 'صندوق المعرض', en: 'Showroom box' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.treasury.modules.reconciliation.title',
        summary: { ar: 'نتائج مطابقة البنك مع حركات النظام.', en: 'Bank reconciliation results against system movements.' },
        primaryAction: { ar: 'فتح المطابقة', en: 'Open reconciliation' },
        rows: rows('REC', [
          { ar: 'مطابقة بنك حزيران', en: 'June bank reconciliation' },
          { ar: 'حركات غير مطابقة', en: 'Unmatched movements' },
          { ar: 'فروقات معلقة', en: 'Pending differences' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.treasury.modules.dailyCashFlow.title',
        summary: { ar: 'التدفق النقدي اليومي مع تفاصيل الوارد والصادر.', en: 'Daily cash flow with inflow and outflow details.' },
        primaryAction: { ar: 'تدفق اليوم', en: 'Daily flow' },
        rows: rows('DCF', [
          { ar: 'تحصيلات اليوم', en: 'Today collections' },
          { ar: 'مدفوعات اليوم', en: 'Today payments' },
          { ar: 'صافي الحركة', en: 'Net movement' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.treasury.modules.cashForecast.title',
        summary: { ar: 'توقع التدفقات النقدية القادمة حسب التحصيلات والمدفوعات المجدولة.', en: 'Cash forecast from planned collections and scheduled payments.' },
        primaryAction: { ar: 'عرض التوقع', en: 'View forecast' },
        rows: rows('FCST', [
          { ar: 'توقع 7 أيام', en: '7-day forecast' },
          { ar: 'توقع 30 يوم', en: '30-day forecast' },
          { ar: 'احتياج سيولة', en: 'Liquidity need' },
        ]),
      },
    ],
  },
  'fixed-assets': {
    stats: [
      { label: { ar: 'أصول مسجلة', en: 'Registered assets' }, value: '86', delta: { ar: '5 جديدة', en: '5 new' }, trend: 'up' },
      { label: { ar: 'القيمة الدفترية', en: 'Book value' }, value: '$214,000', delta: { ar: 'بعد الإهلاك', en: 'After depreciation' }, trend: 'down' },
      { label: { ar: 'إهلاك الفترة', en: 'Period depreciation' }, value: '$4,180', delta: { ar: 'جاهز', en: 'Ready' }, trend: 'down' },
      { label: { ar: 'أصول مستبعدة', en: 'Disposed assets' }, value: '3', delta: { ar: 'هذا الشهر', en: 'This month' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'جرد الأصول', en: 'Inventory assets' },
      { ar: 'احتساب الإهلاك', en: 'Calculate depreciation' },
      { ar: 'مراجعة الاستبعاد', en: 'Review disposal' },
      { ar: 'تصدير السجل', en: 'Export register' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.fixedAssets.modules.register.title',
        summary: { ar: 'سجل الأصول حسب الموقع والمسؤول والقيمة.', en: 'Asset register by location, custodian, and value.' },
        primaryAction: { ar: 'سجل الأصول', en: 'Asset register' },
        rows: rows('FA', [
          { ar: 'رافعة المستودع', en: 'Warehouse forklift' },
          { ar: 'تجهيزات المكتب', en: 'Office equipment' },
          { ar: 'أجهزة البيع', en: 'Sales devices' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.fixedAssets.modules.depreciation.title',
        summary: { ar: 'تقرير الإهلاك الشهري والمتراكم.', en: 'Monthly and accumulated depreciation report.' },
        primaryAction: { ar: 'تقرير الإهلاك', en: 'Depreciation report' },
        rows: rows('DEP', [
          { ar: 'إهلاك شهري', en: 'Monthly depreciation' },
          { ar: 'إهلاك متراكم', en: 'Accumulated depreciation' },
          { ar: 'قيمة دفترية', en: 'Book value' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.fixedAssets.modules.disposed.title',
        summary: { ar: 'الأصول المستبعدة ونتيجة الربح أو الخسارة.', en: 'Disposed assets and gain or loss result.' },
        primaryAction: { ar: 'الأصول المستبعدة', en: 'Disposed assets' },
        rows: rows('DIS', [
          { ar: 'أجهزة مستبعدة', en: 'Retired devices' },
          { ar: 'بيع أصل', en: 'Asset sale' },
          { ar: 'خسارة استبعاد', en: 'Disposal loss' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.fixedAssets.modules.revaluation.title',
        summary: { ar: 'إعادة تقييم الأصول ومقارنة القيمة العادلة بالدفترية.', en: 'Asset revaluation comparing fair value to book value.' },
        primaryAction: { ar: 'إعادة التقييم', en: 'Revaluation' },
        rows: rows('REV', [
          { ar: 'تقييم معدات', en: 'Equipment valuation' },
          { ar: 'فرق قيمة عادلة', en: 'Fair value difference' },
          { ar: 'اعتماد تقييم', en: 'Valuation approval' },
        ]),
      },
    ],
  },
  tax: {
    stats: [
      { label: { ar: 'ضريبة مستحقة', en: 'Tax due' }, value: '$4,380', delta: { ar: 'شهر حزيران', en: 'June' }, trend: 'down' },
      { label: { ar: 'ضريبة مخرجات', en: 'Output tax' }, value: '$8,320', delta: { ar: 'من المبيعات', en: 'From sales' }, trend: 'up' },
      { label: { ar: 'ضريبة مدخلات', en: 'Input tax' }, value: '$3,940', delta: { ar: 'من المشتريات', en: 'From purchases' }, trend: 'up' },
      { label: { ar: 'تنبيهات', en: 'Alerts' }, value: '3', delta: { ar: 'قبل الإقرار', en: 'Before filing' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'تجميع الفواتير', en: 'Collect invoices' },
      { ar: 'احتساب الضريبة', en: 'Calculate tax' },
      { ar: 'مراجعة الإقرار', en: 'Review return' },
      { ar: 'تصدير الملف', en: 'Export file' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.tax.modules.vat.title',
        summary: { ar: 'تقرير VAT للمدخلات والمخرجات وصافي الضريبة.', en: 'VAT report for input, output, and net tax.' },
        primaryAction: { ar: 'تقرير VAT', en: 'VAT report' },
        rows: rows('VAT', [
          { ar: 'ضريبة مبيعات', en: 'Sales VAT' },
          { ar: 'ضريبة مشتريات', en: 'Purchase VAT' },
          { ar: 'صافي الضريبة', en: 'Net VAT' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.tax.modules.taxSummary.title',
        summary: { ar: 'ملخص الضرائب حسب النوع والفترة.', en: 'Tax summary by type and period.' },
        primaryAction: { ar: 'ملخص الضرائب', en: 'Tax summary' },
        rows: rows('TAX', [
          { ar: 'ضريبة مضافة', en: 'VAT' },
          { ar: 'اقتطاعات', en: 'Withholding' },
          { ar: 'تسويات', en: 'Adjustments' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.tax.modules.periodicReturn.title',
        summary: { ar: 'الإقرار الدوري مع حالة التجهيز والتقديم.', en: 'Periodic return with preparation and filing status.' },
        primaryAction: { ar: 'الإقرار الدوري', en: 'Periodic return' },
        rows: rows('RET', [
          { ar: 'إقرار حزيران', en: 'June return' },
          { ar: 'إقرار أيار', en: 'May return' },
          { ar: 'أرشيف الإقرارات', en: 'Returns archive' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.tax.modules.withholding.title',
        summary: { ar: 'تقرير الاقتطاع الضريبي حسب المورد أو الخدمة.', en: 'Withholding report by supplier or service.' },
        primaryAction: { ar: 'تقرير الاقتطاع', en: 'Withholding report' },
        rows: rows('WHT', [
          { ar: 'اقتطاع خدمات', en: 'Service withholding' },
          { ar: 'اقتطاع موردين', en: 'Supplier withholding' },
          { ar: 'مدفوعات خاضعة', en: 'Taxable payments' },
        ]),
      },
    ],
  },
  cost: {
    stats: [
      { label: { ar: 'تكلفة مبيعات', en: 'COGS' }, value: '$46,200', delta: { ar: 'هذا الشهر', en: 'This month' }, trend: 'down' },
      { label: { ar: 'هامش إجمالي', en: 'Gross margin' }, value: '31.8%', delta: { ar: '+2.4%', en: '+2.4%' }, trend: 'up' },
      { label: { ar: 'نقطة تعادل', en: 'Break-even' }, value: '$72,000', delta: { ar: 'تقديري', en: 'Estimated' }, trend: 'up' },
      { label: { ar: 'توزيعات تكلفة', en: 'Allocations' }, value: '9', delta: { ar: 'قيد المراجعة', en: 'In review' }, trend: 'down' },
    ],
    workflow: [
      { ar: 'قراءة المخزون', en: 'Read inventory' },
      { ar: 'تحميل التكلفة', en: 'Apply cost' },
      { ar: 'تحليل الهامش', en: 'Analyze margin' },
      { ar: 'اعتماد التقرير', en: 'Approve report' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.cost.modules.cogs.title',
        summary: { ar: 'تكلفة المبيعات المرتبطة بالفواتير وحركات المخزون.', en: 'COGS linked to invoices and inventory movements.' },
        primaryAction: { ar: 'تقرير COGS', en: 'COGS report' },
        rows: rows('COGS', [
          { ar: 'تكلفة مبيعات القطن', en: 'Cotton COGS' },
          { ar: 'تكلفة مبيعات الحرير', en: 'Silk COGS' },
          { ar: 'تسويات تكلفة', en: 'Cost adjustments' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.cost.modules.margin.title',
        summary: { ar: 'هامش الربح حسب الصنف والعميل والفاتورة.', en: 'Margin by item, customer, and invoice.' },
        primaryAction: { ar: 'تحليل الهامش', en: 'Margin analysis' },
        rows: rows('MRG', [
          { ar: 'هامش الأصناف', en: 'Item margin' },
          { ar: 'هامش العملاء', en: 'Customer margin' },
          { ar: 'فواتير منخفضة الهامش', en: 'Low-margin invoices' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.cost.modules.breakEven.title',
        summary: { ar: 'تحليل نقطة التعادل حسب المصاريف الثابتة والهامش.', en: 'Break-even analysis by fixed cost and margin.' },
        primaryAction: { ar: 'نقطة التعادل', en: 'Break-even' },
        rows: rows('BE', [
          { ar: 'تعادل شهري', en: 'Monthly break-even' },
          { ar: 'هامش مساهمة', en: 'Contribution margin' },
          { ar: 'حساسية السعر', en: 'Price sensitivity' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.cost.modules.allocation.title',
        summary: { ar: 'توزيع التكاليف غير المباشرة على مراكز التكلفة والأصناف.', en: 'Overhead allocation to cost centers and items.' },
        primaryAction: { ar: 'توزيع التكلفة', en: 'Allocate cost' },
        rows: rows('ALC', [
          { ar: 'توزيع إيجار', en: 'Rent allocation' },
          { ar: 'توزيع أجور', en: 'Labor allocation' },
          { ar: 'توزيع مصاريف عامة', en: 'Overhead allocation' },
        ]),
      },
    ],
  },
  'management-bi': {
    stats: [
      { label: { ar: 'مؤشرات تنفيذية', en: 'Executive KPIs' }, value: '18', delta: { ar: 'محدثة', en: 'Updated' }, trend: 'up' },
      { label: { ar: 'لوحات نشطة', en: 'Active dashboards' }, value: '6', delta: { ar: 'إدارة ومبيعات', en: 'Management and sales' }, trend: 'up' },
      { label: { ar: 'تنبيهات مخاطر', en: 'Risk alerts' }, value: '4', delta: { ar: 'تحتاج متابعة', en: 'Need follow-up' }, trend: 'down' },
      { label: { ar: 'تصديرات مجدولة', en: 'Scheduled exports' }, value: '9', delta: { ar: 'أسبوعية', en: 'Weekly' }, trend: 'up' },
    ],
    workflow: [
      { ar: 'اختيار المؤشر', en: 'Select KPI' },
      { ar: 'تحديث البيانات', en: 'Refresh data' },
      { ar: 'مقارنة الفترة', en: 'Compare period' },
      { ar: 'مشاركة النتيجة', en: 'Share result' },
    ],
    modules: [
      {
        moduleTitleKey: 'reports.sections.managementBi.modules.dashboard.title',
        summary: { ar: 'لوحة تنفيذية تجمع مؤشرات المبيعات والمخزون والسيولة.', en: 'Executive dashboard combining sales, inventory, and liquidity KPIs.' },
        primaryAction: { ar: 'فتح اللوحة', en: 'Open dashboard' },
        rows: rows('BI', [
          { ar: 'لوحة الإدارة', en: 'Management dashboard' },
          { ar: 'لوحة المبيعات', en: 'Sales dashboard' },
          { ar: 'لوحة المخزون', en: 'Inventory dashboard' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.managementBi.modules.kpis.title',
        summary: { ar: 'قائمة مؤشرات الأداء الرئيسية مع الاتجاه والهدف.', en: 'KPI list with trend and target.' },
        primaryAction: { ar: 'عرض المؤشرات', en: 'View KPIs' },
        rows: rows('KPI', [
          { ar: 'نمو المبيعات', en: 'Sales growth' },
          { ar: 'دوران المخزون', en: 'Inventory turnover' },
          { ar: 'أيام التحصيل', en: 'Collection days' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.managementBi.modules.periodCompare.title',
        summary: { ar: 'مقارنة الفترات الحالية والسابقة حسب المؤشر.', en: 'Compare current and previous periods by metric.' },
        primaryAction: { ar: 'مقارنة الفترات', en: 'Compare periods' },
        rows: rows('CMP', [
          { ar: 'هذا الشهر مقابل السابق', en: 'This month vs previous' },
          { ar: 'الربع الحالي مقابل السابق', en: 'Current quarter vs previous' },
          { ar: 'السنة الحالية مقابل السابقة', en: 'Current year vs previous' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.managementBi.modules.alerts.title',
        summary: { ar: 'تنبيهات تجاوز الحدود والمخاطر التشغيلية.', en: 'Threshold and operational risk alerts.' },
        primaryAction: { ar: 'فتح التنبيهات', en: 'Open alerts' },
        rows: rows('ALT', [
          { ar: 'انخفاض هامش', en: 'Low margin' },
          { ar: 'تأخر تحصيل', en: 'Collection delay' },
          { ar: 'نفاد مخزون', en: 'Stockout risk' },
        ]),
      },
      {
        moduleTitleKey: 'reports.sections.managementBi.modules.export.title',
        summary: { ar: 'تصدير التقارير ولوحات المؤشرات بصيغ تشغيلية.', en: 'Export reports and dashboards in operational formats.' },
        primaryAction: { ar: 'تصدير مجدول', en: 'Scheduled export' },
        rows: [
          ...rows('EXP', [
            { ar: 'تقرير يومي', en: 'Daily report' },
            { ar: 'تقرير أسبوعي', en: 'Weekly report' },
            { ar: 'تقرير الإدارة', en: 'Management report' },
          ]),
        ].map((row) => ({ ...row, status: scheduled, variant: 'neutral' as const })),
      },
    ],
  },
}
