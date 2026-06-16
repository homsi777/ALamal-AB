import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { fabricCategories, type FabricCategory } from '../data/categories'
import { warehouseStockRows, type WarehouseStockRow } from '../data/warehouseStock'
import { rowsToWarehouseStock, type ParsedImportRow } from '../utils/excelImport'

export type ImportHistoryEntry = {
  id: string
  fileName: string
  date: string
  totalRows: number
  validRows: number
  errorRows: number
  status: 'success' | 'partial' | 'failed'
}

type InventoryContextValue = {
  categories: FabricCategory[]
  warehouseRows: WarehouseStockRow[]
  importHistory: ImportHistoryEntry[]
  toggleCategoryDisabled: (id: string, disabled: boolean) => void
  toggleWarehouseDisabled: (id: string, disabled: boolean) => void
  importRows: (fileName: string, rows: ParsedImportRow[]) => ImportHistoryEntry
}

const InventoryContext = createContext<InventoryContextValue | null>(null)

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<FabricCategory[]>(fabricCategories)
  const [warehouseRows, setWarehouseRows] = useState<WarehouseStockRow[]>(warehouseStockRows)
  const [importHistory, setImportHistory] = useState<ImportHistoryEntry[]>([
    {
      id: 'IMP-012',
      fileName: 'fabrics-june-2026.xlsx',
      date: '2026-06-16',
      totalRows: 48,
      validRows: 48,
      errorRows: 0,
      status: 'success',
    },
    {
      id: 'IMP-011',
      fileName: 'stock-update.xlsx',
      date: '2026-06-14',
      totalRows: 12,
      validRows: 10,
      errorRows: 2,
      status: 'partial',
    },
  ])

  const toggleCategoryDisabled = (id: string, disabled: boolean) => {
    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, disabled } : category)))
  }

  const toggleWarehouseDisabled = (id: string, disabled: boolean) => {
    setWarehouseRows((prev) => prev.map((row) => (row.id === id ? { ...row, disabled } : row)))
  }

  const importRows = (fileName: string, rows: ParsedImportRow[]) => {
    const validRows = rows.filter((row) => row.status === 'valid')
    const errorRows = rows.length - validRows.length
    const importedStock = rowsToWarehouseStock(validRows, categories)

    if (importedStock.length > 0) {
      setWarehouseRows((prev) => [...importedStock, ...prev])
    }

    const entry: ImportHistoryEntry = {
      id: `IMP-${Date.now()}`,
      fileName,
      date: todayIsoDate(),
      totalRows: rows.length,
      validRows: validRows.length,
      errorRows,
      status: errorRows === 0 && validRows.length > 0 ? 'success' : validRows.length > 0 ? 'partial' : 'failed',
    }

    setImportHistory((prev) => [entry, ...prev])
    return entry
  }

  const value = useMemo(
    () => ({
      categories,
      warehouseRows,
      importHistory,
      toggleCategoryDisabled,
      toggleWarehouseDisabled,
      importRows,
    }),
    [categories, warehouseRows, importHistory],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}
