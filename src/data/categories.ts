export type FabricCategory = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  rollCode: string
  colorAr: string
  colorEn: string
  colorCode: string
  disabled: boolean
}

export type CategoryRollGroup = {
  id: string
  goodsTypeAr: string
  goodsTypeEn: string
  rollCode: string
  colors: FabricCategory[]
}

export function categoryPath(category: FabricCategory, locale: 'ar' | 'en') {
  const goodsType = locale === 'ar' ? category.goodsTypeAr : category.goodsTypeEn
  const color = locale === 'ar' ? category.colorAr : category.colorEn
  const parts = [goodsType, category.rollCode, color]
  if (category.colorCode.trim()) parts.push(category.colorCode)
  return parts.join(' / ')
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function groupCategoriesByRoll(categories: FabricCategory[]): CategoryRollGroup[] {
  const groups = new Map<string, CategoryRollGroup>()

  categories.forEach((category) => {
    const key = `${category.goodsTypeAr}::${category.rollCode}`

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        goodsTypeAr: category.goodsTypeAr,
        goodsTypeEn: category.goodsTypeEn,
        rollCode: category.rollCode,
        colors: [],
      })
    }

    groups.get(key)!.colors.push(category)
  })

  return Array.from(groups.values()).sort((a, b) => a.rollCode.localeCompare(b.rollCode))
}

export function matchCategory(
  categories: FabricCategory[],
  goodsType: string,
  rollCode: string,
  color: string,
  colorCode?: string,
) {
  const normalizedGoodsType = normalizeText(goodsType)
  const normalizedRollCode = normalizeText(rollCode)
  const normalizedColor = normalizeText(color)
  const normalizedColorCode = colorCode ? normalizeText(colorCode) : ''

  return categories.find((category) => {
    if (category.disabled) return false

    const goodsMatches =
      normalizeText(category.goodsTypeAr) === normalizedGoodsType ||
      normalizeText(category.goodsTypeEn) === normalizedGoodsType

    const rollMatches = normalizeText(category.rollCode) === normalizedRollCode

    const colorMatches =
      normalizeText(category.colorAr) === normalizedColor ||
      normalizeText(category.colorEn) === normalizedColor

    if (!goodsMatches || !rollMatches || !colorMatches) return false

    if (normalizedColorCode && category.colorCode.trim()) {
      return normalizeText(category.colorCode) === normalizedColorCode
    }

    return true
  })
}

const linenF12Colors: Omit<FabricCategory, 'id' | 'goodsTypeAr' | 'goodsTypeEn' | 'rollCode' | 'disabled'>[] = [
  { colorAr: 'أبيض', colorEn: 'White', colorCode: '' },
  { colorAr: 'بيج', colorEn: 'Beige', colorCode: 'BGE-01' },
  { colorAr: 'أسود', colorEn: 'Black', colorCode: 'BLK-02' },
  { colorAr: 'كحلي', colorEn: 'Navy', colorCode: '' },
  { colorAr: 'زيتي', colorEn: 'Olive', colorCode: 'OLV-03' },
  { colorAr: 'وردي', colorEn: 'Pink', colorCode: '' },
  { colorAr: 'أحمر', colorEn: 'Red', colorCode: 'RED-04' },
  { colorAr: 'رمادي', colorEn: 'Grey', colorCode: '' },
  { colorAr: 'أزرق', colorEn: 'Blue', colorCode: 'BLU-05' },
  { colorAr: 'بني', colorEn: 'Brown', colorCode: '' },
  { colorAr: 'ذهبي', colorEn: 'Gold', colorCode: 'GLD-06' },
  { colorAr: 'فضي', colorEn: 'Silver', colorCode: '' },
]

function buildRollColors(
  prefix: string,
  goodsTypeAr: string,
  goodsTypeEn: string,
  rollCode: string,
  colors: Omit<FabricCategory, 'id' | 'goodsTypeAr' | 'goodsTypeEn' | 'rollCode' | 'disabled'>[],
): FabricCategory[] {
  return colors.map((color, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    goodsTypeAr,
    goodsTypeEn,
    rollCode,
    disabled: false,
    ...color,
  }))
}

export const fabricCategories: FabricCategory[] = [
  ...buildRollColors('LIN-F12', 'كتان F12', 'Linen F12', 'F12', linenF12Colors),
  ...buildRollColors('CTN-100', 'قطن مصري', 'Egyptian cotton', 'CTN-100', [
    { colorAr: 'أبيض', colorEn: 'White', colorCode: 'WHT-01' },
    { colorAr: 'بيج', colorEn: 'Beige', colorCode: '' },
    { colorAr: 'كريمي', colorEn: 'Cream', colorCode: 'CRM-02' },
  ]),
  ...buildRollColors('SLK-220', 'حرير طبيعي', 'Natural silk', 'SLK-220', [
    { colorAr: 'ذهبي', colorEn: 'Gold', colorCode: 'GLD-09' },
    { colorAr: 'عاجي', colorEn: 'Ivory', colorCode: '' },
  ]),
  ...buildRollColors('CHF-330', 'شيفون', 'Chiffon', 'CHF-330', [
    { colorAr: 'وردي', colorEn: 'Pink', colorCode: '' },
    { colorAr: 'موف', colorEn: 'Purple', colorCode: 'PRP-11' },
    { colorAr: 'أبيض', colorEn: 'White', colorCode: '' },
  ]),
]
