export type InventorySubItem = {
  id: string
  path: string
  icon: string
  labelKey: string
}

export const INVENTORY_SUB_ITEMS: InventorySubItem[] = [
  { id: 'warehouses', path: '/inventory/warehouses', icon: '🏭', labelKey: 'inventory.sub.warehouses' },
  { id: 'transfer', path: '/inventory/transfer', icon: '↔️', labelKey: 'inventory.sub.transfer' },
  { id: 'opening-stock', path: '/inventory/opening-stock', icon: '📋', labelKey: 'inventory.sub.openingStock' },
  { id: 'stocktake', path: '/inventory/stocktake', icon: '🔍', labelKey: 'inventory.sub.stocktake' },
  { id: 'categories', path: '/inventory/categories', icon: '🏷️', labelKey: 'inventory.sub.categories' },
  { id: 'import', path: '/inventory/import', icon: '📥', labelKey: 'inventory.sub.import' },
  { id: 'settings', path: '/inventory/settings', icon: '⚙️', labelKey: 'inventory.sub.settings' },
]
