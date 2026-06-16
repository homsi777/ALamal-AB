import * as XLSX from 'xlsx'
import { matchCategory, type FabricCategory } from '../data/categories'
import type { WarehouseStockRow } from '../data/warehouseStock'

export type ParsedImportRow = {
  rowNumber: number
  goodsType: string
  rollCode: string
  color: string
  colorCode?: string
  pieces: number
  totalLength: number
  unitRaw: string
  unit: 'meter' | 'yard' | null
  lot?: string
  location?: string
  status: 'valid' | 'error'
  errors: string[]
  categoryId?: string
}

const HEADER_ALIASES: Record<string, keyof Omit<ParsedImportRow, 'rowNumber' | 'status' | 'errors' | 'categoryId' | 'unit'>> = {
  'نوع بضاعة': 'goodsType',
  'نوع البضاعة': 'goodsType',
  'goods type': 'goodsType',
  'goodstype': 'goodsType',
  'كود التوب': 'rollCode',
  'كود توب': 'rollCode',
  'roll code': 'rollCode',
  'tub code': 'rollCode',
  'اللون': 'color',
  color: 'color',
  'كود اللون': 'colorCode',
  'color code': 'colorCode',
  'عدد الأتواب': 'pieces',
  'عدد الاتواب': 'pieces',
  pieces: 'pieces',
  'الأطوال': 'totalLength',
  lengths: 'totalLength',
  'total length': 'totalLength',
  length: 'totalLength',
  الوحدة: 'unitRaw',
  unit: 'unitRaw',
  اللوط: 'lot',
  lot: 'lot',
  الموقع: 'location',
  location: 'location',
}

function normalizeHeader(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function parseUnit(value: string): 'meter' | 'yard' | null {
  const normalized = value.trim().toLowerCase()
  if (['م', 'متر', 'meter', 'm', 'metre'].includes(normalized)) return 'meter'
  if (['يارد', 'yard', 'yd', 'yards'].includes(normalized)) return 'yard'
  return null
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  const parsed = Number(String(value ?? '').replace(/,/g, '').trim())
  return Number.isFinite(parsed) ? parsed : NaN
}

function readWorkbookRows(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return []

  const sheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
}

export function parseExcelImportFile(
  buffer: ArrayBuffer,
  categories: FabricCategory[],
  messages: {
    missingGoodsType: string
    missingRollCode: string
    missingColor: string
    missingPieces: string
    missingLength: string
    missingUnit: string
    invalidUnit: string
    invalidNumber: string
    unknownCategory: string
  },
): ParsedImportRow[] {
  const rawRows = readWorkbookRows(buffer)
  if (rawRows.length === 0) return []

  const headerMap = new Map<string, keyof ParsedImportRow>()
  const firstRow = rawRows[0]
  Object.keys(firstRow).forEach((header) => {
    const alias = HEADER_ALIASES[normalizeHeader(header)]
    if (alias) headerMap.set(header, alias as keyof ParsedImportRow)
  })

  return rawRows.map((rawRow, index) => {
    const parsed: ParsedImportRow = {
      rowNumber: index + 2,
      goodsType: '',
      rollCode: '',
      color: '',
      pieces: 0,
      totalLength: 0,
      unitRaw: '',
      unit: null,
      status: 'valid',
      errors: [],
    }

    Object.entries(rawRow).forEach(([header, value]) => {
      const field = headerMap.get(header)
      if (!field || field === 'status' || field === 'errors' || field === 'categoryId' || field === 'unit') return

      if (field === 'pieces' || field === 'totalLength') {
        parsed[field] = toNumber(value)
        return
      }

      parsed[field] = String(value ?? '').trim() as never
    })

    if (!parsed.goodsType) parsed.errors.push(messages.missingGoodsType)
    if (!parsed.rollCode) parsed.errors.push(messages.missingRollCode)
    if (!parsed.color) parsed.errors.push(messages.missingColor)

    if (!parsed.pieces && parsed.pieces !== 0) parsed.errors.push(messages.missingPieces)
    else if (Number.isNaN(parsed.pieces) || parsed.pieces < 0) parsed.errors.push(messages.invalidNumber)

    if (!parsed.totalLength && parsed.totalLength !== 0) parsed.errors.push(messages.missingLength)
    else if (Number.isNaN(parsed.totalLength) || parsed.totalLength < 0) parsed.errors.push(messages.invalidNumber)

    if (!parsed.unitRaw) parsed.errors.push(messages.missingUnit)
    else {
      parsed.unit = parseUnit(parsed.unitRaw)
      if (!parsed.unit) parsed.errors.push(messages.invalidUnit)
    }

    if (parsed.errors.length === 0) {
      const category = matchCategory(
        categories,
        parsed.goodsType,
        parsed.rollCode,
        parsed.color,
        parsed.colorCode,
      )

      if (!category) {
        parsed.errors.push(messages.unknownCategory)
      } else {
        parsed.categoryId = category.id
      }
    }

    parsed.status = parsed.errors.length === 0 ? 'valid' : 'error'
    return parsed
  })
}

export function rowsToWarehouseStock(
  rows: ParsedImportRow[],
  categories: FabricCategory[],
): WarehouseStockRow[] {
  return rows
    .filter((row) => row.status === 'valid' && row.categoryId && row.unit)
    .map((row, index) => {
      const category = categories.find((item) => item.id === row.categoryId)!
      const goodsTypeAr = category.goodsTypeAr
      const goodsTypeEn = category.goodsTypeEn
      const colorAr = category.colorAr
      const colorEn = category.colorEn
      const labelAr = `${goodsTypeAr} — ${colorAr}`
      const labelEn = `${goodsTypeEn} — ${colorEn}`

      return {
        id: `IMP-${Date.now()}-${index}`,
        goodsTypeAr: labelAr,
        goodsTypeEn: labelEn,
        pieces: row.pieces,
        totalLength: row.totalLength,
        unitAr: row.unit === 'meter' ? 'متر' : 'يارد',
        unitEn: row.unit === 'meter' ? 'meter' : 'yard',
        lot: row.lot || `LOT-IMP-${row.rollCode}`,
        locationAr: row.location || 'مستودع رئيسي — مستورد',
        locationEn: row.location || 'Main warehouse — imported',
        disabled: false,
      }
    })
}

export function downloadImportTemplate(locale: 'ar' | 'en') {
  const headers =
    locale === 'ar'
      ? [
          'نوع بضاعة',
          'كود التوب',
          'اللون',
          'كود اللون',
          'عدد الأتواب',
          'الأطوال',
          'الوحدة',
          'اللوط',
          'الموقع',
        ]
      : [
          'Goods type',
          'Roll code',
          'Color',
          'Color code',
          'Pieces',
          'Total length',
          'Unit',
          'Lot',
          'Location',
        ]

  const sample =
    locale === 'ar'
      ? ['كتان F12', 'F12', 'أبيض', '', 12, 8500, 'يارد', 'LOT-IMP-001', 'مستودع رئيسي — A1']
      : ['Linen F12', 'F12', 'White', '', 12, 8500, 'yard', 'LOT-IMP-001', 'Main warehouse — A1']

  const sheet = XLSX.utils.aoa_to_sheet([headers, sample])
  sheet['!cols'] = headers.map(() => ({ wch: 18 }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, locale === 'ar' ? 'استيراد' : 'Import')
  XLSX.writeFile(workbook, locale === 'ar' ? 'import-template-ar.xlsx' : 'import-template-en.xlsx')
}
