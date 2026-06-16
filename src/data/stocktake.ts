export type StocktakeStatus = 'draft' | 'in_progress' | 'validated' | 'cancelled'

export type StocktakeLine = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  lot: string
  locationAr: string
  locationEn: string
  unitAr: string
  unitEn: 'meter' | 'yard'
  systemPieces: number
  systemLength: number
  countedPieces: number | null
  countedLength: number | null
}

export type StocktakeSession = {
  id: string
  sessionNo: string
  warehouseAr: string
  warehouseEn: string
  scheduledDate: string
  validatedDate?: string
  responsibleAr: string
  responsibleEn: string
  status: StocktakeStatus
  disabled: boolean
  lines: StocktakeLine[]
}

export function getLineDiff(value: number | null, system: number) {
  if (value === null) return null
  return value - system
}

export function getSessionProgress(lines: StocktakeLine[]) {
  const counted = lines.filter((line) => line.countedPieces !== null).length
  return { counted, total: lines.length, percent: lines.length ? Math.round((counted / lines.length) * 100) : 0 }
}

export function getSessionDiscrepancies(lines: StocktakeLine[]) {
  return lines.filter((line) => {
    if (line.countedPieces === null || line.countedLength === null) return false
    return line.countedPieces !== line.systemPieces || line.countedLength !== line.systemLength
  }).length
}

export function getStocktakeTotals(sessions: StocktakeSession[]) {
  const active = sessions.filter((session) => !session.disabled && session.status !== 'cancelled')

  return active.reduce(
    (totals, session) => {
      if (session.status === 'in_progress') totals.inProgress += 1
      if (session.status === 'validated') totals.validated += 1
      if (session.status === 'draft') totals.draft += 1

      const discrepancies = getSessionDiscrepancies(session.lines)
      totals.discrepancies += discrepancies

      const progress = getSessionProgress(session.lines)
      totals.countedLines += progress.counted
      totals.totalLines += progress.total

      return totals
    },
    { inProgress: 0, validated: 0, draft: 0, discrepancies: 0, countedLines: 0, totalLines: 0 },
  )
}

export function getStocktakeAccuracy(sessions: StocktakeSession[]) {
  let matched = 0
  let counted = 0

  sessions
    .filter((session) => !session.disabled && session.status !== 'cancelled')
    .forEach((session) => {
      session.lines.forEach((line) => {
        if (line.countedPieces === null || line.countedLength === null) return
        counted += 1
        if (line.countedPieces === line.systemPieces && line.countedLength === line.systemLength) {
          matched += 1
        }
      })
    })

  return counted > 0 ? Math.round((matched / counted) * 100) : 100
}

export const stocktakeSessions: StocktakeSession[] = [
  {
    id: 'ST-001',
    sessionNo: 'ST-2026-003',
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    scheduledDate: '2026-06-17',
    responsibleAr: 'أحمد الحموي',
    responsibleEn: 'Ahmad Al-Hamawi',
    status: 'in_progress',
    disabled: false,
    lines: [
      {
        id: 'SL-001',
        goodsTypeAr: 'قطن مصري — أبيض',
        goodsTypeEn: 'Egyptian cotton — white',
        lot: 'LOT-2026-A1',
        locationAr: 'A3 — رف 2',
        locationEn: 'A3 — Shelf 2',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 24,
        systemLength: 22500,
        countedPieces: 24,
        countedLength: 22480,
      },
      {
        id: 'SL-002',
        goodsTypeAr: 'حرير طبيعي — ذهبي',
        goodsTypeEn: 'Natural silk — gold',
        lot: 'LOT-2026-B2',
        locationAr: 'B1 — رف 1',
        locationEn: 'B1 — Shelf 1',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 8,
        systemLength: 6400,
        countedPieces: 8,
        countedLength: 6400,
      },
      {
        id: 'SL-003',
        goodsTypeAr: 'شيفون — وردي',
        goodsTypeEn: 'Chiffon — pink',
        lot: 'LOT-2026-C4',
        locationAr: 'C2 — رف 3',
        locationEn: 'C2 — Shelf 3',
        unitAr: 'متر',
        unitEn: 'meter',
        systemPieces: 16,
        systemLength: 18200,
        countedPieces: null,
        countedLength: null,
      },
      {
        id: 'SL-004',
        goodsTypeAr: 'كتان — بيج',
        goodsTypeEn: 'Linen — beige',
        lot: 'LOT-2026-E1',
        locationAr: 'E1 — رف 4',
        locationEn: 'E1 — Shelf 4',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 32,
        systemLength: 31800,
        countedPieces: null,
        countedLength: null,
      },
    ],
  },
  {
    id: 'ST-002',
    sessionNo: 'ST-2026-002',
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
    scheduledDate: '2026-06-01',
    validatedDate: '2026-06-02',
    responsibleAr: 'سارة ناصر',
    responsibleEn: 'Sara Nasser',
    status: 'validated',
    disabled: false,
    lines: [
      {
        id: 'SL-005',
        goodsTypeAr: 'ساتان — كحلي',
        goodsTypeEn: 'Satin — navy',
        lot: 'LOT-OP-B2',
        locationAr: 'H1 — رف 1',
        locationEn: 'H1 — Shelf 1',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 12,
        systemLength: 9600,
        countedPieces: 12,
        countedLength: 9600,
      },
      {
        id: 'SL-006',
        goodsTypeAr: 'مخمل — أخضر',
        goodsTypeEn: 'Velvet — green',
        lot: 'LOT-OP-D1',
        locationAr: 'H2 — رف 2',
        locationEn: 'H2 — Shelf 2',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 4,
        systemLength: 2800,
        countedPieces: 4,
        countedLength: 2800,
      },
    ],
  },
  {
    id: 'ST-003',
    sessionNo: 'ST-2026-001',
    warehouseAr: 'مستودع رئيسي',
    warehouseEn: 'Main warehouse',
    scheduledDate: '2026-05-15',
    validatedDate: '2026-05-16',
    responsibleAr: 'محمد العلي',
    responsibleEn: 'Mohammad Al-Ali',
    status: 'validated',
    disabled: false,
    lines: [
      {
        id: 'SL-007',
        goodsTypeAr: 'دانتيل — أسود',
        goodsTypeEn: 'Lace — black',
        lot: 'LOT-2025-D9',
        locationAr: 'D4 — رف 1',
        locationEn: 'D4 — Shelf 1',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 6,
        systemLength: 4200,
        countedPieces: 5,
        countedLength: 3900,
      },
      {
        id: 'SL-008',
        goodsTypeAr: 'جورجيت — أحمر',
        goodsTypeEn: 'Georgette — red',
        lot: 'LOT-OP-C2',
        locationAr: 'D5 — رف 2',
        locationEn: 'D5 — Shelf 2',
        unitAr: 'متر',
        unitEn: 'meter',
        systemPieces: 10,
        systemLength: 7800,
        countedPieces: 10,
        countedLength: 7800,
      },
      {
        id: 'SL-009',
        goodsTypeAr: 'تول — أبيض',
        goodsTypeEn: 'Tulle — white',
        lot: 'LOT-2025-F2',
        locationAr: 'D6 — رف 3',
        locationEn: 'D6 — Shelf 3',
        unitAr: 'يارد',
        unitEn: 'yard',
        systemPieces: 14,
        systemLength: 11200,
        countedPieces: 14,
        countedLength: 11150,
      },
    ],
  },
  {
    id: 'ST-004',
    sessionNo: 'ST-2026-004',
    warehouseAr: 'فرع دمشق',
    warehouseEn: 'Damascus branch',
    scheduledDate: '2026-06-20',
    responsibleAr: 'ليلى حمدان',
    responsibleEn: 'Layla Hamdan',
    status: 'draft',
    disabled: false,
    lines: [
      {
        id: 'SL-010',
        goodsTypeAr: 'أورغanza — فضي',
        goodsTypeEn: 'Organza — silver',
        lot: 'LOT-2026-G1',
        locationAr: 'S1 — رف 1',
        locationEn: 'S1 — Shelf 1',
        unitAr: 'متر',
        unitEn: 'meter',
        systemPieces: 18,
        systemLength: 14400,
        countedPieces: null,
        countedLength: null,
      },
    ],
  },
  {
    id: 'ST-005',
    sessionNo: 'ST-2025-011',
    warehouseAr: 'فرع حلب',
    warehouseEn: 'Aleppo branch',
    scheduledDate: '2025-11-10',
    responsibleAr: 'خالد يوسف',
    responsibleEn: 'Khaled Youssef',
    status: 'cancelled',
    disabled: true,
    lines: [],
  },
]
