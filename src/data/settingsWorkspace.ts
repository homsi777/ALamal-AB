export type SettingsLocale = 'ar' | 'en'

export type SettingsText = {
  ar: string
  en: string
}

export type SettingsGroupId = 'general' | 'accounting' | 'operations' | 'output' | 'administration'

export type SettingsSectionId =
  | 'company'
  | 'branches'
  | 'users-roles'
  | 'localization'
  | 'currency'
  | 'finance'
  | 'tax'
  | 'document-numbering'
  | 'print-templates'
  | 'inventory'
  | 'sales'
  | 'purchases'
  | 'parties'
  | 'notifications'
  | 'integrations'
  | 'security'
  | 'backup'
  | 'audit-log'
  | 'system'
  | 'license'

export type SettingsFieldType = 'text' | 'email' | 'url' | 'number' | 'date' | 'select' | 'textarea' | 'toggle'

export type SettingsField = {
  id: string
  label: SettingsText
  helper?: SettingsText
  type: SettingsFieldType
  value: string | boolean
  options?: SettingsText[]
  required?: boolean
  warning?: SettingsText
}

export type SettingsTableColumn = {
  key: string
  label: SettingsText
}

export type SettingsTableRow = Record<string, string>

export type SettingsPanel =
  | {
      id: string
      type: 'fields'
      title: SettingsText
      description?: SettingsText
      fields: SettingsField[]
    }
  | {
      id: string
      type: 'table'
      title: SettingsText
      description?: SettingsText
      columns: SettingsTableColumn[]
      rows: SettingsTableRow[]
      actionLabel?: SettingsText
    }
  | {
      id: string
      type: 'permissions'
      title: SettingsText
      description?: SettingsText
      roles: string[]
      permissions: { module: SettingsText; actions: Record<string, boolean> }[]
    }
  | {
      id: string
      type: 'templates'
      title: SettingsText
      description?: SettingsText
      templates: { name: SettingsText; document: SettingsText; paper: string; default: boolean }[]
    }
  | {
      id: string
      type: 'audit'
      title: SettingsText
      description?: SettingsText
      events: { user: string; action: SettingsText; module: SettingsText; at: string; summary: SettingsText }[]
    }
  | {
      id: string
      type: 'danger'
      title: SettingsText
      description: SettingsText
      actionLabel: SettingsText
      disabledReason?: SettingsText
    }

export type SettingsSection = {
  id: SettingsSectionId
  group: SettingsGroupId
  icon: string
  route: string
  title: SettingsText
  description: SettingsText
  permission: string
  status: 'ready' | 'configured' | 'needs-review' | 'danger'
  affectsSystemBehavior: boolean
  dangerous?: boolean
  panels: SettingsPanel[]
}

export const SETTINGS_GROUPS: Record<SettingsGroupId, SettingsText> = {
  general: { ar: 'الإعدادات العامة', en: 'General configuration' },
  accounting: { ar: 'إعدادات المحاسبة', en: 'Accounting configuration' },
  operations: { ar: 'إعدادات التشغيل', en: 'Operations configuration' },
  output: { ar: 'المخرجات والطباعة', en: 'Output configuration' },
  administration: { ar: 'الإدارة والأمان', en: 'Administration' },
}

const currencies = [{ ar: 'USD', en: 'USD' }, { ar: 'SYP', en: 'SYP' }, { ar: 'EUR', en: 'EUR' }]

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'company',
    group: 'general',
    icon: '🏢',
    route: '/settings/company',
    title: { ar: 'هوية الشركة', en: 'Company Identity' },
    description: { ar: 'البيانات الرسمية التي تظهر في النظام والمستندات المطبوعة وملفات PDF.', en: 'Official identity used across the ERP and printed documents.' },
    permission: 'settings.company.manage',
    status: 'configured',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'identity',
        type: 'fields',
        title: { ar: 'البيانات الرسمية', en: 'Official details' },
        fields: [
          { id: 'companyNameAr', label: { ar: 'اسم الشركة بالعربية', en: 'Arabic company name' }, type: 'text', value: 'الأمل لتجارة الأقمشة', required: true },
          { id: 'companyNameEn', label: { ar: 'اسم الشركة بالإنجليزية', en: 'English company name' }, type: 'text', value: 'ALamal Fabrics Trading', required: true },
          { id: 'commercialName', label: { ar: 'الاسم التجاري', en: 'Commercial name' }, type: 'text', value: 'ALamal-AB' },
          { id: 'taxNumber', label: { ar: 'الرقم الضريبي', en: 'Tax number' }, type: 'text', value: 'TRN-2026-0042' },
          { id: 'commercialRegister', label: { ar: 'رقم السجل التجاري', en: 'Commercial registration' }, type: 'text', value: 'CR-887120' },
          { id: 'phone', label: { ar: 'الهاتف', en: 'Phone' }, type: 'text', value: '+963 11 000 000' },
          { id: 'email', label: { ar: 'البريد الإلكتروني', en: 'Email' }, type: 'email', value: 'finance@alamal.local' },
          { id: 'website', label: { ar: 'الموقع الإلكتروني', en: 'Website' }, type: 'url', value: 'https://alamal.local' },
          { id: 'address', label: { ar: 'العنوان', en: 'Address' }, type: 'textarea', value: 'دمشق - المنطقة الصناعية' },
          { id: 'footerText', label: { ar: 'نص التذييل الافتراضي', en: 'Default footer text' }, type: 'textarea', value: 'شكراً لتعاملكم معنا' },
        ],
      },
      {
        id: 'document-preview',
        type: 'templates',
        title: { ar: 'معاينة الهوية على المستندات', en: 'Document identity preview' },
        description: { ar: 'تستخدم هذه المعاينة قوالب A4 المشتركة الموجودة في المشروع.', en: 'Preview uses the shared A4 document templates.' },
        templates: [
          { name: { ar: 'ترويسة الفاتورة', en: 'Invoice header' }, document: { ar: 'فاتورة مبيعات', en: 'Sales invoice' }, paper: 'A4', default: true },
          { name: { ar: 'ترويسة السند', en: 'Voucher header' }, document: { ar: 'سند قبض/دفع', en: 'Receipt/payment voucher' }, paper: 'A4', default: true },
        ],
      },
    ],
  },
  {
    id: 'branches',
    group: 'general',
    icon: '🏭',
    route: '/settings/branches',
    title: { ar: 'الفروع والمستودعات', en: 'Branches and Warehouses' },
    description: { ar: 'تعريف الفروع والمستودعات الافتراضية وحالة كل موقع تشغيلي.', en: 'Configure operating branches and default warehouses.' },
    permission: 'settings.branches.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'branches-table',
        type: 'table',
        title: { ar: 'قائمة الفروع', en: 'Branches' },
        actionLabel: { ar: 'إضافة فرع', en: 'Add branch' },
        columns: [
          { key: 'code', label: { ar: 'الكود', en: 'Code' } },
          { key: 'name', label: { ar: 'الفرع', en: 'Branch' } },
          { key: 'manager', label: { ar: 'المدير', en: 'Manager' } },
          { key: 'warehouse', label: { ar: 'المستودع الافتراضي', en: 'Default warehouse' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { code: 'BR-DAM', name: 'فرع دمشق', manager: 'سامر', warehouse: 'مستودع دمشق الرئيسي', state: 'نشط' },
          { code: 'BR-ALP', name: 'فرع حلب', manager: 'رنا', warehouse: 'مستودع حلب', state: 'نشط' },
        ],
      },
      {
        id: 'warehouses-table',
        type: 'table',
        title: { ar: 'قائمة المستودعات', en: 'Warehouses' },
        actionLabel: { ar: 'إضافة مستودع', en: 'Add warehouse' },
        columns: [
          { key: 'code', label: { ar: 'الكود', en: 'Code' } },
          { key: 'name', label: { ar: 'المستودع', en: 'Warehouse' } },
          { key: 'type', label: { ar: 'النوع', en: 'Type' } },
          { key: 'location', label: { ar: 'الموقع', en: 'Location' } },
          { key: 'responsible', label: { ar: 'المسؤول', en: 'Responsible' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { code: 'WH-01', name: 'مستودع رئيسي', type: 'رئيسي', location: 'دمشق', responsible: 'أمين المستودع', state: 'نشط' },
          { code: 'WH-02', name: 'مستودع حلب', type: 'فرعي', location: 'حلب', responsible: 'فريق المخزون', state: 'نشط' },
        ],
      },
    ],
  },
  {
    id: 'users-roles',
    group: 'administration',
    icon: '👥',
    route: '/settings/users-roles',
    title: { ar: 'المستخدمون والأدوار والصلاحيات', en: 'Users, Roles, and Permissions' },
    description: { ar: 'إدارة المستخدمين ومصفوفة الصلاحيات دون تغيير نظام الدخول الحقيقي حالياً.', en: 'Manage users and role permissions without changing authentication APIs yet.' },
    permission: 'settings.users.manage',
    status: 'needs-review',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'users',
        type: 'table',
        title: { ar: 'المستخدمون', en: 'Users' },
        actionLabel: { ar: 'إضافة مستخدم', en: 'Add user' },
        columns: [
          { key: 'name', label: { ar: 'الاسم', en: 'Name' } },
          { key: 'role', label: { ar: 'الدور', en: 'Role' } },
          { key: 'email', label: { ar: 'البريد', en: 'Email' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { name: 'المدير العام', role: 'مدير النظام', email: 'admin@alamal.local', state: 'نشط' },
          { name: 'المحاسب العام', role: 'محاسب', email: 'accountant@alamal.local', state: 'نشط' },
        ],
      },
      {
        id: 'permission-matrix',
        type: 'permissions',
        title: { ar: 'مصفوفة الصلاحيات', en: 'Permission matrix' },
        roles: ['مدير النظام', 'محاسب', 'مدير مبيعات'],
        permissions: [
          { module: { ar: 'المالية', en: 'Finance' }, actions: { view: true, create: true, approve: true, post: true } },
          { module: { ar: 'التقارير', en: 'Reports' }, actions: { view: true, create: false, approve: false, post: false } },
          { module: { ar: 'المخزون', en: 'Inventory' }, actions: { view: true, create: true, approve: true, post: false } },
          { module: { ar: 'الإعدادات', en: 'Settings' }, actions: { view: true, create: true, approve: true, post: false } },
        ],
      },
      {
        id: 'password-reset',
        type: 'danger',
        title: { ar: 'إعادة تعيين كلمة المرور', en: 'Password reset' },
        description: { ar: 'جاهزة كواجهة فقط إلى أن يتم ربط API المستخدمين.', en: 'Prepared as UI until user APIs are connected.' },
        actionLabel: { ar: 'إرسال رابط إعادة تعيين', en: 'Send reset link' },
        disabledReason: { ar: 'بانتظار ربط واجهة المستخدمين الخلفية.', en: 'Waiting for user backend APIs.' },
      },
    ],
  },
  {
    id: 'localization',
    group: 'general',
    icon: '🌐',
    route: '/settings/localization',
    title: { ar: 'اللغة والمنطقة', en: 'Localization and Languages' },
    description: { ar: 'اللغة الافتراضية، اتجاه RTL، تنسيق التاريخ والأرقام والمنطقة الزمنية.', en: 'Default language, RTL, date/number formats, and timezone.' },
    permission: 'settings.localization.manage',
    status: 'configured',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'language',
        type: 'fields',
        title: { ar: 'اللغة والتنسيقات', en: 'Language and formats' },
        fields: [
          { id: 'defaultLanguage', label: { ar: 'اللغة الافتراضية', en: 'Default language' }, type: 'select', value: 'العربية', options: [{ ar: 'العربية', en: 'Arabic' }, { ar: 'English', en: 'English' }, { ar: 'Türkçe - لاحقاً', en: 'Turkish - planned' }] },
          { id: 'rtlEnabled', label: { ar: 'تفعيل اتجاه RTL', en: 'Enable RTL' }, type: 'toggle', value: true },
          { id: 'dateFormat', label: { ar: 'تنسيق التاريخ', en: 'Date format' }, type: 'select', value: 'YYYY-MM-DD', options: [{ ar: 'YYYY-MM-DD', en: 'YYYY-MM-DD' }, { ar: 'DD/MM/YYYY', en: 'DD/MM/YYYY' }] },
          { id: 'numberFormat', label: { ar: 'تنسيق الأرقام', en: 'Number format' }, type: 'select', value: 'ar-SY', options: [{ ar: 'ar-SY', en: 'ar-SY' }, { ar: 'en-US', en: 'en-US' }] },
          { id: 'timezone', label: { ar: 'المنطقة الزمنية', en: 'Timezone' }, type: 'select', value: 'Asia/Damascus', options: [{ ar: 'Asia/Damascus', en: 'Asia/Damascus' }, { ar: 'UTC', en: 'UTC' }] },
          { id: 'weekStart', label: { ar: 'أول يوم في الأسبوع', en: 'First day of week' }, type: 'select', value: 'السبت', options: [{ ar: 'السبت', en: 'Saturday' }, { ar: 'الأحد', en: 'Sunday' }, { ar: 'الاثنين', en: 'Monday' }] },
        ],
      },
    ],
  },
  {
    id: 'currency',
    group: 'accounting',
    icon: '💱',
    route: '/settings/currency',
    title: { ar: 'العملات وأسعار الصرف', en: 'Currency and Exchange Rates' },
    description: { ar: 'العملة الأساسية، العملات المدعومة، وآلية تحديث أسعار الصرف.', en: 'Base currency, supported currencies, and exchange rate policy.' },
    permission: 'settings.currency.manage',
    status: 'needs-review',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'currency-base',
        type: 'fields',
        title: { ar: 'العملة الأساسية', en: 'Base currency' },
        fields: [
          { id: 'baseCurrency', label: { ar: 'العملة الأساسية', en: 'Base currency' }, type: 'select', value: 'USD', options: currencies, warning: { ar: 'تغيير العملة الأساسية يؤثر على المحاسبة والأرصدة.', en: 'Changing base currency affects accounting balances.' } },
          { id: 'exchangeRateMode', label: { ar: 'طريقة سعر الصرف', en: 'Exchange rate mode' }, type: 'select', value: 'يدوي', options: [{ ar: 'يدوي', en: 'Manual' }, { ar: 'API خارجي - لاحقاً', en: 'External API - later' }] },
          { id: 'multiCurrency', label: { ar: 'محاسبة متعددة العملات', en: 'Multi-currency accounting' }, type: 'toggle', value: true },
        ],
      },
      {
        id: 'exchange-rates',
        type: 'table',
        title: { ar: 'جدول أسعار الصرف', en: 'Exchange rates' },
        columns: [
          { key: 'currency', label: { ar: 'العملة', en: 'Currency' } },
          { key: 'symbol', label: { ar: 'الرمز', en: 'Symbol' } },
          { key: 'rate', label: { ar: 'السعر مقابل الأساسية', en: 'Rate' } },
          { key: 'effective', label: { ar: 'تاريخ الفعالية', en: 'Effective date' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { currency: 'USD', symbol: '$', rate: '1.0000', effective: '2026-06-21', state: 'نشط' },
          { currency: 'SYP', symbol: 'ل.س', rate: '14500', effective: '2026-06-21', state: 'نشط' },
        ],
      },
    ],
  },
  {
    id: 'finance',
    group: 'accounting',
    icon: '📘',
    route: '/settings/finance',
    title: { ar: 'الإعدادات المالية', en: 'Financial Settings' },
    description: { ar: 'سنوات مالية، قواعد الترحيل، الحسابات الافتراضية، ومراكز التكلفة.', en: 'Fiscal years, posting rules, default accounts, and cost centers.' },
    permission: 'settings.finance.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'posting-rules',
        type: 'fields',
        title: { ar: 'قواعد الفترة والترحيل', en: 'Fiscal and posting rules' },
        fields: [
          { id: 'fiscalStart', label: { ar: 'بداية السنة المالية', en: 'Fiscal year start' }, type: 'date', value: '2026-01-01' },
          { id: 'fiscalEnd', label: { ar: 'نهاية السنة المالية', en: 'Fiscal year end' }, type: 'date', value: '2026-12-31' },
          { id: 'currentPeriod', label: { ar: 'الفترة الحالية', en: 'Current period' }, type: 'text', value: '2026-06' },
          { id: 'allowClosedPosting', label: { ar: 'السماح بالترحيل لفترة مغلقة', en: 'Allow posting to closed period' }, type: 'toggle', value: false },
          { id: 'requireBalancedEntry', label: { ar: 'اشتراط توازن قيد اليومية', en: 'Require balanced journal entry' }, type: 'toggle', value: true },
          { id: 'requireApprovalBeforePosting', label: { ar: 'اشتراط الاعتماد قبل الترحيل', en: 'Require approval before posting' }, type: 'toggle', value: true },
          { id: 'requireCostCenter', label: { ar: 'اشتراط مركز تكلفة', en: 'Require cost center' }, type: 'toggle', value: false },
        ],
      },
      {
        id: 'default-accounts',
        type: 'fields',
        title: { ar: 'الحسابات الافتراضية', en: 'Default accounts' },
        fields: [
          { id: 'cashAccount', label: { ar: 'حساب الصندوق', en: 'Cash account' }, type: 'text', value: '1100 - الصندوق الرئيسي' },
          { id: 'bankAccount', label: { ar: 'حساب البنك', en: 'Bank account' }, type: 'text', value: '1110 - بنك التشغيل' },
          { id: 'salesAccount', label: { ar: 'حساب المبيعات', en: 'Sales account' }, type: 'text', value: '4100 - إيرادات المبيعات' },
          { id: 'purchaseAccount', label: { ar: 'حساب المشتريات', en: 'Purchase account' }, type: 'text', value: '5100 - مشتريات' },
          { id: 'inventoryAccount', label: { ar: 'حساب المخزون', en: 'Inventory account' }, type: 'text', value: '1300 - مخزون' },
          { id: 'cogsAccount', label: { ar: 'حساب تكلفة المبيعات', en: 'COGS account' }, type: 'text', value: '5200 - تكلفة المبيعات' },
          { id: 'taxInput', label: { ar: 'حساب ضريبة المدخلات', en: 'Input tax account' }, type: 'text', value: '1550 - ضريبة مدخلات' },
          { id: 'taxOutput', label: { ar: 'حساب ضريبة المخرجات', en: 'Output tax account' }, type: 'text', value: '2550 - ضريبة مخرجات' },
          { id: 'arAccount', label: { ar: 'ذمم مدينة', en: 'Accounts receivable' }, type: 'text', value: '1200 - ذمم العملاء' },
          { id: 'apAccount', label: { ar: 'ذمم دائنة', en: 'Accounts payable' }, type: 'text', value: '2100 - ذمم الموردين' },
        ],
      },
    ],
  },
  {
    id: 'tax',
    group: 'accounting',
    icon: '🧾',
    route: '/settings/tax',
    title: { ar: 'إعدادات الضرائب', en: 'Tax Settings' },
    description: { ar: 'تفعيل الضريبة، المعدلات، طريقة الاحتساب، وفترات الإقرار.', en: 'Tax activation, rates, calculation method, and filing periods.' },
    permission: 'settings.tax.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'tax-rules',
        type: 'fields',
        title: { ar: 'قواعد الضريبة', en: 'Tax rules' },
        fields: [
          { id: 'taxEnabled', label: { ar: 'تفعيل الضريبة', en: 'Tax enabled' }, type: 'toggle', value: true },
          { id: 'defaultTaxRate', label: { ar: 'معدل VAT الافتراضي', en: 'Default VAT rate' }, type: 'number', value: '8' },
          { id: 'taxRegistration', label: { ar: 'رقم التسجيل الضريبي', en: 'Tax registration number' }, type: 'text', value: 'TRN-2026-0042' },
          { id: 'taxMethod', label: { ar: 'طريقة الاحتساب', en: 'Calculation method' }, type: 'select', value: 'حسب الفاتورة', options: [{ ar: 'حسب الفاتورة', en: 'Per invoice' }, { ar: 'حسب السطر', en: 'Per line' }] },
          { id: 'taxPeriod', label: { ar: 'فترة الإقرار', en: 'Tax period' }, type: 'select', value: 'شهري', options: [{ ar: 'شهري', en: 'Monthly' }, { ar: 'ربع سنوي', en: 'Quarterly' }] },
          { id: 'rounding', label: { ar: 'تقريب الضريبة', en: 'Tax rounding' }, type: 'select', value: 'أقرب 0.01', options: [{ ar: 'أقرب 0.01', en: 'Nearest 0.01' }, { ar: 'بدون تقريب', en: 'No rounding' }] },
          { id: 'archiveTaxPdf', label: { ar: 'أرشفة PDF للإقرارات', en: 'Archive tax PDF' }, type: 'toggle', value: true },
        ],
      },
    ],
  },
  {
    id: 'document-numbering',
    group: 'accounting',
    icon: '🔢',
    route: '/settings/document-numbering',
    title: { ar: 'ترقيم المستندات', en: 'Document Numbering' },
    description: { ar: 'المصدر المركزي لتسلسل أرقام الفواتير والسندات والقيود والمستندات.', en: 'Central source for invoice, voucher, journal, and document sequences.' },
    permission: 'settings.document_numbering.manage',
    status: 'configured',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'numbering-rules',
        type: 'table',
        title: { ar: 'قواعد الترقيم', en: 'Numbering rules' },
        columns: [
          { key: 'document', label: { ar: 'نوع المستند', en: 'Document type' } },
          { key: 'prefix', label: { ar: 'البادئة', en: 'Prefix' } },
          { key: 'next', label: { ar: 'الرقم التالي', en: 'Next no.' } },
          { key: 'padding', label: { ar: 'طول الرقم', en: 'Padding' } },
          { key: 'reset', label: { ar: 'إعادة التصفير', en: 'Reset' } },
          { key: 'branch', label: { ar: 'حسب الفرع', en: 'Branch-specific' } },
          { key: 'preview', label: { ar: 'المعاينة', en: 'Preview' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { document: 'فاتورة مبيعات', prefix: 'SI-', next: '2301', padding: '5', reset: 'سنوي', branch: 'نعم', preview: 'SI-02301', state: 'نشط' },
          { document: 'فاتورة شراء', prefix: 'PI-', next: '778', padding: '5', reset: 'سنوي', branch: 'نعم', preview: 'PI-00778', state: 'نشط' },
          { document: 'سند قبض', prefix: 'RC-', next: '442', padding: '5', reset: 'شهري', branch: 'نعم', preview: 'RC-00442', state: 'نشط' },
          { document: 'سند دفع', prefix: 'PV-', next: '501', padding: '5', reset: 'شهري', branch: 'نعم', preview: 'PV-00501', state: 'نشط' },
          { document: 'قيد يومية', prefix: 'JV-', next: '2034', padding: '5', reset: 'سنوي', branch: 'لا', preview: 'JV-02034', state: 'نشط' },
          { document: 'تسوية مخزون', prefix: 'ADJ-', next: '88', padding: '4', reset: 'سنوي', branch: 'نعم', preview: 'ADJ-0088', state: 'نشط' },
        ],
      },
    ],
  },
  {
    id: 'print-templates',
    group: 'output',
    icon: '🖨️',
    route: '/settings/print-templates',
    title: { ar: 'قوالب الطباعة و PDF', en: 'Printing and PDF Templates' },
    description: { ar: 'إدارة قوالب A4 و PDF للفواتير والسندات والتقارير والكشوف.', en: 'Manage A4/PDF templates for invoices, vouchers, reports, and statements.' },
    permission: 'settings.print_templates.manage',
    status: 'configured',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'templates-list',
        type: 'templates',
        title: { ar: 'القوالب الموحدة', en: 'Unified templates' },
        description: { ar: 'هذه الشاشة تستخدم قوالب التصدير المشتركة الموجودة في المشروع ولا تنشئ أنماطاً منفصلة.', en: 'This screen reuses shared export templates instead of disconnected styles.' },
        templates: [
          { name: { ar: 'قالب فاتورة المبيعات', en: 'Sales invoice template' }, document: { ar: 'فاتورة', en: 'Invoice' }, paper: 'A4', default: true },
          { name: { ar: 'قالب سند القبض', en: 'Receipt voucher template' }, document: { ar: 'سند قبض', en: 'Receipt voucher' }, paper: 'A4', default: true },
          { name: { ar: 'قالب قيد اليومية', en: 'Journal entry template' }, document: { ar: 'قيد يومية', en: 'Journal entry' }, paper: 'A4', default: false },
          { name: { ar: 'قالب كشف حساب', en: 'Statement template' }, document: { ar: 'كشف عميل/مورد', en: 'Customer/supplier statement' }, paper: 'A4', default: true },
          { name: { ar: 'قالب ملخص ضريبي', en: 'Tax summary template' }, document: { ar: 'ملخص ضريبي', en: 'Tax summary' }, paper: 'A4', default: false },
        ],
      },
      {
        id: 'template-options',
        type: 'fields',
        title: { ar: 'خيارات الترويسة والتذييل', en: 'Header and footer options' },
        fields: [
          { id: 'showLogo', label: { ar: 'إظهار الشعار', en: 'Show logo' }, type: 'toggle', value: true },
          { id: 'showStamp', label: { ar: 'إظهار مكان الختم', en: 'Show stamp area' }, type: 'toggle', value: true },
          { id: 'showSignature', label: { ar: 'إظهار التوقيع', en: 'Show signature' }, type: 'toggle', value: true },
          { id: 'paperSize', label: { ar: 'حجم الورق الافتراضي', en: 'Default paper size' }, type: 'select', value: 'A4', options: [{ ar: 'A4', en: 'A4' }, { ar: 'A5', en: 'A5' }, { ar: 'Thermal', en: 'Thermal' }] },
          { id: 'margins', label: { ar: 'الهوامش', en: 'Margins' }, type: 'select', value: 'قياسي', options: [{ ar: 'ضيقة', en: 'Narrow' }, { ar: 'قياسي', en: 'Standard' }, { ar: 'واسعة', en: 'Wide' }] },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    group: 'operations',
    icon: '📦',
    route: '/settings/inventory',
    title: { ar: 'إعدادات المخزون', en: 'Inventory Settings' },
    description: { ar: 'المستودع الافتراضي، طرق التكلفة، الباركود، والموافقات المخزنية.', en: 'Default warehouse, costing, barcode behavior, and stock approvals.' },
    permission: 'settings.inventory.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'inventory-rules',
        type: 'fields',
        title: { ar: 'قواعد المخزون', en: 'Inventory rules' },
        fields: [
          { id: 'defaultWarehouse', label: { ar: 'المستودع الافتراضي', en: 'Default warehouse' }, type: 'text', value: 'مستودع رئيسي' },
          { id: 'negativeStock', label: { ar: 'السماح بالمخزون السالب', en: 'Allow negative stock' }, type: 'toggle', value: false },
          { id: 'costingMethod', label: { ar: 'طريقة التكلفة', en: 'Costing method' }, type: 'select', value: 'المتوسط المرجح', options: [{ ar: 'المتوسط المرجح', en: 'Weighted Average' }, { ar: 'FIFO', en: 'FIFO' }] },
          { id: 'barcodeMode', label: { ar: 'سلوك الباركود/QR', en: 'Barcode/QR behavior' }, type: 'select', value: 'توليد تلقائي', options: [{ ar: 'توليد تلقائي', en: 'Auto generate' }, { ar: 'يدوي', en: 'Manual' }] },
          { id: 'adjustmentApproval', label: { ar: 'اعتماد تسويات المخزون', en: 'Stock adjustment approval' }, type: 'toggle', value: true },
          { id: 'lowStockThreshold', label: { ar: 'حد التنبيه للمخزون المنخفض', en: 'Low stock threshold' }, type: 'number', value: '12' },
          { id: 'itemCodePattern', label: { ar: 'نمط كود الصنف', en: 'Item code pattern' }, type: 'text', value: 'ITM-{00000}' },
        ],
      },
    ],
  },
  {
    id: 'sales',
    group: 'operations',
    icon: '🧾',
    route: '/settings/sales',
    title: { ar: 'إعدادات المبيعات', en: 'Sales Settings' },
    description: { ar: 'حسابات البيع، الائتمان، الخصومات، الطباعة، وطريقة الدفع الافتراضية.', en: 'Sales accounts, credit, discounts, printing, and default payment method.' },
    permission: 'settings.sales.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'sales-rules',
        type: 'fields',
        title: { ar: 'قواعد المبيعات', en: 'Sales rules' },
        fields: [
          { id: 'defaultSalesAccount', label: { ar: 'حساب المبيعات الافتراضي', en: 'Default sales account' }, type: 'text', value: '4100 - إيرادات المبيعات' },
          { id: 'defaultCustomer', label: { ar: 'العميل الافتراضي', en: 'Default customer' }, type: 'text', value: 'عميل نقدي' },
          { id: 'creditSales', label: { ar: 'السماح بالبيع الآجل', en: 'Allow credit sales' }, type: 'toggle', value: true },
          { id: 'creditLimitBehavior', label: { ar: 'سلوك حد الائتمان', en: 'Credit limit behavior' }, type: 'select', value: 'تحذير ثم اعتماد', options: [{ ar: 'تحذير فقط', en: 'Warn only' }, { ar: 'تحذير ثم اعتماد', en: 'Warn then approve' }, { ar: 'منع', en: 'Block' }] },
          { id: 'discountApproval', label: { ar: 'اعتماد الخصومات', en: 'Discount approval' }, type: 'toggle', value: true },
          { id: 'priceIncludesTax', label: { ar: 'السعر شامل الضريبة', en: 'Price includes tax' }, type: 'toggle', value: false },
          { id: 'defaultPaymentMethod', label: { ar: 'طريقة الدفع الافتراضية', en: 'Default payment method' }, type: 'select', value: 'نقدي', options: [{ ar: 'نقدي', en: 'Cash' }, { ar: 'تحويل بنكي', en: 'Bank transfer' }, { ar: 'آجل', en: 'Credit' }] },
        ],
      },
    ],
  },
  {
    id: 'purchases',
    group: 'operations',
    icon: '🛒',
    route: '/settings/purchases',
    title: { ar: 'إعدادات المشتريات', en: 'Purchase Settings' },
    description: { ar: 'حساب المشتريات، اعتماد الشراء، الاستلام قبل الفاتورة، وشروط الدفع.', en: 'Purchase account, approval, receiving before invoice, and payment terms.' },
    permission: 'settings.purchases.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'purchase-rules',
        type: 'fields',
        title: { ar: 'قواعد المشتريات', en: 'Purchase rules' },
        fields: [
          { id: 'defaultPurchaseAccount', label: { ar: 'حساب المشتريات الافتراضي', en: 'Default purchase account' }, type: 'text', value: '5100 - مشتريات' },
          { id: 'defaultSupplier', label: { ar: 'المورد الافتراضي', en: 'Default supplier' }, type: 'text', value: 'مورد عام' },
          { id: 'purchaseApproval', label: { ar: 'اعتماد المشتريات', en: 'Require purchase approval' }, type: 'toggle', value: true },
          { id: 'receiveBeforeInvoice', label: { ar: 'اشتراط الاستلام قبل فاتورة المورد', en: 'Require receiving before supplier invoice' }, type: 'toggle', value: true },
          { id: 'supplierInvoiceMatching', label: { ar: 'مطابقة فاتورة المورد', en: 'Supplier invoice matching' }, type: 'select', value: 'فاتورة + أمر شراء + استلام', options: [{ ar: 'فاتورة فقط', en: 'Invoice only' }, { ar: 'فاتورة + أمر شراء + استلام', en: 'Invoice + PO + receipt' }] },
          { id: 'defaultPaymentTerms', label: { ar: 'شروط الدفع الافتراضية', en: 'Default payment terms' }, type: 'select', value: '30 يوم', options: [{ ar: 'نقدي', en: 'Cash' }, { ar: '15 يوم', en: '15 days' }, { ar: '30 يوم', en: '30 days' }] },
          { id: 'purchasePriceIncludesTax', label: { ar: 'سعر الشراء شامل الضريبة', en: 'Purchase price includes tax' }, type: 'toggle', value: false },
        ],
      },
    ],
  },
  {
    id: 'parties',
    group: 'operations',
    icon: '🤝',
    route: '/settings/parties',
    title: { ar: 'العملاء والموردون', en: 'Customers and Suppliers Settings' },
    description: { ar: 'أنماط الأكواد، الحقول المطلوبة، حدود الائتمان، وقوالب كشوف الحساب.', en: 'Code patterns, required fields, credit limits, and statement templates.' },
    permission: 'settings.parties.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'party-rules',
        type: 'fields',
        title: { ar: 'قواعد العملاء والموردين', en: 'Party rules' },
        fields: [
          { id: 'customerCodePattern', label: { ar: 'نمط كود العميل', en: 'Customer code pattern' }, type: 'text', value: 'CUS-{00000}' },
          { id: 'supplierCodePattern', label: { ar: 'نمط كود المورد', en: 'Supplier code pattern' }, type: 'text', value: 'SUP-{00000}' },
          { id: 'requirePhone', label: { ar: 'اشتراط الهاتف', en: 'Require phone' }, type: 'toggle', value: true },
          { id: 'requireTaxNo', label: { ar: 'اشتراط الرقم الضريبي عند الفاتورة', en: 'Require tax number for invoice' }, type: 'toggle', value: false },
          { id: 'agingBuckets', label: { ar: 'شرائح أعمار الديون', en: 'Aging buckets' }, type: 'text', value: '0-30, 31-60, 61-90, +90' },
          { id: 'statementTemplate', label: { ar: 'قالب كشف الحساب', en: 'Statement template' }, type: 'select', value: 'A4 موحد', options: [{ ar: 'A4 موحد', en: 'Unified A4' }, { ar: 'مختصر', en: 'Compact' }] },
        ],
      },
    ],
  },
  {
    id: 'notifications',
    group: 'administration',
    icon: '🔔',
    route: '/settings/notifications',
    title: { ar: 'الإشعارات والرسائل', en: 'Notifications and Messages' },
    description: { ar: 'قوالب الإشعارات ورسائل البريد/واتساب دون إظهار أسرار الاتصال.', en: 'Notification and message templates without exposing secrets.' },
    permission: 'settings.notifications.manage',
    status: 'needs-review',
    affectsSystemBehavior: false,
    panels: [
      {
        id: 'notification-rules',
        type: 'fields',
        title: { ar: 'قنوات الإشعار', en: 'Notification channels' },
        fields: [
          { id: 'systemNotifications', label: { ar: 'إشعارات النظام', en: 'System notifications' }, type: 'toggle', value: true },
          { id: 'emailEnabled', label: { ar: 'البريد الإلكتروني', en: 'Email' }, type: 'select', value: 'واجهة جاهزة', options: [{ ar: 'واجهة جاهزة', en: 'UI ready' }, { ar: 'معطل', en: 'Disabled' }] },
          { id: 'whatsappEnabled', label: { ar: 'واتساب/SMS', en: 'WhatsApp/SMS' }, type: 'select', value: 'بانتظار التكامل', options: [{ ar: 'بانتظار التكامل', en: 'Waiting integration' }, { ar: 'معطل', en: 'Disabled' }] },
        ],
      },
      {
        id: 'notification-templates',
        type: 'table',
        title: { ar: 'قوالب الرسائل', en: 'Message templates' },
        columns: [
          { key: 'event', label: { ar: 'الحدث', en: 'Event' } },
          { key: 'channel', label: { ar: 'القناة', en: 'Channel' } },
          { key: 'state', label: { ar: 'الحالة', en: 'State' } },
        ],
        rows: [
          { event: 'إصدار فاتورة', channel: 'داخل النظام', state: 'نشط' },
          { event: 'استلام دفعة', channel: 'داخل النظام', state: 'نشط' },
          { event: 'انخفاض المخزون', channel: 'داخل النظام', state: 'نشط' },
          { event: 'اعتماد بانتظار الموافقة', channel: 'داخل النظام', state: 'نشط' },
        ],
      },
    ],
  },
  {
    id: 'integrations',
    group: 'administration',
    icon: '🔌',
    route: '/settings/integrations',
    title: { ar: 'التكاملات', en: 'Integrations' },
    description: { ar: 'نقاط تكامل API، الأرشفة، التخزين، و Webhooks المستقبلية.', en: 'API, archive, storage, and webhook integration points.' },
    permission: 'settings.integrations.manage',
    status: 'needs-review',
    affectsSystemBehavior: false,
    panels: [
      {
        id: 'integrations-fields',
        type: 'fields',
        title: { ar: 'إعدادات التكامل', en: 'Integration settings' },
        fields: [
          { id: 'externalApi', label: { ar: 'API خارجي', en: 'External API' }, type: 'select', value: 'غير مربوط', options: [{ ar: 'غير مربوط', en: 'Not connected' }, { ar: 'جاهز للربط', en: 'Ready' }] },
          { id: 'pdfArchive', label: { ar: 'أرشفة PDF', en: 'PDF archive' }, type: 'select', value: 'محلي حالياً', options: [{ ar: 'محلي حالياً', en: 'Local for now' }, { ar: 'تخزين خارجي لاحقاً', en: 'External later' }] },
          { id: 'webhooks', label: { ar: 'Webhooks', en: 'Webhooks' }, type: 'toggle', value: false },
        ],
      },
      {
        id: 'connection-test',
        type: 'danger',
        title: { ar: 'اختبار الاتصال', en: 'Connection test' },
        description: { ar: 'زر الاختبار معطل حتى يتم تعريف مزود التكامل ومفاتيح الاتصال في الخلفية.', en: 'Test is disabled until providers and secrets are configured server-side.' },
        actionLabel: { ar: 'اختبار الاتصال', en: 'Test connection' },
        disabledReason: { ar: 'لا يتم عرض مفاتيح سرية داخل الواجهة.', en: 'Secrets are not exposed in the frontend.' },
      },
    ],
  },
  {
    id: 'security',
    group: 'administration',
    icon: '🔒',
    route: '/settings/security',
    title: { ar: 'الأمان والجلسات', en: 'Security and Sessions' },
    description: { ar: 'سياسة كلمات المرور، الجلسات، التدقيق، واشتراط سبب للإجراءات الحساسة.', en: 'Password policy, sessions, audit requirements, and critical action reasons.' },
    permission: 'settings.security.manage',
    status: 'ready',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'security-rules',
        type: 'fields',
        title: { ar: 'سياسات الأمان', en: 'Security policies' },
        fields: [
          { id: 'passwordLength', label: { ar: 'الحد الأدنى لطول كلمة المرور', en: 'Minimum password length' }, type: 'number', value: '8' },
          { id: 'sessionTimeout', label: { ar: 'انتهاء الجلسة بالدقائق', en: 'Session timeout minutes' }, type: 'number', value: '60' },
          { id: 'loginAttempts', label: { ar: 'حد محاولات الدخول', en: 'Login attempt limit' }, type: 'number', value: '5' },
          { id: 'twoFactor', label: { ar: 'OTP/2FA لاحقاً', en: 'OTP/2FA later' }, type: 'toggle', value: false },
          { id: 'auditCritical', label: { ar: 'تدقيق الإجراءات الحساسة', en: 'Audit critical actions' }, type: 'toggle', value: true },
          { id: 'requireReason', label: { ar: 'اشتراط سبب للحذف/الإلغاء/العكس', en: 'Require reason for delete/cancel/reverse' }, type: 'toggle', value: true },
        ],
      },
    ],
  },
  {
    id: 'backup',
    group: 'administration',
    icon: '🗄️',
    route: '/settings/backup',
    title: { ar: 'النسخ الاحتياطي والاستعادة', en: 'Backup and Restore' },
    description: { ar: 'حالة النسخ، التصدير، الاستيراد، ونقاط ربط PostgreSQL بدون تنفيذ استعادة خطرة.', en: 'Backup status, export/import, and PostgreSQL integration points without destructive restore.' },
    permission: 'settings.backup.manage',
    status: 'danger',
    affectsSystemBehavior: true,
    dangerous: true,
    panels: [
      {
        id: 'backup-status',
        type: 'fields',
        title: { ar: 'حالة النسخ', en: 'Backup status' },
        fields: [
          { id: 'lastBackup', label: { ar: 'آخر نسخة احتياطية', en: 'Last backup' }, type: 'text', value: '2026-06-21 02:00' },
          { id: 'backupTarget', label: { ar: 'وجهة النسخ', en: 'Backup target' }, type: 'select', value: 'خادم PostgreSQL - نقطة ربط', options: [{ ar: 'خادم PostgreSQL - نقطة ربط', en: 'PostgreSQL integration point' }, { ar: 'ملف محلي', en: 'Local file' }] },
          { id: 'autoBackup', label: { ar: 'نسخ تلقائي', en: 'Automatic backup' }, type: 'toggle', value: true },
        ],
      },
      {
        id: 'restore-danger',
        type: 'danger',
        title: { ar: 'استعادة نسخة احتياطية', en: 'Restore backup' },
        description: { ar: 'الاستعادة إجراء حساس ومتعمد تعطيله حتى يتم ربط Backend مع تأكيد متعدد الخطوات.', en: 'Restore is sensitive and intentionally disabled until backend and multi-step confirmation are connected.' },
        actionLabel: { ar: 'استعادة نسخة', en: 'Restore backup' },
        disabledReason: { ar: 'إجراء حساس يتطلب صلاحية مدير النظام وربط PostgreSQL.', en: 'Sensitive action requiring admin permission and PostgreSQL backend.' },
      },
    ],
  },
  {
    id: 'audit-log',
    group: 'administration',
    icon: '📜',
    route: '/settings/audit-log',
    title: { ar: 'سجل التدقيق', en: 'Audit Log' },
    description: { ar: 'سجل إجراءات المستخدمين مع فلاتر حسب المستخدم والوحدة والتاريخ.', en: 'User action log with filters by user, module, and date.' },
    permission: 'settings.audit_log.view',
    status: 'ready',
    affectsSystemBehavior: false,
    panels: [
      {
        id: 'audit-filters',
        type: 'fields',
        title: { ar: 'فلاتر السجل', en: 'Audit filters' },
        fields: [
          { id: 'auditUser', label: { ar: 'المستخدم', en: 'User' }, type: 'text', value: '' },
          { id: 'auditModule', label: { ar: 'الوحدة', en: 'Module' }, type: 'select', value: 'الكل', options: [{ ar: 'الكل', en: 'All' }, { ar: 'المالية', en: 'Finance' }, { ar: 'الإعدادات', en: 'Settings' }, { ar: 'المخزون', en: 'Inventory' }] },
          { id: 'auditDate', label: { ar: 'التاريخ', en: 'Date' }, type: 'date', value: '2026-06-21' },
        ],
      },
      {
        id: 'audit-events',
        type: 'audit',
        title: { ar: 'الأحداث', en: 'Events' },
        events: [
          { user: 'المدير العام', action: { ar: 'تحديث إعدادات الشركة', en: 'Updated company settings' }, module: { ar: 'الإعدادات', en: 'Settings' }, at: '2026-06-21 11:20', summary: { ar: 'تعديل بيانات الهوية والمستندات.', en: 'Identity and document settings changed.' } },
          { user: 'المحاسب العام', action: { ar: 'اعتماد قيد', en: 'Approved journal entry' }, module: { ar: 'المالية', en: 'Finance' }, at: '2026-06-21 10:35', summary: { ar: 'قيد JV-2034 جاهز للترحيل.', en: 'JV-2034 ready for posting.' } },
        ],
      },
    ],
  },
  {
    id: 'system',
    group: 'general',
    icon: '⚙️',
    route: '/settings/system',
    title: { ar: 'تفضيلات النظام', en: 'System Preferences' },
    description: { ar: 'تفضيلات العرض، الصفحة الافتراضية، كثافة الجداول، والتأكيدات.', en: 'Display, default page, table density, and confirmation preferences.' },
    permission: 'settings.system.manage',
    status: 'configured',
    affectsSystemBehavior: false,
    panels: [
      {
        id: 'system-preferences',
        type: 'fields',
        title: { ar: 'تفضيلات الاستخدام', en: 'Usage preferences' },
        fields: [
          { id: 'theme', label: { ar: 'المظهر', en: 'Theme' }, type: 'select', value: 'حسب النظام', options: [{ ar: 'فاتح', en: 'Light' }, { ar: 'داكن', en: 'Dark' }, { ar: 'حسب النظام', en: 'System' }] },
          { id: 'compactMode', label: { ar: 'وضع مضغوط', en: 'Compact mode' }, type: 'toggle', value: false },
          { id: 'defaultDashboard', label: { ar: 'الصفحة الافتراضية', en: 'Default page' }, type: 'select', value: 'لوحة التحكم', options: [{ ar: 'لوحة التحكم', en: 'Dashboard' }, { ar: 'المالية', en: 'Finance' }, { ar: 'التقارير', en: 'Reports' }] },
          { id: 'defaultDateRange', label: { ar: 'نطاق التاريخ الافتراضي', en: 'Default date range' }, type: 'select', value: 'الشهر الحالي', options: [{ ar: 'اليوم', en: 'Today' }, { ar: 'الشهر الحالي', en: 'This month' }, { ar: 'السنة الحالية', en: 'This year' }] },
          { id: 'tableDensity', label: { ar: 'كثافة الجداول', en: 'Table density' }, type: 'select', value: 'متوسطة', options: [{ ar: 'مريحة', en: 'Comfortable' }, { ar: 'متوسطة', en: 'Medium' }, { ar: 'مضغوطة', en: 'Compact' }] },
          { id: 'itemsPerPage', label: { ar: 'عدد الصفوف في الصفحة', en: 'Items per page' }, type: 'number', value: '25' },
          { id: 'dangerConfirmations', label: { ar: 'تأكيد الإجراءات الحساسة', en: 'Danger confirmations' }, type: 'toggle', value: true },
        ],
      },
    ],
  },
  {
    id: 'license',
    group: 'administration',
    icon: '🪪',
    route: '/settings/license',
    title: { ar: 'الترخيص والتفعيل', en: 'License and Activation' },
    description: { ar: 'واجهة جاهزة لعرض حالة الترخيص عند ربط آلية التفعيل.', en: 'Prepared license status surface for future activation flow.' },
    permission: 'settings.license.manage',
    status: 'needs-review',
    affectsSystemBehavior: true,
    panels: [
      {
        id: 'license-fields',
        type: 'fields',
        title: { ar: 'حالة الترخيص', en: 'License status' },
        fields: [
          { id: 'licenseState', label: { ar: 'الحالة', en: 'Status' }, type: 'select', value: 'تجريبي', options: [{ ar: 'تجريبي', en: 'Trial' }, { ar: 'مفعل', en: 'Activated' }, { ar: 'منتهي', en: 'Expired' }] },
          { id: 'activationCode', label: { ar: 'كود التفعيل', en: 'Activation code' }, type: 'text', value: 'ALM-AB-TRIAL' },
          { id: 'expiryDate', label: { ar: 'تاريخ الانتهاء', en: 'Expiry date' }, type: 'date', value: '2026-12-31' },
          { id: 'machineBinding', label: { ar: 'ربط بالجهاز/الشركة', en: 'Company/machine binding' }, type: 'text', value: 'غير مفعل حالياً' },
        ],
      },
    ],
  },
]

export function settingsText(value: SettingsText, locale: SettingsLocale) {
  return value[locale]
}

export function getDefaultSettingsValues() {
  const values: Record<string, string | boolean> = {}
  for (const section of SETTINGS_SECTIONS) {
    for (const panel of section.panels) {
      if (panel.type !== 'fields') continue
      for (const field of panel.fields) {
        values[`${section.id}.${field.id}`] = field.value
      }
    }
  }
  return values
}
