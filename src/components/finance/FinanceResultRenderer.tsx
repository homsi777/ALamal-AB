import { useMemo, useState } from 'react'
import { Badge } from '../ui/Badge'
import type { FinanceTaskWorkspace } from '../../data/financeTaskWorkspace'
import type { FinanceStatus } from '../../data/financeWorkspace'
import {
  cashboxKindLabels,
  cashboxTransferStatusLabels,
  cashboxTransfers,
  formatCashboxAmount,
  treasuryCashboxes,
  type CashboxCurrency,
  type CashboxKind,
  type CashboxTransfer,
  type TreasuryCashbox,
} from '../../data/treasuryCashboxes'
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

  if (layout === 'cashboxes') {
    return <CashboxesWorkspace locale={locale} />
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

type CashboxModal = 'create' | 'transfer' | null

function CashboxesWorkspace({ locale }: { locale: 'ar' | 'en' }) {
  const [cashboxes, setCashboxes] = useState<TreasuryCashbox[]>(treasuryCashboxes)
  const [transfers, setTransfers] = useState<CashboxTransfer[]>(cashboxTransfers)
  const [modal, setModal] = useState<CashboxModal>(null)
  const [createForm, setCreateForm] = useState({
    name: 'صندوق فرع جديد',
    branch: 'دمشق',
    responsible: 'أمين الصندوق',
    currency: 'USD' as CashboxCurrency,
    kind: 'branch' as CashboxKind,
    openingBalance: '0',
  })
  const [transferForm, setTransferForm] = useState({
    fromCashboxId: treasuryCashboxes[1]?.id ?? '',
    toCashboxId: treasuryCashboxes[0]?.id ?? '',
    amount: '250',
    currency: 'USD' as CashboxCurrency,
    date: '2026-06-22',
    requester: 'المدير المالي',
    note: 'مناقلة بين صناديق',
  })

  const usdBalance = useMemo(
    () => cashboxes.filter((cashbox) => cashbox.currency === 'USD').reduce((total, cashbox) => total + cashbox.balance, 0),
    [cashboxes],
  )
  const sypBalance = useMemo(
    () => cashboxes.filter((cashbox) => cashbox.currency === 'SYP').reduce((total, cashbox) => total + cashbox.balance, 0),
    [cashboxes],
  )
  const pendingTransfers = transfers.filter((transfer) => transfer.status === 'pendingReview').length
  const openSessions = cashboxes.filter((cashbox) => cashbox.status === 'warning' || cashbox.status === 'info').length
  const amount = Number(transferForm.amount)
  const sourceCashbox = cashboxes.find((cashbox) => cashbox.id === transferForm.fromCashboxId)
  const targetCashbox = cashboxes.find((cashbox) => cashbox.id === transferForm.toCashboxId)
  const transferError =
    !sourceCashbox || !targetCashbox
      ? locale === 'ar' ? 'حدد الصندوقين قبل تنفيذ المناقلة.' : 'Select both cashboxes first.'
      : sourceCashbox.id === targetCashbox.id
        ? locale === 'ar' ? 'لا يمكن المناقلة إلى نفس الصندوق.' : 'Source and target must be different.'
        : sourceCashbox.currency !== transferForm.currency || targetCashbox.currency !== transferForm.currency
          ? locale === 'ar' ? 'عملة المناقلة يجب أن تطابق عملة الصندوقين.' : 'Transfer currency must match both cashboxes.'
          : amount <= 0
            ? locale === 'ar' ? 'أدخل مبلغاً صحيحاً أكبر من صفر.' : 'Enter a valid amount greater than zero.'
            : amount > sourceCashbox.balance
              ? locale === 'ar' ? 'رصيد الصندوق المصدر غير كاف لهذه المناقلة.' : 'Source cashbox balance is not enough.'
              : ''

  const cashboxById = useMemo(() => new Map(cashboxes.map((cashbox) => [cashbox.id, cashbox])), [cashboxes])

  const createCashbox = () => {
    const openingBalance = Number(createForm.openingBalance) || 0
    const nextIndex = cashboxes.length + 1
    const newCashbox: TreasuryCashbox = {
      id: `box-${Date.now()}`,
      code: `BOX-${String(nextIndex).padStart(2, '0')}`,
      name: createForm.name.trim() || 'صندوق جديد',
      branch: createForm.branch.trim() || 'الإدارة',
      responsible: createForm.responsible.trim() || 'أمين الصندوق',
      currency: createForm.currency,
      kind: createForm.kind,
      balance: openingBalance,
      lastCloseAt: 'لم يغلق بعد',
      openSession: `CLS-${130 + nextIndex}`,
      status: 'info',
    }

    setCashboxes((current) => [newCashbox, ...current])
    setModal(null)
  }

  const postTransfer = () => {
    if (transferError || !sourceCashbox || !targetCashbox) return

    const newTransfer: CashboxTransfer = {
      id: `tr-${Date.now()}`,
      ref: `TR-CB-${900 + transfers.length + 1}`,
      fromCashboxId: sourceCashbox.id,
      toCashboxId: targetCashbox.id,
      amount,
      currency: transferForm.currency,
      date: transferForm.date,
      requester: transferForm.requester,
      note: transferForm.note,
      status: 'posted',
    }

    setCashboxes((current) =>
      current.map((cashbox) => {
        if (cashbox.id === sourceCashbox.id) return { ...cashbox, balance: cashbox.balance - amount, status: 'success' }
        if (cashbox.id === targetCashbox.id) return { ...cashbox, balance: cashbox.balance + amount, status: 'success' }
        return cashbox
      }),
    )
    setTransfers((current) => [newTransfer, ...current])
    setModal(null)
  }

  return (
    <div className="treasury-cashboxes">
      <section className="treasury-cashboxes__hero">
        <div>
          <span>{locale === 'ar' ? 'المسار المحاسبي' : 'Accounting path'}</span>
          <h3>{locale === 'ar' ? 'المالية > الخزينة > إدارة الصناديق' : 'Finance > Treasury > Cashbox management'}</h3>
          <p>
            {locale === 'ar'
              ? 'من هنا يتم إنشاء صندوق مالي، تغذية العهد، ومناقلة النقد بين الصناديق مع أثر رصيد فوري وسجل حركة جاهز للربط المحاسبي.'
              : 'Create cashboxes, fund petty cash, and transfer cash between boxes with instant balance impact and an accounting-ready movement log.'}
          </p>
        </div>
        <div className="treasury-cashboxes__actions">
          <button type="button" className="btn btn--accent" onClick={() => setModal('create')}>
            {locale === 'ar' ? 'إنشاء صندوق مالي' : 'Create cashbox'}
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setModal('transfer')}>
            {locale === 'ar' ? 'مناقلة بين صناديق' : 'Transfer between cashboxes'}
          </button>
        </div>
      </section>

      <section className="treasury-cashboxes__metrics" aria-label={locale === 'ar' ? 'ملخص الصناديق' : 'Cashbox summary'}>
        <div><span>{locale === 'ar' ? 'رصيد USD' : 'USD balance'}</span><strong>{formatCashboxAmount(usdBalance, 'USD')}</strong></div>
        <div><span>{locale === 'ar' ? 'رصيد SYP' : 'SYP balance'}</span><strong>{formatCashboxAmount(sypBalance, 'SYP')}</strong></div>
        <div><span>{locale === 'ar' ? 'صناديق فعالة' : 'Active boxes'}</span><strong>{cashboxes.length}</strong></div>
        <div><span>{locale === 'ar' ? 'مناقلات معلقة' : 'Pending transfers'}</span><strong>{pendingTransfers}</strong></div>
        <div><span>{locale === 'ar' ? 'إقفالات مفتوحة' : 'Open closes'}</span><strong>{openSessions}</strong></div>
      </section>

      <section className="treasury-cashboxes__grid">
        <div className="treasury-cashboxes__panel">
          <div className="treasury-cashboxes__panel-head">
            <div>
              <h3>{locale === 'ar' ? 'الصناديق المالية' : 'Cashboxes'}</h3>
              <p>{locale === 'ar' ? 'الرصيد الحالي، المسؤول، آخر إقفال، وحالة الصندوق.' : 'Current balance, owner, last close, and box state.'}</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table finance-specific-table treasury-cashboxes__table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'الكود' : 'Code'}</th>
                  <th>{locale === 'ar' ? 'الصندوق' : 'Cashbox'}</th>
                  <th>{locale === 'ar' ? 'الفرع' : 'Branch'}</th>
                  <th>{locale === 'ar' ? 'المسؤول' : 'Responsible'}</th>
                  <th>{locale === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{locale === 'ar' ? 'الرصيد' : 'Balance'}</th>
                  <th>{locale === 'ar' ? 'آخر إقفال' : 'Last close'}</th>
                  <th>{locale === 'ar' ? 'الحالة' : 'State'}</th>
                </tr>
              </thead>
              <tbody>
                {cashboxes.map((cashbox) => (
                  <tr key={cashbox.id}>
                    <td>{cashbox.code}</td>
                    <td><strong>{cashbox.name}</strong><small>{cashbox.openSession}</small></td>
                    <td>{cashbox.branch}</td>
                    <td>{cashbox.responsible}</td>
                    <td>{cashboxKindLabels[cashbox.kind][locale]}</td>
                    <td className="data-table__number">{formatCashboxAmount(cashbox.balance, cashbox.currency)}</td>
                    <td>{cashbox.lastCloseAt}</td>
                    <td><Badge variant={cashbox.status}>{cashbox.status === 'success' ? (locale === 'ar' ? 'مطابق' : 'Matched') : cashbox.status === 'warning' ? (locale === 'ar' ? 'مراجعة' : 'Review') : (locale === 'ar' ? 'مفتوح' : 'Open')}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="treasury-cashboxes__panel">
          <div className="treasury-cashboxes__panel-head">
            <div>
              <h3>{locale === 'ar' ? 'سجل المناقلات' : 'Transfer log'}</h3>
              <p>{locale === 'ar' ? 'كل مناقلة تحفظ المصدر والوجهة والمبلغ والاعتماد.' : 'Every transfer keeps source, destination, amount, and approval state.'}</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table finance-specific-table treasury-cashboxes__table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'المرجع' : 'Ref'}</th>
                  <th>{locale === 'ar' ? 'من صندوق' : 'From'}</th>
                  <th>{locale === 'ar' ? 'إلى صندوق' : 'To'}</th>
                  <th>{locale === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{locale === 'ar' ? 'الطالب' : 'Requester'}</th>
                  <th>{locale === 'ar' ? 'الحالة' : 'State'}</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => {
                  const status = cashboxTransferStatusLabels[transfer.status]
                  return (
                    <tr key={transfer.id}>
                      <td>{transfer.ref}</td>
                      <td>{cashboxById.get(transfer.fromCashboxId)?.name ?? '-'}</td>
                      <td>{cashboxById.get(transfer.toCashboxId)?.name ?? '-'}</td>
                      <td className="data-table__number">{formatCashboxAmount(transfer.amount, transfer.currency)}</td>
                      <td>{transfer.date}</td>
                      <td>{transfer.requester}</td>
                      <td><Badge variant={status.variant}>{status.label[locale]}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modal === 'create' && (
        <CashboxModalFrame
          title={locale === 'ar' ? 'إنشاء صندوق مالي' : 'Create cashbox'}
          subtitle={locale === 'ar' ? 'تعريف صندوق جديد مع الفرع والمسؤول والعملة والرصيد الافتتاحي.' : 'Define a new cashbox with branch, owner, currency, and opening balance.'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="btn btn--ghost" onClick={() => setModal(null)}>{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="button" className="btn btn--primary" onClick={createCashbox}>{locale === 'ar' ? 'حفظ الصندوق' : 'Save cashbox'}</button>
            </>
          }
        >
          <div className="treasury-cashboxes__form">
            <label><span>{locale === 'ar' ? 'اسم الصندوق' : 'Cashbox name'}</span><input className="form-input" value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} /></label>
            <label><span>{locale === 'ar' ? 'الفرع' : 'Branch'}</span><input className="form-input" value={createForm.branch} onChange={(event) => setCreateForm((form) => ({ ...form, branch: event.target.value }))} /></label>
            <label><span>{locale === 'ar' ? 'المسؤول' : 'Responsible'}</span><input className="form-input" value={createForm.responsible} onChange={(event) => setCreateForm((form) => ({ ...form, responsible: event.target.value }))} /></label>
            <label><span>{locale === 'ar' ? 'العملة' : 'Currency'}</span><select className="form-input" value={createForm.currency} onChange={(event) => setCreateForm((form) => ({ ...form, currency: event.target.value as CashboxCurrency }))}><option value="USD">USD</option><option value="SYP">SYP</option></select></label>
            <label><span>{locale === 'ar' ? 'نوع الصندوق' : 'Type'}</span><select className="form-input" value={createForm.kind} onChange={(event) => setCreateForm((form) => ({ ...form, kind: event.target.value as CashboxKind }))}><option value="main">{cashboxKindLabels.main[locale]}</option><option value="branch">{cashboxKindLabels.branch[locale]}</option><option value="petty">{cashboxKindLabels.petty[locale]}</option></select></label>
            <label><span>{locale === 'ar' ? 'رصيد افتتاحي' : 'Opening balance'}</span><input className="form-input" type="number" min="0" value={createForm.openingBalance} onChange={(event) => setCreateForm((form) => ({ ...form, openingBalance: event.target.value }))} /></label>
          </div>
        </CashboxModalFrame>
      )}

      {modal === 'transfer' && (
        <CashboxModalFrame
          title={locale === 'ar' ? 'مناقلة بين صناديق' : 'Transfer between cashboxes'}
          subtitle={locale === 'ar' ? 'اختر الصندوق المصدر والوجهة والمبلغ؛ يتم تحديث الأرصدة مباشرة في الواجهة.' : 'Choose source, target, and amount; balances update immediately in the UI.'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="btn btn--ghost" onClick={() => setModal(null)}>{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="button" className="btn btn--primary" disabled={Boolean(transferError)} onClick={postTransfer}>{locale === 'ar' ? 'تنفيذ المناقلة' : 'Post transfer'}</button>
            </>
          }
        >
          <div className="treasury-cashboxes__form">
            <label><span>{locale === 'ar' ? 'من صندوق' : 'From cashbox'}</span><select className="form-input" value={transferForm.fromCashboxId} onChange={(event) => setTransferForm((form) => ({ ...form, fromCashboxId: event.target.value }))}>{cashboxes.map((cashbox) => <option key={cashbox.id} value={cashbox.id}>{cashbox.name} - {formatCashboxAmount(cashbox.balance, cashbox.currency)}</option>)}</select></label>
            <label><span>{locale === 'ar' ? 'إلى صندوق' : 'To cashbox'}</span><select className="form-input" value={transferForm.toCashboxId} onChange={(event) => setTransferForm((form) => ({ ...form, toCashboxId: event.target.value }))}>{cashboxes.map((cashbox) => <option key={cashbox.id} value={cashbox.id}>{cashbox.name} - {cashbox.currency}</option>)}</select></label>
            <label><span>{locale === 'ar' ? 'العملة' : 'Currency'}</span><select className="form-input" value={transferForm.currency} onChange={(event) => setTransferForm((form) => ({ ...form, currency: event.target.value as CashboxCurrency }))}><option value="USD">USD</option><option value="SYP">SYP</option></select></label>
            <label><span>{locale === 'ar' ? 'المبلغ' : 'Amount'}</span><input className="form-input" type="number" min="1" value={transferForm.amount} onChange={(event) => setTransferForm((form) => ({ ...form, amount: event.target.value }))} /></label>
            <label><span>{locale === 'ar' ? 'التاريخ' : 'Date'}</span><input className="form-input" type="date" value={transferForm.date} onChange={(event) => setTransferForm((form) => ({ ...form, date: event.target.value }))} /></label>
            <label><span>{locale === 'ar' ? 'طالب المناقلة' : 'Requester'}</span><input className="form-input" value={transferForm.requester} onChange={(event) => setTransferForm((form) => ({ ...form, requester: event.target.value }))} /></label>
            <label className="treasury-cashboxes__form-wide"><span>{locale === 'ar' ? 'ملاحظات' : 'Notes'}</span><textarea className="form-input" rows={3} value={transferForm.note} onChange={(event) => setTransferForm((form) => ({ ...form, note: event.target.value }))} /></label>
          </div>
          {transferError && <p className="treasury-cashboxes__error">{transferError}</p>}
        </CashboxModalFrame>
      )}
    </div>
  )
}

function CashboxModalFrame({
  title,
  subtitle,
  children,
  footer,
  onClose,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="treasury-cashboxes-modal" role="dialog" aria-modal="true">
      <button type="button" className="treasury-cashboxes-modal__backdrop" onClick={onClose} aria-label="إغلاق" />
      <div className="treasury-cashboxes-modal__panel">
        <header className="treasury-cashboxes-modal__header">
          <div>
            <span>الخزينة</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="treasury-cashboxes-modal__close" onClick={onClose} aria-label="إغلاق">×</button>
        </header>
        <div className="treasury-cashboxes-modal__body">{children}</div>
        <footer className="treasury-cashboxes-modal__footer">{footer}</footer>
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
