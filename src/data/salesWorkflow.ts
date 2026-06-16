export type WorkflowStatus =
  | 'draft'
  | 'awaiting_detail'
  | 'detailed'
  | 'ready_delivery'
  | 'delivered'

export type SalesWorkflowLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  rollCode: string
  colorAr: string
  colorEn: string
  pieces: number
  unitAr: string
  unitEn: string
  unitPrice: number
  pieceLengths: (number | null)[]
}

export type SalesWorkflowInvoice = {
  id: string
  invoiceNo: string
  customerAr: string
  customerEn: string
  containerId: string
  containerLabelAr: string
  containerLabelEn: string
  warehouseAr: string
  warehouseEn: string
  date: string
  status: WorkflowStatus
  currency: 'usd' | 'syp' | 'egp'
}

export function createEmptyPieceLengths(pieces: number) {
  return Array.from({ length: pieces }, () => null)
}

export function isLineDetailed(line: SalesWorkflowLine) {
  return line.pieceLengths.length === line.pieces && line.pieceLengths.every((v) => v !== null && v > 0)
}

export function isInvoiceDetailed(invoice: SalesWorkflowInvoice, lines: SalesWorkflowLine[]) {
  const invoiceLines = lines.filter((line) => line.id.startsWith(invoice.id))
  return invoiceLines.length > 0 && invoiceLines.every(isLineDetailed)
}

export function getLineTotalLength(line: SalesWorkflowLine) {
  if (!isLineDetailed(line)) return null
  return line.pieceLengths.reduce<number>((sum, value) => sum + (value ?? 0), 0)
}

export function getPendingPiecesCount(lines: SalesWorkflowLine[]) {
  return lines.reduce((count, line) => {
    const pending = line.pieceLengths.filter((value) => value === null || value <= 0).length
    return count + pending
  }, 0)
}

export const initialWorkflowInvoices: SalesWorkflowInvoice[] = [
  {
    id: 'WF-001',
    invoiceNo: 'SINV-1043',
    customerAr: 'محل الأناقة',
    customerEn: 'Al-Anaqa Store',
    containerId: 'CONT-2026-A1',
    containerLabelAr: 'حاوية CN-2026-A1',
    containerLabelEn: 'Container CN-2026-A1',
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    date: '2026-06-17',
    status: 'awaiting_detail',
    currency: 'usd',
  },
  {
    id: 'WF-002',
    invoiceNo: 'SINV-1040',
    customerAr: 'مؤسسة النور',
    customerEn: 'Al-Noor Co.',
    containerId: 'CONT-2026-B2',
    containerLabelAr: 'حاوية CN-2026-B2',
    containerLabelEn: 'Container CN-2026-B2',
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
    date: '2026-06-16',
    status: 'detailed',
    currency: 'usd',
  },
]

export const initialWorkflowLines: SalesWorkflowLine[] = [
  {
    id: 'WF-001-L1',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 10,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    pieceLengths: createEmptyPieceLengths(10),
  },
  {
    id: 'WF-001-L2',
    goodsTypeAr: 'كتان F12',
    goodsTypeEn: 'Linen F12',
    rollCode: 'F12',
    colorAr: 'بيج',
    colorEn: 'Beige',
    pieces: 4,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    pieceLengths: createEmptyPieceLengths(4),
  },
  {
    id: 'WF-002-L1',
    goodsTypeAr: 'قطن مصري',
    goodsTypeEn: 'Egyptian cotton',
    rollCode: 'CTN-100',
    colorAr: 'أبيض',
    colorEn: 'White',
    pieces: 6,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 11,
    pieceLengths: [420, 380, 410, 395, 400, 405],
  },
]
