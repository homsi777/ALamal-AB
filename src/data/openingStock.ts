export type OpeningStockLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  categoryAr: string
  categoryEn: string
  colorAr: string
  colorEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: 'meter' | 'yard'
  lot: string
  locationAr: string
  locationEn: string
  qualityStatus: 'valid' | 'warning' | 'missing'
  noteAr: string
  noteEn: string
}

export type OpeningStockEntry = {
  id: string
  entryNo: string
  date: string
  fiscalYear: number
  warehouseAr: string
  warehouseEn: string
  sourceAr: string
  sourceEn: string
  responsibleAr: string
  responsibleEn: string
  attachmentName: string
  reviewStatus: 'needs_review' | 'ready' | 'approved'
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

export function getOpeningStockQuality(entries: OpeningStockEntry[]) {
  return entries
    .filter((entry) => !entry.disabled)
    .reduce(
      (totals, entry) => {
        if (entry.reviewStatus === 'approved') totals.approved += 1
        if (entry.reviewStatus === 'ready') totals.ready += 1
        if (entry.reviewStatus === 'needs_review') totals.needsReview += 1

        entry.lines.forEach((line) => {
          totals.lines += 1
          if (line.qualityStatus === 'valid') totals.validLines += 1
          if (line.qualityStatus === 'warning') totals.warningLines += 1
          if (line.qualityStatus === 'missing') totals.missingLines += 1
        })

        return totals
      },
      { approved: 0, ready: 0, needsReview: 0, lines: 0, validLines: 0, warningLines: 0, missingLines: 0 },
    )
}

export function getOpeningStockWarehouses(entries: OpeningStockEntry[]) {
  return Array.from(new Set(entries.filter((entry) => !entry.disabled).map((entry) => entry.warehouseAr)))
}

export const openingStockEntries: OpeningStockEntry[] = [
  {
    id: 'OS-001',
    entryNo: 'OS-2026-001',
    date: '2026-01-05',
    fiscalYear: 2026,
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    sourceAr: 'ترحيل افتتاحي من الجرد الورقي',
    sourceEn: 'Opening migration from paper count',
    responsibleAr: 'أحمد الحموي',
    responsibleEn: 'Ahmad Al-Hamawi',
    attachmentName: 'opening-main-2026.xlsx',
    reviewStatus: 'approved',
    status: 'posted',
    disabled: false,
    lines: [
      {
        id: 'L-001',
        goodsTypeAr: 'قطن مصري — أبيض',
        goodsTypeEn: 'Egyptian cotton — white',
        categoryAr: 'أقمشة قطنية',
        categoryEn: 'Cotton fabrics',
        colorAr: 'أبيض',
        colorEn: 'White',
        pieces: 24,
        totalLength: 22500,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-A1',
        locationAr: 'A3 — رف 2',
        locationEn: 'A3 — Shelf 2',
        qualityStatus: 'valid',
        noteAr: 'مطابق للجرد الورقي',
        noteEn: 'Matches paper count',
      },
      {
        id: 'L-002',
        goodsTypeAr: 'حرير طبيعي — ذهبي',
        goodsTypeEn: 'Natural silk — gold',
        categoryAr: 'أقمشة حرير',
        categoryEn: 'Silk fabrics',
        colorAr: 'ذهبي',
        colorEn: 'Gold',
        pieces: 8,
        totalLength: 6400,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-A2',
        locationAr: 'B1 — رف 1',
        locationEn: 'B1 — Shelf 1',
        qualityStatus: 'valid',
        noteAr: 'تمت مراجعته',
        noteEn: 'Reviewed',
      },
      {
        id: 'L-003',
        goodsTypeAr: 'شيفون — وردي',
        goodsTypeEn: 'Chiffon — pink',
        categoryAr: 'أقمشة شيفون',
        categoryEn: 'Chiffon fabrics',
        colorAr: 'وردي',
        colorEn: 'Pink',
        pieces: 16,
        totalLength: 18200,
        unitAr: 'متر',
        unitEn: 'meter',
        lot: 'LOT-OP-A3',
        locationAr: 'C2 — رف 3',
        locationEn: 'C2 — Shelf 3',
        qualityStatus: 'warning',
        noteAr: 'يحتاج مطابقة لون قبل الإقفال النهائي',
        noteEn: 'Color needs final matching',
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
    sourceAr: 'استيراد ملف Excel من الفرع',
    sourceEn: 'Branch Excel import',
    responsibleAr: 'سارة ناصر',
    responsibleEn: 'Sara Nasser',
    attachmentName: 'aleppo-opening-2026.xls',
    reviewStatus: 'approved',
    status: 'posted',
    disabled: false,
    lines: [
      {
        id: 'L-004',
        goodsTypeAr: 'كتان — بيج',
        goodsTypeEn: 'Linen — beige',
        categoryAr: 'أقمشة كتان',
        categoryEn: 'Linen fabrics',
        colorAr: 'بيج',
        colorEn: 'Beige',
        pieces: 32,
        totalLength: 31800,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-B1',
        locationAr: 'H1 — رف 4',
        locationEn: 'H1 — Shelf 4',
        qualityStatus: 'valid',
        noteAr: 'مدخل حسب قالب الفرع',
        noteEn: 'Imported by branch template',
      },
      {
        id: 'L-005',
        goodsTypeAr: 'ساتان — كحلي',
        goodsTypeEn: 'Satin — navy',
        categoryAr: 'أقمشة ساتان',
        categoryEn: 'Satin fabrics',
        colorAr: 'كحلي',
        colorEn: 'Navy',
        pieces: 12,
        totalLength: 9600,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-B2',
        locationAr: 'H2 — رف 1',
        locationEn: 'H2 — Shelf 1',
        qualityStatus: 'valid',
        noteAr: 'جاهز للترحيل',
        noteEn: 'Ready to post',
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
    sourceAr: 'إدخال يدوي من لجنة الجرد',
    sourceEn: 'Manual entry from count committee',
    responsibleAr: 'ليلى حمدان',
    responsibleEn: 'Layla Hamdan',
    attachmentName: 'damascus-opening-draft.pdf',
    reviewStatus: 'needs_review',
    status: 'draft',
    disabled: false,
    lines: [
      {
        id: 'L-006',
        goodsTypeAr: 'دانتيل — أسود',
        goodsTypeEn: 'Lace — black',
        categoryAr: 'أقمشة دانتيل',
        categoryEn: 'Lace fabrics',
        colorAr: 'أسود',
        colorEn: 'Black',
        pieces: 6,
        totalLength: 4200,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-C1',
        locationAr: 'D4 — رف 1',
        locationEn: 'D4 — Shelf 1',
        qualityStatus: 'warning',
        noteAr: 'اللوط بحاجة تثبيت قبل الاعتماد',
        noteEn: 'Lot needs confirmation',
      },
      {
        id: 'L-007',
        goodsTypeAr: 'جورجيت — أحمر',
        goodsTypeEn: 'Georgette — red',
        categoryAr: 'أقمشة جورجيت',
        categoryEn: 'Georgette fabrics',
        colorAr: 'أحمر',
        colorEn: 'Red',
        pieces: 10,
        totalLength: 7800,
        unitAr: 'متر',
        unitEn: 'meter',
        lot: 'LOT-OP-C2',
        locationAr: 'D5 — رف 2',
        locationEn: 'D5 — Shelf 2',
        qualityStatus: 'missing',
        noteAr: 'ينقص مرفق الجرد',
        noteEn: 'Count attachment missing',
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
    sourceAr: 'أرشيف سنة سابقة',
    sourceEn: 'Previous year archive',
    responsibleAr: 'محمد العلي',
    responsibleEn: 'Mohammad Al-Ali',
    attachmentName: 'archive-2025.xlsx',
    reviewStatus: 'approved',
    status: 'posted',
    disabled: true,
    lines: [
      {
        id: 'L-008',
        goodsTypeAr: 'مخمل — أخضر',
        goodsTypeEn: 'Velvet — green',
        categoryAr: 'أقمشة مخملية',
        categoryEn: 'Velvet fabrics',
        colorAr: 'أخضر',
        colorEn: 'Green',
        pieces: 4,
        totalLength: 2800,
        unitAr: 'يارد',
        unitEn: 'yard',
        lot: 'LOT-OP-D1',
        locationAr: 'A1 — أرشيف',
        locationEn: 'A1 — Archive',
        qualityStatus: 'valid',
        noteAr: 'مدخل مؤرشف',
        noteEn: 'Archived entry',
      },
    ],
  },
]

export const activeFiscalYear = 2026
