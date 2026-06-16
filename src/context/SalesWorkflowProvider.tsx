import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  createEmptyPieceLengths,
  getPendingPiecesCount,
  initialWorkflowInvoices,
  initialWorkflowLines,
  isInvoiceDetailed,
  isLineDetailed,
  type SalesWorkflowInvoice,
  type SalesWorkflowLine,
  type WorkflowStatus,
} from '../data/salesWorkflow'

type SaveDraftInput = {
  invoiceNo: string
  customerAr: string
  customerEn: string
  containerId: string
  containerLabelAr: string
  containerLabelEn: string
  warehouseAr: string
  warehouseEn: string
  date: string
  currency: 'usd' | 'syp' | 'egp'
  lines: Array<{
    goodsTypeAr: string
    goodsTypeEn: string
    rollCode: string
    colorAr: string
    colorEn: string
    pieces: number
    unitAr: string
    unitEn: string
    unitPrice: number
  }>
}

type SalesWorkflowContextValue = {
  invoices: SalesWorkflowInvoice[]
  lines: SalesWorkflowLine[]
  awaitingCount: number
  saveDraft: (input: SaveDraftInput) => SalesWorkflowInvoice
  updateLinePieceLengths: (lineId: string, pieceLengths: (number | null)[]) => void
  completeDetailing: (invoiceId: string) => void
  saveAllLineDetailing: (
    invoiceId: string,
    updates: Array<{ lineId: string; pieceLengths: (number | null)[] }>,
  ) => void
  markReadyForDelivery: (invoiceId: string) => void
  getInvoiceLines: (invoiceId: string) => SalesWorkflowLine[]
}

const SalesWorkflowContext = createContext<SalesWorkflowContextValue | null>(null)

export function SalesWorkflowProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<SalesWorkflowInvoice[]>(initialWorkflowInvoices)
  const [lines, setLines] = useState<SalesWorkflowLine[]>(initialWorkflowLines)

  const awaitingCount = invoices.filter((inv) => inv.status === 'awaiting_detail').length

  const getInvoiceLines = (invoiceId: string) =>
    lines.filter((line) => line.id.startsWith(`${invoiceId}-`))

  const saveDraft = (input: SaveDraftInput) => {
    const id = `WF-${Date.now()}`
    const invoice: SalesWorkflowInvoice = {
      id,
      invoiceNo: input.invoiceNo,
      customerAr: input.customerAr,
      customerEn: input.customerEn,
      containerId: input.containerId,
      containerLabelAr: input.containerLabelAr,
      containerLabelEn: input.containerLabelEn,
      warehouseAr: input.warehouseAr,
      warehouseEn: input.warehouseEn,
      date: input.date,
      status: 'awaiting_detail',
      currency: input.currency,
    }

    const newLines: SalesWorkflowLine[] = input.lines.map((line, index) => ({
      id: `${id}-L${index + 1}`,
      goodsTypeAr: line.goodsTypeAr,
      goodsTypeEn: line.goodsTypeEn,
      rollCode: line.rollCode,
      colorAr: line.colorAr,
      colorEn: line.colorEn,
      pieces: line.pieces,
      unitAr: line.unitAr,
      unitEn: line.unitEn,
      unitPrice: line.unitPrice,
      pieceLengths: createEmptyPieceLengths(line.pieces),
    }))

    setInvoices((prev) => [invoice, ...prev])
    setLines((prev) => [...newLines, ...prev])
    return invoice
  }

  const updateLinePieceLengths = (lineId: string, pieceLengths: (number | null)[]) => {
    setLines((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, pieceLengths } : line)),
    )
  }

  const completeDetailing = (invoiceId: string) => {
    const invoiceLines = getInvoiceLines(invoiceId)
    if (!invoiceLines.every(isLineDetailed)) return

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: 'detailed' as WorkflowStatus } : invoice,
      ),
    )
  }

  const saveAllLineDetailing = (
    invoiceId: string,
    updates: Array<{ lineId: string; pieceLengths: (number | null)[] }>,
  ) => {
    setLines((prev) => {
      const next = prev.map((line) => {
        const update = updates.find((item) => item.lineId === line.id)
        return update ? { ...line, pieceLengths: update.pieceLengths } : line
      })
      const invoiceLines = next.filter((line) => line.id.startsWith(`${invoiceId}-`))
      if (invoiceLines.length > 0 && invoiceLines.every(isLineDetailed)) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.id === invoiceId ? { ...invoice, status: 'detailed' as WorkflowStatus } : invoice,
          ),
        )
      }
      return next
    })
  }

  const markReadyForDelivery = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: 'ready_delivery' as WorkflowStatus } : invoice,
      ),
    )
  }

  const value = useMemo(
    () => ({
      invoices,
      lines,
      awaitingCount,
      saveDraft,
      updateLinePieceLengths,
      completeDetailing,
      saveAllLineDetailing,
      markReadyForDelivery,
      getInvoiceLines,
    }),
    [invoices, lines, awaitingCount],
  )

  return <SalesWorkflowContext.Provider value={value}>{children}</SalesWorkflowContext.Provider>
}

export function useSalesWorkflow() {
  const context = useContext(SalesWorkflowContext)
  if (!context) {
    throw new Error('useSalesWorkflow must be used within SalesWorkflowProvider')
  }
  return context
}

export { isInvoiceDetailed, isLineDetailed, getPendingPiecesCount }
