export type MaterialGroup<T extends MaterialLineBase> = {
  rollCode: string
  goodsTypeAr: string
  goodsTypeEn: string
  unitAr: string
  unitEn: string
  lines: T[]
}

type MaterialLineBase = {
  rollCode: string
  goodsTypeAr: string
  goodsTypeEn: string
  unitAr: string
  unitEn: string
  pieces: number
}

export function groupByMaterial<T extends MaterialLineBase>(lines: T[]): MaterialGroup<T>[] {
  const groups: MaterialGroup<T>[] = []
  const indexByRoll = new Map<string, number>()

  for (const line of lines) {
    const existing = indexByRoll.get(line.rollCode)
    if (existing === undefined) {
      indexByRoll.set(line.rollCode, groups.length)
      groups.push({
        rollCode: line.rollCode,
        goodsTypeAr: line.goodsTypeAr,
        goodsTypeEn: line.goodsTypeEn,
        unitAr: line.unitAr,
        unitEn: line.unitEn,
        lines: [line],
      })
    } else {
      groups[existing].lines.push(line)
    }
  }

  return groups
}

export function sumPieces(lines: Array<{ pieces: number }>) {
  return lines.reduce((sum, line) => sum + line.pieces, 0)
}

export function sumLengths(lengths: (number | null)[]) {
  return lengths.reduce<number>((sum, value) => sum + (value !== null && value > 0 ? value : 0), 0)
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 2 })
}
