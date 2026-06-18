import { useEffect, useRef, useState } from 'react'
import { GlossButton } from '../../components/ui/GlossButton'
import { useApp } from '../../context/AppProvider'
import type { CustomerStatementLine, CustomerVoucher, PartyRecord } from '../../data/parties'
import {
  exportStatementExcel,
  exportStatementPdf,
  printStatementA4,
  shareStatementWhatsapp,
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

type ServiceAction = 'pdf' | 'excel' | 'print' | 'whatsapp'

const serviceIcons: Record<ServiceAction, string> = {
  pdf: '📄',
  excel: '📊',
  print: '🖨️',
  whatsapp: '💬',
}

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
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const exportLabels: StatementExportLabels = {
    title: t(`${statementPrefix}.title`),
    party: t('parties.statementServices.party'),
    period: t('parties.statementServices.period'),
    balance: t('common.balance'),
    linesSheet: t('parties.statementServices.linesSheet'),
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
    whatsappIntro: t('parties.statementServices.whatsappIntro'),
    whatsappLines: t(`${statementPrefix}.kpiLines`),
    whatsappAmount: t(`${statementPrefix}.kpiAmount`),
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
    labels: exportLabels,
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
    if (action === 'print') printStatementA4()
    if (action === 'whatsapp') shareStatementWhatsapp(exportContext)
    setOpen(false)
  }

  return (
    <div className="statement-services" ref={wrapRef}>
      <GlossButton
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {t('parties.statementServices.button')}
      </GlossButton>

      {open && (
        <>
          <button
            type="button"
            className="statement-services__backdrop"
            aria-label={t('parties.statementServices.close')}
            onClick={() => setOpen(false)}
          />
          <div className="statement-services__card" role="dialog" aria-label={t('parties.statementServices.title')}>
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
              {services.map((service) => (
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

            <div className="statement-services__footer">
              <span>{partyName}</span>
              <span>{dateFrom} — {dateTo}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
