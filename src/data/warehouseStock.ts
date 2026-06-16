export type WarehouseStockRow = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: string
  lot: string
  locationAr: string
  locationEn: string
  disabled: boolean
}

export function getWarehouseTotals(rows: WarehouseStockRow[]) {
  const active = rows.filter((row) => !row.disabled)

  return active.reduce(
    (totals, row) => {
      totals.pieces += row.pieces

      if (row.unitEn === 'meter') {
        totals.lengthMeter += row.totalLength
      } else if (row.unitEn === 'yard') {
        totals.lengthYard += row.totalLength
      }

      return totals
    },
    { pieces: 0, lengthMeter: 0, lengthYard: 0 },
  )
}

export const warehouseStockRows: WarehouseStockRow[] = [
  {
    id: 'WH-001',
    goodsTypeAr: 'قطن مصري — أبيض',
    goodsTypeEn: 'Egyptian cotton — white',
    pieces: 24,
    totalLength: 22500,
    unitAr: 'يارد',
    unitEn: 'yard',
    lot: 'LOT-2026-A1',
    locationAr: 'مستودع رئيسي — A3',
    locationEn: 'Main warehouse — A3',
    disabled: false,
  },
  {
    id: 'WH-002',
    goodsTypeAr: 'حرير طبيعي — ذهبي',
    goodsTypeEn: 'Natural silk — gold',
    pieces: 8,
    totalLength: 6400,
    unitAr: 'يارد',
    unitEn: 'yard',
    lot: 'LOT-2026-B2',
    locationAr: 'مستودع رئيسي — B1',
    locationEn: 'Main warehouse — B1',
    disabled: false,
  },
  {
    id: 'WH-003',
    goodsTypeAr: 'شيفون — وردي',
    goodsTypeEn: 'Chiffon — pink',
    pieces: 16,
    totalLength: 18200,
    unitAr: 'متر',
    unitEn: 'meter',
    lot: 'LOT-2026-C4',
    locationAr: 'فرع حلب — C2',
    locationEn: 'Aleppo branch — C2',
    disabled: false,
  },
  {
    id: 'WH-004',
    goodsTypeAr: 'دانتيل — أسود',
    goodsTypeEn: 'Lace — black',
    pieces: 0,
    totalLength: 0,
    unitAr: 'يارد',
    unitEn: 'yard',
    lot: 'LOT-2025-D9',
    locationAr: 'مستودع رئيسي — D4',
    locationEn: 'Main warehouse — D4',
    disabled: true,
  },
  {
    id: 'WH-005',
    goodsTypeAr: 'كتان — بيج',
    goodsTypeEn: 'Linen — beige',
    pieces: 32,
    totalLength: 31800,
    unitAr: 'يارد',
    unitEn: 'yard',
    lot: 'LOT-2026-E1',
    locationAr: 'فرع دمشق — E1',
    locationEn: 'Damascus branch — E1',
    disabled: false,
  },
]
