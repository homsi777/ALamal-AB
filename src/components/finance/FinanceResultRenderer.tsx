import { Badge } from '../ui/Badge'
import type { FinanceTaskWorkspace } from '../../data/financeTaskWorkspace'
import type { FinanceStatus } from '../../data/financeWorkspace'
import { text } from './financeLabels'

type FinanceResultRendererProps = {
  workspace: FinanceTaskWorkspace
  locale: 'ar' | 'en'
}

type Column = {
  key: string
  label: string
  numeric?: boolean
}

type Row = Record<string, string | { label: string; variant: FinanceStatus }>

const journalLines: Row[] = [
  { account: '5100 - مصاريف شحن', debit: '$1,250', credit: '$0', costCenter: 'لوجستيك', note: 'استحقاق مصاريف شحن' },
  { account: '2100 - ذمم موردين', debit: '$0', credit: '$1,250', costCenter: 'لوجستيك', note: 'مكتب التخليص الجمركي' },
  { account: '1200 - صندوق دمشق', debit: '$3,000', credit: '$0', costCenter: 'فرع دمشق', note: 'إقفال صندوق يومي' },
  { account: '4100 - إيرادات نقدية', debit: '$0', credit: '$3,000', costCenter: 'فرع دمشق', note: 'مبيعات نقدية' },
]

const rowsByLayout: Partial<Record<string, Row[]>> = {
  'chart-of-accounts': [
    { code: '1000', name: 'الأصول', type: 'رئيسي', parent: '-', balance: '$186,500', state: { label: 'نشط', variant: 'success' } },
    { code: '1100', name: 'الصندوق الرئيسي', type: 'نقدية', parent: '1000', balance: '$24,800', state: { label: 'نشط', variant: 'success' } },
    { code: '2100', name: 'ذمم الموردين', type: 'التزام', parent: '2000', balance: '$18,420', state: { label: 'مراجعة', variant: 'warning' } },
  ],
  'supplier-invoices': [
    { supplier: 'شركة الحرير الدولية', invoice: 'AP-778', date: '2026-06-18', due: '2026-06-24', amount: '$8,950', tax: '$716', approval: { label: 'قيد الاعتماد', variant: 'warning' }, payment: { label: 'غير مدفوع', variant: 'danger' } },
    { supplier: 'مكتب التخليص الجمركي', invoice: 'AP-777', date: '2026-06-17', due: '2026-06-22', amount: '$2,140', tax: '$171', approval: { label: 'جاهز', variant: 'info' }, payment: { label: 'مجدول', variant: 'warning' } },
  ],
  receipts: [
    { customer: 'مؤسسة النور', receipt: 'RC-442', date: '2026-06-21', amount: '$2,500', method: 'نقدي', account: 'الصندوق الرئيسي', invoice: 'AR-902', remaining: '$1,240', state: { label: 'مرحّل', variant: 'success' } },
    { customer: 'شركة الشام', receipt: 'RC-441', date: '2026-06-21', amount: '$5,350', method: 'تحويل بنكي', account: 'بنك الشام', invoice: 'AR-901', remaining: '$0', state: { label: 'مطابق', variant: 'success' } },
  ],
  'bank-reconciliation': [
    { bankRow: 'تحويل وارد - مؤسسة النور', bankAmount: '$5,350', systemRow: 'RC-441', systemAmount: '$5,350', difference: '$0', state: { label: 'مطابق', variant: 'success' } },
    { bankRow: 'عمولة بنك', bankAmount: '$40', systemRow: 'غير موجود', systemAmount: '$0', difference: '$40', state: { label: 'غير مطابق', variant: 'warning' } },
    { bankRow: 'دفعة مورد', bankAmount: '$370', systemRow: 'PO-501', systemAmount: '$0', difference: '$370', state: { label: 'غير مطابق', variant: 'warning' } },
  ],
  'assets-register': [
    { code: 'FA-044', asset: 'رافعة مستودع', type: 'معدات', location: 'المستودع', custodian: 'أمين المستودع', acquired: '2026-06-18', cost: '$18,000', method: 'قسط ثابت', accumulated: '$900', book: '$17,100', state: { label: 'نشط', variant: 'success' } },
    { code: 'FA-043', asset: 'طابعة فواتير', type: 'أجهزة', location: 'المبيعات', custodian: 'مشرف المبيعات', acquired: '2026-06-15', cost: '$620', method: 'قسط ثابت', accumulated: '$20', book: '$600', state: { label: 'نشط', variant: 'success' } },
  ],
  'tax-period': [
    { source: 'فواتير بيع', count: '86', base: '$104,000', tax: '$8,320', state: { label: 'مراجعة', variant: 'info' } },
    { source: 'فواتير شراء', count: '42', base: '$49,250', tax: '$3,940', state: { label: 'مطابق', variant: 'success' } },
    { source: 'مستندات ناقصة', count: '1', base: '$0', tax: '$0', state: { label: 'تنبيه', variant: 'warning' } },
  ],
  cogs: [
    { item: 'قطن مطبوع', invoice: 'INV-2301', customer: 'مؤسسة النور', revenue: '$12,600', direct: '$8,900', indirect: '$1,910', total: '$10,810', margin: '14.2%', state: { label: 'هامش منخفض', variant: 'warning' } },
    { item: 'حرير طبيعي ذهبي', invoice: 'INV-2300', customer: 'شركة الشام', revenue: '$21,400', direct: '$11,600', indirect: '$1,560', total: '$13,160', margin: '38.5%', state: { label: 'جيد', variant: 'success' } },
  ],
}

const defaultColumns: Record<string, Column[]> = {
  'chart-of-accounts': [
    { key: 'code', label: 'كود الحساب' },
    { key: 'name', label: 'اسم الحساب' },
    { key: 'type', label: 'النوع' },
    { key: 'parent', label: 'الحساب الأب' },
    { key: 'balance', label: 'الرصيد', numeric: true },
    { key: 'state', label: 'الحالة' },
  ],
  'supplier-invoices': [
    { key: 'supplier', label: 'المورد' },
    { key: 'invoice', label: 'رقم الفاتورة' },
    { key: 'date', label: 'تاريخ الفاتورة' },
    { key: 'due', label: 'الاستحقاق' },
    { key: 'amount', label: 'المبلغ', numeric: true },
    { key: 'tax', label: 'الضريبة', numeric: true },
    { key: 'approval', label: 'الاعتماد' },
    { key: 'payment', label: 'الدفع' },
  ],
  receipts: [
    { key: 'customer', label: 'العميل' },
    { key: 'receipt', label: 'رقم السند' },
    { key: 'date', label: 'التاريخ' },
    { key: 'amount', label: 'المبلغ', numeric: true },
    { key: 'method', label: 'طريقة الدفع' },
    { key: 'account', label: 'الصندوق/البنك' },
    { key: 'invoice', label: 'الفاتورة' },
    { key: 'remaining', label: 'المتبقي', numeric: true },
    { key: 'state', label: 'الحالة' },
  ],
  'bank-reconciliation': [
    { key: 'bankRow', label: 'حركة البنك' },
    { key: 'bankAmount', label: 'مبلغ البنك', numeric: true },
    { key: 'systemRow', label: 'حركة النظام' },
    { key: 'systemAmount', label: 'مبلغ النظام', numeric: true },
    { key: 'difference', label: 'الفرق', numeric: true },
    { key: 'state', label: 'الحالة' },
  ],
  'assets-register': [
    { key: 'code', label: 'كود الأصل' },
    { key: 'asset', label: 'الأصل' },
    { key: 'type', label: 'النوع' },
    { key: 'location', label: 'الموقع' },
    { key: 'custodian', label: 'المسؤول' },
    { key: 'acquired', label: 'تاريخ الاقتناء' },
    { key: 'cost', label: 'التكلفة', numeric: true },
    { key: 'method', label: 'الإهلاك' },
    { key: 'accumulated', label: 'مجمع الإهلاك', numeric: true },
    { key: 'book', label: 'القيمة الدفترية', numeric: true },
    { key: 'state', label: 'الحالة' },
  ],
  'tax-period': [
    { key: 'source', label: 'المصدر' },
    { key: 'count', label: 'عدد المستندات', numeric: true },
    { key: 'base', label: 'الأساس', numeric: true },
    { key: 'tax', label: 'الضريبة', numeric: true },
    { key: 'state', label: 'الحالة' },
  ],
  cogs: [
    { key: 'item', label: 'الصنف' },
    { key: 'invoice', label: 'الفاتورة' },
    { key: 'customer', label: 'العميل' },
    { key: 'revenue', label: 'الإيراد', numeric: true },
    { key: 'direct', label: 'تكلفة مباشرة', numeric: true },
    { key: 'indirect', label: 'تكلفة غير مباشرة', numeric: true },
    { key: 'total', label: 'إجمالي التكلفة', numeric: true },
    { key: 'margin', label: 'الهامش', numeric: true },
    { key: 'state', label: 'تنبيه' },
  ],
}

const fallbackColumns: Column[] = [
  { key: 'ref', label: 'المرجع' },
  { key: 'subject', label: 'البند' },
  { key: 'owner', label: 'المسؤول' },
  { key: 'amount', label: 'القيمة', numeric: true },
  { key: 'date', label: 'التاريخ' },
  { key: 'status', label: 'الحالة' },
]

export function getFinanceExportRows(workspace: FinanceTaskWorkspace) {
  const layout = workspace.definition.layout
  const rows = rowsByLayout[layout]
  if (rows) return rows.map(flattenRow)

  return workspace.module.rows.map((row) => ({
    ref: row.ref,
    subject: text(row.subject, 'ar'),
    owner: text(row.owner, 'ar'),
    amount: row.amount,
    date: row.date,
    status: text(row.status, 'ar'),
  }))
}

export function FinanceResultRenderer({ workspace, locale }: FinanceResultRendererProps) {
  const layout = workspace.definition.layout
  const rows = rowsByLayout[layout]
  const columns = defaultColumns[layout]

  if (layout === 'journal-entries') {
    return <JournalEntryWorkspace locale={locale} />
  }

  if (rows && columns) {
    return <FinanceSpecificTable rows={rows} columns={columns} />
  }

  return (
    <FinanceSpecificTable
      rows={workspace.module.rows.map((row) => ({
        ref: row.ref,
        subject: text(row.subject, locale),
        owner: text(row.owner, locale),
        amount: row.amount,
        date: row.date,
        status: { label: text(row.status, locale), variant: row.variant },
      }))}
      columns={fallbackColumns}
    />
  )
}

function JournalEntryWorkspace({ locale }: { locale: 'ar' | 'en' }) {
  const totalDebit = 4250
  const totalCredit = 4250
  const difference = totalDebit - totalCredit

  return (
    <div className="finance-journal-workspace">
      <div className="finance-document-summary">
        <div><span>{locale === 'ar' ? 'رقم القيد' : 'Entry no.'}</span><strong>JV-2034</strong></div>
        <div><span>{locale === 'ar' ? 'التاريخ' : 'Date'}</span><strong>2026-06-21</strong></div>
        <div><span>{locale === 'ar' ? 'العملة' : 'Currency'}</span><strong>USD</strong></div>
        <div><span>{locale === 'ar' ? 'الوصف' : 'Description'}</span><strong>{locale === 'ar' ? 'تسوية مصاريف وتشغيل يومية' : 'Daily expense and operations accrual'}</strong></div>
      </div>

      <FinanceSpecificTable
        rows={journalLines}
        columns={[
          { key: 'account', label: locale === 'ar' ? 'الحساب' : 'Account' },
          { key: 'debit', label: locale === 'ar' ? 'مدين' : 'Debit', numeric: true },
          { key: 'credit', label: locale === 'ar' ? 'دائن' : 'Credit', numeric: true },
          { key: 'costCenter', label: locale === 'ar' ? 'مركز التكلفة' : 'Cost center' },
          { key: 'note', label: locale === 'ar' ? 'ملاحظات' : 'Notes' },
        ]}
      />

      <div className={`finance-balance-strip ${difference === 0 ? 'finance-balance-strip--ok' : 'finance-balance-strip--warn'}`}>
        <div><span>{locale === 'ar' ? 'إجمالي المدين' : 'Total debit'}</span><strong>$4,250</strong></div>
        <div><span>{locale === 'ar' ? 'إجمالي الدائن' : 'Total credit'}</span><strong>$4,250</strong></div>
        <div><span>{locale === 'ar' ? 'الفرق' : 'Difference'}</span><strong>$0.00</strong></div>
      </div>
    </div>
  )
}

function FinanceSpecificTable({ rows, columns }: { rows: Row[]; columns: Column[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table finance-specific-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className={column.numeric ? 'data-table__number' : undefined}>
                  {renderCell(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderCell(value: Row[string]) {
  if (typeof value === 'object' && value) {
    return <Badge variant={value.variant}>{value.label}</Badge>
  }
  return value
}

function flattenRow(row: Row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, typeof value === 'object' && value ? value.label : value]),
  )
}
