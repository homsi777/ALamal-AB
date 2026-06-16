import { Navigate, Route, Routes } from 'react-router-dom'
import { InventoryProvider } from '../context/InventoryProvider'
import { WarehousesPage } from './inventory/WarehousesPage'
import { TransferPage } from './inventory/TransferPage'
import { OpeningStockPage } from './inventory/OpeningStockPage'
import { StocktakePage } from './inventory/StocktakePage'
import { CategoriesPage } from './inventory/CategoriesPage'
import { ImportPage } from './inventory/ImportPage'
import { InventorySettingsPage } from './inventory/InventorySettingsPage'

export function InventoryPage() {
  return (
    <InventoryProvider>
      <Routes>
        <Route index element={<Navigate to="warehouses" replace />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="opening-stock" element={<OpeningStockPage />} />
        <Route path="stocktake" element={<StocktakePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="import" element={<ImportPage />} />
        <Route path="settings" element={<InventorySettingsPage />} />
      </Routes>
    </InventoryProvider>
  )
}
