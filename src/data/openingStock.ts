export type OpeningStockLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: 'meter' | 'yard'
  lot: string
}

export type OpeningStockEntry = {
  id: string
  entryNo: string
  date: string
  fiscalYear: number
  warehouseAr: string
  warehouseEn: string
  status: 'draft' | 'posted'
  disabled: boolean
  lines: OpeningStockLine[]
}

export function getEntryTotals(lines: OpeningStockLine[]) {
  return lines.reduce(
    (totals, line) => {
      totals.items += 1
      totals.pieces += line.pieces

      if (line.unitEn === 'meter') {
        totals.lengthMeter += line.totalLength
      } else {
        totals.lengthYard += line.totalLength
      }

      return totals
    },
    { items: 0, pieces: 0, lengthMeter: 0, lengthYard: 0 },
  )
}

export function getOpeningStockTotals(entries: OpeningStockEntry[]) {
  return entries
    .filter((entry) => !entry.disabled && entry.status === 'posted')
    .reduce(
      (totals, entry) => {
        const entryTotals = getEntryTotals(entry.lines)
        totals.entries += 1
        totals.items += entryTotals.items
        totals.pieces += entryTotals.pieces
        totals.lengthMeter += entryTotals.lengthMeter
        totals.lengthYard += entryTotals.lengthYard
        return totals
      },
      { entries: 0, items: 0, pieces: 0, lengthMeter: 0, lengthYard: 0 },
    )
}

export const openingStockEntries: OpeningStockEntry[] = [
  {
    id: 'OS-001',
    entryNo: 'OS-2026-001',
    date: '2026-01-05',
    fiscalYear: 2026,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    status: 'posted',
    disabled: false,
    lines: [
      {
        id: 'L-001',
        goodsTypeAr: 'قطن مصري — أبيض',
        goodsTypeEn: 'Egyptian cotton — white',
        pieces: 24,
        totalLength: 22500,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-A1',
      },
      {
        id: 'L-002',
        goodsTypeAr: 'حرير طبيعي — ذهبي',
        goodsTypeEn: 'Natural silk — gold',
        pieces: 8,
        totalLength: 6400,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-A2',
      },
      {
        id: 'L-003',
        goodsTypeAr: 'شيفون — وردي',
        goodsTypeEn: 'Chiffon — pink',
        pieces: 16,
        totalLength: 18200,
        unitAr: 'متر',
        unitEn: 'meter',
        lot: 'LOT-OP-A3',
      },
    ],
  },
  {
    id: 'OS-002',
    entryNo: 'OS-2026-002',
    date: '2026-01-12',
    fiscalYear: 2026,
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
    status: 'posted',
    disabled: false,
    lines: [
      {
        id: 'L-004',
        goodsTypeAr: 'كتان — بيج',
        goodsTypeEn: 'Linen — beige',
        pieces: 32,
        totalLength: 31800,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-B1',
      },
      {
        id: 'L-005',
        goodsTypeAr: 'ساتان — كحلي',
        goodsTypeEn: 'Satin — navy',
        pieces: 12,
        totalLength: 9600,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-B2',
      },
    ],
  },
  {
    id: 'OS-003',
    entryNo: 'OS-2026-003',
    date: '2026-02-01',
    fiscalYear: 2026,
    warehouseAr: 'فرع دمشق',
    warehouseEn: 'Damascus branch',
    status: 'draft',
    disabled: false,
    lines: [
      {
        id: 'L-006',
        goodsTypeAr: 'دانتيل — أسود',
        goodsTypeEn: 'Lace — black',
        pieces: 6,
        totalLength: 4200,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-C1',
      },
      {
        id: 'L-007',
        goodsTypeAr: 'جورجيت — أحمر',
        goodsTypeEn: 'Georgette — red',
        pieces: 10,
        totalLength: 7800,
        unitAr: 'متر',
        unitEn: 'meter',
        lot: 'LOT-OP-C2',
      },
    ],
  },
  {
    id: 'OS-004',
    entryNo: 'OS-2025-014',
    date: '2025-12-28',
    fiscalYear: 2025,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    status: 'posted',
    disabled: true,
    lines: [
      {
        id: 'L-008',
        goodsTypeAr: 'مخمل — أخضر',
        goodsTypeEn: 'Velvet — green',
        pieces: 4,
        totalLength: 2800,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-D1',
      },
    ],
  },
]

export const activeFiscalYear = 2026
