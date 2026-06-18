import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExportPreviewModal } from '../../components/ui/ExportPreviewModal'
import { GlossButton } from '../../components/ui/GlossButton'
import { useApp } from '../../context/AppProvider'
import type { CustomerStatementLine, CustomerVoucher, PartyRecord } from '../../data/parties'
import {
  exportInvoiceStatementExcel,
  exportInvoiceStatementPdf,
  exportStatementExcel,
  exportStatementPdf,
  getInvoiceExcelPreviewHtml,
  getInvoicePdfPreviewHtml,
  getStatementExcelPreviewHtml,
  getStatementPdfPreviewHtml,
  printStatementA4,
  shareStatementWhatsapp,
  type InvoiceExportLabels,
  type StatementExportLabels,
} from '../../utils/statementExport'

type PartyStatementServicesMenuProps = {
  party: PartyRecord
  partyName: string
  dateFrom: string
  dateTo: string
  lines: CustomerStatementLine[]
  vouchers: CustomerVoucher[]
  lineTotals: { pieces: number; lengths: number; amount: number }
  statementPrefix: string
}

type ServiceAction =
  | 'pdf'
  | 'excel'
  | 'print'
  | 'whatsapp'
  | 'previewAccountPdf'
  | 'previewAccountExcel'
  | 'previewInvoicePdf'
  | 'previewInvoiceExcel'
  | 'exportInvoicePdf'
  | 'exportInvoiceExcel'

type CardPosition = {
  mode: 'dropdown' | 'sheet'
  top?: number
  left?: number
  right?: number
  width: number
}

const serviceIcons: Record<ServiceAction, string> = {
  pdf: '📄',
  excel: '📊',
  print: '🖨️',
  whatsapp: '💬',
  previewAccountPdf: '👁️',
  previewAccountExcel: '👁️',
  previewInvoicePdf: '👁️',
  previewInvoiceExcel: '👁️',
  exportInvoicePdf: '📄',
  exportInvoiceExcel: '📊',
}

const MOBILE_BREAKPOINT = 767
const CARD_ESTIMATED_HEIGHT = 500

export function PartyStatementServicesMenu({
  party,
  partyName,
  dateFrom,
  dateTo,
  lines,
  vouchers,
  lineTotals,
  statementPrefix,
}: PartyStatementServicesMenuProps) {
  const { t, locale } = useApp()
  const [open, setOpen] = useState(false)
  const [cardPos, setCardPos] = useState<CardPosition | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const updateCardPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const cardWidth = Math.min(360, viewportWidth - 32)

    if (viewportWidth <= MOBILE_BREAKPOINT) {
      setCardPos({ mode: 'sheet', width: Math.min(420, viewportWidth - 32) })
      return
    }

    const rect = trigger.getBoundingClientRect()
    const isRtl = document.documentElement.dir === 'rtl'
    const gap = 8
    const cardHeight = cardRef.current?.offsetHeight ?? CARD_ESTIMATED_HEIGHT

    let top = rect.bottom + gap
    if (top + cardHeight > viewportHeight - 16) {
      top = Math.max(16, rect.top - cardHeight - gap)
    }

    setCardPos({
      mode: 'dropdown',
      top,
      left: isRtl ? undefined : Math.max(16, rect.right - cardWidth),
      right: isRtl ? Math.max(16, viewportWidth - rect.right) : undefined,
      width: cardWidth,
    })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setCardPos(null)
      return
    }

    updateCardPosition()

    window.addEventListener('resize', updateCardPosition)
    window.addEventListener('scroll', updateCardPosition, true)

    return () => {
      window.removeEventListener('resize', updateCardPosition)
      window.removeEventListener('scroll', updateCardPosition, true)
    }
  }, [open, updateCardPosition])

  useLayoutEffect(() => {
    if (!open || !cardRef.current) return
    updateCardPosition()
  }, [open, cardPos?.mode, updateCardPosition])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', handlePointerDown)
    }, 0)

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const accountLabels: StatementExportLabels = {
    title: t('parties.exportTemplates.accountStatement.title'),
    party: t('parties.statementServices.party'),
    period: t('parties.statementServices.period'),
    balance: t('common.balance'),
    phone: t('common.phone'),
    city: t('parties.form.city'),
    address: t('common.address'),
    financialSummary: t('parties.exportTemplates.accountStatement.financialSummary'),
    openingBalance: t('parties.exportTemplates.accountStatement.openingBalance'),
    invoicesTotal: t('parties.exportTemplates.accountStatement.invoicesTotal'),
    receiptsTotal: t('parties.exportTemplates.accountStatement.receiptsTotal'),
    paymentsTotal: t('parties.exportTemplates.accountStatement.paymentsTotal'),
    closingBalance: t('parties.exportTemplates.accountStatement.closingBalance'),
    receivables: t('parties.exportTemplates.accountStatement.receivables'),
    creditLimit: t('parties.form.creditLimit'),
    linesSheet: t('parties.exportTemplates.accountStatement.linesSheet'),
    vouchersSheet: t(`${statementPrefix}.vouchersTitle`),
    colGoodsType: t(`${statementPrefix}.colGoodsType`),
    colPieces: t(`${statementPrefix}.colPieces`),
    colLengths: t(`${statementPrefix}.colLengths`),
    colPrice: t(`${statementPrefix}.colPrice`),
    colLineTotal: t(`${statementPrefix}.colLineTotal`),
    colInvoiceNo: t(`${statementPrefix}.colInvoiceNo`),
    colDate: t(`${statementPrefix}.colDate`),
    colNotes: t(`${statementPrefix}.colNotes`),
    colVoucherType: t(`${statementPrefix}.colVoucherType`),
    colVoucherRef: t(`${statementPrefix}.colVoucherRef`),
    colVoucherAmount: t(`${statementPrefix}.colVoucherAmount`),
    footerTotal: t(`${statementPrefix}.footerTotal`),
    receipt: t('parties.statementTypeReceipt'),
    payment: t('parties.statementTypePayment'),
    kpiInvoices: t('parties.exportTemplates.accountStatement.kpiInvoices'),
    kpiPieces: t(`${statementPrefix}.kpiPieces`),
    kpiLengths: t(`${statementPrefix}.kpiLengths`),
    kpiAmount: t(`${statementPrefix}.kpiAmount`),
    generatedAt: t('parties.statementServices.generatedAt'),
    sampleBadge: t('parties.statementServices.sampleBadge'),
    previewBanner: t('parties.exportTemplates.accountStatement.previewBanner'),
    previewExcelBanner: t('parties.exportTemplates.accountStatement.previewExcelBanner'),
    print: t('parties.statementServices.print'),
    close: t('parties.statementServices.close'),
    whatsappIntro: t('parties.statementServices.whatsappIntro'),
    whatsappLines: t('parties.exportTemplates.accountStatement.kpiInvoices'),
    whatsappAmount: t(`${statementPrefix}.kpiAmount`),
  }

  const invoiceLabels: InvoiceExportLabels = {
    title: t('parties.exportTemplates.invoiceStatement.title'),
    party: t('parties.statementServices.party'),
    period: t('parties.statementServices.period'),
    balance: t('common.balance'),
    linesSheet: t('parties.exportTemplates.invoiceStatement.linesSheet'),
    vouchersSheet: t(`${statementPrefix}.vouchersTitle`),
    colGoodsType: t(`${statementPrefix}.colGoodsType`),
    colPieces: t(`${statementPrefix}.colPieces`),
    colLengths: t(`${statementPrefix}.colLengths`),
    colPrice: t(`${statementPrefix}.colPrice`),
    colLineTotal: t(`${statementPrefix}.colLineTotal`),
    colInvoiceNo: t(`${statementPrefix}.colInvoiceNo`),
    colDate: t(`${statementPrefix}.colDate`),
    colNotes: t(`${statementPrefix}.colNotes`),
    colVoucherType: t(`${statementPrefix}.colVoucherType`),
    colVoucherRef: t(`${statementPrefix}.colVoucherRef`),
    colVoucherAmount: t(`${statementPrefix}.colVoucherAmount`),
    footerTotal: t(`${statementPrefix}.footerTotal`),
    receipt: t('parties.statementTypeReceipt'),
    payment: t('parties.statementTypePayment'),
    kpiLines: t('parties.exportTemplates.invoiceStatement.kpiLines'),
    kpiPieces: t(`${statementPrefix}.kpiPieces`),
    kpiLengths: t(`${statementPrefix}.kpiLengths`),
    kpiAmount: t(`${statementPrefix}.kpiAmount`),
    generatedAt: t('parties.statementServices.generatedAt'),
    sampleBadge: t('parties.statementServices.sampleBadge'),
    previewBanner: t('parties.exportTemplates.invoiceStatement.previewBanner'),
    previewExcelBanner: t('parties.exportTemplates.invoiceStatement.previewExcelBanner'),
    print: t('parties.statementServices.print'),
    close: t('parties.statementServices.close'),
  }

  const exportContext = {
    party,
    partyName,
    dateFrom,
    dateTo,
    locale,
    lines,
    vouchers,
    lineTotals,
    labels: accountLabels,
  }

  const invoiceContext = {
    party,
    partyName,
    dateFrom,
    dateTo,
    locale,
    lines,
    vouchers,
    lineTotals,
    labels: invoiceLabels,
  }

  const services: { id: ServiceAction; title: string; hint: string; tone: string }[] = [
    {
      id: 'pdf',
      title: t('parties.statementServices.exportPdf'),
      hint: t('parties.statementServices.exportPdfHint'),
      tone: 'pdf',
    },
    {
      id: 'excel',
      title: t('parties.statementServices.exportExcel'),
      hint: t('parties.statementServices.exportExcelHint'),
      tone: 'excel',
    },
    {
      id: 'print',
      title: t('parties.statementServices.printA4'),
      hint: t('parties.statementServices.printA4Hint'),
      tone: 'print',
    },
    {
      id: 'whatsapp',
      title: t('parties.statementServices.shareWhatsapp'),
      hint: t('parties.statementServices.shareWhatsappHint'),
      tone: 'whatsapp',
    },
  ]

  function handleService(action: ServiceAction) {
    if (action === 'pdf') exportStatementPdf(exportContext)
    if (action === 'excel') exportStatementExcel(exportContext)
    if (action === 'exportInvoicePdf') exportInvoiceStatementPdf(invoiceContext)
    if (action === 'exportInvoiceExcel') exportInvoiceStatementExcel(invoiceContext)
    if (action === 'print') printStatementA4()
    if (action === 'whatsapp') shareStatementWhatsapp(exportContext)
    if (action === 'previewAccountPdf') {
      setPreviewTitle(t('parties.exportTemplates.accountStatement.previewBanner'))
      setPreviewHtml(getStatementPdfPreviewHtml(accountLabels, locale))
    }
    if (action === 'previewAccountExcel') {
      setPreviewTitle(t('parties.exportTemplates.accountStatement.previewExcelBanner'))
      setPreviewHtml(getStatementExcelPreviewHtml(accountLabels, locale))
    }
    if (action === 'previewInvoicePdf') {
      setPreviewTitle(t('parties.exportTemplates.invoiceStatement.previewBanner'))
      setPreviewHtml(getInvoicePdfPreviewHtml(invoiceLabels, locale))
    }
    if (action === 'previewInvoiceExcel') {
      setPreviewTitle(t('parties.exportTemplates.invoiceStatement.previewExcelBanner'))
      setPreviewHtml(getInvoiceExcelPreviewHtml(invoiceLabels, locale))
    }
    setOpen(false)
  }

  const mainServices = services

  const accountPreviewServices: { id: ServiceAction; title: string; tone: string }[] = [
    { id: 'previewAccountPdf', title: t('parties.exportTemplates.accountStatement.previewPdf'), tone: 'pdf' },
    { id: 'previewAccountExcel', title: t('parties.exportTemplates.accountStatement.previewExcel'), tone: 'excel' },
  ]

  const invoicePreviewServices: { id: ServiceAction; title: string; tone: string }[] = [
    { id: 'previewInvoicePdf', title: t('parties.exportTemplates.invoiceStatement.previewPdf'), tone: 'pdf' },
    { id: 'previewInvoiceExcel', title: t('parties.exportTemplates.invoiceStatement.previewExcel'), tone: 'excel' },
  ]

  const invoiceExportServices: { id: ServiceAction; title: string; tone: string }[] = [
    { id: 'exportInvoicePdf', title: t('parties.exportTemplates.invoiceStatement.exportPdf'), tone: 'pdf' },
    { id: 'exportInvoiceExcel', title: t('parties.exportTemplates.invoiceStatement.exportExcel'), tone: 'excel' },
  ]

  const overlay =
    open && cardPos
      ? createPortal(
          <>
            <button
              type="button"
              className="statement-services__backdrop"
              aria-label={t('parties.statementServices.close')}
              onClick={() => setOpen(false)}
            />
            <div
              ref={cardRef}
              className={`statement-services__card statement-services__card--portal ${
                cardPos.mode === 'sheet' ? 'statement-services__card--sheet' : ''
              }`}
              role="dialog"
              aria-label={t('parties.statementServices.title')}
              style={
                cardPos.mode === 'sheet'
                  ? { width: cardPos.width }
                  : {
                      top: cardPos.top,
                      left: cardPos.left,
                      right: cardPos.right,
                      width: cardPos.width,
                    }
              }
            >
              <div className="statement-services__card-header">
                <div>
                  <h3 className="statement-services__card-title">{t('parties.statementServices.title')}</h3>
                  <p className="statement-services__card-subtitle">{t('parties.statementServices.subtitle')}</p>
                </div>
                <button
                  type="button"
                  className="statement-services__close"
                  onClick={() => setOpen(false)}
                  aria-label={t('parties.statementServices.close')}
                >
                  ×
                </button>
              </div>

              <div className="statement-services__grid">
                {mainServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className={`statement-services__item statement-services__item--${service.tone}`}
                    onClick={() => handleService(service.id)}
                  >
                    <span className="statement-services__item-icon" aria-hidden>
                      {serviceIcons[service.id]}
                    </span>
                    <span className="statement-services__item-body">
                      <strong>{service.title}</strong>
                      <span>{service.hint}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="statement-services__preview">
                <span className="statement-services__preview-label">
                  {t('parties.exportTemplates.accountStatement.previewSection')}
                </span>
                <div className="statement-services__preview-actions">
                  {accountPreviewServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`statement-services__preview-btn statement-services__preview-btn--${service.tone}`}
                      onClick={() => handleService(service.id)}
                    >
                      <span aria-hidden>{serviceIcons[service.id]}</span>
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="statement-services__preview">
                <span className="statement-services__preview-label">
                  {t('parties.exportTemplates.invoiceStatement.previewSection')}
                </span>
                <div className="statement-services__preview-actions">
                  {invoicePreviewServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`statement-services__preview-btn statement-services__preview-btn--${service.tone}`}
                      onClick={() => handleService(service.id)}
                    >
                      <span aria-hidden>{serviceIcons[service.id]}</span>
                      {service.title}
                    </button>
                  ))}
                </div>
                <div className="statement-services__preview-actions" style={{ marginTop: 'var(--space-2)' }}>
                  {invoiceExportServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`statement-services__preview-btn statement-services__preview-btn--${service.tone}`}
                      onClick={() => handleService(service.id)}
                    >
                      <span aria-hidden>{serviceIcons[service.id]}</span>
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="statement-services__footer">
                <span>{partyName}</span>
                <span>
                  {dateFrom} — {dateTo}
                </span>
              </div>
            </div>
          </>,
          document.body,
        )
      : null

  return (
    <div className="statement-services">
      <GlossButton
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        ref={triggerRef}
      >
        {t('parties.statementServices.button')}
      </GlossButton>
      {overlay}
      {previewHtml && (
        <ExportPreviewModal
          html={previewHtml}
          title={previewTitle}
          onClose={() => setPreviewHtml(null)}
          printLabel={t('parties.statementServices.print')}
          closeLabel={t('parties.statementServices.close')}
        />
      )}
    </div>
  )
}
