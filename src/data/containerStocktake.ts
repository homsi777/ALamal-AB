import { chinaContainers, type ChinaContainer } from './chinaOrdersMockData'

export type ContainerMovementType =
  | 'arrival'
  | 'warehouse_in'
  | 'sale'
  | 'return'
  | 'waste'
  | 'transfer'
  | 'customer_balance'
  | 'reservation'

export type ContainerMovement = {
  id: string
  containerId: string
  date: string
  type: ContainerMovementType
  title: string
  party: string
  warehouse: string
  fabricCode: string
  color: string
  bolts: number
  lengthMeter: number
  status: string
  note: string
}

export type ContainerStocktakeLine = {
  fabricCode: string
  fabricName: string
  color: string
  arrivedBolts: number
  arrivedLength: number
  soldBolts: number
  soldLength: number
  reservedBolts: number
  returnedBolts: number
  wasteBolts: number
  transferredBolts: number
  expectedBolts: number
  expectedLength: number
  countedBolts: number | null
  countedLength: number | null
}

export type ContainerStocktakeAudit = {
  container: ChinaContainer
  stocktakeDate: string
  warehouse: string
  lines: ContainerStocktakeLine[]
  movements: ContainerMovement[]
}

const movementTypeLabels: Record<ContainerMovementType, string> = {
  arrival: 'وصول الحاوية',
  warehouse_in: 'إدخال مستودع',
  sale: 'بيع / تسليم',
  return: 'إرجاع',
  waste: 'هالك / إهلاك',
  transfer: 'مناقلة',
  customer_balance: 'ذمم عميل',
  reservation: 'حجز عميل',
}

export function containerMovementLabel(type: ContainerMovementType) {
  return movementTypeLabels[type]
}

function groupContainerLines(container: ChinaContainer): ContainerStocktakeLine[] {
  const groups = new Map<string, ContainerStocktakeLine>()

  container.bolts.forEach((bolt) => {
    const key = `${bolt.fabricCode}-${bolt.color}`
    const current = groups.get(key) ?? {
      fabricCode: bolt.fabricCode,
      fabricName: bolt.fabricName,
      color: bolt.color,
      arrivedBolts: 0,
      arrivedLength: 0,
      soldBolts: 0,
      soldLength: 0,
      reservedBolts: 0,
      returnedBolts: 0,
      wasteBolts: 0,
      transferredBolts: 0,
      expectedBolts: 0,
      expectedLength: 0,
      countedBolts: null,
      countedLength: null,
    }

    current.arrivedBolts += 1
    current.arrivedLength += bolt.lengthMeter
    groups.set(key, current)
  })

  container.distributions.forEach((distribution) => {
    const key = `${distribution.fabricCode}-${distribution.color}`
    const current = groups.get(key)
    if (!current) return

    if (distribution.status === 'delivered' || distribution.status === 'sold') {
      current.soldBolts += distribution.bolts
      current.soldLength += distribution.lengthMeter
    }

    if (distribution.status === 'reserved' || distribution.status === 'preparing') {
      current.reservedBolts += distribution.bolts
    }
  })

  return Array.from(groups.values()).map((line, index) => {
    const wasteBolts = index % 4 === 0 ? 1 : 0
    const returnedBolts = index % 5 === 0 ? 1 : 0
    const transferredBolts = index % 3 === 0 ? 2 : 0
    const expectedBolts = Math.max(line.arrivedBolts - line.soldBolts - wasteBolts - transferredBolts + returnedBolts, 0)
    const avgLength = line.arrivedBolts > 0 ? line.arrivedLength / line.arrivedBolts : 0
    const expectedLength = Math.max(line.arrivedLength - line.soldLength - wasteBolts * avgLength - transferredBolts * avgLength + returnedBolts * avgLength, 0)
    const hasVariance = index % 4 === 1

    return {
      ...line,
      wasteBolts,
      returnedBolts,
      transferredBolts,
      expectedBolts,
      expectedLength,
      countedBolts: hasVariance ? Math.max(expectedBolts - 1, 0) : expectedBolts,
      countedLength: hasVariance ? Math.max(expectedLength - avgLength, 0) : expectedLength,
    }
  })
}

function buildMovements(container: ChinaContainer): ContainerMovement[] {
  const firstBolt = container.bolts[0]
  const secondBolt = container.bolts[1] ?? firstBolt
  const thirdBolt = container.bolts[2] ?? firstBolt

  const base: ContainerMovement[] = [
    {
      id: `${container.id}-arrival`,
      containerId: container.id,
      date: container.expectedArrival,
      type: 'arrival',
      title: 'تسجيل وصول الحاوية',
      party: container.supplierName,
      warehouse: 'المستودع الرئيسي',
      fabricCode: firstBolt.fabricCode,
      color: firstBolt.color,
      bolts: container.bolts.length,
      lengthMeter: container.bolts.reduce((sum, bolt) => sum + bolt.lengthMeter, 0),
      status: 'موثق',
      note: 'بداية سجل الجرد للحاوية من تاريخ الوصول.',
    },
    {
      id: `${container.id}-warehouse`,
      containerId: container.id,
      date: container.expectedArrival,
      type: 'warehouse_in',
      title: 'إدخال أثواب إلى المستودع',
      party: 'أمين المستودع',
      warehouse: 'المستودع الرئيسي',
      fabricCode: secondBolt.fabricCode,
      color: secondBolt.color,
      bolts: Math.max(container.bolts.length - 2, 1),
      lengthMeter: Math.max(container.bolts.reduce((sum, bolt) => sum + bolt.lengthMeter, 0) - 90, 0),
      status: 'مدخل',
      note: 'استلام كميات الحاوية حسب ملف المورد التجريبي.',
    },
    {
      id: `${container.id}-waste`,
      containerId: container.id,
      date: '2026-06-22',
      type: 'waste',
      title: 'تسجيل هالك فحص',
      party: 'لجنة الجرد',
      warehouse: 'المستودع الرئيسي',
      fabricCode: thirdBolt.fabricCode,
      color: thirdBolt.color,
      bolts: 1,
      lengthMeter: Math.round(thirdBolt.lengthMeter * 0.4),
      status: 'بانتظار اعتماد',
      note: 'هالك/إهلاك كمي فقط بدون أثر مالي في هذه الشاشة.',
    },
  ]

  const distributionMovements = container.distributions.map<ContainerMovement>((distribution, index) => ({
    id: `${container.id}-dist-${index}`,
    containerId: container.id,
    date: distribution.movementDate,
    type: distribution.status === 'reserved' ? 'reservation' : distribution.status === 'delivered' ? 'sale' : 'customer_balance',
    title: distribution.status === 'reserved' ? 'حجز عميل' : distribution.status === 'delivered' ? 'تسليم كمية' : 'حركة مرتبطة بذمم عميل',
    party: distribution.customerName,
    warehouse: distribution.status === 'delivered' ? 'خروج من المستودع الرئيسي' : 'المستودع الرئيسي',
    fabricCode: distribution.fabricCode,
    color: distribution.color,
    bolts: distribution.bolts,
    lengthMeter: distribution.lengthMeter,
    status: distribution.status,
    note: distribution.notes ?? 'حركة كمية مرتبطة بالحاوية.',
  }))

  return [...base, ...distributionMovements].sort((a, b) => a.date.localeCompare(b.date))
}

export const containerStocktakeAudits: ContainerStocktakeAudit[] = chinaContainers.map((container) => ({
  container,
  stocktakeDate: '2026-06-22',
  warehouse: 'المستودع الرئيسي',
  lines: groupContainerLines(container),
  movements: buildMovements(container),
}))

export function getContainerAuditTotals(audit: ContainerStocktakeAudit) {
  return audit.lines.reduce(
    (totals, line) => {
      totals.arrivedBolts += line.arrivedBolts
      totals.arrivedLength += line.arrivedLength
      totals.expectedBolts += line.expectedBolts
      totals.expectedLength += line.expectedLength
      totals.countedBolts += line.countedBolts ?? 0
      totals.countedLength += line.countedLength ?? 0
      totals.varianceBolts += (line.countedBolts ?? 0) - line.expectedBolts
      totals.varianceLength += (line.countedLength ?? 0) - line.expectedLength
      return totals
    },
    {
      arrivedBolts: 0,
      arrivedLength: 0,
      expectedBolts: 0,
      expectedLength: 0,
      countedBolts: 0,
      countedLength: 0,
      varianceBolts: 0,
      varianceLength: 0,
    },
  )
}
