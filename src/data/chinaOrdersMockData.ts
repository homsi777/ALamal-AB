export type ChinaImportStatus = 'draft' | 'shipping' | 'arrived' | 'approved' | 'archived'

export type ChinaSupplier = {
  id: string
  name: string
  city: string
  templateName: string
}

export type ChinaFabricCode = {
  code: string
  name: string
  category: string
}

export type ChinaBolt = {
  id: string
  boltNo: string
  fabricCode: string
  fabricName: string
  color: string
  lengthMeter: number
  weightKg: number
  note?: string
}

export type ChinaCustomerDistribution = {
  id: string
  customerName: string
  city: string
  fabricCode: string
  color: string
  bolts: number
  lengthMeter: number
  status: 'reserved' | 'sold' | 'delivered' | 'preparing'
  movementDate: string
  notes?: string
}

export type ChinaContainer = {
  id: string
  containerNo: string
  supplierId: string
  supplierName: string
  orderNo: string
  shipDate: string
  expectedArrival: string
  status: ChinaImportStatus
  wastePercent: number
  lastUpdate: string
  notes: string
  bolts: ChinaBolt[]
  distributions: ChinaCustomerDistribution[]
}

export type ChinaImportTemplate = {
  id: string
  supplierId: string
  name: string
  columns: Array<{ column: string; label: string }>
}

export type ChinaImportRowStatus = 'valid' | 'warning' | 'error'

export type ChinaImportRow = {
  id: string
  boltNo: string
  fabricCode: string
  fabricName: string
  color: string
  lengthMeter?: number
  weightKg?: number
  note: string
  status: ChinaImportRowStatus
}

export const chinaSuppliers: ChinaSupplier[] = [
  { id: 'sup-guangzhou', name: 'Guangzhou Textile Co.', city: 'Guangzhou', templateName: 'قالب قوانغتشو القياسي' },
  { id: 'sup-yiwu', name: 'Yiwu Fabric Export', city: 'Yiwu', templateName: 'قالب ييوو للأكواد المختصرة' },
  { id: 'sup-shanghai', name: 'Shanghai Soft Weave', city: 'Shanghai', templateName: 'قالب شنغهاي المفصل' },
  { id: 'sup-foshan', name: 'Foshan Premium Textiles', city: 'Foshan', templateName: 'قالب فوشان للألوان' },
]

export const chinaFabricCodes: ChinaFabricCode[] = [
  { code: 'COLOMBIA', name: 'كولومبيا مستورد', category: 'أقمشة مستوردة' },
  { code: 'DPL', name: 'دي بي إل', category: 'أقمشة مستوردة' },
  { code: 'ROYAL', name: 'رويال ناعم', category: 'أقمشة مستوردة' },
  { code: 'VELVET-X', name: 'مخمل فيلفت X', category: 'أقمشة مخملية' },
  { code: 'LINEN-22', name: 'كتان 22', category: 'أقمشة كتان' },
  { code: 'SOFT-90', name: 'سوفت 90', category: 'أقمشة ناعمة' },
  { code: 'MILANO', name: 'ميلانو', category: 'أقمشة مستوردة' },
  { code: 'CLASSIC-T', name: 'كلاسيك T', category: 'أقمشة كلاسيكية' },
]

export const chinaImportTemplates: ChinaImportTemplate[] = chinaSuppliers.map((supplier) => ({
  id: `tpl-${supplier.id}`,
  supplierId: supplier.id,
  name: supplier.templateName,
  columns: [
    { column: 'A', label: 'رقم التوب' },
    { column: 'B', label: 'كود القماش' },
    { column: 'C', label: 'اللون' },
    { column: 'D', label: 'الطول بالمتر' },
    { column: 'E', label: 'الوزن بالكغ' },
  ],
}))

const customerNames = [
  ['شركة الأمل للأقمشة', 'دمشق'],
  ['محلات النور', 'حلب'],
  ['مستودع الشرق', 'دمشق'],
  ['أقمشة الربيع', 'حماة'],
  ['شركة البركة', 'اللاذقية'],
  ['مركز الشام التجاري', 'دمشق'],
  ['أقمشة العائلة', 'طرطوس'],
  ['مستودع حمص المركزي', 'حمص'],
  ['أقمشة حلب الجديدة', 'حلب'],
  ['شركة الياسمين', 'دمشق'],
]

const colors = ['أحمر', 'كحلي', 'أسود', 'بيج', 'رمادي', 'سكري', 'أخضر زيتي', 'عنابي']

function fabricName(code: string) {
  return chinaFabricCodes.find((item) => item.code === code)?.name ?? code
}

function makeBolts(prefix: string, codes: string[], count: number, start = 1): ChinaBolt[] {
  return Array.from({ length: count }, (_, index) => {
    const code = codes[index % codes.length]
    const color = colors[(index + codes.length) % colors.length]
    const lengthMeter = 38 + ((index * 7 + start) % 44)
    const weightKg = Number((lengthMeter * (0.31 + ((index % 5) * 0.035))).toFixed(1))
    const serial = String(start + index).padStart(3, '0')

    return {
      id: `${prefix}-${serial}`,
      boltNo: `${code}-${color.slice(0, 2)}-${serial}`,
      fabricCode: code,
      fabricName: fabricName(code),
      color,
      lengthMeter,
      weightKg,
      note: index % 11 === 0 ? 'يحتاج تدقيق لون عند الإدخال النهائي' : '',
    }
  })
}

function makeDistributions(containerId: string, bolts: ChinaBolt[], offset: number): ChinaCustomerDistribution[] {
  return customerNames.slice(offset, offset + 5).map(([customerName, city], index) => {
    const bolt = bolts[(index * 3 + offset) % bolts.length]
    const quantity = 2 + ((index + offset) % 5)
    const lengthMeter = bolts
      .filter((item) => item.fabricCode === bolt.fabricCode && item.color === bolt.color)
      .slice(0, quantity)
      .reduce((sum, item) => sum + item.lengthMeter, 0)

    return {
      id: `${containerId}-dist-${index + 1}`,
      customerName,
      city,
      fabricCode: bolt.fabricCode,
      color: bolt.color,
      bolts: quantity,
      lengthMeter: lengthMeter || quantity * 45,
      status: (['reserved', 'sold', 'delivered', 'preparing'] as const)[(index + offset) % 4],
      movementDate: `2026-06-${String(8 + index + offset).padStart(2, '0')}`,
      notes: index % 2 === 0 ? 'مرتبط بحجز مدير المبيعات' : 'كمية مجدولة للتوزيع',
    }
  })
}

const cn2601Bolts = makeBolts('CN2601', ['COLOMBIA', 'DPL', 'ROYAL'], 16, 1)
const cn2602Bolts = makeBolts('CN2602', ['VELVET-X', 'LINEN-22', 'SOFT-90'], 14, 20)
const cn2603Bolts = makeBolts('CN2603', ['MILANO', 'CLASSIC-T', 'COLOMBIA', 'DPL'], 18, 40)
const cn2604Bolts = makeBolts('CN2604', ['ROYAL', 'SOFT-90'], 12, 70)
const cn2605Bolts = makeBolts('CN2605', ['LINEN-22', 'MILANO', 'VELVET-X'], 13, 90)
const cn2606Bolts = makeBolts('CN2606', ['CLASSIC-T', 'DPL', 'COLOMBIA'], 15, 120)

export const chinaContainers: ChinaContainer[] = [
  {
    id: 'cn-2601',
    containerNo: 'MSKU-782614-6',
    supplierId: 'sup-guangzhou',
    supplierName: 'Guangzhou Textile Co.',
    orderNo: 'CN-2026-041',
    shipDate: '2026-05-28',
    expectedArrival: '2026-06-26',
    status: 'arrived',
    wastePercent: 1.8,
    lastUpdate: '2026-06-21 11:30',
    notes: 'حاوية وصلت وتنتظر مراجعة نهائية للألوان قبل الاعتماد.',
    bolts: cn2601Bolts,
    distributions: makeDistributions('cn-2601', cn2601Bolts, 0),
  },
  {
    id: 'cn-2602',
    containerNo: 'TLLU-492187-1',
    supplierId: 'sup-yiwu',
    supplierName: 'Yiwu Fabric Export',
    orderNo: 'CN-2026-038',
    shipDate: '2026-05-17',
    expectedArrival: '2026-06-18',
    status: 'approved',
    wastePercent: 2.2,
    lastUpdate: '2026-06-19 15:10',
    notes: 'تم اعتماد الحاوية تجريبيا ضمن الواجهة.',
    bolts: cn2602Bolts,
    distributions: makeDistributions('cn-2602', cn2602Bolts, 1),
  },
  {
    id: 'cn-2603',
    containerNo: 'OOLU-337906-4',
    supplierId: 'sup-shanghai',
    supplierName: 'Shanghai Soft Weave',
    orderNo: 'CN-2026-045',
    shipDate: '2026-06-12',
    expectedArrival: '2026-07-08',
    status: 'shipping',
    wastePercent: 1.5,
    lastUpdate: '2026-06-22 09:45',
    notes: 'قيد الشحن مع تحديثات كمية من المورد.',
    bolts: cn2603Bolts,
    distributions: makeDistributions('cn-2603', cn2603Bolts, 2),
  },
  {
    id: 'cn-2604',
    containerNo: 'CMAU-619540-2',
    supplierId: 'sup-foshan',
    supplierName: 'Foshan Premium Textiles',
    orderNo: 'CN-2026-047',
    shipDate: '2026-06-20',
    expectedArrival: '2026-07-18',
    status: 'draft',
    wastePercent: 2,
    lastUpdate: '2026-06-20 18:20',
    notes: 'مسودة بانتظار تأكيد نموذج المورد.',
    bolts: cn2604Bolts,
    distributions: makeDistributions('cn-2604', cn2604Bolts, 3),
  },
  {
    id: 'cn-2605',
    containerNo: 'EMCU-104873-9',
    supplierId: 'sup-guangzhou',
    supplierName: 'Guangzhou Textile Co.',
    orderNo: 'CN-2026-032',
    shipDate: '2026-04-29',
    expectedArrival: '2026-05-30',
    status: 'archived',
    wastePercent: 1.9,
    lastUpdate: '2026-06-02 10:00',
    notes: 'أرشيف تجريبي لحاوية قديمة.',
    bolts: cn2605Bolts,
    distributions: makeDistributions('cn-2605', cn2605Bolts, 4),
  },
  {
    id: 'cn-2606',
    containerNo: 'HMMU-870231-5',
    supplierId: 'sup-yiwu',
    supplierName: 'Yiwu Fabric Export',
    orderNo: 'CN-2026-050',
    shipDate: '2026-06-21',
    expectedArrival: '2026-07-22',
    status: 'shipping',
    wastePercent: 1.4,
    lastUpdate: '2026-06-22 13:05',
    notes: 'حاوية حديثة قيد المتابعة.',
    bolts: cn2606Bolts,
    distributions: makeDistributions('cn-2606', cn2606Bolts, 5),
  },
]

export const mockSingleFabricRows: ChinaImportRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: `single-${index + 1}`,
  boltNo: `COL-RED-${String(index + 1).padStart(3, '0')}`,
  fabricCode: 'COLOMBIA',
  fabricName: fabricName('COLOMBIA'),
  color: index % 3 === 0 ? 'أحمر' : index % 3 === 1 ? 'كحلي' : 'أسود',
  lengthMeter: 42 + (index % 6) * 5,
  weightKg: Number(((42 + (index % 6) * 5) * 0.36).toFixed(1)),
  note: index === 5 ? 'لون يحتاج مطابقة' : '',
  status: index === 5 ? 'warning' : 'valid',
}))

export const mockMultiFabricRows: ChinaImportRow[] = Array.from({ length: 16 }, (_, index) => {
  const code = ['DPL', 'ROYAL', 'VELVET-X', 'LINEN-22'][index % 4]
  const lengthMeter = index === 7 ? undefined : 36 + ((index * 5) % 46)
  const weightKg = index === 11 ? undefined : Number(((lengthMeter ?? 50) * (0.32 + (index % 4) * 0.03)).toFixed(1))

  return {
    id: `multi-${index + 1}`,
    boltNo: `${code}-${String(index + 1).padStart(3, '0')}`,
    fabricCode: code,
    fabricName: fabricName(code),
    color: colors[index % colors.length],
    lengthMeter,
    weightKg,
    note: index === 7 ? 'ينقص الطول' : index === 11 ? 'ينقص الوزن' : '',
    status: index === 7 || index === 11 ? 'error' : 'valid',
  }
})
